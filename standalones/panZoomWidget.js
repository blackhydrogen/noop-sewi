var sewi = sewi || {};

sewi.PanZoomWidget = function(panZoomTarget, panZoomContainer, targetOriginalWidth, targetOriginalHeight) {
	this.selfref = this;
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

	this.calculateTargetDimensions(this.selfref, targetOriginalWidth, targetOriginalHeight);

	this.container.on("mousewheel.PanZoomWidget", _.partial(this.calculateTargetZoomFromMousewheel, this.selfref));
	this.container.on("mousedown.PanZoomWidget", _.partial(this.setupPanningVariables, this.selfref));
}

sewi.PanZoomWidget.prototype.getTargetZoom = function(selfref) {
	return Math.round(100 * selfref.target.width() / selfref.targetDimensions.original.width);
}

sewi.PanZoomWidget.prototype.calculateTargetDimensions = function(selfref, originalWidth, originalHeight) {
	selfref.targetDimensions.original.width = originalWidth;
	selfref.targetDimensions.original.height = originalHeight;

	// Compute fit to container sizes
	var containerWidth = selfref.container.width();
	var containerHeight = selfref.container.height();

	if(originalWidth <= containerWidth) {
		if(originalHeight <= containerHeight) {
			selfref.targetDimensions.fitToContainer.width = originalWidth;
			selfref.targetDimensions.fitToContainer.height = originalHeight;
		}
		else {
			selfref.targetDimensions.fitToContainer.width = originalWidth * containerHeight / originalHeight;
			selfref.targetDimensions.fitToContainer.height = containerHeight;
		}
	}
	else {
		if(originalHeight <= containerHeight) {
			selfref.targetDimensions.fitToContainer.width = containerWidth;
			selfref.targetDimensions.fitToContainer.height = originalHeight * containerWidth / originalWidth;
		}
		else {
			var adjustedWidth = originalWidth * containerHeight / originalHeight;

			if(adjustedWidth <= containerWidth) {
				selfref.targetDimensions.fitToContainer.width = adjustedWidth;
				selfref.targetDimensions.fitToContainer.height = originalHeight * adjustedWidth / originalWidth;
			}
			else {
				selfref.targetDimensions.fitToContainer.width = containerWidth;
				selfref.targetDimensions.fitToContainer.height = originalHeight * containerWidth / originalWidth;
			}
		}
	}
	// End compute fit to container sizes

	selfref.targetDimensions.minimumZoom.width = selfref.targetDimensions.fitToContainer.width / 2;
	selfref.targetDimensions.minimumZoom.height = selfref.targetDimensions.fitToContainer.height / 2;

	selfref.targetDimensions.maximumZoom.width = selfref.targetDimensions.original.width * 2;
	selfref.targetDimensions.maximumZoom.height = selfref.targetDimensions.original.height * 2;
}

// Recalculate the targetDimensions of the target - used when the container is resized.
sewi.PanZoomWidget.prototype.recalculateTargetDimensions = function(selfref) {
	selfref.calculateTargetDimensions(selfref, selfref.targetDimensions.original.width, selfref.targetDimensions.original.height);
}

sewi.PanZoomWidget.prototype.moveTargetToCursor = function(selfref) {
	if(selfref.targetPanningVariables.ignoreEvent)
		return false;

	var newTargetPositionX = selfref.targetPanningVariables.originalTargetX + event.pageX - selfref.targetPanningVariables.originalCursorX;
	var newTargetPositionY = selfref.targetPanningVariables.originalTargetY + event.pageY - selfref.targetPanningVariables.originalCursorY;

	if(newTargetPositionX < selfref.targetPanningVariables.minImageX)
		newTargetPositionX = selfref.targetPanningVariables.minImageX;
	else if(newTargetPositionX > selfref.targetPanningVariables.maxImageX)
		newTargetPositionX = selfref.targetPanningVariables.maxImageX;

	if(newTargetPositionY < selfref.targetPanningVariables.minImageY)
		newTargetPositionY = selfref.targetPanningVariables.minImageY;
	else if(newTargetPositionY > selfref.targetPanningVariables.maxImageY)
		newTargetPositionY = selfref.targetPanningVariables.maxImageY;

	selfref.target.css({
		top: newTargetPositionY,
		left: newTargetPositionX
	});

	selfref.targetPanningVariables.ignoreEvent = true;
	setTimeout(function() {
		selfref.targetPanningVariables.ignoreEvent = false;
	}, 10);

	return false;
}

sewi.PanZoomWidget.prototype.calculateTargetZoomFromMousewheel = function(selfref, event) {
	// Figure out new width
	var zoomChange = 1 + 0.2 * event.originalEvent.wheelDelta / 120;
	var newImageWidth = selfref.target.width() * zoomChange;

	var cursorPositionOnImageContainerX = event.pageX - selfref.container.position().left;
	var cursorPositionOnImageContainerY = event.pageY - selfref.container.position().top;

	selfref.executeZoomImage(selfref, newImageWidth, cursorPositionOnImageContainerX, cursorPositionOnImageContainerY);

	return false;
}

sewi.PanZoomWidget.prototype.setTargetZoom = function(selfref, zoomPercentage) {
	var newImageWidth = selfref.targetDimensions.original.width * zoomPercentage / 100;

	selfref.executeZoomImage(selfref, newImageWidth, selfref.container.width() / 2, selfref.container.height() / 2);
}

sewi.PanZoomWidget.prototype.executeZoomImage = function(selfref, newImageWidth, cursorPositionOnImageContainerX, cursorPositionOnImageContainerY) {
	// We make sure the new width isn't outside the range of the respective minimum and maximum dimensions.
	if(newImageWidth < selfref.targetDimensions.minimumZoom.width) {
		newImageWidth = selfref.targetDimensions.minimumZoom.width;
	}
	else if(newImageWidth > selfref.targetDimensions.maximumZoom.width) {
		newImageWidth = selfref.targetDimensions.maximumZoom.width;
	}

	// Optimizing... If there is no change in the width, we just return.
	// (We round newImageWidth because HTML rounds the value when we assign a floating point number.)
	if(Math.round(newImageWidth) == selfref.target.width())
		return;

	// Figure out where to centre image after resizing based on cursorPositionOnImageContainerX, cursorPositionOnImageContainerY
	// Where, in pixels, inside the image is the zoom centre (relative to the image)
	var zoomCentreOnImageX = cursorPositionOnImageContainerX - selfref.target.position().left;
	var zoomCentreOnImageY = cursorPositionOnImageContainerY - selfref.target.position().top;

	// If zoomCentreOnImageX or zoomCentreOnImageY is out the image coordinates, then centre on centre of container
	if(zoomCentreOnImageX < 0
		|| zoomCentreOnImageX > selfref.target.width()
		|| zoomCentreOnImageY < 0
		|| zoomCentreOnImageY > selfref.target.height()) {

		cursorPositionOnImageContainerX = selfref.container.width() / 2;
		cursorPositionOnImageContainerY = selfref.container.height() / 2;

		// Recalculate
		zoomCentreOnImageX = cursorPositionOnImageContainerX - selfref.target.position().left;
		zoomCentreOnImageY = cursorPositionOnImageContainerY - selfref.target.position().top;
	}

	// Calculate re-centering ratios
	var zoomCentreToWidthRatioX = zoomCentreOnImageX / selfref.target.width();
	var zoomCentreToHeightRatioY = zoomCentreOnImageY / selfref.target.height();

	selfref.target.width( newImageWidth );

	var newTargetPositionX = cursorPositionOnImageContainerX - zoomCentreToWidthRatioX * selfref.target.width();
	var newTargetPositionY = cursorPositionOnImageContainerY - zoomCentreToHeightRatioY * selfref.target.height();

	selfref.target.css({
		top: newTargetPositionY,
		left: newTargetPositionX
	});

	selfref.target.trigger("zoomchange");
}

sewi.PanZoomWidget.prototype.setTargetZoomToFit = function(selfref) {
	selfref.executeZoomImage(selfref, selfref.targetDimensions.fitToContainer.width, 0, 0);
	selfref.centreTargetOnContainer(selfref);
}

sewi.PanZoomWidget.prototype.centreTargetOnContainer = function(selfref) {
	selfref.target.css({
		top: (selfref.container.height() - selfref.target.height()) / 2,
		left: (selfref.container.width() - selfref.target.width()) / 2
	});
}

sewi.PanZoomWidget.prototype.setupPanningVariables = function(selfref, event) {
	selfref.targetPanningVariables.originalCursorX = event.pageX;
	selfref.targetPanningVariables.originalCursorY = event.pageY;
	selfref.targetPanningVariables.originalTargetX = selfref.target.position().left;
	selfref.targetPanningVariables.originalTargetY = selfref.target.position().top;
	selfref.targetPanningVariables.maxImageX = selfref.container.width() / 2;
	selfref.targetPanningVariables.maxImageY = selfref.container.height() / 2;
	selfref.targetPanningVariables.minImageX = selfref.targetPanningVariables.maxImageX - selfref.target.width();
	selfref.targetPanningVariables.minImageY = selfref.targetPanningVariables.maxImageY - selfref.target.height();
	selfref.targetPanningVariables.ignoreEvent = false; // Used for performances purposes. This variable is set when moveTargetToCursor is called too quickly consecutively (after each call to moveTargetToCursor, it is set to true, then a timeout() - with some delay - is set it back to false)

	selfref.container.off("mousewheel.PanZoomWidget"); //Don't allow the user to move and zoom

	$("body").on("mousemove.PanZoomWidget", _.partial(selfref.moveTargetToCursor, selfref));

	$("body").one("mouseup.PanZoomWidget", function(event) {
		selfref.container.on("mousewheel.PanZoomWidget", _.partial(selfref.calculateTargetZoomFromMousewheel, selfref));
		$("body").off("mousemove.PanZoomWidget");
	});
}