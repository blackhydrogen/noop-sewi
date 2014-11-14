(function() {
	var constants = {
		PATH_TO_TEST_IMAGES: "js/tests/images/",
		ORIGNAL_IMAGE_FILENAME: "testImageOriginal.png",
		ORIGINAL_IMAGE_WIDTH: 700,
		ORIGINAL_IMAGE_HEIGHT: 700,

		FLAME_FILTER_NAME: "flame",
		RAINBOW_FILTER_NAME: "rainbow",
		SPECTRUM_FILTER_NAME: "spectrum",

		RESULT_IMAGE_FILENAMES: {
			GRAYSCALE: "grayscale.png",
			FLAME: "flame.png",
			RAINBOW: "rainbow.png",
			SPECTRUM: "spectrum.png",
			INVERT: "invert.png",
			DIFFERENCE: "difference.png",
			AUTO_CONTRAST: "autoconstrast.png",
			SHADOWS: "shadows.png",
			MIDTONES: "midtones.png",
			HIGHLIGHTS: "highlights.png"
		}
	}

	function loadResultImage(filename, keyname) {
		var imageElement = $("<img>");

		imageElement.one("load", convertImageToDataUri.bind(this, imageElement, keyname));

		imageElement.prop("src", sewi.staticPath + constants.PATH_TO_TEST_IMAGES + filename);
	}

	function convertImageToDataUri(imageElement, keyname, event) {
	    // Create an empty canvas element
	    var canvas = $("<canvas>")
	    	.prop("width", constants.ORIGINAL_IMAGE_WIDTH)
	    	.prop("height", constants.ORIGINAL_IMAGE_HEIGHT);

	    // Draw the image contents onto the canvas
	    canvas[0].getContext("2d").drawImage(imageElement[0], 0, 0, constants.ORIGINAL_IMAGE_WIDTH, constants.ORIGINAL_IMAGE_HEIGHT);

	    this.resultsDataUri[keyname] = canvas[0].toDataURL(
            sewi.constants.IMAGE_RESOURCE_GENERATED_IMAGE_TYPE_JPEG,
            sewi.constants.IMAGE_RESOURCE_GENERATED_IMAGE_QUALITY_JPEG
        );

        this.imagesPendingLoad--;
	}

	QUnit.module("ImageResource, Custom Filters", {
		setup: function() {
			this.fixture = $('#qunit-fixture');

			this.imageResourceViewer = new sewi.ImageResourceViewer({
				id: ""
			});

			this.fixture.append(
				this.imageResourceViewer.getDOM()
					.width(constants.ORIGNAL_IMAGE_WIDTH)
					.height(constants.ORIGINAL_IMAGE_HEIGHT)
			);

			// We load each of the result images as a data URI, and the original image into the ImageResourceViewer object.
			// As this is an async process, we have to track the completeness of the process with a counter, this.imagesPendingLoad
			this.imagesPendingLoad = _.size(constants.RESULT_IMAGE_FILENAMES) + 1; // +1 for the original image.

			// Loading the results images as data URI.
			this.resultsDataUri = {};
			_.forEach(constants.RESULT_IMAGE_FILENAMES, loadResultImage.bind(this));

			// Because we can't fetch the image resource URL, we give a URL manually, but have to manually tie the required events.
			this.imageResourceViewer.imageElement.one(
				"load",
				this.imageResourceViewer.privates.afterImageLoadSetup.bind(this.imageResourceViewer)
			);

			// We also have to track when the image is loaded.
			this.imageResourceViewer.imageElement.one(
				"load",
				(function() {
					this.imagesPendingLoad--;
				}).bind(this)
			);

			// Finally, we trigger the image loading process in ImageResourceViewer
			this.imageResourceViewer.privates.loadImageUrlSuccess.call(
				this.imageResourceViewer,
				{
					url: sewi.staticPath + constants.PATH_TO_TEST_IMAGES + constants.ORIGNAL_IMAGE_FILENAME
				}
			);
		},

		teardown: function() {
		}
	});

	QUnit.asyncTest("Grayscale", function(assert) {
		expect(1);

		function checkForImageReadyBeforeTest() {
			if(this.imagesPendingLoad != 0) {
				setTimeout(checkForImageReadyBeforeTest.bind(this), 100);
				return;
			}
			else { // Test here.
				// Set up the settings object for applyCustomImageFilters
				var filterSettings = {
		            colorize: sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE,
		            difference: false,
		            invert: false,
		            autoContrast: false,
		            contrastStretchMode: sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE,
		            contrastStretchValue: 1
		        };

		        // Set up a listener on the image element
		        this.imageResourceViewer.imageElement.one(
		        	"load",
		        	(function() {
		        		assert.equal(
		        			this.imageResourceViewer.privates.getImageUri.call(this.imageResourceViewer),
		        			this.resultsDataUri.GRAYSCALE,
		        			"Data URI"
		        		);
		        		QUnit.start();
		        	}).bind(this)
		        );

		        // Call applyCustomImageFilters
		        this.imageResourceViewer.privates.applyCustomImageFilters.call(
		        	this.imageResourceViewer,
		        	{},
		        	filterSettings
		        );
			}
		}

		checkForImageReadyBeforeTest.call(this);
	});

	QUnit.asyncTest("Flame", function(assert) {
		expect(1);

		function checkForImageReadyBeforeTest() {
			if(this.imagesPendingLoad != 0) {
				setTimeout(checkForImageReadyBeforeTest.bind(this), 100);
				return;
			}
			else { // Test here.
				// Set up the settings object for applyCustomImageFilters
				var filterSettings = {
		            colorize: constants.FLAME_FILTER_NAME,
		            difference: false,
		            invert: false,
		            autoContrast: false,
		            contrastStretchMode: sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE,
		            contrastStretchValue: 1
		        };

		        // Set up a listener on the image element
		        this.imageResourceViewer.imageElement.one(
		        	"load",
		        	(function() {
		        		assert.equal(
		        			this.imageResourceViewer.privates.getImageUri.call(this.imageResourceViewer),
		        			this.resultsDataUri.FLAME,
		        			"Data URI"
		        		);
		        		QUnit.start();
		        	}).bind(this)
		        );

		        // Call applyCustomImageFilters
		        this.imageResourceViewer.privates.applyCustomImageFilters.call(
		        	this.imageResourceViewer,
		        	{},
		        	filterSettings
		        );
			}
		}

		checkForImageReadyBeforeTest.call(this);
	});

	QUnit.asyncTest("Rainbow", function(assert) {
		expect(1);

		function checkForImageReadyBeforeTest() {
			if(this.imagesPendingLoad != 0) {
				setTimeout(checkForImageReadyBeforeTest.bind(this), 100);
				return;
			}
			else { // Test here.
				// Set up the settings object for applyCustomImageFilters
				var filterSettings = {
		            colorize: constants.RAINBOW_FILTER_NAME,
		            difference: false,
		            invert: false,
		            autoContrast: false,
		            contrastStretchMode: sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE,
		            contrastStretchValue: 1
		        };

		        // Set up a listener on the image element
		        this.imageResourceViewer.imageElement.one(
		        	"load",
		        	(function() {
		        		assert.equal(
		        			this.imageResourceViewer.privates.getImageUri.call(this.imageResourceViewer),
		        			this.resultsDataUri.RAINBOW,
		        			"Data URI"
		        		);
		        		QUnit.start();
		        	}).bind(this)
		        );

		        // Call applyCustomImageFilters
		        this.imageResourceViewer.privates.applyCustomImageFilters.call(
		        	this.imageResourceViewer,
		        	{},
		        	filterSettings
		        );
			}
		}

		checkForImageReadyBeforeTest.call(this);
	});

	QUnit.asyncTest("Spectrum", function(assert) {
		expect(1);

		function checkForImageReadyBeforeTest() {
			if(this.imagesPendingLoad != 0) {
				setTimeout(checkForImageReadyBeforeTest.bind(this), 100);
				return;
			}
			else { // Test here.
				// Set up the settings object for applyCustomImageFilters
				var filterSettings = {
		            colorize: constants.SPECTRUM_FILTER_NAME,
		            difference: false,
		            invert: false,
		            autoContrast: false,
		            contrastStretchMode: sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE,
		            contrastStretchValue: 1
		        };

		        // Set up a listener on the image element
		        this.imageResourceViewer.imageElement.one(
		        	"load",
		        	(function() {
		        		assert.equal(
		        			this.imageResourceViewer.privates.getImageUri.call(this.imageResourceViewer),
		        			this.resultsDataUri.SPECTRUM,
		        			"Data URI"
		        		);
		        		QUnit.start();
		        	}).bind(this)
		        );

		        // Call applyCustomImageFilters
		        this.imageResourceViewer.privates.applyCustomImageFilters.call(
		        	this.imageResourceViewer,
		        	{},
		        	filterSettings
		        );
			}
		}

		checkForImageReadyBeforeTest.call(this);
	});

	QUnit.asyncTest("Invert", function(assert) {
		expect(1);

		function checkForImageReadyBeforeTest() {
			if(this.imagesPendingLoad != 0) {
				setTimeout(checkForImageReadyBeforeTest.bind(this), 100);
				return;
			}
			else { // Test here.
				// Set up the settings object for applyCustomImageFilters
				var filterSettings = {
		            colorize: sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_NONE,
		            difference: false,
		            invert: true,
		            autoContrast: false,
		            contrastStretchMode: sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE,
		            contrastStretchValue: 1
		        };

		        // Set up a listener on the image element
		        this.imageResourceViewer.imageElement.one(
		        	"load",
		        	(function() {
		        		assert.equal(
		        			this.imageResourceViewer.privates.getImageUri.call(this.imageResourceViewer),
		        			this.resultsDataUri.INVERT,
		        			"Data URI"
		        		);
		        		QUnit.start();
		        	}).bind(this)
		        );

		        // Call applyCustomImageFilters
		        this.imageResourceViewer.privates.applyCustomImageFilters.call(
		        	this.imageResourceViewer,
		        	{},
		        	filterSettings
		        );
			}
		}

		checkForImageReadyBeforeTest.call(this);
	});

	QUnit.asyncTest("Difference", function(assert) {
		expect(1);

		function checkForImageReadyBeforeTest() {
			if(this.imagesPendingLoad != 0) {
				setTimeout(checkForImageReadyBeforeTest.bind(this), 100);
				return;
			}
			else { // Test here.
				// Set up the settings object for applyCustomImageFilters
				var filterSettings = {
		            colorize: sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_NONE,
		            difference: true,
		            invert: false,
		            autoContrast: false,
		            contrastStretchMode: sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE,
		            contrastStretchValue: 1
		        };

		        // Set up a listener on the image element
		        this.imageResourceViewer.imageElement.one(
		        	"load",
		        	(function() {
		        		assert.equal(
		        			this.imageResourceViewer.privates.getImageUri.call(this.imageResourceViewer),
		        			this.resultsDataUri.DIFFERENCE,
		        			"Data URI"
		        		);
		        		QUnit.start();
		        	}).bind(this)
		        );

		        // Call applyCustomImageFilters
		        this.imageResourceViewer.privates.applyCustomImageFilters.call(
		        	this.imageResourceViewer,
		        	{},
		        	filterSettings
		        );
			}
		}

		checkForImageReadyBeforeTest.call(this);
	});

	QUnit.asyncTest("Auto-contrast", function(assert) {
		expect(1);

		function checkForImageReadyBeforeTest() {
			if(this.imagesPendingLoad != 0) {
				setTimeout(checkForImageReadyBeforeTest.bind(this), 100);
				return;
			}
			else { // Test here.
				// Set up the settings object for applyCustomImageFilters
				var filterSettings = {
		            colorize: sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE, // Grayscale is implied with autocontrast
		            difference: false,
		            invert: false,
		            autoContrast: true,
		            contrastStretchMode: sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE,
		            contrastStretchValue: 1
		        };

		        // Set up a listener on the image element
		        this.imageResourceViewer.imageElement.one(
		        	"load",
		        	(function() {
		        		assert.equal(
		        			this.imageResourceViewer.privates.getImageUri.call(this.imageResourceViewer),
		        			this.resultsDataUri.AUTO_CONTRAST,
		        			"Data URI"
		        		);
		        		QUnit.start();
		        	}).bind(this)
		        );

		        // Call applyCustomImageFilters
		        this.imageResourceViewer.privates.applyCustomImageFilters.call(
		        	this.imageResourceViewer,
		        	{},
		        	filterSettings
		        );
			}
		}

		checkForImageReadyBeforeTest.call(this);
	});

	QUnit.asyncTest("Contrast Stretching, Shadows", function(assert) {
		expect(1);

		function checkForImageReadyBeforeTest() {
			if(this.imagesPendingLoad != 0) {
				setTimeout(checkForImageReadyBeforeTest.bind(this), 100);
				return;
			}
			else { // Test here.
				// Set up the settings object for applyCustomImageFilters
				var filterSettings = {
		            colorize: sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE, // Grayscale is implied with contrast stretching
		            difference: false,
		            invert: false,
		            autoContrast: false,
		            contrastStretchMode: sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_SHADOWS,
		            contrastStretchValue: 2.5
		        };

		        // Set up a listener on the image element
		        this.imageResourceViewer.imageElement.one(
		        	"load",
		        	(function() {
		        		assert.equal(
		        			this.imageResourceViewer.privates.getImageUri.call(this.imageResourceViewer),
		        			this.resultsDataUri.SHADOWS,
		        			"Data URI"
		        		);
		        		QUnit.start();
		        	}).bind(this)
		        );

		        // Call applyCustomImageFilters
		        this.imageResourceViewer.privates.applyCustomImageFilters.call(
		        	this.imageResourceViewer,
		        	{},
		        	filterSettings
		        );
			}
		}

		checkForImageReadyBeforeTest.call(this);
	});

	QUnit.asyncTest("Contrast Stretching, Midtones", function(assert) {
		expect(1);

		function checkForImageReadyBeforeTest() {
			if(this.imagesPendingLoad != 0) {
				setTimeout(checkForImageReadyBeforeTest.bind(this), 100);
				return;
			}
			else { // Test here.
				// Set up the settings object for applyCustomImageFilters
				var filterSettings = {
		            colorize: sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE, // Grayscale is implied with contrast stretching
		            difference: false,
		            invert: false,
		            autoContrast: false,
		            contrastStretchMode: sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_MIDTONES,
		            contrastStretchValue: 2.5
		        };

		        // Set up a listener on the image element
		        this.imageResourceViewer.imageElement.one(
		        	"load",
		        	(function() {
		        		assert.equal(
		        			this.imageResourceViewer.privates.getImageUri.call(this.imageResourceViewer),
		        			this.resultsDataUri.MIDTONES,
		        			"Data URI"
		        		);
		        		QUnit.start();
		        	}).bind(this)
		        );

		        // Call applyCustomImageFilters
		        this.imageResourceViewer.privates.applyCustomImageFilters.call(
		        	this.imageResourceViewer,
		        	{},
		        	filterSettings
		        );
			}
		}

		checkForImageReadyBeforeTest.call(this);
	});

	QUnit.asyncTest("Contrast Stretching, Highlights", function(assert) {
		expect(1);

		function checkForImageReadyBeforeTest() {
			if(this.imagesPendingLoad != 0) {
				setTimeout(checkForImageReadyBeforeTest.bind(this), 100);
				return;
			}
			else { // Test here.
				// Set up the settings object for applyCustomImageFilters
				var filterSettings = {
		            colorize: sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE, // Grayscale is implied with contrast stretching
		            difference: false,
		            invert: false,
		            autoContrast: false,
		            contrastStretchMode: sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_HIGHLIGHTS,
		            contrastStretchValue: 2.5
		        };

		        // Set up a listener on the image element
		        this.imageResourceViewer.imageElement.one(
		        	"load",
		        	(function() {
		        		assert.equal(
		        			this.imageResourceViewer.privates.getImageUri.call(this.imageResourceViewer),
		        			this.resultsDataUri.HIGHLIGHTS,
		        			"Data URI"
		        		);
		        		QUnit.start();
		        	}).bind(this)
		        );

		        // Call applyCustomImageFilters
		        this.imageResourceViewer.privates.applyCustomImageFilters.call(
		        	this.imageResourceViewer,
		        	{},
		        	filterSettings
		        );
			}
		}

		checkForImageReadyBeforeTest.call(this);
	});
})();