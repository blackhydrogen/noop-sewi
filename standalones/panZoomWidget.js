var sewi = sewi || {};

sewi.PanZoomWidget = function(panZoomTarget, panZoomContainer, targetOriginalWidth, targetOriginalHeight) {
	// Safeguard if function is called without `new` keyword
	if (!(this instanceof sewi.PanZoomWidget))
		return new sewi.PanZoomWidget();
	
	this.container = panZoomContainer;
	this.target = panZoomTarget;
	this.targetDimensions = { // Dimensions of the target in different zoom states
		original: {},
		fitToContainer: {},
		minimumZoom: {},
		maximumZoom: {}
	}
	this.targetPanningVariables = {}; // Variables used when panning

	if(targetOriginalWidth == undefined)
		targetOriginalWidth = this.target.prop("naturalWidth");
	if(targetOriginalHeight == undefined)
		targetOriginalHeight = this.target.prop("naturalHeight");

	this.calculateTargetDimensions(targetOriginalWidth, targetOriginalHeight);

	this.container.css({
		cursor: "-webkit-grab"
	});

	this.container.on("mousewheel.PanZoomWidget", this.calculateTargetZoomFromMousewheel.bind(this));
	this.container.on("mousedown.PanZoomWidget", this.setupPanningVariables.bind(this));

	this.setTargetZoomToFit();
}

sewi.PanZoomWidget.prototype.calculateTargetDimensions = function(originalWidth, originalHeight) {
	this.targetDimensions.original.width = originalWidth;
	this.targetDimensions.original.height = originalHeight;

	// Compute fit to container sizes
	var containerWidth = this.container.width();
	var containerHeight = this.container.height();

	if(originalWidth <= containerWidth) {
		if(originalHeight <= containerHeight) {
			this.targetDimensions.fitToContainer.width = originalWidth;
			this.targetDimensions.fitToContainer.height = originalHeight;
		}
		else {
			this.targetDimensions.fitToContainer.width = originalWidth * containerHeight / originalHeight;
			this.targetDimensions.fitToContainer.height = containerHeight;
		}
	}
	else {
		if(originalHeight <= containerHeight) {
			this.targetDimensions.fitToContainer.width = containerWidth;
			this.targetDimensions.fitToContainer.height = originalHeight * containerWidth / originalWidth;
		}
		else {
			var adjustedWidth = originalWidth * containerHeight / originalHeight;

			if(adjustedWidth <= containerWidth) {
				this.targetDimensions.fitToContainer.width = adjustedWidth;
				this.targetDimensions.fitToContainer.height = originalHeight * adjustedWidth / originalWidth;
			}
			else {
				this.targetDimensions.fitToContainer.width = containerWidth;
				this.targetDimensions.fitToContainer.height = originalHeight * containerWidth / originalWidth;
			}
		}
	}
	// End compute fit to container sizes

	this.targetDimensions.minimumZoom.width = this.targetDimensions.fitToContainer.width / 2;
	this.targetDimensions.minimumZoom.height = this.targetDimensions.fitToContainer.height / 2;

	this.targetDimensions.maximumZoom.width = this.targetDimensions.original.width * 2;
	this.targetDimensions.maximumZoom.height = this.targetDimensions.original.height * 2;
}

// Recalculate the targetDimensions of the target - used when the container is resized.
sewi.PanZoomWidget.prototype.recalculateTargetDimensions = function() {
	this.calculateTargetDimensions(this.targetDimensions.original.width, this.targetDimensions.original.height);
}

sewi.PanZoomWidget.prototype.getTargetZoom = function() {
	return Math.round(100 * this.target.width() / this.targetDimensions.original.width);
}

sewi.PanZoomWidget.prototype.setTargetZoom = function(zoomPercentage) {
	var newImageWidth = this.targetDimensions.original.width * zoomPercentage / 100;

	this.executeZoomImage(newImageWidth, this.container.width() / 2, this.container.height() / 2);
}

sewi.PanZoomWidget.prototype.calculateTargetZoomFromMousewheel = function(event) {
	// Figure out new width
	var zoomChange = 1 + 0.2 * event.originalEvent.wheelDelta / 120;
	var newImageWidth = this.target.width() * zoomChange;

	var cursorPositionOnImageContainerX = event.pageX - this.container.offset().left;
	var cursorPositionOnImageContainerY = event.pageY - this.container.offset().top;

	this.executeZoomImage(newImageWidth, cursorPositionOnImageContainerX, cursorPositionOnImageContainerY);

	return false;
}

sewi.PanZoomWidget.prototype.executeZoomImage = function(newImageWidth, cursorPositionOnImageContainerX, cursorPositionOnImageContainerY) {
	// We make sure the new width isn't outside the range of the respective minimum and maximum dimensions.
	if(newImageWidth < this.targetDimensions.minimumZoom.width) {
		newImageWidth = this.targetDimensions.minimumZoom.width;
	}
	else if(newImageWidth > this.targetDimensions.maximumZoom.width) {
		newImageWidth = this.targetDimensions.maximumZoom.width;
	}

	// Optimizing... If there is no change in the width, we just return.
	// (We round newImageWidth because HTML rounds the value when we assign a floating point number.)
	if(Math.round(newImageWidth) == this.target.width())
		return;

	// Figure out where to centre image after resizing based on cursorPositionOnImageContainerX, cursorPositionOnImageContainerY
	// Where, in pixels, inside the image is the zoom centre (relative to the image)
	var zoomCentreOnImageX = cursorPositionOnImageContainerX - this.target.position().left;
	var zoomCentreOnImageY = cursorPositionOnImageContainerY - this.target.position().top;

	// If zoomCentreOnImageX or zoomCentreOnImageY is out the image coordinates, then centre on centre of container
	if(zoomCentreOnImageX < 0
		|| zoomCentreOnImageX > this.target.width()
		|| zoomCentreOnImageY < 0
		|| zoomCentreOnImageY > this.target.height()) {

		cursorPositionOnImageContainerX = this.container.width() / 2;
		cursorPositionOnImageContainerY = this.container.height() / 2;

		// Recalculate
		zoomCentreOnImageX = cursorPositionOnImageContainerX - this.target.position().left;
		zoomCentreOnImageY = cursorPositionOnImageContainerY - this.target.position().top;
	}

	// Calculate re-centering ratios
	var zoomCentreToWidthRatioX = zoomCentreOnImageX / this.target.width();
	var zoomCentreToHeightRatioY = zoomCentreOnImageY / this.target.height();

	this.target.width( newImageWidth );

	var newTargetPositionX = cursorPositionOnImageContainerX - zoomCentreToWidthRatioX * this.target.width();
	var newTargetPositionY = cursorPositionOnImageContainerY - zoomCentreToHeightRatioY * this.target.height();

	this.target.css({
		top: newTargetPositionY,
		left: newTargetPositionX
	});

	this.target.trigger("zoomchange", this.getTargetZoom());
}

sewi.PanZoomWidget.prototype.setTargetZoomToFit = function() {
	this.executeZoomImage(this.targetDimensions.fitToContainer.width, 0, 0);
	this.centreTargetOnContainer();
}

sewi.PanZoomWidget.prototype.moveTargetToCursor = function(event) {
	event.preventDefault();

	if(this.targetPanningVariables.ignoreEvent)
		return;

	var newTargetPositionX = this.targetPanningVariables.originalTargetX + event.pageX - this.targetPanningVariables.originalCursorX;
	var newTargetPositionY = this.targetPanningVariables.originalTargetY + event.pageY - this.targetPanningVariables.originalCursorY;

	if(newTargetPositionX < this.targetPanningVariables.minImageX)
		newTargetPositionX = this.targetPanningVariables.minImageX;
	else if(newTargetPositionX > this.targetPanningVariables.maxImageX)
		newTargetPositionX = this.targetPanningVariables.maxImageX;

	if(newTargetPositionY < this.targetPanningVariables.minImageY)
		newTargetPositionY = this.targetPanningVariables.minImageY;
	else if(newTargetPositionY > this.targetPanningVariables.maxImageY)
		newTargetPositionY = this.targetPanningVariables.maxImageY;

	this.target.css({
		top: newTargetPositionY,
		left: newTargetPositionX
	});

	this.targetPanningVariables.ignoreEvent = true;
	setTimeout((function() {
		this.targetPanningVariables.ignoreEvent = false;
	}).bind(this), 10);
}

sewi.PanZoomWidget.prototype.centreTargetOnContainer = function() {
	this.target.css({
		top: (this.container.height() - this.target.height()) / 2,
		left: (this.container.width() - this.target.width()) / 2
	});
}

sewi.PanZoomWidget.prototype.setupPanningVariables = function(event) {
	this.targetPanningVariables.originalCursorX = event.pageX;
	this.targetPanningVariables.originalCursorY = event.pageY;
	this.targetPanningVariables.originalTargetX = this.target.position().left;
	this.targetPanningVariables.originalTargetY = this.target.position().top;
	this.targetPanningVariables.maxImageX = this.container.width() / 2;
	this.targetPanningVariables.maxImageY = this.container.height() / 2;
	this.targetPanningVariables.minImageX = this.targetPanningVariables.maxImageX - this.target.width();
	this.targetPanningVariables.minImageY = this.targetPanningVariables.maxImageY - this.target.height();
	this.targetPanningVariables.ignoreEvent = false; // Used for performances purposes. This variable is set when moveTargetToCursor is called too quickly consecutively (after each call to moveTargetToCursor, it is set to true, then a timeout() - with some delay - is set it back to false)

	this.container.off("mousewheel.PanZoomWidget"); //Don't allow the user to move and zoom

	this.container.css({
		cursor: "-webkit-grabbing"
	});

	$("body").css({
		cursor: "-webkit-grabbing"
	});

	$("body").on("mousemove.PanZoomWidget", this.moveTargetToCursor.bind(this));

	$("body").one("mouseup.PanZoomWidget", (function(event) {
		this.container.on("mousewheel.PanZoomWidget", this.calculateTargetZoomFromMousewheel.bind(this));
		$("body").off("mousemove.PanZoomWidget");

		$("body").css({
			cursor: "auto"
		});
		
		this.container.css({
			cursor: "-webkit-grab"
		});
	}).bind(this));
}

sewi.PanZoomWidget.prototype.fitSizeEqualsOriginalSize = function() {
	return this.targetDimensions.fitToContainer == this.targetDimensions.original;
}