var sewi = sewi || {};

sewi.ImageResourceViewer = function(options) {
	sewi.ResourceViewer.call(this);

	options = options || {};

	this.originalImageInfo = {
		width: 0,
		height: 0,
		url: "",
		id: options.id
	};

	this.mainDOMElement.addClass("image-resource-main-container");

	this.imageContainer = $('<div class="image-resource-image-container"></div>')
		.appendTo(this.mainDOMElement);

	this.imageElement = $('<img class="image-resource-image">')
		.appendTo(this.imageContainer);

	this.brightness = 1;
	this.contrast = 1;

	this.controls;
	this.imagePanZoomWidget;	
};

sewi.inherits(sewi.ImageResourceViewer, sewi.ResourceViewer);

sewi.ImageResourceViewer.prototype.falseColorPalette = {
	flame: {
		name: "Flame",
		values: [[3, 0, 0], [5, 0, 0], [5, 0, 0], [8, 0, 0], [8, 0, 0], [11, 0, 0], [11, 0, 0], [13, 0, 0], [13, 0, 0], [16, 0, 0], [19, 0, 0], [19, 0, 0], [21, 0, 0], [21, 0, 0], [24, 0, 0], [27, 0, 0], [27, 0, 0], [29, 0, 0], [32, 0, 0], [32, 0, 0], [35, 0, 0], [37, 0, 0], [40, 0, 0], [40, 0, 0], [43, 0, 0], [45, 0, 0], [48, 0, 0], [48, 0, 0], [50, 0, 0], [53, 0, 0], [56, 0, 0], [58, 0, 0], [58, 0, 0], [61, 0, 0], [64, 0, 0], [66, 0, 0], [69, 0, 0], [72, 0, 0], [74, 0, 0], [74, 0, 0], [77, 0, 0], [80, 0, 0], [82, 0, 0], [85, 0, 0], [88, 0, 0], [90, 0, 0], [93, 0, 0], [96, 0, 0], [98, 0, 0], [101, 0, 0], [104, 0, 0], [106, 0, 0], [109, 0, 0], [112, 0, 0], [114, 0, 0], [117, 0, 0], [120, 0, 0], [122, 0, 0], [125, 0, 0], [128, 0, 0], [130, 0, 0], [133, 0, 0], [135, 0, 0], [138, 0, 0], [141, 0, 0], [143, 0, 0], [146, 0, 0], [149, 0, 0], [151, 0, 0], [154, 0, 0], [157, 0, 0], [159, 0, 0], [162, 0, 0], [167, 0, 0], [170, 0, 0], [173, 0, 0], [175, 0, 0], [178, 0, 0], [181, 0, 0], [183, 0, 0], [186, 0, 0], [191, 0, 0], [194, 0, 0], [197, 0, 0], [199, 0, 0], [202, 0, 0], [205, 0, 0], [207, 0, 0], [213, 0, 0], [215, 0, 0], [218, 0, 0], [220, 0, 0], [223, 0, 0], [228, 0, 0], [231, 0, 0], [234, 0, 0], [236, 0, 0], [239, 0, 0], [244, 0, 0], [247, 0, 0], [250, 0, 0], [252, 0, 0], [255, 0, 0], [255, 5, 0], [255, 8, 0], [255, 11, 0], [255, 13, 0], [255, 16, 0], [255, 21, 0], [255, 24, 0], [255, 27, 0], [255, 29, 0], [255, 35, 0], [255, 37, 0], [255, 40, 0], [255, 43, 0], [255, 48, 0], [255, 50, 0], [255, 53, 0], [255, 56, 0], [255, 61, 0], [255, 64, 0], [255, 66, 0], [255, 69, 0], [255, 74, 0], [255, 77, 0], [255, 80, 0], [255, 82, 0], [255, 88, 0], [255, 90, 0], [255, 93, 0], [255, 96, 0], [255, 98, 0], [255, 104, 0], [255, 106, 0], [255, 109, 0], [255, 112, 0], [255, 117, 0], [255, 120, 0], [255, 122, 0], [255, 125, 0], [255, 130, 0], [255, 133, 0], [255, 135, 0], [255, 138, 0], [255, 143, 0], [255, 146, 0], [255, 149, 0], [255, 151, 0], [255, 157, 0], [255, 159, 0], [255, 162, 0], [255, 165, 0], [255, 167, 0], [255, 173, 0], [255, 175, 0], [255, 178, 0], [255, 181, 0], [255, 183, 0], [255, 189, 0], [255, 191, 0], [255, 194, 0], [255, 197, 0], [255, 199, 0], [255, 205, 0], [255, 207, 0], [255, 210, 0], [255, 213, 0], [255, 215, 0], [255, 220, 0], [255, 223, 0], [255, 226, 0], [255, 228, 0], [255, 231, 0], [255, 234, 0], [255, 236, 0], [255, 242, 0], [255, 244, 0], [255, 247, 0], [255, 250, 0], [255, 252, 0], [255, 255, 0], [255, 255, 4], [255, 255, 8], [255, 255, 16], [255, 255, 20], [255, 255, 24], [255, 255, 28], [255, 255, 32], [255, 255, 36], [255, 255, 40], [255, 255, 44], [255, 255, 48], [255, 255, 52], [255, 255, 56], [255, 255, 60], [255, 255, 64], [255, 255, 68], [255, 255, 72], [255, 255, 76], [255, 255, 80], [255, 255, 84], [255, 255, 88], [255, 255, 92], [255, 255, 96], [255, 255, 100], [255, 255, 104], [255, 255, 108], [255, 255, 112], [255, 255, 116], [255, 255, 120], [255, 255, 124], [255, 255, 128], [255, 255, 131], [255, 255, 135], [255, 255, 139], [255, 255, 143], [255, 255, 147], [255, 255, 147], [255, 255, 151], [255, 255, 155], [255, 255, 159], [255, 255, 163], [255, 255, 167], [255, 255, 171], [255, 255, 171], [255, 255, 175], [255, 255, 179], [255, 255, 183], [255, 255, 187], [255, 255, 187], [255, 255, 191], [255, 255, 195], [255, 255, 199], [255, 255, 199], [255, 255, 203], [255, 255, 207], [255, 255, 211], [255, 255, 211], [255, 255, 215], [255, 255, 219], [255, 255, 219], [255, 255, 223], [255, 255, 227], [255, 255, 227], [255, 255, 231], [255, 255, 231], [255, 255, 235], [255, 255, 239], [255, 255, 239], [255, 255, 243], [255, 255, 243], [255, 255, 247], [255, 255, 247], [255, 255, 251], [255, 255, 251]]},
	rainbow: {
		name: "Rainbow",
		values: [[0, 0, 131], [0, 0, 135], [0, 0, 135], [0, 0, 139], [0, 0, 139], [0, 0, 143], [0, 0, 143], [0, 0, 147], [0, 0, 147], [0, 0, 151], [0, 0, 155], [0, 0, 155], [0, 0, 159], [0, 0, 159], [0, 0, 163], [0, 0, 167], [0, 0, 167], [0, 0, 171], [0, 0, 175], [0, 0, 175], [0, 0, 179], [0, 0, 183], [0, 0, 187], [0, 0, 187], [0, 0, 191], [0, 0, 195], [0, 0, 199], [0, 0, 199], [0, 0, 203], [0, 0, 207], [0, 0, 211], [0, 0, 215], [0, 0, 215], [0, 0, 219], [0, 0, 223], [0, 0, 227], [0, 0, 231], [0, 0, 235], [0, 0, 239], [0, 0, 239], [0, 0, 243], [0, 0, 247], [0, 0, 251], [0, 0, 255], [0, 4, 255], [0, 8, 255], [0, 12, 255], [0, 16, 255], [0, 20, 255], [0, 24, 255], [0, 28, 255], [0, 32, 255], [0, 36, 255], [0, 40, 255], [0, 44, 255], [0, 48, 255], [0, 52, 255], [0, 56, 255], [0, 60, 255], [0, 64, 255], [0, 68, 255], [0, 72, 255], [0, 76, 255], [0, 80, 255], [0, 84, 255], [0, 88, 255], [0, 92, 255], [0, 96, 255], [0, 100, 255], [0, 104, 255], [0, 108, 255], [0, 112, 255], [0, 116, 255], [0, 124, 255], [0, 128, 255], [0, 131, 255], [0, 135, 255], [0, 139, 255], [0, 143, 255], [0, 147, 255], [0, 151, 255], [0, 159, 255], [0, 163, 255], [0, 167, 255], [0, 171, 255], [0, 175, 255], [0, 179, 255], [0, 183, 255], [0, 191, 255], [0, 195, 255], [0, 199, 255], [0, 203, 255], [0, 207, 255], [0, 215, 255], [0, 219, 255], [0, 223, 255], [0, 227, 255], [0, 231, 255], [0, 239, 255], [0, 243, 255], [0, 247, 255], [0, 251, 255], [0, 255, 255], [8, 255, 247], [12, 255, 243], [16, 255, 239], [20, 255, 235], [24, 255, 231], [32, 255, 223], [36, 255, 219], [40, 255, 215], [44, 255, 211], [52, 255, 203], [56, 255, 199], [60, 255, 195], [64, 255, 191], [72, 255, 183], [76, 255, 179], [80, 255, 175], [84, 255, 171], [92, 255, 163], [96, 255, 159], [100, 255, 155], [104, 255, 151], [112, 255, 143], [116, 255, 139], [120, 255, 135], [124, 255, 131], [131, 255, 124], [135, 255, 120], [139, 255, 116], [143, 255, 112], [147, 255, 108], [155, 255, 100], [159, 255, 96], [163, 255, 92], [167, 255, 88], [175, 255, 80], [179, 255, 76], [183, 255, 72], [187, 255, 68], [195, 255, 60], [199, 255, 56], [203, 255, 52], [207, 255, 48], [215, 255, 40], [219, 255, 36], [223, 255, 32], [227, 255, 28], [235, 255, 20], [239, 255, 16], [243, 255, 12], [247, 255, 8], [251, 255, 4], [255, 251, 0], [255, 247, 0], [255, 243, 0], [255, 239, 0], [255, 235, 0], [255, 227, 0], [255, 223, 0], [255, 219, 0], [255, 215, 0], [255, 211, 0], [255, 203, 0], [255, 199, 0], [255, 195, 0], [255, 191, 0], [255, 187, 0], [255, 179, 0], [255, 175, 0], [255, 171, 0], [255, 167, 0], [255, 163, 0], [255, 159, 0], [255, 155, 0], [255, 147, 0], [255, 143, 0], [255, 139, 0], [255, 135, 0], [255, 131, 0], [255, 128, 0], [255, 124, 0], [255, 120, 0], [255, 112, 0], [255, 108, 0], [255, 104, 0], [255, 100, 0], [255, 96, 0], [255, 92, 0], [255, 88, 0], [255, 84, 0], [255, 80, 0], [255, 76, 0], [255, 72, 0], [255, 68, 0], [255, 64, 0], [255, 60, 0], [255, 56, 0], [255, 52, 0], [255, 48, 0], [255, 44, 0], [255, 40, 0], [255, 36, 0], [255, 32, 0], [255, 28, 0], [255, 24, 0], [255, 20, 0], [255, 16, 0], [255, 12, 0], [255, 8, 0], [255, 4, 0], [255, 0, 0], [251, 0, 0], [247, 0, 0], [243, 0, 0], [239, 0, 0], [235, 0, 0], [235, 0, 0], [231, 0, 0], [227, 0, 0], [223, 0, 0], [219, 0, 0], [215, 0, 0], [211, 0, 0], [211, 0, 0], [207, 0, 0], [203, 0, 0], [199, 0, 0], [195, 0, 0], [195, 0, 0], [191, 0, 0], [187, 0, 0], [183, 0, 0], [183, 0, 0], [179, 0, 0], [175, 0, 0], [171, 0, 0], [171, 0, 0], [167, 0, 0], [163, 0, 0], [163, 0, 0], [159, 0, 0], [155, 0, 0], [155, 0, 0], [151, 0, 0], [151, 0, 0], [147, 0, 0], [143, 0, 0], [143, 0, 0], [139, 0, 0], [139, 0, 0], [135, 0, 0], [135, 0, 0], [131, 0, 0], [131, 0, 0]]},
	spectrum: {
		name: "Spectrum",
		values: [[255, 0, 0], [255, 6, 0], [255, 6, 0], [255, 12, 0], [255, 12, 0], [255, 18, 0], [255, 18, 0], [255, 24, 0], [255, 24, 0], [255, 30, 0], [255, 36, 0], [255, 36, 0], [255, 42, 0], [255, 42, 0], [255, 48, 0], [255, 54, 0], [255, 54, 0], [255, 60, 0], [255, 66, 0], [255, 66, 0], [255, 72, 0], [255, 78, 0], [255, 84, 0], [255, 84, 0], [255, 90, 0], [255, 96, 0], [255, 102, 0], [255, 102, 0], [255, 108, 0], [255, 114, 0], [255, 120, 0], [255, 126, 0], [255, 126, 0], [255, 131, 0], [255, 137, 0], [255, 143, 0], [255, 149, 0], [255, 155, 0], [255, 161, 0], [255, 161, 0], [255, 167, 0], [255, 173, 0], [255, 179, 0], [255, 185, 0], [255, 191, 0], [255, 197, 0], [255, 203, 0], [255, 209, 0], [255, 215, 0], [255, 221, 0], [255, 227, 0], [255, 233, 0], [255, 239, 0], [255, 245, 0], [255, 251, 0], [253, 255, 0], [247, 255, 0], [241, 255, 0], [235, 255, 0], [229, 255, 0], [223, 255, 0], [217, 255, 0], [211, 255, 0], [205, 255, 0], [199, 255, 0], [193, 255, 0], [187, 255, 0], [181, 255, 0], [175, 255, 0], [169, 255, 0], [163, 255, 0], [157, 255, 0], [151, 255, 0], [139, 255, 0], [133, 255, 0], [128, 255, 0], [122, 255, 0], [116, 255, 0], [110, 255, 0], [104, 255, 0], [98, 255, 0], [86, 255, 0], [80, 255, 0], [74, 255, 0], [68, 255, 0], [62, 255, 0], [56, 255, 0], [50, 255, 0], [38, 255, 0], [32, 255, 0], [26, 255, 0], [20, 255, 0], [14, 255, 0], [2, 255, 0], [0, 255, 4], [0, 255, 10], [0, 255, 16], [0, 255, 22], [0, 255, 34], [0, 255, 40], [0, 255, 46], [0, 255, 52], [0, 255, 58], [0, 255, 70], [0, 255, 76], [0, 255, 82], [0, 255, 88], [0, 255, 94], [0, 255, 106], [0, 255, 112], [0, 255, 118], [0, 255, 124], [0, 255, 135], [0, 255, 141], [0, 255, 147], [0, 255, 153], [0, 255, 165], [0, 255, 171], [0, 255, 177], [0, 255, 183], [0, 255, 195], [0, 255, 201], [0, 255, 207], [0, 255, 213], [0, 255, 225], [0, 255, 231], [0, 255, 237], [0, 255, 243], [0, 255, 255], [0, 249, 255], [0, 243, 255], [0, 237, 255], [0, 231, 255], [0, 219, 255], [0, 213, 255], [0, 207, 255], [0, 201, 255], [0, 189, 255], [0, 183, 255], [0, 177, 255], [0, 171, 255], [0, 159, 255], [0, 153, 255], [0, 147, 255], [0, 141, 255], [0, 129, 255], [0, 124, 255], [0, 118, 255], [0, 112, 255], [0, 100, 255], [0, 94, 255], [0, 88, 255], [0, 82, 255], [0, 76, 255], [0, 64, 255], [0, 58, 255], [0, 52, 255], [0, 46, 255], [0, 40, 255], [0, 28, 255], [0, 22, 255], [0, 16, 255], [0, 10, 255], [0, 4, 255], [8, 0, 255], [14, 0, 255], [20, 0, 255], [26, 0, 255], [32, 0, 255], [44, 0, 255], [50, 0, 255], [56, 0, 255], [62, 0, 255], [68, 0, 255], [74, 0, 255], [80, 0, 255], [92, 0, 255], [98, 0, 255], [104, 0, 255], [110, 0, 255], [116, 0, 255], [122, 0, 255], [128, 0, 255], [133, 0, 255], [145, 0, 255], [151, 0, 255], [157, 0, 255], [163, 0, 255], [169, 0, 255], [175, 0, 255], [181, 0, 255], [187, 0, 255], [193, 0, 255], [199, 0, 255], [205, 0, 255], [211, 0, 255], [217, 0, 255], [223, 0, 255], [229, 0, 255], [235, 0, 255], [241, 0, 255], [247, 0, 255], [253, 0, 255], [255, 0, 251], [255, 0, 245], [255, 0, 239], [255, 0, 233], [255, 0, 227], [255, 0, 221], [255, 0, 215], [255, 0, 209], [255, 0, 203], [255, 0, 197], [255, 0, 191], [255, 0, 185], [255, 0, 179], [255, 0, 173], [255, 0, 167], [255, 0, 167], [255, 0, 161], [255, 0, 155], [255, 0, 149], [255, 0, 143], [255, 0, 137], [255, 0, 131], [255, 0, 131], [255, 0, 126], [255, 0, 120], [255, 0, 114], [255, 0, 108], [255, 0, 108], [255, 0, 102], [255, 0, 96], [255, 0, 90], [255, 0, 90], [255, 0, 84], [255, 0, 78], [255, 0, 72], [255, 0, 72], [255, 0, 66], [255, 0, 60], [255, 0, 60], [255, 0, 54], [255, 0, 48], [255, 0, 48], [255, 0, 42], [255, 0, 42], [255, 0, 36], [255, 0, 30], [255, 0, 30], [255, 0, 24], [255, 0, 24], [255, 0, 18], [255, 0, 18], [255, 0, 12], [255, 0, 12]]}
};

sewi.ImageResourceViewer.prototype.resize = function() {
	this.imagePanZoomWidget.recalculateTargetDimensions();
}

sewi.ImageResourceViewer.prototype.showTooltips = function() {
	this.controls.enableTooltips();
}

sewi.ImageResourceViewer.prototype.hideTooltips = function() {
	this.controls.disableTooltips();
}

sewi.ImageResourceViewer.prototype.load = function() {
	this.showProgressBar();
	this.updateProgressBar(100);

	this.imageElement.one("load", this.afterImageLoadSetup.bind(this));

	this.loadImage();
};

sewi.ImageResourceViewer.prototype.loadImage = function() {
	$.ajax({
		dataType: 'json',
		type: 'GET',
		async: true,
		url: '/sewi/resources/image/' + this.originalImageInfo.id,
	})
	.done((function(data) {
		this.imageElement.prop("src", data.url);
	}).bind(this))
	.error((function() {
		this.showError("An error occurred while trying to load the image resource.");
	}).bind(this));
}

sewi.ImageResourceViewer.prototype.afterImageLoadSetup = function() {
	this.originalImageInfo.width = this.imageElement.prop("naturalWidth");
	this.originalImageInfo.height = this.imageElement.prop("naturalHeight");
	this.originalImageInfo.url = this.imageElement.prop("src");

	this.controls = new sewi.ImageControls();
	
	this.controls.on("brightnessChanged", this.applyInbuiltImageBrightness.bind(this));
	this.controls.on("contrastChanged", this.applyInbuiltImageContrast.bind(this));
	this.controls.on("filtersChanged", this.applyCustomImageFilters.bind(this));

	this.mainDOMElement.append(this.controls.getDOM());

	this.addDownloadButton(function() {
		return this.imageElement.attr("src");
	});

	this.setupZoomControls();

	this.hideProgressBar();
}

sewi.ImageResourceViewer.prototype.setupZoomControls = function() {
	this.imagePanZoomWidget = new sewi.PanZoomWidget(this.imageElement, this.imageContainer);

	this.on("zoomChanged", (function(event, newZoomPercentage) {
		this.controls.updateZoomControlValue({
			zoomLevel: newZoomPercentage
		});
	}).bind(this));

	this.controls.on("zoomChanged", (function(event, zoomLevel) {
		this.imagePanZoomWidget.setCurrentZoomLevel(zoomLevel);
	}).bind(this));

	this.controls.on("zoomToFitRequested", this.imagePanZoomWidget.setZoomLevelToZoomToFit.bind(this.imagePanZoomWidget));

	// TODO set the correct min and max values.

	// Update controls to the correct values (the value may have changed during construction,
	// and the event not captured due to the event being registered after the construction)
	this.controls.updateZoomControlValue({
		zoomLevel: this.imagePanZoomWidget.getCurrentZoomLevel()
	});
}

sewi.ImageResourceViewer.prototype.applyCustomImageFilters = function(event, settings) {
	var t1 = new Date().getTime();
	var t2;

	var toApplyGrayscaleFilter = settings.colorize !== "none";
	var toApplyDifferenceFilter = settings.difference;
	var toApplyInvertFilter = settings.invert;
	var toApplyHistogramEqualizationFilter = settings.autoContrast;
	var toApplyFalseColorFilter = settings.colorize !== "none" && settings.colorize !== "grayscale";
	var toApplySelectiveStretchingFilter = settings.contrastStretchMode !== "none";

	if(toApplyInvertFilter
		|| toApplyGrayscaleFilter
		|| toApplyDifferenceFilter
		|| toApplyHistogramEqualizationFilter
		|| toApplyFalseColorFilter
		|| toApplySelectiveStretchingFilter) {
		var canvasElement = $("<canvas></canvas>")
			.prop("width", this.originalImageInfo.width)
			.prop("height", this.originalImageInfo.height);

		var originalImage = $("<img>").prop("src", this.originalImageInfo.url);

		canvasElement[0].getContext("2d").drawImage(originalImage[0], 0, 0, this.originalImageInfo.width, this.originalImageInfo.height);

		t2 = new Date().getTime(); console.log("WRITE IMG TO CANVAS TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

		var canvasData = canvasElement[0].getContext("2d").getImageData(0, 0, this.originalImageInfo.width, this.originalImageInfo.height);

		t2 = new Date().getTime(); console.log("GET CANVAS DATA TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

		if(toApplyGrayscaleFilter) {
			this.applyGrayscaleFilterToPixelData(canvasData.data);
		}
		if(toApplyDifferenceFilter) {
			this.applyDifferenceFilterToPixelData(canvasData.data);
		}
		if(toApplyInvertFilter) {
			this.applyInvertFilterToPixelData(canvasData.data);
		}
		if(toApplyHistogramEqualizationFilter) {
			this.applyHistogramEqualizationFilterToPixelData(canvasData.data);
		}
		if(toApplySelectiveStretchingFilter) {
			switch(settings.contrastStretchMode) {
				case "shadows":
					var selectedRangeStart = 0;
					var selectedRangeEnd = 80;
					break;
				case "midtones":
					var selectedRangeStart = 81;
					var selectedRangeEnd = 174;
					break;
				case "highlights":
					var selectedRangeStart = 175;
					var selectedRangeEnd = 255;
					break;
			}

			this.applySelectiveStretchingFilterToPixelData(
				canvasData.data,
				selectedRangeStart,
				selectedRangeEnd, 
				settings.contrastStretchValue
			);
		}
		if(toApplyFalseColorFilter) {
			this.applyFalseColorFilterToPixelData(canvasData.data, settings.colorize);
		}

		t2 = new Date().getTime(); console.log("APPLY FILTER TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

		canvasElement[0].getContext("2d").putImageData(canvasData, 0, 0);

		t2 = new Date().getTime(); console.log("WRITE-BACK DATA TO CANVAS TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

		this.imageElement.prop("src", canvasElement[0].toDataURL("image/jpeg", 0.9));

		t2 = new Date().getTime(); console.log("CANVAS TO IMG CONVERSION TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG
	}
	else {
		this.imageElement.prop("src", this.originalImageInfo.url);
	}

	console.log("=== END OF REPORT ===") // DEBUG
	console.log(""); // DEBUG
}

sewi.ImageResourceViewer.prototype.applyInvertFilterToPixelData = function(pixelData) {
	for(var i = 0; i < pixelData.length; i += 4) {
		// Direct computation is faster than using an array
		pixelData[i] = 255 - pixelData[i];
		pixelData[i+1] = 255 - pixelData[i+1];
		pixelData[i+2] = 255 - pixelData[i+2];
	}
}

sewi.ImageResourceViewer.prototype.applyGrayscaleFilterToPixelData = function(pixelData) {
	for(var i = 0; i < pixelData.length; i += 4) {
		// Luminosity method: 0.21 R + 0.72 G + 0.07 B
		var newColor = Math.round(0.21 * pixelData[i] + 0.72 * pixelData[i+1] + 0.07 * pixelData[i+2]);
		pixelData[i] = newColor;
		pixelData[i+1] = newColor;
		pixelData[i+2] = newColor;
	}
}

sewi.ImageResourceViewer.prototype.applyDifferenceFilterToPixelData = function(pixelData) {
	var newValuesMapping = new Array(256);
	for(var i = 0; i < 256; i++) {
		newValuesMapping[i] = Math.abs(255 - 2 * i);
	}

	for(var i = 0; i < pixelData.length; i += 4) {
		pixelData[i] = newValuesMapping[pixelData[i]];
		pixelData[i+1] = newValuesMapping[pixelData[i+1]];
		pixelData[i+2] = newValuesMapping[pixelData[i+2]];
	}
}

sewi.ImageResourceViewer.prototype.applyHistogramEqualizationFilterToPixelData = function(pixelData) {
	// Assumption: image is in grayscale.
	var colorCount = new Array(256);
	for(var i = 0; i < 256; i++) {
		colorCount[i] = 0;
	}

	for(var i = 0; i < pixelData.length; i += 4) {
		colorCount[pixelData[i]]++;
	}

	var cdfMin = 0;
	var cdfOriginal = new Array(256);
	cdfOriginal[0] = colorCount[0];
	for(var i = 1; i < 256; i++) {
		cdfOriginal[i] = cdfOriginal[i-1] + colorCount[i];

		if(cdfMin == 0 && cdfOriginal[i] != 0)
			cdfMin = cdfOriginal[i];
	}

	var cdfScaled = new Array(256);
	var totalNumberOfPixelsSubtractCdfMin = pixelData.length / 4 - cdfMin;
	for(var i = 0; i < 256; i++) {
		cdfScaled[i] = Math.round( ( (cdfOriginal[i] - cdfMin) / totalNumberOfPixelsSubtractCdfMin) * 255);
	}

	for(var i = 0; i < pixelData.length; i += 4) {
		pixelData[i] = cdfScaled[pixelData[i]];
		pixelData[i+1] = cdfScaled[pixelData[i+1]];
		pixelData[i+2] = cdfScaled[pixelData[i+2]];
	}
}

sewi.ImageResourceViewer.prototype.applySelectiveStretchingFilterToPixelData = function(pixelData, startOfRange, endOfRange, intensity) {
	// Assumption: image is in grayscale.

	var defaultRangeLength = endOfRange - startOfRange + 1;
	var expandedRangeLength = Math.round(defaultRangeLength * intensity);

	var defaultOuterRangeLength = 256 - defaultRangeLength;
	var compressedOuterRangeLength = 256 - expandedRangeLength;

	var defaultPreRangeLength = startOfRange - 0;
	var defaultPostRangeLength = 255 - endOfRange;

	var compressedPreRangeLength = Math.ceil(defaultPreRangeLength * compressedOuterRangeLength / defaultOuterRangeLength);
	var compressedPostRangeLength = Math.ceil(defaultPostRangeLength * compressedOuterRangeLength / defaultOuterRangeLength);

	// Redefine the expandedRangeLength, due to rounding errors.
	expandedRangeLength = 256 - compressedPreRangeLength - compressedPostRangeLength;

	var newValuesMapping = new Array(256);
	for(var i = 0; i < defaultPreRangeLength; i++) {
		newValuesMapping[i] = Math.round(i * compressedPreRangeLength / defaultPreRangeLength);
	}

	for(var i = 0; i < defaultPostRangeLength; i++) {
		newValuesMapping[255 - i] = Math.round(255 - i * compressedPostRangeLength / defaultPostRangeLength);
	}

	var testValuesMapping = new Array(256);
	for(var i = 0; i < defaultRangeLength; i++) {
		testValuesMapping[defaultPreRangeLength + i] = Math.round(compressedPreRangeLength + i * expandedRangeLength / defaultRangeLength);
		newValuesMapping[defaultPreRangeLength + i] = Math.round(compressedPreRangeLength + i * expandedRangeLength / defaultRangeLength);
	}

	for(var i = 0; i < pixelData.length; i += 4) {
		pixelData[i] = newValuesMapping[pixelData[i]];
		pixelData[i+1] = newValuesMapping[pixelData[i+1]];
		pixelData[i+2] = newValuesMapping[pixelData[i+2]];
	}
}

sewi.ImageResourceViewer.prototype.applyFalseColorFilterToPixelData = function(pixelData, chosenFalseColorPalette) {
	// Assumption: image is in grayscale.

	var falseColorPaletteToUse = this.falseColorPalette[chosenFalseColorPalette].values;

	for(var i = 0; i < pixelData.length; i += 4) {
		var falseColorToUse = falseColorPaletteToUse[pixelData[i]];

		pixelData[i] = falseColorToUse[0];
		pixelData[i+1] = falseColorToUse[1];
		pixelData[i+2] = falseColorToUse[2];
	}
}

sewi.ImageResourceViewer.prototype.applyInbuiltImageBrightness = function(event, brightness) {
	this.brightness = brightness;
	this.applyInbuiltImageFilters();
}

sewi.ImageResourceViewer.prototype.applyInbuiltImageContrast = function(event, contrast) {
	this.contrast = contrast;
	this.applyInbuiltImageFilters();
}

sewi.ImageResourceViewer.prototype.applyInbuiltImageFilters = function() {
	this.imageElement.css("-webkit-filter",
		"brightness(" + this.brightness + ")" +
		"contrast(" + this.contrast + ")"
	);
}





// ========== ImageControls Class Definition ==========

sewi.ImageControls = function(options) {
	// Safeguard if function is called without `new` keyword
	if (!(this instanceof sewi.ImageControls))
		return new sewi.ImageControls();

	sewi.ConfiguratorElement.call(this);

	this.initDOM();
	this.initEvents();
};

sewi.inherits(sewi.ImageControls, sewi.ConfiguratorElement);

// ImageControls private methods begin
sewi.ImageControls.prototype.initDOM = function() {
	this.mainDOMElement
		.addClass('image-control-panel')
		.addClass('animated');

	var button = $('<button class="btn btn-default">');
	var toggleButtonLabel = $('<label class="btn btn-default">');
	var toggleButton = $('<input type="checkbox">');
	var slider = $('<input type="range" min="0" max="2" value="1" step="0.1" />');
	var innerPanel = $('<div>');

	var leftButtonPanel = innerPanel
		.clone()
		.addClass('left');

	var rightButtonPanel = innerPanel
		.clone()
		.addClass('right');

	var filterButtonGroup = $('<div class="filter-button-group" data-toggle="buttons">');

	this.brightnessButton = button
		.clone()
		.addClass('brightness-button')
		.append('<span class="sewi-icon-brightness-medium">');

	this.contrastButton = button
		.clone()
		.addClass('contrast-button')
		.append('<span class="sewi-icon-contrast">');

	this.contrastPlusButton = button
		.clone()
		.addClass('contrast-plus-button')
		.append('<span class="glyphicon glyphicon-tasks">');

	this.zoomButton = button
		.clone()
		.addClass('zoom-button')
		.append('<span class="sewi-icon-zoom-to-full">');

	this.zoomToFitButton = button
		.clone()
		.addClass('fit-button')
		.append('<span class="sewi-icon-zoom-to-fit">');

	this.brightnessSlider = slider
		.clone()
		.addClass('brightness-slider');

	this.contrastSlider = slider
		.clone()
		.addClass('contrast-slider');

	this.contrastPlusSlider = slider.clone()
		.addClass('contrast-plus-slider')
		.attr({
			min: "1",
			max: "2.5",
			value: "1"
		});

	this.zoomSlider = slider
		.clone()
		.addClass('zoom-slider')
		.attr({
			max: "200",
			min: "50",
			value: "100",
			step: "1"
		});

	var recolorFilterGroup = $('<optgroup label="Colorize" data-max-options="1">')
		.append('<option class="grayscale-option" value="colorize.grayscale">Grayscale</option>')
		.append('<option class="flame-option" value="colorize.flame">Flame</option>')
		.append('<option class="spectrum-option" value="colorize.rainbow">Rainbow</option>')
		.append('<option class="hsv-option" value="colorize.spectrum">Spectrum</option>');

	var advancedFilterGroup = $('<optgroup label="Advanced Filters">')
		.append('<option class="invert-option" value="filter.invert">Invert</option>')
		.append('<option class="difference-option" value="filter.difference">Difference</option>')
		.append('<option class="autoContrast-option" value="filter.autoContrast">Auto Contrast</option>');

	this.filterMenu = $('<select class="dropup" multiple role="menu" title="Filters" data-style="btn-default filter-menu-button">')
		.append(recolorFilterGroup)
		.append(advancedFilterGroup);

	this.contrastPlusMenu = $('<select class="dropup" multiple role="menu" title="C. Stretch" data-style="btn-default contrast-menu-button" data-max-options="1">')
		.append('<option value="shadows">Shadows</option>')
		.append('<option value="midtones">Midtones</option>')
		.append('<option value="highlights">Highlights</option>');

	var brightnessControl = sewi.createVerticalSlider(this.brightnessSlider, this.brightnessButton);
	var contrastControl = sewi.createVerticalSlider(this.contrastSlider, this.contrastButton);
	this.contrastPlusControl = sewi.createVerticalSlider(this.contrastPlusSlider, this.contrastPlusButton).addClass('hidden');
	var zoomControl = sewi.createVerticalSlider(this.zoomSlider, this.zoomButton);

	leftButtonPanel.append(brightnessControl)
		 .append(contrastControl)
		 .append(this.filterMenu)
		 .append(this.contrastPlusMenu)
		 .append(this.contrastPlusControl);

	rightButtonPanel.append(this.zoomToFitButton)
		.append(zoomControl);

	this.mainDOMElement.append(leftButtonPanel)
		.append(rightButtonPanel);

	this.filterMenu.selectpicker({
		countSelectedText: 'Filters',
		selectedTextFormat: 'count > 0',
		width: '75px',
		dropupAuto: false,
	});

	this.contrastPlusMenu.selectpicker({
		selectedTextFormat: 'values',
		width: '95px',
		dropupAuto: false,
	});
}

sewi.ImageControls.prototype.initEvents = function() {
	this.brightnessSlider.on('input', this.brightnessChanged.bind(this));	
	this.contrastSlider.on('input', this.contrastChanged.bind(this));
	this.brightnessButton.on('click', this.brightnessReset.bind(this));
	this.contrastButton.on('click', this.contrastReset.bind(this));
	this.zoomSlider.on('input', this.zoomLevelChanged.bind(this));
	this.zoomButton.on('click', this.zoomLevelReset.bind(this));
	this.zoomToFitButton.on('click', this.zoomToFit.bind(this));
	this.filterMenu.on('change', this.filtersChanged.bind(this));
	this.contrastPlusMenu.on('change', this.contrastPlusMenuSelectionChanged.bind(this));
	this.contrastPlusMenu.on('change', this.filtersChanged.bind(this));
	this.contrastPlusSlider.on('change', this.filtersChanged.bind(this));
}

sewi.ImageControls.prototype.disableTooltips = function() {
	this.mainDOMElement.find(".grayscale-option").tooltip('destroy');
	this.mainDOMElement.find(".flame-option").tooltip('destroy');
	this.mainDOMElement.find(".spectrum-option").tooltip('destroy');
	this.mainDOMElement.find(".hsv-option").tooltip('destroy');
	this.mainDOMElement.find(".difference-option").tooltip('destroy');
	this.mainDOMElement.find(".invert-option").tooltip('destroy');
	this.mainDOMElement.find(".autoContrast-option").tooltip('destroy');
	this.mainDOMElement.find(".contrast-menu-button").tooltip('destroy');
}

sewi.ImageControls.prototype.enableTooltips = function() {
	this.mainDOMElement.find(".grayscale-option").tooltip({
		html: true,
		title: 'Removes color details from the image, forming a grayscale respresentation.<br><img src="' + sewi.staticPath +'images/image_tooltip_grayscale.png" height="100px" width="200px">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".flame-option").tooltip({
		html: true,
		title: 'Artifically colors a grayscale image with the flame color spectrum, where the darker shades are mapped to black and red, and the lighter shades mapped to yellow and white. This filter may highlight hard-to-see shade differences of the original image. Different color spectrum filters will provide different levels of details at different areas of the image.<br><img src="' + sewi.staticPath +'images/image_tooltip_false_color_flame.png" height="100px" width="200px">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".spectrum-option").tooltip({
		html: true,
		title: 'Artifically colors a grayscale image with the colors (largely) from the rainbow spectrum. Darker shades are mapped to blue, while the lighter shades are mapped to red; shades in-between the two extremes are mapped to the respective in-between colors of the rainbow. This filter may highlight hard-to-see shade differences of the original image. Different color spectrum filters will provide different levels of details at different areas of the image.<br><img src="' + sewi.staticPath +'images/image_tooltip_false_color_rainbow.png" height="100px" width="200px">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".hsv-option").tooltip({
		html: true,
		title: 'Artifically colors a grayscale image with the entire color spectrum. This filter may highlight hard-to-see shade differences of the original image. Different color spectrum filters will provide different levels of details at different areas of the image.<br><img src="' + sewi.staticPath +'images/image_tooltip_false_color_spectrum.png" height="100px" width="200px">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".difference-option").tooltip({
		html: true,
		title: 'Produces an image that represents the difference in color intensity between the original and inverted image. Generally this filter improves the contrast of the image.<br><img src="' + sewi.staticPath +'images/image_tooltip_difference.png" height="100px" width="200px">',
		container: $("body"),
		placement: "right"
	});

	this.mainDOMElement.find(".invert-option").tooltip({
		html: true,
		title: 'Inverts the colors of image. Simply stated, on a grayscale image, white becomes black, while black becomes white.<br><img src="' + sewi.staticPath +'images/image_tooltip_invert.png" height="100px" width="200px">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".autoContrast-option").tooltip({
		html: true,
		title: 'Artifically stretches the colors of the image to make use of the entire grayscale spectrum, which intensifies the difference among the various shades of gray, generally improving contrast.<br><img src="' + sewi.staticPath +'images/image_tooltip_histogram_equalization.png" height="100px" width="200px">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".contrast-menu-button").removeAttr("title");
	this.mainDOMElement.find(".contrast-menu-button").tooltip({
		html: true,
		title: '<span class="underline">Contrast Stretching</span><br>This filter artifically stretches the grayscale range of a specific region at the cost of other regions. This improves the constrast for the stretched region, but reduces the constrast for the other regions. The example below stretches the range of the middle region (i.e. mid-shades of grays), while the range of the upper (white/lighter shades of grays) and lower regions (black/darker shades of grays) are compressed. There are 3 regions to choose from, and you may vary the degree of intensity to stretch the range of the region selected.<br><img src="' + sewi.staticPath +'images/image_tooltip_contrast_stretch_middle.png"  height="100px" width="200px">',
		container: "body",
		placement: "top"
	});
}

sewi.ImageControls.prototype.brightnessChanged = function() {
	this.trigger('brightnessChanged', this.brightnessSlider.val());
}

sewi.ImageControls.prototype.contrastChanged = function() {
	this.trigger('contrastChanged', this.contrastSlider.val());
}

sewi.ImageControls.prototype.brightnessReset = function() {
	this.brightnessSlider.val(1);
	this.brightnessChanged();
}

sewi.ImageControls.prototype.contrastReset = function() {
	this.contrastSlider.val(1);
	this.contrastChanged();
}

sewi.ImageControls.prototype.zoomLevelChanged = function() {
	this.trigger('zoomChanged', this.zoomSlider.val());
}

sewi.ImageControls.prototype.zoomLevelReset = function() {
	this.zoomSlider.val(100);
	this.zoomLevelChanged();
}

sewi.ImageControls.prototype.zoomToFit = function() {
	this.trigger('zoomToFitRequested');
}

sewi.ImageControls.prototype.filtersChanged = function() {
	var filterMenuValues = this.filterMenu.val() || [];
	var contrastStretchMenuValues = this.contrastPlusMenu.val() || [];

	var filterSettingsReturnObject = {
		colorize: "none",
		difference: false,
		invert: false,
		autoContrast: false,
		contrastStretchMode: "none",
		contrastStretchValue: 1
	};

	// Figure out colorize
	if(filterMenuValues.length != 0 && filterMenuValues[0].indexOf("colorize.") != -1) {
		filterSettingsReturnObject.colorize = filterMenuValues[0].substr(9); //remove the leading "colorize."
		filterMenuValues.shift();
	}

	// Figure out filters (invert, difference, autoContrast). What's left in the filterMenuValues array should be strings starting with "filter."
	while(filterMenuValues.length != 0) {
		var chosenFilter = filterMenuValues[0].substr(7); //remove the leading "filter."
		filterSettingsReturnObject[chosenFilter] = true;
		filterMenuValues.shift();
	}

	// Figure out the contrast stretch filter
	if (contrastStretchMenuValues.length != 0) {
		filterSettingsReturnObject.contrastStretchMode = contrastStretchMenuValues[0];
		filterSettingsReturnObject.contrastStretchValue = parseFloat(this.contrastPlusSlider.val());
	}

	// Ensure that at least grayscale is selected when Auto Contrast or Contrast Stretch is used
	// (false-colors - e.g. flame - are implicitly grayscale, so they satisfy the condition)
	if (filterSettingsReturnObject.colorize === "none" && 
		(filterSettingsReturnObject.autoContrast || filterSettingsReturnObject.contrastStretchMode !== "none")) {
		filterSettingsReturnObject.colorize = "grayscale";

		// Propagate the changes to the UI
		var newFilterMenuValues = this.filterMenu.val();
		newFilterMenuValues.unshift("colorize.grayscale");
		this.filterMenu.selectpicker('val', newFilterMenuValues);
	}

	this.trigger('filtersChanged', filterSettingsReturnObject);
}

sewi.ImageControls.prototype.contrastPlusMenuSelectionChanged = function() {
	var value = this.contrastPlusMenu.val();
	if (value != null) {
		this.contrastPlusControl.removeClass('hidden');
		this.mainDOMElement.find('.contrast-menu-button')
			.addClass('option-selected');
	}
	else {
		this.mainDOMElement.find('.contrast-menu-button')
			.removeClass('option-selected');
		this.contrastPlusControl.addClass('hidden');
	}
}

sewi.ImageControls.prototype.updateZoomControlValue = function(options) {
	options = options || {};

	if (!_.isUndefined(options.zoomSettings)) {
		this.zoomSlider.attr({
			max: options.zoomSettings.max,
			min: options.zoomSettings.min,
		});
	}

	if (!_.isUndefined(options.zoomLevel)) {
		this.zoomSlider.val(options.zoomLevel);
	}
}