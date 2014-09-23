var sewi = sewi || {};
sewi.ImageResourceViewer = function(options) {

	// TODO Inherit from ConfiguratorElement once the changes have been merged.

	var selfRef = this;

	// TODO $.getJSON("json/image.json", function( imageURL ) {

	selfRef.mainContainer = $("<div class='image-resource-container'></div>");
		var imageContainer = $("<div class='image-resource-image-container'></div>")
		.appendTo(mainContainer);
			var imageElement = $("<img src='sf.jpg' class='image-resource-image'>")
			.appendTo(imageContainer);
		var controlsContainer = $("<div class='image-resource-control-panel animated'></div>")
		.appendTo(mainContainer);
			var brightnessControlContainer = $("<div class='image-resource-control'></div>")
			.appendTo(controlsContainer)
			.html("Brightness<br>");
				var brightnessControl = $("<input type='range' class='image-resource-brightness' min='0' max='2' step='0.1'>")
				.appendTo(brightnessControlContainer);
			var contrastControlContainer = $("<div class='image-resource-control'></div>")
			.appendTo(controlsContainer)
			.html("Contrast<br>");
				var contrastControl = $("<input type='range' class='image-resource-contrast' min='0' max='2' step='0.1'>")
				.appendTo(contrastControlContainer);
			var invertControlContainer = $("<div class='image-resource-control'></div>")
			.appendTo(controlsContainer)
				var invertControlLabel = $("<label>Invert</label>")
				.appendTo(invertControlContainer);
					var invertControl = $("<input type='checkbox' class='image-resource-invert'>")
					.prependTo(invertControlLabel);
			var zoomControlContainer = $("<div class='image-resource-control'></div>")
			.appendTo(controlsContainer)
			.html("Zoom<br>");
				var zoomControl = $("<input type='number' class='image-resource-zoom' min='10' max='200' step='10'>")
				.appendTo(zoomControlContainer);
				$("<span>%</span>")
				.appendTo(zoomControlContainer)
				var zoom100PercentButton = $("<input type='button' class='image-resource-zoom-100' value='100%'>")
				.appendTo(zoomControlContainer);
				var zoomFitButton = $("<input type='button' class='image-resource-zoom-fit' value='Fit'>")
				.appendTo(zoomControlContainer);
			var resetControlContainer = $("<div class='image-resource-control'></div>")
			.appendTo(controlsContainer);
				var resetControl = $("<input type='button' value='Reset' class='image-resource-reset-button'>")
				.appendTo(resetControlContainer);
		var showHideControlsButton = $("<input type='button' value='Hide Controls' class='image-resource-show-hide-button'>")
		.appendTo(mainContainer);

	var imageSizeProperties = {
		original: {},
		fit: {},
		minZoom: {},
		maxZoom: {}
	};

	var imageMovementVariables = {};

	function moveImageToCursor(event) {
		if(imageMovementVariables.ignoreEvent) return false;
		var newImageX =  imageMovementVariables.originalImageX + event.pageX - imageMovementVariables.originalCursorX;
		var newImageY =  imageMovementVariables.originalImageY + event.pageY - imageMovementVariables.originalCursorY;

		if(newImageX < imageMovementVariables.minImageX)
			newImageX = imageMovementVariables.minImageX;
		else if(newImageX > imageMovementVariables.maxImageX)
			newImageX = imageMovementVariables.maxImageX;

		if(newImageY < imageMovementVariables.minImageY)
			newImageY = imageMovementVariables.minImageY;
		else if(newImageY > imageMovementVariables.maxImageY)
			newImageY = imageMovementVariables.maxImageY;

		imageElement.css({
			top: newImageY,
			left: newImageX
		});

		imageMovementVariables.ignoreEvent = true;
		setTimeout(function() {
			imageMovementVariables.ignoreEvent = false;
		}, 10);

		return false;
	}

	function calculateImageZoomFromMousewheel(event) {
		var zoomChange = 1 + 0.2 * event.originalEvent.wheelDelta / 120;
		var newImageWidth = imageElement.width() * zoomChange;

		updateImageZoom(newImageWidth);

		return false;
	}

	function calculateImageZoomFromZoomControl() {
		var newImageWidth = imageSizeProperties.original.width * zoomControl.val() / 100;

		updateImageZoom(newImageWidth);
	}

	function updateImageZoom(newImageWidth) {
		if(newImageWidth < imageSizeProperties.minZoom.width) {
			newImageWidth = imageSizeProperties.minZoom.width;
		}
		else if(newImageWidth > imageSizeProperties.maxZoom.width) {
			newImageWidth = imageSizeProperties.maxZoom.width;
		}

		imageElement.width( newImageWidth );

		if(newImageWidth < imageSizeProperties.fit.width) {
			centreImageOnCanvas();
		}

		updateZoomPercentage();
	}

	function updateZoomPercentage() {
		zoomControl.val( Math.floor(imageElement.width() / imageSizeProperties.original.width * 100) );
	}

	function setImageZoomToFit() {
		imageElement.width( imageSizeProperties.fit.width );

		updateZoomPercentage();

		centreImageOnCanvas();
	}

	function centreImageOnCanvas() {
		imageElement.css({
			top: (imageContainer.height() - imageElement.height()) / 2,
			left: (imageContainer.width() - imageElement.width()) / 2
		});
	}

	function setImageSizeProperties() {

		imageSizeProperties.original.width = imageElement.prop("naturalWidth");
		imageSizeProperties.original.height = imageElement.prop("naturalHeight");

		//Compute fit sizes
		var originalWidth = imageElement.prop("naturalWidth");
		var originalHeight = imageElement.prop("naturalHeight");
		var containerWidth = imageContainer.width();
		var containerHeight = imageContainer.height();

		if(originalWidth <= containerWidth) {
			if(originalHeight <= containerHeight) {
				imageSizeProperties.fit.width = originalWidth;
				imageSizeProperties.fit.height = originalHeight;
			}
			else {
				imageSizeProperties.fit.width = originalWidth * containerHeight / originalHeight;
				imageSizeProperties.fit.height = containerHeight;
			}
		}
		else {
			if(originalHeight <= containerHeight) {
				imageSizeProperties.fit.width = containerWidth;
				imageSizeProperties.fit.height = originalHeight * containerWidth / originalWidth;
			}
			else {
				var adjustedWidth = originalWidth * containerHeight / originalHeight;

				if(adjustedWidth <= containerWidth) {
					imageSizeProperties.fit.width = adjustedWidth;
					imageSizeProperties.fit.height = originalHeight * adjustedWidth / originalWidth;
				}
				else {
					imageSizeProperties.fit.width = containerWidth;
					imageSizeProperties.fit.height = originalHeight * containerWidth / originalWidth;
				}
			}
		}
		// End Compute fit sizes

		imageSizeProperties.minZoom.width = imageSizeProperties.fit.width / 2;
		imageSizeProperties.minZoom.height = imageSizeProperties.fit.height / 2;

		imageSizeProperties.maxZoom.width = imageSizeProperties.original.width * 2;
		imageSizeProperties.maxZoom.height = imageSizeProperties.original.height * 2;
	}

	function adjustImageFilters() {
		imageElement.css("-webkit-filter",
				"brightness(" + brightnessControl.val() + ")"
				+ "contrast(" + contrastControl.val() + ")"
				+ "invert(" + (invertControl.prop("checked") ? 1 : 0) + ")");
	}
}

sewi.ImageResourceViewer.prototype.load = function() {

	brightnessControl.on("input", adjustImageFilters);
	contrastControl.on("input", adjustImageFilters);
	invertControl.on("change", adjustImageFilters);
	zoomControl.on("change", calculateImageZoomFromZoomControl);
	zoom100PercentButton.on("click", function() {
		updateImageZoom(imageSizeProperties.original.width);
	});
	zoomFitButton.on("click", setImageZoomToFit);

	resetControl.on("click", function() {
		brightnessControl.val(1);
		contrastControl.val(1);
		invertControl.prop("checked", false);
		adjustImageFilters();
		setImageZoomToFit();
	})

	showHideControlsButton.on("click", function() {
		if($(this).val() == "Hide Controls") {
			controlsContainer.addClass("hidden");
			$(this).val("Show Controls");
		}
		else {
			controlsContainer.removeClass("hidden");
			$(this).val("Hide Controls");	
		}
	});

	imageContainer.on("mousewheel", calculateImageZoomFromMousewheel);

	imageContainer.on("mousedown", function(event) {
		imageMovementVariables.originalCursorX = event.pageX;
		imageMovementVariables.originalCursorY = event.pageY;
		imageMovementVariables.originalImageX = imageElement.position().left;
		imageMovementVariables.originalImageY = imageElement.position().top;
		imageMovementVariables.maxImageX = imageContainer.width() / 2;
		imageMovementVariables.maxImageY = imageContainer.height() / 2;
		imageMovementVariables.minImageX = imageMovementVariables.maxImageX - imageElement.width();
		imageMovementVariables.minImageY = imageMovementVariables.maxImageY - imageElement.height();
		imageMovementVariables.ignoreEvent = false; // Used for performances purposes. This variable is set when moveImageToCursor is called too quickly consecutively (after each call to moveImageToCursor, it is set to true, then a timeout() - with some delay - is set it back to false)

		imageContainer.unbind("mousewheel", calculateImageZoomFromMousewheel); //Don't allow the user to move and zoom
		$("body").on("mousemove", moveImageToCursor);
	});

	$("body").on("mouseup", function(event) {
		imageContainer.on("mousewheel", calculateImageZoomFromMousewheel);
		$("body").unbind("mousemove", moveImageToCursor);
	});

	imageElement.load(function() {
		setImageSizeProperties();
		setImageZoomToFit();
	});
	
};

// TODO Should be inherited from ConfiguratorElement
sewi.ImageResourceViewer.prototype.getDOM = function() {
	return this.mainContainer;
}