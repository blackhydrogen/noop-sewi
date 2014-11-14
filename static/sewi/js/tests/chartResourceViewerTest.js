(function() {

  var constants = {
    TEST_INVALID_RESOURCE_ID: 121,
    TEST_VALID_RESOURCE_ID: 'fd28bb9f-b9b4-4449-a914-0525237df1ce',
    TEST_NON_EXISTENT_RESOURCE_ID: 'non-existent-resource-id',
    TEST_INITIAL_GRAPH_RANGE: [0, 30000],
    TEST_SAMPLE_POINT_1: 800,
    TEST_SAMPLE_POINT_2: 1000,
    TEST_SAMPLE_POINT_3: 1800,
    TEST_SAMPLE_X_VALUE: 2000,
    TEST_SAMPLE_Y_VALUE: 1.87,
    TEST_LEGEND_Y_VALUE_FORMATTED_OUTPUT: '<b style="color:#c61055"></b>1.87mV',
    TEST_LEGEND_X_VALUE_FORMATTED_OUTPUT: '<b style="color:#c61055">Time</b>: 2000ms ',
    TEST_TIME_INTERVAL_FOR_2_SELECTED_POINTS: '0.20s',
    TEST_TIME_INTERVAL_FOR_3_SELECTED_POINTS: '0.50s',
    TEST_ZOOMED_Y_RANGE: [1.5, 2.2],
    TEST_NUM_SELECED_POINTS_IN_ZOOMED_Y_RANGE: 16,
    TEST_TIME_INTERVAL_IN_ZOOMED_Y_RANGE: '1.80s',
    TEST_ZOOMED_X_RANGE: [900, 2000],
    RESET_ALL_POINTS_EVENT: 'allPointsReset',
    RESET_VISIBLE_POINTS_EVENT: 'visiblePointsReset',
    ZOOM_OUT_GRAPH_EVENT: 'zoomOutGraph',
    ERROR_SCREEN_CLASS: 'error-screen',

    //Control panel constants
    TIMING_DISPLAY_LABEL_CLASS: 'timing-display-label',
    ZOOM_OUT_BUTTON_CLASS: 'zoom-out-button',
    RESET_ALL_POINTS_BUTTON_CLASS: 'reset-all-points-button',
    RESET_VISIBLE_POINTS_BUTTON_CLASS: 'reset-visible-points-button',
  };

  function getPointInGraph(pointX) {
    var pointNum = pointX / this.samplingRate;
    return {
      'xval': parseInt(this.graphData[pointNum][0]),
      'yval': parseFloat(this.graphData[pointNum][1])
    };
  }

  function isIDInDOM(containerElement, htmlID) {
    return containerElement.find('#' + htmlID).length > 0;
  }

  QUnit.module('Chart Resource Viewer', {
    setup: function() {
      this.fixture = $('#qunit-fixture');
    },
    teardown: function() {}
  });

  QUnit.test('CR1: Initialization', function(assert) {

    assert.throws(function() {
      var chartResourceViewer = new sewi.ChartResourceViewer();
    }, Error, 'Throws Error when no id is passed on initialization');

    var options = {
      id: constants.TEST_INVALID_RESOURCE_ID
    }
    assert.throws(function() {
      var chartResourceViewer = new sewi.ChartResourceViewer(options);
    }, Error, 'Throws Error when invalid id is passed on initialization');

    options.id = constants.TEST_VALID_RESOURCE_ID;
    assert.ok(sewi.ChartResourceViewer(options), 'Chart Resource Viewer called without the new keyword');
    assert.ok(new sewi.ChartResourceViewer(options), 'Chart Resource Viewer initialized successfully');
  });

  QUnit.asyncTest('CR2: Loading graph into the DOM', function(assert) {
  	QUnit.expect(3);
    var validChartResourceViewer = new sewi.ChartResourceViewer({
      id: constants.TEST_VALID_RESOURCE_ID
    });
    validChartResourceViewer.load();

    var nonExistentChartResourceViewer = new sewi.ChartResourceViewer({
      id: constants.TEST_NON_EXISTENT_RESOURCE_ID
    });
    nonExistentChartResourceViewer.load();

    setTimeout(function() {
      var graphCanvas = validChartResourceViewer.chartContainer.find('canvas');
      assert.equal(graphCanvas.length, 2, 'Chart loaded into the DOM successfully');
      assert.ok(_.isEqual(validChartResourceViewer.graph.xAxisRange(), constants.TEST_INITIAL_GRAPH_RANGE), 'Initial range of the graph set successfully');

      var nonExistentResourceViewer = nonExistentChartResourceViewer.getDOM();
      var errorScreen = nonExistentResourceViewer.find('.' + constants.ERROR_SCREEN_CLASS);
      assert.equal(errorScreen.length, 1, 'Viewer displays an error if the resource does not exist.');

      QUnit.start();
    }, 9000);

  });

  QUnit.asyncTest('CR3: Selecting/Deselecting a graph-point on clicking it', function(assert) {
  	QUnit.expect(4);
    var chartResourceViewer = new sewi.ChartResourceViewer({
      id: constants.TEST_VALID_RESOURCE_ID
    });
    chartResourceViewer.load();
    var e = jQuery.Event('mousedown');

    setTimeout(function() {
      var pointOnGraph = getPointInGraph.call(chartResourceViewer, constants.TEST_SAMPLE_POINT_1);
      //Select/Deselect a point by directly clicking on it
      chartResourceViewer.privates.chartPointClicked.call(chartResourceViewer, e, pointOnGraph);
      assert.ok(_.contains(chartResourceViewer.selectedPoints, pointOnGraph), 'Clicked point selected');
      chartResourceViewer.privates.chartPointClicked.call(chartResourceViewer, e, pointOnGraph);
      assert.ok(!_.contains(chartResourceViewer.selectedPoints, pointOnGraph), 'Selected point deselected on clicking again');

      //Select/Deselect a point by clicking on the canvas when the point is highlighted
      chartResourceViewer.clickedX = 0; // Reset any previous click events
      chartResourceViewer.privates.canvasPointClicked.call(chartResourceViewer, e, constants.TEST_SAMPLE_POINT_1, [pointOnGraph]);
      assert.ok(_.contains(chartResourceViewer.selectedPoints, pointOnGraph), 'Point selected when canvas is clicked');
      chartResourceViewer.privates.canvasPointClicked.call(chartResourceViewer, e, constants.TEST_SAMPLE_POINT_1, [pointOnGraph]);
      assert.ok(!_.contains(chartResourceViewer.selectedPoints, pointOnGraph), 'Point deselected when canvas is clicked again');

      QUnit.start();
    }, 9000);

  });

  QUnit.asyncTest('CR4: Updating time interval on selecting/deselecting points', function(assert) {
    var chartResourceViewer = new sewi.ChartResourceViewer({
      id: constants.TEST_VALID_RESOURCE_ID
    });
    chartResourceViewer.load();
    var e = jQuery.Event('mousedown');

    setTimeout(function() {
      var point1 = getPointInGraph.call(chartResourceViewer, constants.TEST_SAMPLE_POINT_1);
      chartResourceViewer.privates.chartPointClicked.call(chartResourceViewer, e, point1);

      var point2 = getPointInGraph.call(chartResourceViewer, constants.TEST_SAMPLE_POINT_2);
      chartResourceViewer.privates.chartPointClicked.call(chartResourceViewer, e, point2);
      assert.equal(chartResourceViewer.controls.getTiming(), constants.TEST_TIME_INTERVAL_FOR_2_SELECTED_POINTS, 'Interval correct for 2 points');

      var point3 = getPointInGraph.call(chartResourceViewer, constants.TEST_SAMPLE_POINT_3);
      chartResourceViewer.privates.chartPointClicked.call(chartResourceViewer, e, point3);
      assert.equal(chartResourceViewer.controls.getTiming(), constants.TEST_TIME_INTERVAL_FOR_3_SELECTED_POINTS, 'Interval correct for 3 points');
      
      chartResourceViewer.privates.chartPointClicked.call(chartResourceViewer, e, point3);
      assert.equal(chartResourceViewer.controls.getTiming(), constants.TEST_TIME_INTERVAL_FOR_2_SELECTED_POINTS, 'Interval updated on deselecting point');

      QUnit.start();
    }, 9000);

  });

  QUnit.asyncTest('CR5: Updating time interval when zooming into X axis', function(assert) {
 
    var chartResourceViewer = new sewi.ChartResourceViewer({
      id: constants.TEST_VALID_RESOURCE_ID
    });
    chartResourceViewer.load();
    var e = jQuery.Event('mousedown');

    setTimeout(function() {
      var newXRange = constants.TEST_ZOOMED_X_RANGE;

      var pointWithinNewRange = getPointInGraph.call(chartResourceViewer, constants.TEST_SAMPLE_POINT_2);
      chartResourceViewer.privates.chartPointClicked.call(chartResourceViewer, e, pointWithinNewRange);
      var pointOutsideNewRange = getPointInGraph.call(chartResourceViewer, constants.TEST_SAMPLE_POINT_1);
      chartResourceViewer.privates.chartPointClicked.call(chartResourceViewer, e, pointOutsideNewRange);      
      assert.equal(chartResourceViewer.controls.getTiming(),constants.TEST_TIME_INTERVAL_FOR_2_SELECTED_POINTS, 'Interval correct before zooming');
      
      chartResourceViewer.graph.updateOptions({
       	 dateWindow: newXRange
      });
      chartResourceViewer.privates.chartZoomed.call(chartResourceViewer);
      assert.equal(chartResourceViewer.controls.getTiming(), '', 'Interval updated when one point moves out of the currently visible range');
      
      QUnit.start();
    }, 9000);
  });

  QUnit.asyncTest('CR6: Detecting peaks and updating time interval when zooming into Y axis', function(assert) {
    QUnit.stop(1);
    var chartResourceViewer = new sewi.ChartResourceViewer({
      id: constants.TEST_VALID_RESOURCE_ID
    });
    chartResourceViewer.load();

    setTimeout(function() {
      var newYRange = constants.TEST_ZOOMED_Y_RANGE;
      chartResourceViewer.graph.updateOptions({
        valueRange: newYRange
      });
      chartResourceViewer.yMax = newYRange[1];
      chartResourceViewer.yMin = newYRange[0];
      chartResourceViewer.privates.chartZoomed.call(chartResourceViewer);
      QUnit.start();
    }, 9000);

    setTimeout(function() {
      assert.equal(chartResourceViewer.selectedPoints.length, constants.TEST_NUM_SELECED_POINTS_IN_ZOOMED_Y_RANGE, 'All peaks selected successfully');
      assert.equal(chartResourceViewer.controls.getTiming(), constants.TEST_TIME_INTERVAL_IN_ZOOMED_Y_RANGE, 'Interval between selected points updated successfully');
      QUnit.start();
    }, 9500);

  });

  QUnit.asyncTest('CR7: Handling control panel events: Reset all points', function(assert) {
    QUnit.expect(2);
    QUnit.stop(1);
    var chartResourceViewer = new sewi.ChartResourceViewer({
      id: constants.TEST_VALID_RESOURCE_ID
    });
    chartResourceViewer.load();
    chartResourceViewer.selectedPoints.push([1, 2]);
    chartResourceViewer.XValueOfSelectedPoints.push(1);

    setTimeout(function() {
      chartResourceViewer.controlPanelElement.trigger(constants.RESET_ALL_POINTS_EVENT);
      QUnit.start();
    }, 9000);

    setTimeout(function() {
      assert.equal(chartResourceViewer.selectedPoints.length, 0, "All highlighted points reset successfully");
      assert.equal(chartResourceViewer.XValueOfSelectedPoints.length, 0, "X values of highlighted points reset successfully");
      QUnit.start();
    }, 9500);

  });

QUnit.asyncTest('CR8: Handling control panel events: Zoom out graph', function(assert) {
    QUnit.stop(1);
    var chartResourceViewer = new sewi.ChartResourceViewer({
      id: constants.TEST_VALID_RESOURCE_ID
    });
    chartResourceViewer.load();
   
    setTimeout(function() {
      chartResourceViewer.controlPanelElement.trigger(constants.ZOOM_OUT_GRAPH_EVENT);
      QUnit.start();
    }, 9000);

    setTimeout(function() {
     	assert.ok(!chartResourceViewer.graph.isZoomed(), 'Chart zoomed out successfully');
      QUnit.start();
    }, 9500);

  });

QUnit.asyncTest('CR9: Handling control panel events: Reset visible points', function(assert) {
    QUnit.expect(2);
    QUnit.stop(1);
    var chartResourceViewer = new sewi.ChartResourceViewer({
      id: constants.TEST_VALID_RESOURCE_ID
    });
    chartResourceViewer.load();
    var e = jQuery.Event('mousedown');
    var point1_WithinRange, point2_WithinRange, pointOutOfRange
    setTimeout(function() {
      var newXRange = constants.TEST_ZOOMED_X_RANGE;
      point1_WithinRange = getPointInGraph.call(chartResourceViewer, constants.TEST_SAMPLE_POINT_2);
      chartResourceViewer.privates.chartPointClicked.call(chartResourceViewer, e, point1_WithinRange);
      point2_WithinRange = getPointInGraph.call(chartResourceViewer, constants.TEST_SAMPLE_POINT_3);
      chartResourceViewer.privates.chartPointClicked.call(chartResourceViewer, e, point2_WithinRange);

      chartResourceViewer.graph.updateOptions({
       	 dateWindow: newXRange
      });

      pointOutOfRange = getPointInGraph.call(chartResourceViewer, constants.TEST_SAMPLE_POINT_1);
      chartResourceViewer.privates.chartPointClicked.call(chartResourceViewer, e, pointOutOfRange);
      
      chartResourceViewer.controlPanelElement.trigger(constants.RESET_VISIBLE_POINTS_EVENT);
      QUnit.start();
    }, 9000);

    setTimeout(function() {
     	assert.ok(!_.contains(chartResourceViewer.selectedPoints, point1_WithinRange) && !_.contains(chartResourceViewer.selectedPoints, point2_WithinRange), 'Both points within range reset');
     	assert.ok(_.contains(chartResourceViewer.selectedPoints, pointOutOfRange), 'Point outside the range is not reset');
      QUnit.start();
    }, 9500);

  });

QUnit.asyncTest('CR10: Toogle tooltips', function(assert){

    var chartResourceViewer = new sewi.ChartResourceViewer({
      id: constants.TEST_VALID_RESOURCE_ID
    });
    
    var chartControls = chartResourceViewer.controls;
    var controlPanelElement = chartControls.getDOM();
    this.fixture.append(controlPanelElement);

    chartResourceViewer.showTooltips();
    var timingDisplay = this.fixture.find('.' + constants.TIMING_DISPLAY_LABEL_CLASS);
    var zoomOutButton = this.fixture.find('.' + constants.ZOOM_OUT_BUTTON_CLASS);
    var resetAllButton = this.fixture.find('.' + constants.RESET_ALL_POINTS_BUTTON_CLASS);
    var resetVisibleButton = this.fixture.find('.' + constants.RESET_VISIBLE_POINTS_BUTTON_CLASS);

    timingDisplay.trigger('mouseover');
    var tooltipId = $(timingDisplay).attr('aria-describedby');
    assert.ok(isIDInDOM($('body'), tooltipId), 'Tooltip for Timing display present');
    
    zoomOutButton.trigger('mouseover');
    tooltipId = $(zoomOutButton).attr('aria-describedby');
    assert.ok(isIDInDOM($('body'), tooltipId), 'Tooltip for Zoom out button present');
    
    resetAllButton.trigger('mouseover');
    tooltipId = $(resetAllButton).attr('aria-describedby');
    assert.ok(isIDInDOM($('body'), tooltipId), 'Tooltip for Reset all points button present');
    
    resetVisibleButton.trigger('mouseover');
    tooltipId = $(resetVisibleButton).attr('aria-describedby');
    assert.ok(isIDInDOM($('body'), tooltipId), 'Tooltip for Reset visible points button present');

    chartResourceViewer.hideTooltips();
    setTimeout(function(){
      assert.ok(!$(timingDisplay).attr('aria-describedby'), 'Tooltip for Timing display hidden');
      assert.ok(!$(zoomOutButton).attr('aria-describedby'), 'Tooltip for Zoom out button hidden');
      assert.ok(!$(resetAllButton).attr('aria-describedby'), 'Tooltip for Reset all points button hidden');
      assert.ok(!$(resetVisibleButton).attr('aria-describedby'), 'Tooltip for Reset visible points button hidden');
      QUnit.start();
    }, 1000);

  });

QUnit.test('CR11: Testing value formatters in the graph', function(assert){
	var chartResourceViewer = new sewi.ChartResourceViewer({
      id: constants.TEST_VALID_RESOURCE_ID
    });

    var yValue= chartResourceViewer.privates.formatLegendDisplayForYAxis(constants.TEST_SAMPLE_Y_VALUE);
    assert.equal(yValue, constants.TEST_LEGEND_Y_VALUE_FORMATTED_OUTPUT, 'Y value formatted correctly');

    var xValue= chartResourceViewer.privates.formatLegendDisplayForXAxis(constants.TEST_SAMPLE_X_VALUE);
    assert.equal(xValue, constants.TEST_LEGEND_X_VALUE_FORMATTED_OUTPUT, 'X value formatted correctly');
});

})();

(function() {

  var constants = {
    TIMING_DISPLAY_LABEL_CLASS: 'timing-display-label',
    ZOOM_OUT_BUTTON_CLASS: 'zoom-out-button',
    RESET_ALL_POINTS_BUTTON_CLASS: 'reset-all-points-button',
    RESET_VISIBLE_POINTS_BUTTON_CLASS: 'reset-visible-points-button',
    RESET_ALL_POINTS_EVENT: 'allPointsReset',
    RESET_VISIBLE_POINTS_EVENT: 'visiblePointsReset',
    ZOOM_OUT_GRAPH_EVENT: 'zoomOutGraph',
    INVALID_TIMING_1: '123s',
    INVALID_TIMING_2: -5,
    VALID_TIMING: 1000,
    VALID_TIMING_OUTPUT: '1.00s',
  }

  function isClassInDOM(containerElement, htmlClass) {
    return containerElement.find('.' + htmlClass).length > 0;
  }

  QUnit.module('Chart Controls', {
    setup: function() {
      this.fixture = $('#qunit-fixture');
      this.sewi = window.sewi;
    },

    teardown: function() {}
  });

  QUnit.test('CC1: Initialization', function(assert) {
    assert.ok(this.sewi.ChartControls(), 'Chart Controls called without the new keyword');
    assert.ok(new this.sewi.ChartControls(), 'Chart Controls initialized successfully');
  });

  QUnit.test('CC2: Presence of options in the control panel', function(assert) {
    var controls = new this.sewi.ChartControls();
    this.fixture.append(controls.getDOM());
    assert.ok(isClassInDOM(this.fixture, constants.TIMING_DISPLAY_LABEL_CLASS), 'Chart controls adds the interval input box');
    assert.ok(isClassInDOM(this.fixture, constants.ZOOM_OUT_BUTTON_CLASS), 'Chart controls adds the zoom out button.');
    assert.ok(isClassInDOM(this.fixture, constants.RESET_ALL_POINTS_BUTTON_CLASS), 'Chart controls adds the reset all points button.');
    assert.ok(isClassInDOM(this.fixture, constants.RESET_VISIBLE_POINTS_BUTTON_CLASS), 'Chart controls adds the reset visible points button.');
  });

  QUnit.asyncTest('CC3: Triggering events when any of the options change', function(assert) {
    QUnit.expect(3);
    QUnit.stop(2);

    var chartControls = new this.sewi.ChartControls();
    var controlPanelElement = chartControls.getDOM();
    this.fixture.append(controlPanelElement);

    controlPanelElement.on(constants.ZOOM_OUT_GRAPH_EVENT, function() {
      assert.ok(true, 'Zoom out event triggered successfully');
      QUnit.start();
    });

    controlPanelElement.on(constants.RESET_ALL_POINTS_EVENT, function() {
      assert.ok(true, 'Reset all points event triggered successfully');
      QUnit.start();
    });

    controlPanelElement.on(constants.RESET_VISIBLE_POINTS_EVENT, function() {
      assert.ok(true, 'Reset visible points event triggered successfully');
      QUnit.start();
    });

    var zoomButton = this.fixture.find('.' + constants.ZOOM_OUT_BUTTON_CLASS);
    zoomButton.click();
    var resetAllButton = this.fixture.find('.' + constants.RESET_ALL_POINTS_BUTTON_CLASS);
    resetAllButton.click();
    var resetVisibleButton = this.fixture.find('.' + constants.RESET_VISIBLE_POINTS_BUTTON_CLASS);
    resetVisibleButton.click();

  });

  QUnit.test('CC4: Updating the timing display', function(assert) {

    var chartControls = new this.sewi.ChartControls();
    var controlPanelElement = chartControls.getDOM();
    this.fixture.append(controlPanelElement);

    var options = {};
    chartControls.update(options);
    assert.equal(chartControls.getTiming(), '', 'Timing not updated if no value is passed');

    options.timing = constants.INVALID_TIMING_1;
    chartControls.update(options);
    assert.equal(chartControls.getTiming(), '', 'Timing not updated if an integer value is not passed');

    options.timing = constants.INVALID_TIMING_2;
    chartControls.update(options);
    assert.equal(chartControls.getTiming(), '', 'Timing not updated if a negative integer value is passed');

    options.timing = constants.VALID_TIMING;
    chartControls.update(options);
    assert.equal(chartControls.getTiming(), constants.VALID_TIMING_OUTPUT, 'Timing updated successfully');

  });
})();