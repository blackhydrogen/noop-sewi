(function() {

	QUnit.module("PanZoomWidget, Zoom Control Tests, 100% Zoom", {
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

			this.panZoomContainer.appendTo(this.fixture);

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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "0px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "0px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "0px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "-5px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "0px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "5px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "-5px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "0px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "-5px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "-5px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "-5px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "5px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "5px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "0px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "5px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "-5px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "5px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "5px", "Top");
	});

	QUnit.module("PanZoomWidget, Zoom Control Tests, Zoom-to-Fit", {
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

			this.panZoomContainer.appendTo(this.fixture);

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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "0px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "0px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 780, "Width");
		assert.equal(this.panZoomTarget.height(), 390, "Height");
		assert.equal(this.panZoomTarget.css("left"), "10px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "0px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "0px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "5px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 790, "Width");
		assert.equal(this.panZoomTarget.height(), 395, "Height");
		assert.equal(this.panZoomTarget.css("left"), "0px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "2.5px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 780, "Width");
		assert.equal(this.panZoomTarget.height(), 390, "Height");
		assert.equal(this.panZoomTarget.css("left"), "5px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "0px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 790, "Width");
		assert.equal(this.panZoomTarget.height(), 395, "Height");
		assert.equal(this.panZoomTarget.css("left"), "0px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "7.5px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "5px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "0px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 780, "Width");
		assert.equal(this.panZoomTarget.height(), 390, "Height");
		assert.equal(this.panZoomTarget.css("left"), "15px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "0px", "Top");
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

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "5px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "5px", "Top");
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

			this.panZoomContainer.appendTo(this.fixture);

			this.panZoomWidget = new sewi.PanZoomWidget(
				this.panZoomTarget,
				this.panZoomContainer,
				this.panZoomTargetOriginalWidth,
				this.panZoomTargetOriginalHeight
			);
		},

		teardown: function() {
			this.panZoomContainer.remove();
		}
	});

	QUnit.test("Mousewheel (magnify, 1 step, cursor in image)", function(assert) {
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
		this.panZoomWidget.privates.calculateNewTargetWidthFromMousewheel.call(this.panZoomWidget, {
			preventDefault: $.noop,
			pageX: 100 + this.panZoomContainer.offset().left,
			pageY: 100 + this.panZoomContainer.offset().top,
			originalEvent: {
				wheelDelta: 120
			}
		});

		assert.equal(this.panZoomTarget.width(), 960, "Width");
		assert.equal(this.panZoomTarget.height(), 480, "Height");
		assert.equal(this.panZoomTarget.css("left"), "-20px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "-20px", "Top");	
	});

	QUnit.test("Mousewheel (de-magnify, 1 step, cursor in image)", function(assert) {
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
		this.panZoomWidget.privates.calculateNewTargetWidthFromMousewheel.call(this.panZoomWidget, {
			preventDefault: $.noop,
			pageX: 100 + this.panZoomContainer.offset().left,
			pageY: 100 + this.panZoomContainer.offset().top,
			originalEvent: {
				wheelDelta: -120
			}
		});

		assert.equal(this.panZoomTarget.width(), 640, "Width");
		assert.equal(this.panZoomTarget.height(), 320, "Height");
		assert.equal(this.panZoomTarget.css("left"), "20px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "20px", "Top");	
	});

	QUnit.test("Mousewheel (magnify, 1 step, cursor outside of image)", function(assert) {
		expect(4);

		// Set the container's respective width and height.
		this.panZoomContainer.width(800);
		this.panZoomContainer.height(400);

		// Make PanZoomWidget recalculate the new dimensions
		this.panZoomWidget.recalculateTargetDimensions();

		// Reset the target's width and position
		this.panZoomWidget.setCurrentZoomLevel(50);
		this.panZoomWidget.centreTargetOnContainer();

		// Now mimic the event
		this.panZoomWidget.privates.calculateNewTargetWidthFromMousewheel.call(this.panZoomWidget, {
			preventDefault: $.noop,
			pageX: 0 + this.panZoomContainer.offset().left,
			pageY: 0 + this.panZoomContainer.offset().top,
			originalEvent: {
				wheelDelta: 120
			}
		});

		assert.equal(this.panZoomTarget.width(), 480, "Width");
		assert.equal(this.panZoomTarget.height(), 240, "Height");
		assert.equal(this.panZoomTarget.css("left"), "160px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "80px", "Top");	
	});

	QUnit.test("Mousewheel (magnify, 20 steps - beyond maximum limit)", function(assert) {
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
		this.panZoomWidget.privates.calculateNewTargetWidthFromMousewheel.call(this.panZoomWidget, {
			preventDefault: $.noop,
			pageX: 100 + this.panZoomContainer.offset().left,
			pageY: 100 + this.panZoomContainer.offset().top,
			originalEvent: {
				wheelDelta: 2400
			}
		});

		assert.equal(this.panZoomTarget.width(), 1600, "Width");
		assert.equal(this.panZoomTarget.height(), 800, "Height");
		assert.equal(this.panZoomTarget.css("left"), "-100px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "-100px", "Top");	
	});

	QUnit.test("Mousewheel (de-magnify, 20 steps - beyond minimum bounds)", function(assert) {
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
		this.panZoomWidget.privates.calculateNewTargetWidthFromMousewheel.call(this.panZoomWidget, {
			preventDefault: $.noop,
			pageX: 100 + this.panZoomContainer.offset().left,
			pageY: 100 + this.panZoomContainer.offset().top,
			originalEvent: {
				wheelDelta: -2400
			}
		});

		assert.equal(this.panZoomTarget.width(), 400, "Width");
		assert.equal(this.panZoomTarget.height(), 200, "Height");
		assert.equal(this.panZoomTarget.css("left"), "50px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "50px", "Top");	
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
		this.panZoomWidget.privates.setupPanningVariables.call(this.panZoomWidget, {
			pageX: 100 + this.panZoomContainer.offset().left,
			pageY: 100 + this.panZoomContainer.offset().top
		});

		// Then mimic event mousemove (pan)
		this.panZoomWidget.privates.moveTargetToCursor.call(this.panZoomWidget, {
			preventDefault: $.noop,
			pageX: 200 + this.panZoomContainer.offset().left,
			pageY: 200 + this.panZoomContainer.offset().top
		});

		// Finally mimic event mouseup
		this.panZoomWidget.privates.cleanUpAfterPanning.call(this.panZoomWidget);

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "100px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "100px", "Top");	
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
		this.panZoomWidget.privates.setupPanningVariables.call(this.panZoomWidget, {
			pageX: 100 + this.panZoomContainer.offset().left,
			pageY: 100 + this.panZoomContainer.offset().top
		});

		// Then mimic event mousemove (pan)
		this.panZoomWidget.privates.moveTargetToCursor.call(this.panZoomWidget, {
			preventDefault: $.noop,
			pageX: 1000 + this.panZoomContainer.offset().left,
			pageY: 1000 + this.panZoomContainer.offset().top
		});

		// Finally mimic event mouseup
		this.panZoomWidget.privates.cleanUpAfterPanning.call(this.panZoomWidget);

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "400px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "200px", "Top");	
	});


	QUnit.test("Mousedown, Mousemove, Mouseup (move by 900 up, 900 left - beyond bounds)", function(assert) {
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
		this.panZoomWidget.privates.setupPanningVariables.call(this.panZoomWidget, {
			pageX: 100 + this.panZoomContainer.offset().left,
			pageY: 100 + this.panZoomContainer.offset().top
		});

		// Then mimic event mousemove (pan)
		this.panZoomWidget.privates.moveTargetToCursor.call(this.panZoomWidget, {
			preventDefault: $.noop,
			pageX: -800 + this.panZoomContainer.offset().left,
			pageY: -800 + this.panZoomContainer.offset().top
		});

		// Finally mimic event mouseup
		this.panZoomWidget.privates.cleanUpAfterPanning.call(this.panZoomWidget);

		assert.equal(this.panZoomTarget.width(), 800, "Width");
		assert.equal(this.panZoomTarget.height(), 400, "Height");
		assert.equal(this.panZoomTarget.css("left"), "-400px", "Left");
		assert.equal(this.panZoomTarget.css("top"), "-200px", "Top");	
	});

	QUnit.module("PanZoomWidget, Get Zoom Level Functions", {
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

			this.panZoomContainer.appendTo(this.fixture);

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

	QUnit.test("getMinimumZoomLevel, getMaximumZoomLevel (2 values)", function(assert) {
		expect(4);

		// Set the container's respective width and height.
		this.panZoomContainer.width(800);
		this.panZoomContainer.height(400);

		// Make PanZoomWidget recalculate the new dimensions
		this.panZoomWidget.recalculateTargetDimensions();

		assert.equal(this.panZoomWidget.getMinimumZoomLevel(), 50, "getMinimumZoomLevel (container size: 800, 400)");
		assert.equal(this.panZoomWidget.getMaximumZoomLevel(), 200, "getMaximumZoomLevel (container size: 800, 400)");

		// Re-Set the container's respective width and height.
		this.panZoomContainer.width(400);
		this.panZoomContainer.height(200);

		// Make PanZoomWidget recalculate the new dimensions
		this.panZoomWidget.recalculateTargetDimensions();

		assert.equal(this.panZoomWidget.getMinimumZoomLevel(), 25, "getMinimumZoomLevel (container size: 400, 200)");
		assert.equal(this.panZoomWidget.getMaximumZoomLevel(), 200, "getMaximumZoomLevel (container size: 400, 200)");
	});

	QUnit.test("fitSizeEqualsOriginalSize (Both possible values)", function(assert) {
		expect(2);

		// Set the container's respective width and height.
		this.panZoomContainer.width(800);
		this.panZoomContainer.height(400);

		// Make PanZoomWidget recalculate the new dimensions
		this.panZoomWidget.recalculateTargetDimensions();

		assert.equal(this.panZoomWidget.fitSizeEqualsOriginalSize(), true, "fitSizeEqualsOriginalSize (true)");

		// Re-Set the container's respective width and height.
		this.panZoomContainer.width(600);
		this.panZoomContainer.height(300);

		// Make PanZoomWidget recalculate the new dimensions
		this.panZoomWidget.recalculateTargetDimensions();

		assert.equal(this.panZoomWidget.fitSizeEqualsOriginalSize(), false, "fitSizeEqualsOriginalSize (false)");
	});

})();