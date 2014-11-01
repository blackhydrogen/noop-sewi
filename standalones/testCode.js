	/*
	// ============================================================================================================================= TESTS ==

	var previousImageElementURL;
	var previousImageResourceWidth;
	var previousImageResourceHeight;
	var testImageIsLoaded = false;

	QUnit.begin(function() {
		previousImageElementURL = imageElement.prop("src");
		previousImageResourceWidth = mainContainer.width();
		previousImageResourceHeight = mainContainer.height();

		imageElement.one("load", function() {
			testImageIsLoaded = true;
		});

		imageElement.prop("src", "testimage.png");
	});

	QUnit.done(function() {
		imageElement.one("load", function() {
			setoriginalImageInfo();
			setImageZoomToFit();
		});

		imageElement.prop("src", previousImageElementURL);
		mainContainer.width(previousImageResourceWidth);
		mainContainer.height(previousImageResourceHeight);
	});

	QUnit.module("Zoom Control Tests, 100% Zoom Button")

	QUnit.asyncTest("Fit/Fit", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(700);
			mainContainer.height(663);
			setoriginalImageInfo();

			zoom100PercentButton.trigger("click");
			setTimeout(function() {
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, 0, "Left");
				assert.equal(imageElement.position().top, 0, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Fit/Small", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(700);
			mainContainer.height(653);
			setoriginalImageInfo();

			zoom100PercentButton.trigger("click");
			setTimeout(function() {
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, 0, "Left");
				assert.equal(imageElement.position().top, -5, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Fit/Large", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(700);
			mainContainer.height(673);
			setoriginalImageInfo();

			zoom100PercentButton.trigger("click");
			setTimeout(function() {
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, 0, "Left");
				assert.equal(imageElement.position().top, 5, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Small/Fit", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(690);
			mainContainer.height(663);
			setoriginalImageInfo();

			zoom100PercentButton.trigger("click");
			setTimeout(function() {
				
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, -5, "Left");
				assert.equal(imageElement.position().top, 0, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Small/Small", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(690);
			mainContainer.height(653);
			setoriginalImageInfo();

			zoom100PercentButton.trigger("click");
			setTimeout(function() {
				
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, -5, "Left");
				assert.equal(imageElement.position().top, -5, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Small/Large", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(690);
			mainContainer.height(673);
			setoriginalImageInfo();

			zoom100PercentButton.trigger("click");
			setTimeout(function() {
				
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, -5, "Left");
				assert.equal(imageElement.position().top, 5, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Large/Fit", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(710);
			mainContainer.height(663);
			setoriginalImageInfo();

			zoom100PercentButton.trigger("click");
			setTimeout(function() {
				
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, 5, "Left");
				assert.equal(imageElement.position().top, 0, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Large/Small", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(710);
			mainContainer.height(653);
			setoriginalImageInfo();

			zoom100PercentButton.trigger("click");
			setTimeout(function() {
				
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, 5, "Left");
				assert.equal(imageElement.position().top, -5, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Large/Large", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(710);
			mainContainer.height(673);
			setoriginalImageInfo();

			zoom100PercentButton.trigger("click");
			setTimeout(function() {
				
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, 5, "Left");
				assert.equal(imageElement.position().top, 5, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});


	QUnit.module("Zoom Control Tests, Fit Zoom Button")

	QUnit.asyncTest("Fit/Fit", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(700);
			mainContainer.height(663);
			setoriginalImageInfo();

			zoomFitButton.trigger("click");
			setTimeout(function() {
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, 0, "Left");
				assert.equal(imageElement.position().top, 0, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Fit/Small", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(700);
			mainContainer.height(653);
			setoriginalImageInfo();

			zoomFitButton.trigger("click");
			setTimeout(function() {
				assert.equal(imageElement.width(), 689, "Width");
				assert.equal(imageElement.height(), 653, "Height");
				assert.equal(imageElement.position().left, 5.5, "Left");
				assert.equal(imageElement.position().top, 0, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Fit/Large", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(700);
			mainContainer.height(673);
			setoriginalImageInfo();

			zoomFitButton.trigger("click");
			setTimeout(function() {
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, 0, "Left");
				assert.equal(imageElement.position().top, 5, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Small/Fit", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(690);
			mainContainer.height(663);
			setoriginalImageInfo();

			zoomFitButton.trigger("click");
			setTimeout(function() {
				assert.equal(imageElement.width(), 690, "Width");
				assert.equal(imageElement.height(), 654, "Height");
				assert.equal(imageElement.position().left, 0, "Left");
				assert.equal(imageElement.position().top, 4.5, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Small/Small", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(690);
			mainContainer.height(653);
			setoriginalImageInfo();

			zoomFitButton.trigger("click");
			setTimeout(function() {
				assert.equal(imageElement.width(), 689, "Width");
				assert.equal(imageElement.height(), 653, "Height");
				assert.equal(imageElement.position().left, 0.5, "Left");
				assert.equal(imageElement.position().top, 0, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Small/Large", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(690);
			mainContainer.height(673);
			setoriginalImageInfo();

			zoomFitButton.trigger("click");
			setTimeout(function() {
				assert.equal(imageElement.width(), 690, "Width");
				assert.equal(imageElement.height(), 654, "Height");
				assert.equal(imageElement.position().left, 0, "Left");
				assert.equal(imageElement.position().top, 9.5, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Large/Fit", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(710);
			mainContainer.height(663);
			setoriginalImageInfo();

			zoomFitButton.trigger("click");
			setTimeout(function() {
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, 5, "Left");
				assert.equal(imageElement.position().top, 0, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Large/Small", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(710);
			mainContainer.height(653);
			setoriginalImageInfo();

			zoomFitButton.trigger("click");
			setTimeout(function() {
				assert.equal(imageElement.width(), 689, "Width");
				assert.equal(imageElement.height(), 653, "Height");
				assert.equal(imageElement.position().left, 10.5, "Left");
				assert.equal(imageElement.position().top, 0, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});

	QUnit.asyncTest("Large/Large", function(assert) {
		assert.expect(4);

		var conditionTest = function() {
			if(testImageIsLoaded)
				test();
			else
				setTimeout(conditionTest, 50);
		};

		var test = function() {
			mainContainer.width(710);
			mainContainer.height(673);
			setoriginalImageInfo();

			zoomFitButton.trigger("click");
			setTimeout(function() {
				assert.equal(imageElement.width(), 700, "Width");
				assert.equal(imageElement.height(), 663, "Height");
				assert.equal(imageElement.position().left, 5, "Left");
				assert.equal(imageElement.position().top, 5, "Top");
				QUnit.start();
			}, 50);
		};

		conditionTest();
	});
	//*/