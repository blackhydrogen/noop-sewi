var sewi = sewi || {};

// ChartControls definition
$(function() {
  /** [ChartControls description] */
  sewi.ChartControls = function(options) {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.ChartControls))
      return new sewi.ChartControls();

    sewi.ConfiguratorElement.call(this);

    this.isRangeSelectorShown = false;

    initDOM.call(this);
    initEvents.call(this);
  };

  sewi.inherits(sewi.ChartControls, sewi.ConfiguratorElement);

  function initDOM() {
    var innerPanel = $(sewi.constants.CHART_CONTROLS_INNER_PANEL_DOM);
    var leftPanel = innerPanel.clone()
      .addClass(sewi.constants.CHART_CONTROLS_LEFT_PANEL_CLASS);
    var rightPanel = innerPanel.clone()
      .addClass(sewi.constants.CHART_CONTROLS_RIGHT_PANEL_CLASS);


    this.optionsMenu = $(sewi.constants.CHART_CONTROLS_OPTIONS_DROPDOWN_DOM)
      .append(sewi.constants.CHART_CONTROLS_RANGE_SELECTOR_OPTION_DOM)
      .append(sewi.constants.CHART_CONTROLS_RESET_ALL_POINTS_BUTTON_DOM)
      .append(sewi.constants.CHART_CONTROLS_RESET_SHOWN_POINTS_BUTTON_DOM)
      .append(sewi.constants.CHART_CONTROLS_ZOOM_OUT_OPTION_DOM);

    this.timingDisplayLabel = $(sewi.constants.CHART_CONTROLS_TIMING_DISPLAY_DOM);
    this.timingDisplay = this.timingDisplayLabel.children('input');

    leftPanel.append(this.optionsMenu);
    rightPanel.append(this.timingDisplayLabel).append(this.timingDisplay);

    this.mainDOMElement.append(rightPanel)
      .append(leftPanel)
      .addClass(sewi.constants.CHART_CONTROLS_DOM_CLASS);

    this.optionsMenu.selectpicker({
      title: 'Options',
      countSelectedText: 'Options',
      selectedTextFormat: 'count > 0',
      width: '100px',
      dropupAuto: false,
    });
    this.timingDisplayLabel.tooltip({
      appendTo: 'body',
    });
  }

  function initEvents() {
    this.optionsMenu.change(selectionChanged.bind(this));
    this.timingDisplay.focus(timingDisplayFocused.bind(this));
  }

  function getOwnElements() {
    var elements = this.mainDOMElement.find(sewi.constants.CHART_CONTROLS_OPTIONS_DROPDOWN_CLASS);
    return elements;
  }

  function selectionChanged() {
    var selectionOptions = this.optionsMenu.val() || [];
    var isRangeSelectorShown = false;
    var isResetAllPoints = false;
    var isResetShownPoints = false;
    var isZoomOut = false;
    // Get selected options
    if (!_.isEmpty(selectionOptions)) {
      isRangeSelectorShown = _.contains(selectionOptions, sewi.constants.CHART_CONTROLS_RANGE_SELECTOR_VALUE);
      isZoomOut = _.contains(selectionOptions, sewi.constants.CHART_CONTROLS_ZOOM_OUT_VALUE);
      isResetAllPoints = _.contains(selectionOptions, sewi.constants.CHART_CONTROLS_RESET_ALL_POINTS_VALUE);
      isResetShownPoints = _.contains(selectionOptions, sewi.constants.CHART_CONTROLS_RESET_SHOWN_POINTS_VALUE);
    }

    // Ensure that non-checkable selections remain un-checked
    var newOptions = [];
    if (isRangeSelectorShown) {
      newOptions.push(sewi.constants.CHART_CONTROLS_RANGE_SELECTOR_VALUE);
    }

    this.optionsMenu.selectpicker('val', newOptions);

    // Ensure the event is only triggered when the range selector's state has to change
    var hasRangeSelectorChangedState = isRangeSelectorShown !== this.isRangeSelectorShown;

    if (hasRangeSelectorChangedState) {
      // Display or hide range selector as necessary
      if (isRangeSelectorShown) {
        this.trigger('rangeSelectorShown');
      } else {
        this.trigger('rangeSelectorHidden');
      }

      this.isRangeSelectorShown = isRangeSelectorShown;
    }

    // Reset all as necessary
    if (isResetAllPoints) {
      this.timingDisplay.val('');
      this.trigger('allPointsReset');
    }

    // Reset points currently shown as necessary
    if (isResetShownPoints) {
      this.trigger('shownPointsReset');
    }

    //Zoom out graph
    if (isZoomOut) {
      this.trigger('zoomOutGraph');
    }
  }

  function timingDisplayFocused() {
    // Auto-select the entire text field for the user to easily copy
    this.timingDisplay.select();
  }

  sewi.ChartControls.prototype.update = function(options) {
    options = options || {};

    if (!_.isUndefined(options.timing)) {
      if (options.timing > 0) {
        var timingInSec = this.roundOffToNearestSeconds(options.timing);
        this.timingDisplay.val(timingInSec + 's');
      } else {
        this.timingDisplay.val('');
      }
    }
  };

  sewi.ChartControls.prototype.roundOffToNearestSeconds = function(value) {
    return (value / 1000).toFixed(2);
  }
});


$(function() {

  sewi.ChartResourceViewer = function(options) {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.ChartResourceViewer))
      return new sewi.ChartResourceViewer();

    sewi.ResourceViewer.call(this);

    var defaults = {};

    /*options = options || {};
    _.defaults(options, defaults);
    _.assign(this, _.pick(options, [
        'id',
    ]));*/
    this.id = 'e3925503-3f28-4d98-851f-88f263ce969c';

    initDOM.call(this);
    initControls.call(this);
    initEventHandlers.call(this);
    initChartComponents.call(this);

  }

  sewi.inherits(sewi.ChartResourceViewer, sewi.ResourceViewer);

  sewi.ChartResourceViewer.prototype.load = function(){
    var chartResourceEndPoint = sewi.constants.CHART_RESOURCE_URL + this.id;

    $.ajax({
            dataType: 'json',
            type: 'GET',
            url: chartResourceEndPoint,
        }).done(generateChartData.bind(this));
  }

  function initDOM() {

    this.mainDOMElement.addClass('time-series-graph-container');

    this.legendContainer = $('<div>').addClass('legend-container');
    this.chartContainer = $('<div>').addClass('main-graph-container');
    this.mainDOMElement.append(this.legendContainer).append(this.chartContainer);

  }

  function initControls() {
    this.controls = new sewi.ChartControls();
    this.controlPanelElement = this.controls.getDOM();
    this.mainDOMElement.append(this.controlPanelElement);
  }

  function initEventHandlers() {

    this.controlPanelElement.on('allPointsReset', clearAllPoints.bind(this));
    this.controlPanelElement.on('shownPointsReset', clearShownPoints.bind(this));

    this.controlPanelElement.on('rangeSelectorShown', showRangeSelector.bind(this));
    this.controlPanelElement.on('rangeSelectorHidden', hideRangeSelector.bind(this));
    this.controlPanelElement.on('zoomOutGraph', zoomOutGraph.bind(this));
    this.chartContainer.on('zoomedOnY', highlightPointsAboveMinY.bind(this));

  }

  function initChartComponents() {

    this.highlightedPoints = [];
    this.peaks = [];
  }

  /**
   * Resets all points that have been previously selected by the user
   **/
  function clearAllPoints() {

    this.highlightedPoints = [];
    this.peaks = [];
    this.redrawGraph();
  }

  /**
   * Resets points within the current range of the graph visible to the user
   **/
  function clearShownPoints() {
    var selfRef = this;
    var clone = selfRef.highlightedPoints.slice(0);
    $.each(clone, function(index, value) {
      if (value['xval'] <= selfRef.xMax && value['xval'] >= selfRef.xMin && value['yval'] <= selfRef.yMax && value['yval'] >= selfRef.yMin) {
        selfRef.unHighlightPoint(value);
      }

    });
    selfRef.redrawGraph();

  }

  function showRangeSelector() {
    this.graph.updateOptions({
      showRangeSelector: true
    });
  }

  function hideRangeSelector() {
    this.graph.updateOptions({
      showRangeSelector: false
    });
  }

  function zoomOutGraph() {
    if (this.graph.isZoomed())
      this.graph.resetZoom();
  }

  function highlightPointsAboveMinY() {
    console.log("dk");

    var yRange = this.graph.yAxisRange();
    var yMin = yRange[0];
    var yMax = yRange[1];
    var indexMin = parseInt(this.xMin / this.samplingRate);
    var indexMax = parseInt(this.xMax / this.samplingRate);
    var averagePeakInterval = parseInt((800 / this.samplingRate) / 2);
    var start = indexMin;
    while (start <= indexMax) {
      var point = this.findPeakInRegion(start, start + 40);

      if (point != -1) {
        if (parseFloat(point['yval']) > yMin && parseFloat(point['yval']) < yMax) {
          if (!this.isHighlightedPoint(point)) {
            this.highlightedPoints.push(point);
            this.peaks.push(point.xval);
            this.highlightPoint(point);
          }
        }
        start += averagePeakInterval;
      } else {
        start += 40;
      }
    }
    this.updateTimeInterval();
  }

  function formatLegend(ms) {
    return '<b style="color:#c90696">Time: </b>' + ms;
  }

  function sorter(a, b) {
    return a - b;
  }

  function isValidPoint(x) {
    return (this.clickedX && x == this.clickedX);
  }

  function generateChartData(data) {
    var selfRef = this;
    selfRef.graphData = [];
    var parsedCSV = "";

    $.get(data.url, function(csvText) {
      var allTextLines = csvText.split(/\r\n|\n/);
      $.each(allTextLines, function(index, value) {
        if (index == 1) {
          selfRef.samplingRate = value[0] - allTextLines[index - 1][0];
        }
        parsedCSV += value + '\n';
        selfRef.graphData.push(value.split(','));
      });
      selfRef.createChart(parsedCSV);
    });
  }

  sewi.ChartResourceViewer.prototype.resize = function() {
    this.graph.resize();
  }

  sewi.ChartResourceViewer.prototype.redrawGraph = function() {
    this.graph.updateOptions({
      dateWindow: this.graph.xAxisRange()
    });
  }

  sewi.ChartResourceViewer.prototype.chartPointClicked = function(p) {
    var context = this.canvasContext;
    if (this.isHighlightedPoint(p)) {
      this.unHighlightPoint(p);

    } else {
      this.highlightedPoints.push(p);
      this.peaks.push(p.xval);
      this.highlightPoint(p);
    }
    if (!this.controls.isRangeSelectorShown) {
      this.redrawGraph();
    }
    this.updateTimeInterval();
  }

  sewi.ChartResourceViewer.prototype.updateTimeInterval = function() {
    if (this.peaks.length > 1) {
      // if more than one peak has been selected, find the R-R Interval using the peaks
      var rrInterval = this.calculateRRInterval();
      this.controls.update({
        'timing': rrInterval
      });
    } else {
      this.controls.update({
        'timing': ''
      });
    }

  }

  sewi.ChartResourceViewer.prototype.isHighlightedPoint = function(p) {
    var index = this.peaks.indexOf(p.xval);
    return (index >= 0);
  }

  sewi.ChartResourceViewer.prototype.canvasPointClicked = function(x, points) {
    this.chartPointClicked(points[0]);
    /*var indexOfClosestPointOnGraph = this.binarySearch(x);
    var start = indexOfClosestPointOnGraph - 10;
    var end = indexOfClosestPointOnGraph + 10;
    var peak = this.findPeakInRegion(start, end);
    if(peak == -1){
     
    }
    else{
      this.chartPointClicked(peak);
    }*/
  }

  sewi.ChartResourceViewer.prototype.findPeakInRegion = function(start, end) {
    var ymax = 0;
    var xmax = 0;
    var ySecondMax = 0;
    var graphXExtremes = this.graph.xAxisExtremes();
    var maxX = graphXExtremes[1];
    var xSecondMax = 0;
    var index = start;

    if (end >= maxX / this.samplingRate)
      end = maxX / this.samplingRate;

    while (index < end) {
      var y = parseFloat(this.graphData[index][1]);
      if (y > ymax) {
        ymax = y;
        xmax = parseInt(this.graphData[index][0]);
      } else if (y > ySecondMax) {
        ySecondMax = y;
        xSecondMax = parseInt(this.graphData[index][0]);
      }
      index++;
    }
    if (ymax - ySecondMax > 0.2)
      return {
        'xval': xmax,
        'yval': ymax
      };
    return -1;

  }

  sewi.ChartResourceViewer.prototype.highlightAllPoints = function() {
    var selfRef = this;
    var context = selfRef.canvasContext;
    $.each(selfRef.highlightedPoints, function(index, value) {
      selfRef.highlightPoint(value);
    });
  }

  sewi.ChartResourceViewer.prototype.highlightPoint = function(p) {
    var context = this.canvasContext;
    var x = this.graph.toDomXCoord(p.xval),
      y = this.graph.toDomYCoord(p.yval);
    context.fillStyle = "#000";
    context.beginPath();
    context.arc(x, y, 2.5, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
  }

  sewi.ChartResourceViewer.prototype.createChart = function(data) {
    var selfRef = this;
    selfRef.graph = new Dygraph(
      selfRef.chartContainer[0],
      data, {
        title: ' ',
        animatedZooms: true,
        panEdgeFraction: 0.01,
        drawGapEdgePoints: true,
        rangeSelectorPlotFillColor: 'blue',
        rangeSelectorPlotStrokeColor: 'blue',
        colors: ['#c90696'],
        xAxisLabelWidth: 15,
        yAxisLabelWidth: 37,
        highlightCircleSize: 4,
        hideOverlayOnMouseOut: false,
        xlabel: 'Time',
        ylabel: 'Value',
        labels: ['time', 'Value'],
        labelsDiv: selfRef.legendContainer[0],
        dateWindow: [0, 2000],
        axes: {
          x: {
            valueFormatter: formatLegend
          }
        },

        underlayCallback: function() {
          selfRef.canvasContext = selfRef.chartContainer.find('canvas')[1].getContext('2d');
        },

        zoomCallback: function() {
          var currXRange = selfRef.graph.xAxisRange();

          if (selfRef.xMin == currXRange[0] && selfRef.xMax == currXRange[1] && selfRef.graph.isZoomed())
            selfRef.chartContainer.trigger('zoomedOnY');
          selfRef.setCurrAxisRanges(currXRange, selfRef.graph.yAxisRange());

        },

        pointClickCallback: function(e, p) {
          selfRef.clickedX = p.xval;
          selfRef.chartPointClicked(p);
        },

        highlightCallback: function(e, x, p) {
          //console.log(p[0]);
          selfRef.highlightAllPoints();
        },

        drawCallback: function(g, is_initial) {
          if (is_initial) {
            selfRef.setCurrAxisRanges(g.xAxisRange(), g.yAxisRange());
          }
          selfRef.highlightAllPoints();
        },

        clickCallback: function(e, x, points) {
          if (!isValidPoint.call(selfRef, x))
            selfRef.canvasPointClicked(x, points);
        }
      }
    );
  }

  sewi.ChartResourceViewer.prototype.setCurrAxisRanges = function(xRange, yRange) {
    this.xMin = xRange[0];
    this.xMax = xRange[1];

    this.yMin = yRange[0];
    this.yMax = yRange[1];

  }

  /**
   * Remove the point from the list of highlighted points.
   **/

  sewi.ChartResourceViewer.prototype.unHighlightPoint = function(p) {

    for (var index = 0; index < this.highlightedPoints.length; index++) {
      if (this.highlightedPoints[index].xval == p.xval) {
        this.highlightedPoints.splice(index, 1);
        break;
      }
    }
    this.peaks.splice(this.peaks.indexOf(p.xval), 1);
  }

  /**
   * R-R Interval is calculated as follows :
   * 1.Sort all the points selected by increasing x-coordinate.
   * 2.Sum up the difference between adjacent points.
   * 3.Return the average difference.
   **/
  sewi.ChartResourceViewer.prototype.calculateRRInterval = function() {

    var selfRef = this;
    selfRef.peaks.sort(sorter);
    var sumOfRRIntervals = 0;

    $.each(selfRef.peaks, function(index) {
      if (index != selfRef.peaks.length - 1)
        sumOfRRIntervals += selfRef.peaks[index + 1] - selfRef.peaks[index];
    });

    return sumOfRRIntervals / (selfRef.peaks.length - 1);
  }
});