var sewi = sewi || {};

$(function() {
  // Safeguard if function is called without `new` keyword
  sewi.chartResourceViewer = function(options) {

    var selfRef = this;
    initDOM.call(selfRef);
    initEvents.call(selfRef);
    generateChartData(createChart).call(selfRef);
    initChartComponents.call(selfRef);
  }

  function initDOM() {
    var selfRef = this;
    selfRef.mainDOMElement.addClass('time-series-graph-container').attr('id', 'timechartContainer');

    var legend = $('<div>').addClass('legend-container').attr('id', 'legend');
    var chart = $('<div>').addClass('main-graph').attr('id', 'ecg');

    // appending chart and legend to timeChartContainer
    selfRef.mainDOMElement.append(legend).append(chart);

    //option to show/hide the rangeSelector
    var options = $('<div>').attr('id', 'options').addClass('chart-options');
    selfRef.rangeSelector = $('<input>').attr('type', 'checkbox').attr('id', 'rangeSelector');
    options.append(selfRef.rangeSelector);

    var rangeSelectorLabel = $('<label>').attr('for', 'rangeSelector').html('Show range selector').addClass('chart-option');
    options.append(rangeSelectorLabel);

    //options to calculate R-R interval and clear the list of selected points. 
    var textBox = $('<label>').addClass('chart-option').attr('for', 'rrInterval').html('R-R Interval: ').append($('<input>').attr('type', 'textbox').attr('id', 'rrInterval').attr('size', 4).attr('disabled', 'disabled'));
    options.append(textBox);

    //option to clear the points selected
    selfRef.clearButton = $('<button>').addClass('chart-option').attr('id', 'clearSelectedPoints').html('Clear all selected points');
    options.append(selfRef.clearButton);
    selfRef.mainDOMElement.append(options);
  }

  function initEvents() {
    var selfRef = this;
    selfRef.clearButton.click(clearButtonClicked.bind(selfRef));
    selfRef.rangeSelector.on('change', rangeSelectorChanged.bind(selfRef));
  }

  function initChartComponents() {
    var selfRef = this;
    selfRef.highlightedPoints = [];
    selfRef.peaks = [];
  }

  function clearButtonClicked() {
    var selfRef = this;
    selfRef.highlightedPoints = [];
    selfRef.peaks = [];
    $('#rrInterval').val("");
    selfRef.graph.updateOptions({
      dateWindow: selfRef.graph.xAxisRange()
    });
  }

  function rangeSelectorChanged() {
    var selfRef = this;
    if ($(this.rangeSelector).is(":checked"))
      selfRef.graph.updateOptions({
        showRangeSelector: true
      });
    else
      selfRef.graph.updateOptions({
        showRangeSelector: false
      });
  }

  function generateChartData(callback) {
    var data = "";
    $.get("data.csv", function(allText) {

      var allTextLines = allText.split(/\r\n|\n/);

      for (var i = 0; i < allTextLines.length; i++) {
        data += allTextLines[i] + '\n';
      }
      callback(data);
    });

  }

  function highlightPoint(context, x, y) {
    context.fillStyle = "#000";
    context.beginPath();
    context.arc(x, y, 3, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
  }

  var unHighlightPoint = function(p) {
    for (var index = 0; index < highlightedPoints.length; index++) {
      if (highlightedPoints[index].xval == p.xval) {
        highlightedPoints.splice(index, 1);
        break;
      }
    }
  }

  function createChart(result) {
    selfRef.graph = new Dygraph(
      document.getElementById("ecg"),
      result, {
        title: ' ',
        animatedZooms: true,
        panEdgeFraction: 0.01,
        drawGapEdgePoints: true,
        rangeSelectorPlotFillColor: '#08b265',
        rangeSelectorPlotStrokeColor: '#068149',
        colors: ['#c90696'],
        highlightCircleSize: 4,
        hideOverlayOnMouseOut: false,
        labels: ['time', 'Value'],
        xRangePad: 2,
        labelsDiv: document.getElementById("legend"),
        axes: {
          x: {
            valueFormatter: function(ms) {
              return '<b style="color:#c90696">Time: </b>' + ms;
            }
          }
        },

        pointClickCallback: function(e, p) {
          var index = peaks.indexOf(p.xval);

          if (index >= 0) {
            peaks.splice(index, 1);
            unHighlightPoint(p);

          } else {
            var context = e.toElement.getContext('2d');
            highlightedPoints.push(p);
            peaks.push(p.xval);
            var x = selfRef.graph.toDomXCoord(p.xval),
              y = selfRef.graph.toDomYCoord(p.yval);
            highlightPoint(context, x, y);
          }

          if (peaks.length > 1) {
            // if more than one peak has been selected, sort them and find the rrInterval

            var sorter = function(a, b) {
              return a - b;
            }

            peaks.sort(sorter);

            var diff = 0;
            $.each(peaks, function(index) {
              if (index != peaks.length - 1)
                diff += peaks[index + 1] - peaks[index];
            });

            // rrInterval = diff between the peaks
            var rrInterval = (diff / (peaks.length - 1));
            // convert to decimal and round off to 2 decimal places
            rrInterval = (rrInterval / 1000).toFixed(2);
            $('#rrInterval').val(rrInterval + ' sec');
          } else {
            $('#rrInterval').val('');
          }

        },
        highlightCallback: function(e, x, p) {
          var context = e.toElement.getContext('2d');

          $.each(highlightedPoints, function(index) {
            var x = selfRef.graph.toDomXCoord(highlightedPoints[index].xval),
              y = selfRef.graph.toDomYCoord(highlightedPoints[index].yval);
            highlightPoint(context, x, y);
          });

        },

        drawCallback: function(g) {
          var context = g.canvas_.getContext('2d');
          $.each(highlightedPoints, function(index) {
            var x = g.toDomXCoord(highlightedPoints[index].xval),
              y = g.toDomYCoord(highlightedPoints[index].yval);
            highlightPoint(context, x, y);
          });
        },
        dateWindow: [2900, 5200],
      }
    );
  }
});