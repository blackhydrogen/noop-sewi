var sewi = sewi || {};

(function() {

  /**
   * Defines a control panel suitable for controlling and manipulating the chart.
   *
   * @class sewi.ChartControls
   * @constructor
   * @extends sewi.ConfiguratorElement
   */

  sewi.ChartControls = function() {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.ChartControls))
      return new sewi.ChartControls();

    sewi.ConfiguratorElement.call(this);

    this.isRangeSelectorShown = false;

    initDOM.call(this);
    initEvents.call(this);
  };

  sewi.inherits(sewi.ChartControls, sewi.ConfiguratorElement);

  /**
   * Fired when all the selected points in the chart need to be reset
   * @event allPointsReset
   * @memberof sewi.ChartControls
   */

  /**
   * Fired when the selected points in the visible range of the graph need to be reset
   * @event visiblePointsReset
   * @memberof sewi.ChartControls
   */

  /**
   * Fired when the graph needs to be fully zoomed out
   * @event zoomOutGraph
   * @memberof sewi.ChartControls
   */

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
      this.trigger('visiblePointsReset');
    }

    if (isZoomOut) {
      this.trigger('zoomOutGraph');
    }
  }

  function timingDisplayFocused() {
    this.timingDisplay.select();
  }

  function roundOffToNearestSeconds(value) {
    return (value / 1000).toFixed(2);
  }

  /**
   * Updates the displayed values of the ChartControls instance.
   *
   * @param  {Object} [options] A dictionary containing all values that will
   * be updated.
   * @param {number} [options.timing] The new time interval between the selected
   * points in the visible range of the graph
   * @return {ChartControls} The current instance of ChartControls.
   */

  sewi.ChartControls.prototype.update = function(options) {
    options = options || {};

    if (!_.isUndefined(options.timing)) {
      if (options.timing > 0) {
        var timingInSec = roundOffToNearestSeconds(options.timing);
        this.timingDisplay.val(timingInSec + 's');
      } else {
        this.timingDisplay.val('');
      }
    }
    return this;
  };

  /**
   * Hides tooltips previously made visible via
   * {@link sewi.ChartControls#showTooltips}.
   */
  sewi.ChartControls.prototype.hideTooltips = function() {
    if (this.initializedTooltips) {
      var element = this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_RESET_ALL_POINTS_BUTTON_CLASS);
      element.tooltip('destroy');
      this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_RESET_SHOWN_POINTS_BUTTON_CLASS).tooltip('destroy');
      this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_ZOOM_OUT_BUTTON_CLASS).tooltip('destroy');
      this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_TIMING_DISPLAY_LABEL_CLASS).tooltip('destroy');
      this.initializedTooltips = false;
    }
  };

  /**
   * Allows tooltips within the ChartControls to be displayed when the buttons
   * are under the mouse cursor.
   */
  sewi.ChartControls.prototype.showTooltips = function() {
    if (!this.initializedTooltips) {
      this.mainDOMElement.find('.' + sewi.constants.CHART_CONTROLS_RESET_ALL_POINTS_BUTTON_CLASS).tooltip({
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

  };
})();


(function() {

  /**
   * Displays a time series chart for an ECG from an encounter.
   *
   * @class sewi.ChartResourceViewer
   * @constructor
   * @param {Object} options Configuration options for the ChartResourceViewer
   * @param {string} options.id The UUID of the chart resource to be displayed.
   */

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
    validateArguments.call(this);
    initDOM.call(this);
    initControls.call(this);
    initEventHandlers.call(this);
    initChartComponents.call(this);

  };

  sewi.inherits(sewi.ChartResourceViewer, sewi.ResourceViewer);

  /**
   * Fired when the graph has been zoomed on the y axis
   * @event zoomedOnY
   * @memberof sewi.ChartResourceViewer
   */

  function validateArguments() {        
    if (!_.isString(this.id)) {
        throw new Error('options: Valid resource id must be provided.');
    }
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
    this.controlPanelElement.on('visiblePointsReset', clearShownPoints.bind(this));
    this.controlPanelElement.on('zoomOutGraph', zoomOutGraph.bind(this));
    this.chartContainer.on('zoomedOnY', highlightPointsAboveMinY.bind(this));

  }

  function initChartComponents() {

    this.highlightedPoints = [];
    this.peaks = [];
    this.initialXRange = [0, 2000];
    this.isZoomed = true;
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
      createChart.call(selfRef, parsedCSV);
    });
  }

  function loadFailed() {
    this.showError(sewi.constants.CHART_RESOURCE_VIEWER_LOAD_ERROR_MESSAGE);
  }

  function loadSuccessful(data) {
    parseChartData.call(this, data);
  }

  function clearAllPoints() {

    this.highlightedPoints = [];
    this.peaks = [];
    redrawGraph.call(this);
  }

  function clearShownPoints() {
    var selfRef = this;
    var clone = selfRef.highlightedPoints.slice(0);
    $.each(clone, function(index, value) {
      if (isVisiblePoint(value, selfRef.xMin, selfRef.xMax, selfRef.yMin, selfRef.yMax)) {
        unHighlightPoint.call(selfRef, value);
      }

    });
    redrawGraph.call(this);

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
      var point = findPeakInRegion.call(this, start, start + searchInterval);

      if (point != -1) {
        if (parseFloat(point.yval) > yMin && parseFloat(point.yval) < yMax) {
          if (!isHighlightedPoint(point, this.peaks)) {
            this.highlightedPoints.push(point);
            this.peaks.push(point.xval);
            highlightPoint.call(this, point);
          }
        }
      }
      start += searchInterval;
    }
    updateTimeInterval.call(this);
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

  function redrawGraph() {
    this.graph.updateOptions({
      dateWindow: this.graph.xAxisRange()
    });
  }

  function chartPointClicked(p) {
    if (isHighlightedPoint(p, this.peaks)) {
      unHighlightPoint.call(this, p);

    } else {
      this.highlightedPoints.push(p);
      this.peaks.push(p.xval);
      highlightPoint.call(this, p);
    }
    redrawGraph.call(this);
    updateTimeInterval.call(this);
  }

  function updateTimeInterval() {
    if (this.peaks.length > 1) {
      var rrInterval = calculateRRInterval.call(this);
      this.controls.update({
        'timing': rrInterval
      });
    } else {
      this.controls.update({
        'timing': ''
      });
    }

  }

  function isHighlightedPoint(p, peaks) {
    var index = peaks.indexOf(p.xval);
    return (index >= 0);
  }

  function canvasPointClicked(x, points) {
    chartPointClicked.call(this, points[0]);
  }

  function getIndexOfPoint(x, samplingRate) {
    return parseInt(x / samplingRate);
  }

  function isVisiblePoint(point, xMin, xMax, yMin, yMax) {
    return (point.xval <= xMax && point.xval >= xMin && point.yval <= yMax && point.yval >= yMin);
  }

  function findPeakInRegion(start, end) {
    var xmax = 0;
    var ymax = 0;
    var ySecondMax = 0;
    var graphXExtremes = this.graph.xAxisExtremes();
    var maxX = graphXExtremes[1];
    var maxIndex = getIndexOfPoint(maxX, this.samplingRate);

    var index = start;

    if (end > maxIndex)
      end = maxIndex;

    while (index <= end) {
      var y = parseFloat(this.graphData[index][1]);
      if (y > ymax) {
        ymax = y;
        xmax = parseInt(this.graphData[index][0]);
      } else if (y > ySecondMax) {
        ySecondMax = y;
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

  function highlightAllPoints() {
    var selfRef = this;
    $.each(selfRef.highlightedPoints, function(index, value) {
      highlightPoint.call(selfRef, value);
    });
  }

  function highlightPoint(p) {
    var context = this.canvasContext;
    var x = this.graph.toDomXCoord(p.xval),
      y = this.graph.toDomYCoord(p.yval);
    context.fillStyle = "#000";
    context.beginPath();
    context.arc(x, y, 2.5, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
  }

  function createChart(data) {
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
          if ((selfRef.yMin != selfRef.prevYMin || selfRef.yMax != selfRef.prevYMax) && selfRef.graph.isZoomed())
            selfRef.chartContainer.trigger('zoomedOnY');

          setCurrAxisRanges.call(selfRef, selfRef.graph);
          updateTimeInterval.call(selfRef);
          if(selfRef.graph.isZoomed())
            selfRef.isZoomed = true;

        },

        pointClickCallback: function(e, p) {
          selfRef.clickedX = p.xval;
          chartPointClicked.call(selfRef, p);
        },

        highlightCallback: function() {
          highlightAllPoints.call(selfRef);
        },

        drawCallback: function(g, is_initial) {
          setCurrAxisRanges.call(selfRef, g);
          if (!is_initial) {
            highlightAllPoints.call(selfRef);
            updateTimeInterval.call(selfRef);
          }
        },

        clickCallback: function(e, x, points) {
          if (!isPointOnGraph.call(selfRef, x))
            canvasPointClicked.call(selfRef, x, points);
        }
      }
    );
  }

  function setCurrAxisRanges(graph) {
    var xRange = graph.xAxisRange();
    var yRange = graph.yAxisRange();
    this.xMin = xRange[0];
    this.xMax = xRange[1];
    this.prevYMin = this.yMin;
    this.prevYMax = this.yMax;
    this.yMin = yRange[0];
    this.yMax = yRange[1];

  }

  function unHighlightPoint(p) {

    for (var index = 0; index < this.highlightedPoints.length; index++) {
      if (this.highlightedPoints[index].xval == p.xval) {
        this.highlightedPoints.splice(index, 1);
        break;
      }
    }
    this.peaks.splice(this.peaks.indexOf(p.xval), 1);
  }

   /*
   * R-R Interval is calculated as follows :
   * 1.Sort all the points selected by increasing x-coordinate.
   * 2.Sum up the difference between adjacent points.
   * 3.Return the average difference.
   */
  function calculateRRInterval() {

    var selfRef = this;
    var sumOfRRIntervals = 0;
    var visibleHighlightedPoints = [];

    $.each(selfRef.highlightedPoints, function(index, value) {
      if (isVisiblePoint(value, selfRef.xMin, selfRef.xMax, selfRef.yMin, selfRef.yMax)) {
        visibleHighlightedPoints.push(value.xval);
      }

    });
    visibleHighlightedPoints.sort(sorter);

    $.each(visibleHighlightedPoints, function(index, value) {
      if (index != visibleHighlightedPoints.length - 1)
        sumOfRRIntervals += visibleHighlightedPoints[index + 1] - value;
    });

    return sumOfRRIntervals / (visibleHighlightedPoints.length - 1);
  }

  /**
   * Loads the chart from its end point
   *
   */
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
  };

  sewi.ChartResourceViewer.prototype.resize = function() {
    this.graph.resize();
  };

  sewi.ChartResourceViewer.prototype.hideTooltips = function() {
    this.controls.hideTooltips();
  };

  sewi.ChartResourceViewer.prototype.showTooltips = function() {
    this.controls.showTooltips();
  };
})();