QUnit.module("Zoom Control Tests, 100% Zoom", {
	setup: function() {
		this.fixture = $('#qunit-fixture');

		// this.panZoomTargetOriginalUrl = "testImage1.png";
		this.panZoomContainer = $('<div></div>');

		this.panZoomTargetOriginalWidth = 800;
		this.panZoomTargetOriginalHeight = 400;
		this.panZoomTarget = $('<img src="/static/sewi/images/testImage1.png">')
			.width(this.panZoomTargetOriginalWidth)
			.height(this.panZoomTargetOriginalHeight)
			.appendTo(this.panZoomContainer);

		this.panZoomWidget = new sewi.PanZoomWidget(
			this.panZoomTarget,
			this.panZoomContainer,
			this.panZoomTargetOriginalWidth,
			this.panZoomTargetOriginalHeight
		);
	},

	teardown: function() {
	}
});

QUnit.test("Fit/Fit", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(800);
	this.panZoomContainer.height(400);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to 100%
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "0px", "Left");
	equal(this.panZoomTarget.css("top"), "0px", "Top");
});

QUnit.test("Fit/Small", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(800);
	this.panZoomContainer.height(390);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to 100%
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "0px", "Left");
	equal(this.panZoomTarget.css("top"), "-5px", "Top");
});

QUnit.test("Fit/Large", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(800);
	this.panZoomContainer.height(410);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to 100%
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "0px", "Left");
	equal(this.panZoomTarget.css("top"), "5px", "Top");
});

QUnit.test("Small/Fit", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(790);
	this.panZoomContainer.height(400);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to 100%
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "-5px", "Left");
	equal(this.panZoomTarget.css("top"), "0px", "Top");
});

QUnit.test("Small/Small", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(790);
	this.panZoomContainer.height(390);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to 100%
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "-5px", "Left");
	equal(this.panZoomTarget.css("top"), "-5px", "Top");
});

QUnit.test("Small/Large", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(790);
	this.panZoomContainer.height(410);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to 100%
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "-5px", "Left");
	equal(this.panZoomTarget.css("top"), "5px", "Top");
});

QUnit.test("Large/Fit", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(810);
	this.panZoomContainer.height(400);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to 100%
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "5px", "Left");
	equal(this.panZoomTarget.css("top"), "0px", "Top");
});

QUnit.test("Large/Small", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(810);
	this.panZoomContainer.height(390);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to 100%
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "5px", "Left");
	equal(this.panZoomTarget.css("top"), "-5px", "Top");
});

QUnit.test("Large/Large", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(810);
	this.panZoomContainer.height(410);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to 100%
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "5px", "Left");
	equal(this.panZoomTarget.css("top"), "5px", "Top");
});

QUnit.module("Zoom Control Tests, Zoom-to-Fit", {
	setup: function() {
		this.fixture = $('#qunit-fixture');

		// this.panZoomTargetOriginalUrl = "testImage1.png";
		this.panZoomContainer = $('<div></div>');

		this.panZoomTargetOriginalWidth = 800;
		this.panZoomTargetOriginalHeight = 400;
		this.panZoomTarget = $('<img>')
			.width(this.panZoomTargetOriginalWidth)
			.height(this.panZoomTargetOriginalHeight)
			.appendTo(this.panZoomContainer);

		this.panZoomWidget = new sewi.PanZoomWidget(
			this.panZoomTarget,
			this.panZoomContainer,
			this.panZoomTargetOriginalWidth,
			this.panZoomTargetOriginalHeight
		);
	},

	teardown: function() {
	}
});

QUnit.test("Fit/Fit", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(800);
	this.panZoomContainer.height(400);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to zoom-to-fit
	this.panZoomWidget.setZoomLevelToZoomToFit(100);

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "0px", "Left");
	equal(this.panZoomTarget.css("top"), "0px", "Top");
});

QUnit.test("Fit/Small", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(800);
	this.panZoomContainer.height(390);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to zoom-to-fit
	this.panZoomWidget.setZoomLevelToZoomToFit();

	equal(this.panZoomTarget.width(), 780, "Width");
	equal(this.panZoomTarget.height(), 390, "Height");
	equal(this.panZoomTarget.css("left"), "10px", "Left");
	equal(this.panZoomTarget.css("top"), "0px", "Top");
});

QUnit.test("Fit/Large", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(800);
	this.panZoomContainer.height(410);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to zoom-to-fit
	this.panZoomWidget.setZoomLevelToZoomToFit();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "0px", "Left");
	equal(this.panZoomTarget.css("top"), "5px", "Top");
});

QUnit.test("Small/Fit", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(790);
	this.panZoomContainer.height(400);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to zoom-to-fit
	this.panZoomWidget.setZoomLevelToZoomToFit();

	equal(this.panZoomTarget.width(), 790, "Width");
	equal(this.panZoomTarget.height(), 395, "Height");
	equal(this.panZoomTarget.css("left"), "0px", "Left");
	equal(this.panZoomTarget.css("top"), "2.5px", "Top");
});

QUnit.test("Small/Small", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(790);
	this.panZoomContainer.height(390);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to zoom-to-fit
	this.panZoomWidget.setZoomLevelToZoomToFit();

	equal(this.panZoomTarget.width(), 780, "Width");
	equal(this.panZoomTarget.height(), 390, "Height");
	equal(this.panZoomTarget.css("left"), "5px", "Left");
	equal(this.panZoomTarget.css("top"), "0px", "Top");
});

QUnit.test("Small/Large", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(790);
	this.panZoomContainer.height(410);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to zoom-to-fit
	this.panZoomWidget.setZoomLevelToZoomToFit();

	equal(this.panZoomTarget.width(), 790, "Width");
	equal(this.panZoomTarget.height(), 395, "Height");
	equal(this.panZoomTarget.css("left"), "0px", "Left");
	equal(this.panZoomTarget.css("top"), "7.5px", "Top");
});

QUnit.test("Large/Fit", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(810);
	this.panZoomContainer.height(400);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to zoom-to-fit
	this.panZoomWidget.setZoomLevelToZoomToFit();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "5px", "Left");
	equal(this.panZoomTarget.css("top"), "0px", "Top");
});

QUnit.test("Large/Small", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(810);
	this.panZoomContainer.height(390);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to zoom-to-fit
	this.panZoomWidget.setZoomLevelToZoomToFit();

	equal(this.panZoomTarget.width(), 780, "Width");
	equal(this.panZoomTarget.height(), 390, "Height");
	equal(this.panZoomTarget.css("left"), "15px", "Left");
	equal(this.panZoomTarget.css("top"), "0px", "Top");
});

QUnit.test("Large/Large", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(810);
	this.panZoomContainer.height(410);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Set the Target to zoom to zoom-to-fit
	this.panZoomWidget.setZoomLevelToZoomToFit();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "5px", "Left");
	equal(this.panZoomTarget.css("top"), "5px", "Top");
});

QUnit.module("PanZoomWidget, Events (Simulated)", {
	setup: function() {
		this.fixture = $('#qunit-fixture');

		// this.panZoomTargetOriginalUrl = "testImage1.png";
		this.panZoomContainer = $('<div></div>');

		this.panZoomTargetOriginalWidth = 800;
		this.panZoomTargetOriginalHeight = 400;
		this.panZoomTarget = $('<img>')
			.width(this.panZoomTargetOriginalWidth)
			.height(this.panZoomTargetOriginalHeight)
			.appendTo(this.panZoomContainer);

		this.panZoomWidget = new sewi.PanZoomWidget(
			this.panZoomTarget,
			this.panZoomContainer,
			this.panZoomTargetOriginalWidth,
			this.panZoomTargetOriginalHeight
		);
	},

	teardown: function() {
	}
});

QUnit.test("Mousewheel (magnify)", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(800);
	this.panZoomContainer.height(400);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Reset the target's width and position
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	// Now mimic the event
	this.panZoomWidget.calculateNewTargetWidthFromMousewheel({
		preventDefault: $.noop,
		pageX: 100,
		pageY: 100,
		originalEvent: {
			wheelDelta: 120
		}
	});

	equal(this.panZoomTarget.width(), 960, "Width");
	equal(this.panZoomTarget.height(), 480, "Height");
	equal(this.panZoomTarget.css("left"), "-20px", "Left");
	equal(this.panZoomTarget.css("top"), "-20px", "Top");	
});

QUnit.test("Mousewheel (de-magnify)", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(800);
	this.panZoomContainer.height(400);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Reset the target's width and position
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	// Now mimic the event
	this.panZoomWidget.calculateNewTargetWidthFromMousewheel({
		preventDefault: $.noop,
		pageX: 100,
		pageY: 100,
		originalEvent: {
			wheelDelta: -120
		}
	});

	equal(this.panZoomTarget.width(), 640, "Width");
	equal(this.panZoomTarget.height(), 320, "Height");
	equal(this.panZoomTarget.css("left"), "20px", "Left");
	equal(this.panZoomTarget.css("top"), "20px", "Top");	
});

QUnit.test("Mousedown, Mousemove, Mouseup (move by 100 down, 100 right - within bounds)", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(800);
	this.panZoomContainer.height(400);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Reset the target's width and position
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	// Now mimic the event mousedown
	this.panZoomWidget.setupPanningVariables({
		pageX: 100,
		pageY: 100
	});

	// Then mimic event mousemove (pan)
	this.panZoomWidget.moveTargetToCursor({
		preventDefault: $.noop,
		pageX: 200,
		pageY: 200
	});

	// Finally mimic event mouseup
	this.panZoomWidget.cleanUpAfterPanning();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "100px", "Left");
	equal(this.panZoomTarget.css("top"), "100px", "Top");	
});

QUnit.test("Mousedown, Mousemove, Mouseup (move by 900 down, 900 right - beyond bounds)", function(assert) {
	expect(4);

	// Set the container's respective width and height.
	this.panZoomContainer.width(800);
	this.panZoomContainer.height(400);

	// Make PanZoomWidget recalculate the new dimensions
	this.panZoomWidget.recalculateTargetDimensions();

	// Reset the target's width and position
	this.panZoomWidget.setCurrentZoomLevel(100);
	this.panZoomWidget.centreTargetOnContainer();

	// Now mimic the event mousedown
	this.panZoomWidget.setupPanningVariables({
		pageX: 100,
		pageY: 100
	});

	// Then mimic event mousemove (pan)
	this.panZoomWidget.moveTargetToCursor({
		preventDefault: $.noop,
		pageX: 1000,
		pageY: 1000
	});

	// Finally mimic event mouseup
	this.panZoomWidget.cleanUpAfterPanning();

	equal(this.panZoomTarget.width(), 800, "Width");
	equal(this.panZoomTarget.height(), 400, "Height");
	equal(this.panZoomTarget.css("left"), "400px", "Left");
	equal(this.panZoomTarget.css("top"), "200px", "Top");	
});