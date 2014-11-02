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
                                 .append(sewi.constants.CHART_CONTROLS_RESET_SELECTION_BUTTON_DOM);

        this.timingDisplay = $(sewi.constants.CHART_CONTROLS_TIMING_DISPLAY_DOM);

        leftPanel.append(this.optionsMenu);
        rightPanel.append(this.timingDisplay);

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
        var isSelectionReset = false;

        // Get selected options
        if (!_.isEmpty(selectionOptions)) {
            isRangeSelectorShown = _.contains(selectionOptions, sewi.constants.CHART_CONTROLS_RANGE_SELECTOR_VALUE);

            isSelectionReset = _.contains(selectionOptions, sewi.constants.CHART_CONTROLS_RESET_SELECTION_VALUE);
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

        // Reset selection is necessary
        if (isSelectionReset) {
            this.trigger('selectionReset');
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
                this.timingDisplay.val(options.timing.toFixed(2) + 's');
            } else {
                this.timingDisplay.val('');
            }
        }
    };
});

$(function() {

  sewi.ChartControls = function(options) {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.ChartControls))
      return new sewi.ChartControls();

    sewi.ConfiguratorElement.call(this);

    initDOM.call(this);
    initEvents.call(this);

  }

  sewi.inherits(sewi.ChartControls, sewi.ConfiguratorElement);

  function initDOM() {
    var options = this.mainDOMElement.addClass('chart-options');

    //option to show/hide the rangeSelector
    this.rangeSelectorOption = $('<input>').attr('type', 'checkbox').attr('id', 'rangeSelector');
    options.append(this.rangeSelectorOption);
    var rangeSelectorLabel = $('<label>').attr('for', 'rangeSelector').html('Range selector').addClass('chart-option');
    options.append(rangeSelectorLabel);

    //textbox to display R-R interval
    this.rrIntervalBox = $('<input>').attr('type', 'textbox').attr('id', 'rrInterval').attr('size', 4).attr('disabled', 'disabled');

    var rrIntervalLabel = $('<label>').addClass('chart-option').attr('for', 'rrInterval').html('Average time interval between selected points: ');
    options.append(rrIntervalLabel);
    options.append(this.rrIntervalBox);

    //option to clear the points selected
    this.clearButton = $('<button>').addClass('chart-option').attr('id', 'clearSelectedPoints').html('Clear all selected points');
    options.append(this.clearButton);

    this.mainDOMElement.append(options);

  }

  function initEvents() {
    this.rangeSelectorOption.change(rangeSelectorOptionChanged.bind(this));
    this.clearButton.click(clearButtonClicked.bind(this));
  }

  function rangeSelectorOptionChanged() {
    this.toggleRangeSelectorDisplay();
  }

  function clearButtonClicked() {
    this.clearSelectedPoints();
  }

  sewi.ChartControls.prototype.toggleRangeSelectorDisplay = function() {
    if ($(this.rangeSelectorOption).is(":checked")) {
      this.isRangeSelectorShown = true;
      this.mainDOMElement.trigger('ShowRangeSelector');
    } else {
      this.isRangeSelectorShown = false;
      this.mainDOMElement.trigger('HideRangeSelector');
    }

    return this;

  }

  sewi.ChartControls.prototype.clearSelectedPoints = function() {
    this.clearRRIntervalBox();
    this.mainDOMElement.trigger('clear');
    return this;
  }

  sewi.ChartControls.prototype.setRRIntervalValue = function(value) {
    this.rrIntervalBox.val(value);
  }

  sewi.ChartControls.prototype.clearRRIntervalBox = function() {
    this.rrIntervalBox.val("");
  }

});

$(function() {

  sewi.ChartResourceViewer = function(options) {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.ChartResourceViewer))
      return new sewi.ChartResourceViewer();

    sewi.ResourceViewer.call(this);
    initDOM.call(this);
    initControls.call(this);
    initEventHandlers.call(this);
    initChartComponents.call(this);
    generateChartData.call(this);

  }

  sewi.inherits(sewi.ChartResourceViewer, sewi.ResourceViewer);

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

    this.controlPanelElement.on('clear', clearEvent.bind(this));
    this.controlPanelElement.on('ShowRangeSelector', showRangeSelector.bind(this));
    this.controlPanelElement.on('HideRangeSelector', hideRangeSelector.bind(this));
    this.chartContainer.on('ZoomedOnY', highlightPointsAboveMinY.bind(this));

  }

  function initChartComponents() {

    this.highlightedPoints = [];
    this.peaks = [];
    this.xMin = 0;
    this.xMax = 2000;
  }

  function clearEvent() {

    this.highlightedPoints = [];
    this.peaks = [];
    this.clearAllSelectedPoints();
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

  function highlightPointsAboveMinY() {
    console.log("re");
    var yRange = this.graph.yAxisRange();
    var yMin = yRange[0];
    var indexMin = this.binarySearch(parseInt(this.xMin));
    var indexMax = this.binarySearch(parseInt(this.xMax));
    for (var start = indexMin; start < indexMax; start += 40){
     var point = this.findPeakInRegion(start, start + 39);
    
    if (point != -1) {
      if (parseFloat(point['yval']) > yMin)
        this.chartPointClicked(point);
    }
  }
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

  function generateChartData() {
    var selfRef = this;
    selfRef.graphData = [];
    var data = "";
    $.get("/static/sewi/js/app/Sample Resources/data.csv", function(csvText) {
      var allTextLines = csvText.split(/\r\n|\n/);
      $.each(allTextLines, function(index, value) {
        data += value + '\n';
        selfRef.graphData.push(value.split(','));
      });
      selfRef.createChart(data);
    });
  }

  sewi.ChartResourceViewer.prototype.resize = function() {
    console.log("Incomplete");
  }

  sewi.ChartResourceViewer.prototype.clearAllSelectedPoints = function() {
    this.redrawGraph();

  }

  sewi.ChartResourceViewer.prototype.redrawGraph = function() {
    this.graph.updateOptions({
      dateWindow: this.graph.xAxisRange()
    });
  }

  sewi.ChartResourceViewer.prototype.roundOffToNearestSeconds = function(value) {
    return (value / 1000).toFixed(2);
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

    if (this.peaks.length > 1) {
      // if more than one peak has been selected, find the R-R Interval using the peaks
      var rrInterval = this.calculateRRInterval();
      rrInterval = this.roundOffToNearestSeconds(rrInterval);

      this.controls.setRRIntervalValue(rrInterval + ' sec');
    } else {
      this.controls.clearRRIntervalBox();
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
    var xSecondMax = 0;
    var index = start;
    while (index <= end) {
      console.log(index);
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

  sewi.ChartResourceViewer.prototype.binarySearch = function(x) {
    var data = this.graphData;

    var minIndex = 0;
    var maxIndex = data.length - 1;
    var currentIndex;
    var currentElement;
    var closestMatch;
    var minDiff = 1000000;

    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0;
      currentElement = parseInt(data[currentIndex][0]);

      if (currentElement < x) {
        minIndex = currentIndex + 1;
      } else if (currentElement > x) {
        maxIndex = currentIndex - 1;
      } else {
        return currentIndex;
      }
      if(minDiff > Math.abs(currentElement-x)){
        minDiff = Math.abs(currentElement -x);
        closestMatch = currentIndex;
      }
    }
    return closestMatch;

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
    context.arc(x, y, 3, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
  }

  /**
   * Remove the point from the list of highlighted points.
   * The graph is automatically re-rendered when the point is unhighlighted.
   **/
  sewi.ChartResourceViewer.prototype.unHighlightPoint = function(point) {

    for (var index = 0; index < this.highlightedPoints.length; index++) {
      if (this.highlightedPoints[index].xval == point.xval) {
        this.highlightedPoints.splice(index, 1);
        break;
      }
    }
    this.peaks.splice(this.peaks.indexOf(point.xval), 1);
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
          var extreme = selfRef.graph.xAxisExtremes();

          if (!(selfRef.graph.isZoomed('x')) && !(selfRef.graph.isZoomed('y'))) {
            selfRef.xMin = extreme[0];
            selfRef.xMax = extreme[1];

          } else {
            if (selfRef.xMin == currXRange[0] && selfRef.xMax == currXRange[1])
              selfRef.chartContainer.trigger('ZoomedOnY');
            else {
              selfRef.xMin = currXRange[0];
              selfRef.xMax = currXRange[1];
            }
          }
        },

        pointClickCallback: function(e, p) {
          selfRef.clickedX = p.xval;
          selfRef.chartPointClicked(p);
        },

        highlightCallback: function(e, x, p) {
          //console.log(p[0]);
          selfRef.highlightAllPoints();
        },

        drawCallback: function(g) {
          selfRef.highlightAllPoints();
        },

        clickCallback: function(e, x, points) {
          if (!isValidPoint.call(selfRef, x))
            selfRef.canvasPointClicked(x, points);
        }
      }
    );
  }
});
