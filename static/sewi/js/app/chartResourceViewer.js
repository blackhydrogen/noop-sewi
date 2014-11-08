var sewi = sewi || {};

// ChartControls definition
(function() {
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
      .append(sewi.constants.CHART_CONTROLS_RESET_ALL_POINTS_BUTTON_DOM)
      .append(sewi.constants.CHART_CONTROLS_RESET_SHOWN_POINTS_BUTTON_DOM)
      .append(sewi.constants.CHART_CONTROLS_ZOOM_OUT_BUTTON_DOM);

    this.timingDisplayLabel = $(sewi.constants.CHART_CONTROLS_TIMING_DISPLAY_DOM);
    this.timingDisplay = $(this.timingDisplayLabel.children('input'));

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

    this.initializedTooltips = false;
  }

  function initEvents() {
    this.optionsMenu.change(selectionChanged.bind(this));
    this.timingDisplay.focus(timingDisplayFocused.bind(this));
  }

  function selectionChanged() {
    var selectionOptions = this.optionsMenu.val() || [];
    var isResetAllPoints = false;
    var isResetShownPoints = false;
    var isZoomOut = false;
    // Get selected options
    if (!_.isEmpty(selectionOptions)) {
      isZoomOut = _.contains(selectionOptions, sewi.constants.CHART_CONTROLS_ZOOM_OUT_VALUE);
      isResetAllPoints = _.contains(selectionOptions, sewi.constants.CHART_CONTROLS_RESET_ALL_POINTS_VALUE);
      isResetShownPoints = _.contains(selectionOptions, sewi.constants.CHART_CONTROLS_RESET_SHOWN_POINTS_VALUE);
    }

    // Ensure that none of the options have the tick mark.
    this.optionsMenu.selectpicker('val', []);

    if (isResetAllPoints) {
      this.timingDisplay.val('');
      this.trigger('allPointsReset');
    }

    if (isResetShownPoints) {
      this.trigger('shownPointsReset');
    }

    if (isZoomOut) {
      this.trigger('zoomOutGraph');
    }
  }

  function timingDisplayFocused() {
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

  sewi.ChartControls.prototype.disableTooltips = function() {
    if (this.initializedTooltips) {
      var element = this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_RESET_ALL_POINTS_BUTTON_CLASS);
      element.tooltip('destroy');
      this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_RESET_SHOWN_POINTS_BUTTON_CLASS).tooltip('destroy');
      this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_ZOOM_OUT_BUTTON_CLASS).tooltip('destroy');
      this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_TIMING_DISPLAY_LABEL_CLASS).tooltip('destroy');
      this.initializedTooltips = false;
    }
  }


  sewi.ChartControls.prototype.enableTooltips = function() {
    if (!this.initializedTooltips) {
      var element = this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_RESET_ALL_POINTS_BUTTON_CLASS)
      element.tooltip({
        html: true,
        title: sewi.constants.CHART_CONTROLS_RESET_ALL_POINTS_TOOLTIP_TEXT,
        container: 'body',
        placement: 'right'
      });

      this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_RESET_SHOWN_POINTS_BUTTON_CLASS).tooltip({
        html: true,
        title: sewi.constants.CHART_CONTROLS_RESET_SHOWN_POINTS_TOOLTIP_TEXT,
        container: 'body',
        placement: 'right'
      });

      this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_ZOOM_OUT_BUTTON_CLASS).tooltip({
        html: true,
        title: sewi.constants.CHART_CONTROLS_ZOOM_OUT_TOOLTIP_TEXT,
        container: 'body',
        placement: 'right'
      });

      this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_TIMING_DISPLAY_LABEL_CLASS).tooltip({
        html: true,
        title: sewi.constants.CHART_CONTROLS_TIMING_DISPLAY_TOOLTIP_TEXT,
        container: 'body',
        placement: 'top',
      });
      this.initializedTooltips = true;
    }

  }
})();


(function() {

  sewi.ChartResourceViewer = function(options) {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.ChartResourceViewer))
      return new sewi.ChartResourceViewer();

    sewi.ResourceViewer.call(this);

    var defaults = {};

    options = options || {};
    _.defaults(options, defaults);
    _.assign(this, _.pick(options, [
      'id',
    ]));

    initDOM.call(this);
    initControls.call(this);
    initEventHandlers.call(this);
    initChartComponents.call(this);

  }

  sewi.inherits(sewi.ChartResourceViewer, sewi.ResourceViewer);

  sewi.ChartResourceViewer.prototype.load = function() {
    this.showProgressBar('Generating chart');
    this.updateProgressBar(100);
    /*var chartResourceEndPoint = sewi.constants.CHART_RESOURCE_URL + this.id;

    $.ajax({
            dataType: 'json',
            type: 'GET',
            url: chartResourceEndPoint,
        }).done(loadSuccessful.bind(this))
          .fail(loadFailed.bind(this));*/
    parseChartData.call(this, {
      'url': "/static/sewi/js/app/Sample Resources/data.csv"
    });
  }

  function parseChartData(data) {
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

  function loadFailed() {
    this.showError(sewi.constants.CHART_RESOURCE_VIEWER_LOAD_ERROR_MESSAGE);
  }

  function loadSuccessful(data){
    parseChartData.call(this,data);
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
    this.controlPanelElement.on('zoomOutGraph', zoomOutGraph.bind(this));
    this.chartContainer.on('zoomedOnY', highlightPointsAboveMinY.bind(this));

  }

  function initChartComponents() {

    this.highlightedPoints = [];
    this.peaks = [];
    this.initialXRange = [0, 2000];
    this.isZoomed = true;
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
      if (selfRef.isVisiblePoint(value)) {
        selfRef.unHighlightPoint(value);
      }

    });
    selfRef.redrawGraph();

  }

  function zoomOutGraph() {
    if (this.isZoomed) {
      this.graph.resetZoom();
      this.isZoomed = false;
    }
  }

  function highlightPointsAboveMinY() {

    var yRange = this.graph.yAxisRange();
    var yMin = yRange[0];
    var yMax = yRange[1];
    var indexMin = parseInt(this.xMin / this.samplingRate);
    var indexMax = parseInt(this.xMax / this.samplingRate);

    var searchInterval = parseInt(sewi.constants.CHART_RESOURCE_PEAK_SEARCH_INTERVAL / this.samplingRate);
    var start = indexMin;
    while (start <= indexMax) {
      var point = this.findPeakInRegion(start, start + searchInterval);

      if (point != -1) {
        if (parseFloat(point['yval']) > yMin && parseFloat(point['yval']) < yMax) {
          if (!this.isHighlightedPoint(point)) {
            this.highlightedPoints.push(point);
            this.peaks.push(point.xval);
            this.highlightPoint(point);
          }
        }
      }
      start += searchInterval;
    }
    this.updateTimeInterval();
  }

  function formatLegend(ms) {
    return '<b style="color:#c90696">Time: </b>' + ms;
  }

  function sorter(a, b) {
    return a - b;
  }

  function isPointOnGraph(x) {
    return (this.clickedX && x == this.clickedX);
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
    this.updateTimeInterval();
  }

  sewi.ChartResourceViewer.prototype.updateTimeInterval = function() {
    if (this.peaks.length > 1) {
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
  }

  sewi.ChartResourceViewer.prototype.getIndexOfPoint = function(x) {
    return x / this.samplingRate;
  }

  sewi.ChartResourceViewer.prototype.isVisiblePoint = function(point) {
    return (point['xval'] <= this.xMax && point['xval'] >= this.xMin && point['yval'] <= this.yMax && point['yval'] >= this.yMin)
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

    while (index <= end) {
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
        colors: ['#c61055'],
        xAxisLabelWidth: 55,
        isZoomedIgnoreProgrammaticZoom: true,
        yAxisLabelWidth: 37,
        highlightCircleSize: 4,
        hideOverlayOnMouseOut: false,
        xlabel: 'Time',
        ylabel: 'Value',
        labels: ['time', 'Value'],
        labelsDiv: selfRef.legendContainer[0],
        dateWindow: selfRef.initialXRange,
        axes: {
          x: {
            valueFormatter: formatLegend
          }
        },

        underlayCallback: function() {
          selfRef.canvasContext = selfRef.chartContainer.find('canvas')[1].getContext('2d');
          selfRef.hideProgressBar();
        },

        zoomCallback: function() {
          var currXRange = selfRef.graph.xAxisRange();

          if ((selfRef.yMin != selfRef.prevYMin || selfRef.yMax != selfRef.prevYMax) && selfRef.graph.isZoomed())
            selfRef.chartContainer.trigger('zoomedOnY');

          selfRef.setCurrAxisRanges(currXRange, selfRef.graph.yAxisRange());
          selfRef.updateTimeInterval();
          selfRef.isZoomed = true;

        },

        pointClickCallback: function(e, p) {
          selfRef.clickedX = p.xval;
          selfRef.chartPointClicked(p);
        },

        highlightCallback: function(e, x, p) {
          selfRef.highlightAllPoints();
        },

        drawCallback: function(g, is_initial) {
          selfRef.setCurrAxisRanges(g.xAxisRange(), g.yAxisRange());
          selfRef.highlightAllPoints();
          selfRef.updateTimeInterval();
        },

        clickCallback: function(e, x, points) {
          if (!isPointOnGraph.call(selfRef, x))
            selfRef.canvasPointClicked(x, points);
        }
      }
    );
  }

  sewi.ChartResourceViewer.prototype.setCurrAxisRanges = function(xRange, yRange) {
    this.xMin = xRange[0];
    this.xMax = xRange[1];
    this.prevYMin = this.yMin;
    this.prevYMax = this.yMax;
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
    var sumOfRRIntervals = 0;
    var visibleHighlightedPoints = [];

    $.each(selfRef.highlightedPoints, function(index, value) {
      if (selfRef.isVisiblePoint(value)) {
        visibleHighlightedPoints.push(value['xval']);
      }

    });
    visibleHighlightedPoints.sort(sorter);

    $.each(visibleHighlightedPoints, function(index, value) {
      if (index != visibleHighlightedPoints.length - 1)
        sumOfRRIntervals += visibleHighlightedPoints[index + 1] - value;
    });

    return sumOfRRIntervals / (visibleHighlightedPoints.length - 1);
  }

  sewi.ChartResourceViewer.prototype.hideTooltips = function() {
    this.controls.disableTooltips();
  }

  sewi.ChartResourceViewer.prototype.showTooltips = function() {
    this.controls.enableTooltips();
  }
})();