var sewi = sewi || {};

$(function() {
  // Safeguard if function is called without `new` keyword
  sewi.ChartResourceViewer = function(options) {

    sewi.ResourceViewer.call(this);
    initDOM.call(this);
    initEvents.call(this);
    initChartComponents.call(this);
    generateChartData.call(this);

  }

  sewi.inherits(sewi.ChartResourceViewer, sewi.ResourceViewer);

  function initDOM() {

    this.mainDOMElement.addClass('time-series-graph-container');

    var legend = $('<div>').addClass('legend-container').attr('id', 'legend');
    var chart = $('<div>').addClass('main-graph').attr('id', 'ecg');

    // appending chart and legend to timeChartContainer
    this.mainDOMElement.append(legend).append(chart);

    //option to show/hide the rangeSelector
    var options = $('<div>').attr('id', 'options').addClass('chart-options');
    this.rangeSelector = $('<input>').attr('type', 'checkbox').attr('id', 'rangeSelector');
    options.append(this.rangeSelector);

    var rangeSelectorLabel = $('<label>').attr('for', 'rangeSelector').html('Range selector').addClass('chart-option');
    options.append(rangeSelectorLabel);

    //options to calculate R-R interval and clear the list of selected points. 
    var textBox = $('<label>').addClass('chart-option').attr('for', 'rrInterval').html('R-R Interval: ').append($('<input>').attr('type', 'textbox').attr('id', 'rrInterval').attr('size', 4).attr('disabled', 'disabled'));
    options.append(textBox);

    //option to clear the points selected
    this.clearButton = $('<button>').addClass('chart-option').attr('id', 'clearSelectedPoints').html('Clear all selected points');
    options.append(this.clearButton);
    this.mainDOMElement.append(options);
  }

  function initEvents() {

    this.clearButton.click(clearButtonClicked.bind(this));
    this.rangeSelector.on('change', rangeSelectorChanged.bind(this));
  }

  function initChartComponents() {

    this.highlightedPoints = [];
    this.peaks = [];
  }

  function clearButtonClicked() {

    this.highlightedPoints = [];
    this.peaks = [];
    $('#rrInterval').val("");
    this.graph.updateOptions({
      dateWindow: this.graph.xAxisRange()
    });
  }

  function rangeSelectorChanged() {

    if ($(this.rangeSelector).is(":checked"))
      this.graph.updateOptions({
        showRangeSelector: true
      });
    else
      this.graph.updateOptions({
        showRangeSelector: false
      });
  }

  function formatLegendDisplay(ms) {
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

  sewi.ChartResourceViewer.prototype.chartPointClicked = function(context, p) {
    if (this.isHighlightedPoint(p)) {
      this.unHighlightPoint(p);

    } else {
      this.highlightedPoints.push(p);
      this.peaks.push(p.xval);
      this.highlightPoint(context, p);
    }

    if (this.peaks.length > 1) {
      // if more than one peak has been selected, find the R-R Interval using the peaks
      var rrInterval = this.calculateRRInterval();

      $('#rrInterval').val((rrInterval / 1000).toFixed(2) + ' sec');
    } else {
      $('#rrInterval').val('');
    }

  }

  sewi.ChartResourceViewer.prototype.isHighlightedPoint = function(p) {
    var index = this.peaks.indexOf(p.xval);
    return (index >= 0);
  }

  sewi.ChartResourceViewer.prototype.highlightNearestPeak = function(context, x) {
    var indexOfClickedPoint = this.binarySearch(x);
    var start = indexOfClickedPoint - 25;
    var end = indexOfClickedPoint + 25;
    this.chartPointClicked(context, this.findClosestPeak(start, end));
  }

  sewi.ChartResourceViewer.prototype.findClosestPeak = function(start, end) {
    var ymax = 0;
    var xmax = 0;
    var index = start;
    while (index <= end) {
      var y = parseFloat(this.graphData[index][1]);
      if (y > ymax) {
        ymax = y;
        xmax = parseInt(this.graphData[index][0]);
      }
      index++;
    }
    console.log(xmax + ' ' + ymax);
    return {
      'xval': xmax,
      'yval': ymax
    };

  }

  sewi.ChartResourceViewer.prototype.binarySearch = function(x) {
    var data = this.graphData;

    var minIndex = 0;
    var maxIndex = data.length - 1;
    var currentIndex;
    var currentElement;

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
    }
    return -1;

  }

  sewi.ChartResourceViewer.prototype.highlightAllPoints = function(context) {
    var selfRef = this;
    $.each(selfRef.highlightedPoints, function(index, value) {
      selfRef.highlightPoint(context, value);
    });
  }

  sewi.ChartResourceViewer.prototype.highlightPoint = function(context, p) {
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
      $("#ecg")[0],
      data, {
        title: ' ',
        animatedZooms: true,
        panEdgeFraction: 0.01,
        drawGapEdgePoints: true,
        rangeSelectorPlotFillColor: '#08b265',
        rangeSelectorPlotStrokeColor: '#068149',
        colors: ['#c90696'],
        highlightCircleSize: 4,
        hideOverlayOnMouseOut: false,
        xlabel: 'Time',
        ylabel: 'Value',
        labels: ['time', 'Value'],
        xRangePad: 2,
        labelsDiv: $("#legend")[0],
        dateWindow: [2900, 5200],
        axes: {
          x: {
            valueFormatter: formatLegendDisplay
          }
        },

        pointClickCallback: function(e, p) {
          selfRef.clickedX = p.xval;
          selfRef.chartPointClicked(e.toElement.getContext('2d'), p);
        },

        highlightCallback: function(e, x, p) {
          selfRef.highlightAllPoints(e.toElement.getContext('2d'));
        },

        drawCallback: function(g) {
          selfRef.highlightAllPoints(g.canvas_.getContext('2d'));
        },

        clickCallback: function(e, x, points) {
          if (!isValidPoint.call(selfRef, x))
            selfRef.highlightNearestPeak(e.toElement.getContext('2d'), x);
        }
      }
    );
  }
});