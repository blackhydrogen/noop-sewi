var sewi = sewi || {};

sewi.ImageResourceViewer = function() {
	var selfref = this;

	var falseColorPalette = {
		fire: {
			name: "Fire",
			values: [[3, 0, 0], [5, 0, 0], [5, 0, 0], [8, 0, 0], [8, 0, 0], [11, 0, 0], [11, 0, 0], [13, 0, 0], [13, 0, 0], [16, 0, 0], [19, 0, 0], [19, 0, 0], [21, 0, 0], [21, 0, 0], [24, 0, 0], [27, 0, 0], [27, 0, 0], [29, 0, 0], [32, 0, 0], [32, 0, 0], [35, 0, 0], [37, 0, 0], [40, 0, 0], [40, 0, 0], [43, 0, 0], [45, 0, 0], [48, 0, 0], [48, 0, 0], [50, 0, 0], [53, 0, 0], [56, 0, 0], [58, 0, 0], [58, 0, 0], [61, 0, 0], [64, 0, 0], [66, 0, 0], [69, 0, 0], [72, 0, 0], [74, 0, 0], [74, 0, 0], [77, 0, 0], [80, 0, 0], [82, 0, 0], [85, 0, 0], [88, 0, 0], [90, 0, 0], [93, 0, 0], [96, 0, 0], [98, 0, 0], [101, 0, 0], [104, 0, 0], [106, 0, 0], [109, 0, 0], [112, 0, 0], [114, 0, 0], [117, 0, 0], [120, 0, 0], [122, 0, 0], [125, 0, 0], [128, 0, 0], [130, 0, 0], [133, 0, 0], [135, 0, 0], [138, 0, 0], [141, 0, 0], [143, 0, 0], [146, 0, 0], [149, 0, 0], [151, 0, 0], [154, 0, 0], [157, 0, 0], [159, 0, 0], [162, 0, 0], [167, 0, 0], [170, 0, 0], [173, 0, 0], [175, 0, 0], [178, 0, 0], [181, 0, 0], [183, 0, 0], [186, 0, 0], [191, 0, 0], [194, 0, 0], [197, 0, 0], [199, 0, 0], [202, 0, 0], [205, 0, 0], [207, 0, 0], [213, 0, 0], [215, 0, 0], [218, 0, 0], [220, 0, 0], [223, 0, 0], [228, 0, 0], [231, 0, 0], [234, 0, 0], [236, 0, 0], [239, 0, 0], [244, 0, 0], [247, 0, 0], [250, 0, 0], [252, 0, 0], [255, 0, 0], [255, 5, 0], [255, 8, 0], [255, 11, 0], [255, 13, 0], [255, 16, 0], [255, 21, 0], [255, 24, 0], [255, 27, 0], [255, 29, 0], [255, 35, 0], [255, 37, 0], [255, 40, 0], [255, 43, 0], [255, 48, 0], [255, 50, 0], [255, 53, 0], [255, 56, 0], [255, 61, 0], [255, 64, 0], [255, 66, 0], [255, 69, 0], [255, 74, 0], [255, 77, 0], [255, 80, 0], [255, 82, 0], [255, 88, 0], [255, 90, 0], [255, 93, 0], [255, 96, 0], [255, 98, 0], [255, 104, 0], [255, 106, 0], [255, 109, 0], [255, 112, 0], [255, 117, 0], [255, 120, 0], [255, 122, 0], [255, 125, 0], [255, 130, 0], [255, 133, 0], [255, 135, 0], [255, 138, 0], [255, 143, 0], [255, 146, 0], [255, 149, 0], [255, 151, 0], [255, 157, 0], [255, 159, 0], [255, 162, 0], [255, 165, 0], [255, 167, 0], [255, 173, 0], [255, 175, 0], [255, 178, 0], [255, 181, 0], [255, 183, 0], [255, 189, 0], [255, 191, 0], [255, 194, 0], [255, 197, 0], [255, 199, 0], [255, 205, 0], [255, 207, 0], [255, 210, 0], [255, 213, 0], [255, 215, 0], [255, 220, 0], [255, 223, 0], [255, 226, 0], [255, 228, 0], [255, 231, 0], [255, 234, 0], [255, 236, 0], [255, 242, 0], [255, 244, 0], [255, 247, 0], [255, 250, 0], [255, 252, 0], [255, 255, 0], [255, 255, 4], [255, 255, 8], [255, 255, 16], [255, 255, 20], [255, 255, 24], [255, 255, 28], [255, 255, 32], [255, 255, 36], [255, 255, 40], [255, 255, 44], [255, 255, 48], [255, 255, 52], [255, 255, 56], [255, 255, 60], [255, 255, 64], [255, 255, 68], [255, 255, 72], [255, 255, 76], [255, 255, 80], [255, 255, 84], [255, 255, 88], [255, 255, 92], [255, 255, 96], [255, 255, 100], [255, 255, 104], [255, 255, 108], [255, 255, 112], [255, 255, 116], [255, 255, 120], [255, 255, 124], [255, 255, 128], [255, 255, 131], [255, 255, 135], [255, 255, 139], [255, 255, 143], [255, 255, 147], [255, 255, 147], [255, 255, 151], [255, 255, 155], [255, 255, 159], [255, 255, 163], [255, 255, 167], [255, 255, 171], [255, 255, 171], [255, 255, 175], [255, 255, 179], [255, 255, 183], [255, 255, 187], [255, 255, 187], [255, 255, 191], [255, 255, 195], [255, 255, 199], [255, 255, 199], [255, 255, 203], [255, 255, 207], [255, 255, 211], [255, 255, 211], [255, 255, 215], [255, 255, 219], [255, 255, 219], [255, 255, 223], [255, 255, 227], [255, 255, 227], [255, 255, 231], [255, 255, 231], [255, 255, 235], [255, 255, 239], [255, 255, 239], [255, 255, 243], [255, 255, 243], [255, 255, 247], [255, 255, 247], [255, 255, 251], [255, 255, 251]]},
		spectrum: {
			name: "Spectrum",
			values: [[0, 0, 131], [0, 0, 135], [0, 0, 135], [0, 0, 139], [0, 0, 139], [0, 0, 143], [0, 0, 143], [0, 0, 147], [0, 0, 147], [0, 0, 151], [0, 0, 155], [0, 0, 155], [0, 0, 159], [0, 0, 159], [0, 0, 163], [0, 0, 167], [0, 0, 167], [0, 0, 171], [0, 0, 175], [0, 0, 175], [0, 0, 179], [0, 0, 183], [0, 0, 187], [0, 0, 187], [0, 0, 191], [0, 0, 195], [0, 0, 199], [0, 0, 199], [0, 0, 203], [0, 0, 207], [0, 0, 211], [0, 0, 215], [0, 0, 215], [0, 0, 219], [0, 0, 223], [0, 0, 227], [0, 0, 231], [0, 0, 235], [0, 0, 239], [0, 0, 239], [0, 0, 243], [0, 0, 247], [0, 0, 251], [0, 0, 255], [0, 4, 255], [0, 8, 255], [0, 12, 255], [0, 16, 255], [0, 20, 255], [0, 24, 255], [0, 28, 255], [0, 32, 255], [0, 36, 255], [0, 40, 255], [0, 44, 255], [0, 48, 255], [0, 52, 255], [0, 56, 255], [0, 60, 255], [0, 64, 255], [0, 68, 255], [0, 72, 255], [0, 76, 255], [0, 80, 255], [0, 84, 255], [0, 88, 255], [0, 92, 255], [0, 96, 255], [0, 100, 255], [0, 104, 255], [0, 108, 255], [0, 112, 255], [0, 116, 255], [0, 124, 255], [0, 128, 255], [0, 131, 255], [0, 135, 255], [0, 139, 255], [0, 143, 255], [0, 147, 255], [0, 151, 255], [0, 159, 255], [0, 163, 255], [0, 167, 255], [0, 171, 255], [0, 175, 255], [0, 179, 255], [0, 183, 255], [0, 191, 255], [0, 195, 255], [0, 199, 255], [0, 203, 255], [0, 207, 255], [0, 215, 255], [0, 219, 255], [0, 223, 255], [0, 227, 255], [0, 231, 255], [0, 239, 255], [0, 243, 255], [0, 247, 255], [0, 251, 255], [0, 255, 255], [8, 255, 247], [12, 255, 243], [16, 255, 239], [20, 255, 235], [24, 255, 231], [32, 255, 223], [36, 255, 219], [40, 255, 215], [44, 255, 211], [52, 255, 203], [56, 255, 199], [60, 255, 195], [64, 255, 191], [72, 255, 183], [76, 255, 179], [80, 255, 175], [84, 255, 171], [92, 255, 163], [96, 255, 159], [100, 255, 155], [104, 255, 151], [112, 255, 143], [116, 255, 139], [120, 255, 135], [124, 255, 131], [131, 255, 124], [135, 255, 120], [139, 255, 116], [143, 255, 112], [147, 255, 108], [155, 255, 100], [159, 255, 96], [163, 255, 92], [167, 255, 88], [175, 255, 80], [179, 255, 76], [183, 255, 72], [187, 255, 68], [195, 255, 60], [199, 255, 56], [203, 255, 52], [207, 255, 48], [215, 255, 40], [219, 255, 36], [223, 255, 32], [227, 255, 28], [235, 255, 20], [239, 255, 16], [243, 255, 12], [247, 255, 8], [251, 255, 4], [255, 251, 0], [255, 247, 0], [255, 243, 0], [255, 239, 0], [255, 235, 0], [255, 227, 0], [255, 223, 0], [255, 219, 0], [255, 215, 0], [255, 211, 0], [255, 203, 0], [255, 199, 0], [255, 195, 0], [255, 191, 0], [255, 187, 0], [255, 179, 0], [255, 175, 0], [255, 171, 0], [255, 167, 0], [255, 163, 0], [255, 159, 0], [255, 155, 0], [255, 147, 0], [255, 143, 0], [255, 139, 0], [255, 135, 0], [255, 131, 0], [255, 128, 0], [255, 124, 0], [255, 120, 0], [255, 112, 0], [255, 108, 0], [255, 104, 0], [255, 100, 0], [255, 96, 0], [255, 92, 0], [255, 88, 0], [255, 84, 0], [255, 80, 0], [255, 76, 0], [255, 72, 0], [255, 68, 0], [255, 64, 0], [255, 60, 0], [255, 56, 0], [255, 52, 0], [255, 48, 0], [255, 44, 0], [255, 40, 0], [255, 36, 0], [255, 32, 0], [255, 28, 0], [255, 24, 0], [255, 20, 0], [255, 16, 0], [255, 12, 0], [255, 8, 0], [255, 4, 0], [255, 0, 0], [251, 0, 0], [247, 0, 0], [243, 0, 0], [239, 0, 0], [235, 0, 0], [235, 0, 0], [231, 0, 0], [227, 0, 0], [223, 0, 0], [219, 0, 0], [215, 0, 0], [211, 0, 0], [211, 0, 0], [207, 0, 0], [203, 0, 0], [199, 0, 0], [195, 0, 0], [195, 0, 0], [191, 0, 0], [187, 0, 0], [183, 0, 0], [183, 0, 0], [179, 0, 0], [175, 0, 0], [171, 0, 0], [171, 0, 0], [167, 0, 0], [163, 0, 0], [163, 0, 0], [159, 0, 0], [155, 0, 0], [155, 0, 0], [151, 0, 0], [151, 0, 0], [147, 0, 0], [143, 0, 0], [143, 0, 0], [139, 0, 0], [139, 0, 0], [135, 0, 0], [135, 0, 0], [131, 0, 0], [131, 0, 0]]},
		hsv: {
			name: "HSV",
			values: [[255, 0, 0], [255, 6, 0], [255, 6, 0], [255, 12, 0], [255, 12, 0], [255, 18, 0], [255, 18, 0], [255, 24, 0], [255, 24, 0], [255, 30, 0], [255, 36, 0], [255, 36, 0], [255, 42, 0], [255, 42, 0], [255, 48, 0], [255, 54, 0], [255, 54, 0], [255, 60, 0], [255, 66, 0], [255, 66, 0], [255, 72, 0], [255, 78, 0], [255, 84, 0], [255, 84, 0], [255, 90, 0], [255, 96, 0], [255, 102, 0], [255, 102, 0], [255, 108, 0], [255, 114, 0], [255, 120, 0], [255, 126, 0], [255, 126, 0], [255, 131, 0], [255, 137, 0], [255, 143, 0], [255, 149, 0], [255, 155, 0], [255, 161, 0], [255, 161, 0], [255, 167, 0], [255, 173, 0], [255, 179, 0], [255, 185, 0], [255, 191, 0], [255, 197, 0], [255, 203, 0], [255, 209, 0], [255, 215, 0], [255, 221, 0], [255, 227, 0], [255, 233, 0], [255, 239, 0], [255, 245, 0], [255, 251, 0], [253, 255, 0], [247, 255, 0], [241, 255, 0], [235, 255, 0], [229, 255, 0], [223, 255, 0], [217, 255, 0], [211, 255, 0], [205, 255, 0], [199, 255, 0], [193, 255, 0], [187, 255, 0], [181, 255, 0], [175, 255, 0], [169, 255, 0], [163, 255, 0], [157, 255, 0], [151, 255, 0], [139, 255, 0], [133, 255, 0], [128, 255, 0], [122, 255, 0], [116, 255, 0], [110, 255, 0], [104, 255, 0], [98, 255, 0], [86, 255, 0], [80, 255, 0], [74, 255, 0], [68, 255, 0], [62, 255, 0], [56, 255, 0], [50, 255, 0], [38, 255, 0], [32, 255, 0], [26, 255, 0], [20, 255, 0], [14, 255, 0], [2, 255, 0], [0, 255, 4], [0, 255, 10], [0, 255, 16], [0, 255, 22], [0, 255, 34], [0, 255, 40], [0, 255, 46], [0, 255, 52], [0, 255, 58], [0, 255, 70], [0, 255, 76], [0, 255, 82], [0, 255, 88], [0, 255, 94], [0, 255, 106], [0, 255, 112], [0, 255, 118], [0, 255, 124], [0, 255, 135], [0, 255, 141], [0, 255, 147], [0, 255, 153], [0, 255, 165], [0, 255, 171], [0, 255, 177], [0, 255, 183], [0, 255, 195], [0, 255, 201], [0, 255, 207], [0, 255, 213], [0, 255, 225], [0, 255, 231], [0, 255, 237], [0, 255, 243], [0, 255, 255], [0, 249, 255], [0, 243, 255], [0, 237, 255], [0, 231, 255], [0, 219, 255], [0, 213, 255], [0, 207, 255], [0, 201, 255], [0, 189, 255], [0, 183, 255], [0, 177, 255], [0, 171, 255], [0, 159, 255], [0, 153, 255], [0, 147, 255], [0, 141, 255], [0, 129, 255], [0, 124, 255], [0, 118, 255], [0, 112, 255], [0, 100, 255], [0, 94, 255], [0, 88, 255], [0, 82, 255], [0, 76, 255], [0, 64, 255], [0, 58, 255], [0, 52, 255], [0, 46, 255], [0, 40, 255], [0, 28, 255], [0, 22, 255], [0, 16, 255], [0, 10, 255], [0, 4, 255], [8, 0, 255], [14, 0, 255], [20, 0, 255], [26, 0, 255], [32, 0, 255], [44, 0, 255], [50, 0, 255], [56, 0, 255], [62, 0, 255], [68, 0, 255], [74, 0, 255], [80, 0, 255], [92, 0, 255], [98, 0, 255], [104, 0, 255], [110, 0, 255], [116, 0, 255], [122, 0, 255], [128, 0, 255], [133, 0, 255], [145, 0, 255], [151, 0, 255], [157, 0, 255], [163, 0, 255], [169, 0, 255], [175, 0, 255], [181, 0, 255], [187, 0, 255], [193, 0, 255], [199, 0, 255], [205, 0, 255], [211, 0, 255], [217, 0, 255], [223, 0, 255], [229, 0, 255], [235, 0, 255], [241, 0, 255], [247, 0, 255], [253, 0, 255], [255, 0, 251], [255, 0, 245], [255, 0, 239], [255, 0, 233], [255, 0, 227], [255, 0, 221], [255, 0, 215], [255, 0, 209], [255, 0, 203], [255, 0, 197], [255, 0, 191], [255, 0, 185], [255, 0, 179], [255, 0, 173], [255, 0, 167], [255, 0, 167], [255, 0, 161], [255, 0, 155], [255, 0, 149], [255, 0, 143], [255, 0, 137], [255, 0, 131], [255, 0, 131], [255, 0, 126], [255, 0, 120], [255, 0, 114], [255, 0, 108], [255, 0, 108], [255, 0, 102], [255, 0, 96], [255, 0, 90], [255, 0, 90], [255, 0, 84], [255, 0, 78], [255, 0, 72], [255, 0, 72], [255, 0, 66], [255, 0, 60], [255, 0, 60], [255, 0, 54], [255, 0, 48], [255, 0, 48], [255, 0, 42], [255, 0, 42], [255, 0, 36], [255, 0, 30], [255, 0, 30], [255, 0, 24], [255, 0, 24], [255, 0, 18], [255, 0, 18], [255, 0, 12], [255, 0, 12]]}
	};

	var setupFalseColorControl = function(selectComponent) {
		var capitalizeFirstCharacter = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		$('<option value="">(None)</option>')
			.appendTo(selectComponent);

		for(var i in falseColorPalette) {
			$('<option value="' + i + '">' + falseColorPalette[i].name + '</option>')
			.appendTo(selectComponent);
		}
	};

	var mainContainer = $('<div class="image-resource-container"></div>');
		var imageContainer = $('<div class="image-resource-image-container"></div>')
		.appendTo(mainContainer);
			var imageElement = $('<img src="sfc.png" class="image-resource-image">')
			.appendTo(imageContainer);
		var controlsContainer = $('<div class="image-resource-control-panel animated"></div>')
		.appendTo(mainContainer);
			var brightnessControlContainer = $('<div class="image-resource-control"></div>')
			.appendTo(controlsContainer)
			.html('Brightness<br>');
				var brightnessControl = $('<input type="range" class="image-resource-brightness" min="0" max="2" step="0.1">')
				.appendTo(brightnessControlContainer);
			var contrastControlContainer = $('<div class="image-resource-control"></div>')
			.appendTo(controlsContainer)
			.html('Contrast<br>');
				var contrastControl = $('<input type="range" class="image-resource-contrast" min="0" max="2" step="0.1">')
				.appendTo(contrastControlContainer);
			var invertControlContainer = $('<div class="image-resource-control"></div>')
			.appendTo(controlsContainer)
				var invertControlLabel = $('<label>Invert</label>')
				.appendTo(invertControlContainer);
					var invertControl = $('<input type="checkbox" class="image-resource-invert">')
					.prependTo(invertControlLabel);
			var differenceControlContainer = $('<div class="image-resource-control"></div>')
			.appendTo(controlsContainer)
				var differenceControlLabel = $('<label>Difference</label>')
				.appendTo(differenceControlContainer);
					var differenceControl = $('<input type="checkbox" class="image-resource-difference">')
					.prependTo(differenceControlLabel);
			var grayscaleControlContainer = $('<div class="image-resource-control"></div>')
			.appendTo(controlsContainer)
				var grayscaleControlLabel = $('<label>Grayscale</label>')
				.appendTo(grayscaleControlContainer);
					var grayscaleControl = $('<input type="checkbox" class="image-resource-grayscale">')
					.prependTo(grayscaleControlLabel);
			var falseColorControlContainer = $('<div class="image-resource-control"></div>')
			.appendTo(controlsContainer)
			.html("False Color<br>")
				var falseColorControl = $('<select class="image-resource-false-color"></select>')
				.appendTo(falseColorControlContainer);
					setupFalseColorControl(falseColorControl);
			var zoomControlContainer = $('<div class="image-resource-control"></div>')
			.appendTo(controlsContainer)
			.html('Zoom<br>');
				var zoomControl = $('<input type="number" class="image-resource-zoom" min="10" max="200" step="10">')
				.appendTo(zoomControlContainer);
				$('<span>%</span>')
				.appendTo(zoomControlContainer)
				var zoom100PercentButton = $('<input type="button" class="image-resource-zoom-100" value="100%">')
				.appendTo(zoomControlContainer);
				var zoomFitButton = $('<input type="button" class="image-resource-zoom-fit" value="Fit">')
				.appendTo(zoomControlContainer);
			var resetControlContainer = $('<div class="image-resource-control"></div>')
			.appendTo(controlsContainer);
				var resetControl = $('<input type="button" value="Reset" class="image-resource-reset-button">')
				.appendTo(resetControlContainer);
		var showHideControlsButton = $('<input type="button" value="Hide Controls" class="image-resource-show-hide-button">')
		.appendTo(mainContainer);

	var imageProperties = {
		original: {},
		fit: {},
		minZoom: {},
		maxZoom: {}
	};

	var imageMovementVariables = {
	};

	selfref.getDOM = function() {
		return mainContainer;
	};

	selfref.load = function() {

		brightnessControl.on("input", adjustImageFilters);
		contrastControl.on("input", adjustImageFilters);
		invertControl.on("change", adjustImageFilters);
		differenceControl.on("change", updateCustomFilters);
		grayscaleControl.on("change", updateCustomFilters);
		falseColorControl.on("change", updateCustomFilters);
		zoomControl.on("change", calculateImageZoomFromZoomControl);
		zoom100PercentButton.on("click", function() {
			executeZoomImage(imageProperties.original.width, 0, 0);
			centreImageOnCanvas();
		});
		zoomFitButton.on("click", setImageZoomToFit);

		resetControl.on("click", function() {
			brightnessControl.val(1);
			contrastControl.val(1);
			invertControl.prop("checked", false);
			differenceControl.prop("checked", false);
			grayscaleControl.prop("checked", false);
			falseColorControl.val("");
			updateCustomFilters();
			adjustImageFilters();
			setImageZoomToFit();
		})

		showHideControlsButton.on("click", function() {
			if($(this).val() == "Hide Controls") {
				controlsContainer.css("bottom", -controlsContainer.height());
				$(this).val("Show Controls");
			}
			else {
				controlsContainer.css("bottom", 0);
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

			$("body").one("mouseup", function(event) {
				imageContainer.on("mousewheel", calculateImageZoomFromMousewheel);
				$("body").unbind("mousemove", moveImageToCursor);
			});
			
		});

		imageElement.one("load", function() {
			setImageProperties();
			setImageZoomToFit();
		});
		
	};

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
		//Figure out new width
		var zoomChange = 1 + 0.2 * event.originalEvent.wheelDelta / 120;
		var newImageWidth = imageElement.width() * zoomChange;

		executeZoomImage(newImageWidth, event.clientX, event.clientY);

		return false;
	}

	function executeZoomImage(newImageWidth, centreOnX, centreOnY) {
		if(newImageWidth < imageProperties.minZoom.width) {
			newImageWidth = imageProperties.minZoom.width;
		}
		else if(newImageWidth > imageProperties.maxZoom.width) {
			newImageWidth = imageProperties.maxZoom.width;
		}

		// Figure out where to centre image after resizing based on centreOnX, centreOnY

		// Where, in pixels, inside the image is the centre (relative to the image)
		var imageX = centreOnX - imageElement.position().left;
		var imageY = centreOnY - imageElement.position().top

		// TODO add condition, if imageX or imageY is out image coordinates, then centre on centre of imageContainer

		var imageRatioX = imageX / imageElement.width();
		var imageRatioY = imageY / imageElement.height();

		imageElement.width( newImageWidth );

		var newImageX = centreOnX - imageRatioX * imageElement.width();
		var newImageY = centreOnY - imageRatioY * imageElement.height();

		imageElement.css({
			top: newImageY,
			left: newImageX
		});

		zoomControl.val( Math.floor(imageElement.width() / imageProperties.original.width * 100) );
	}

	function calculateImageZoomFromZoomControl() {
		var newImageWidth = imageProperties.original.width * zoomControl.val() / 100;

		executeZoomImage(newImageWidth, imageContainer.width() / 2, imageContainer.height() / 2);
	}

	function setImageZoomToFit() {
		executeZoomImage(imageProperties.fit.width, 0, 0);
		centreImageOnCanvas();
	}

	function centreImageOnCanvas() {
		imageElement.css({
			top: (imageContainer.height() - imageElement.height()) / 2,
			left: (imageContainer.width() - imageElement.width()) / 2
		});
	}

	function setImageProperties() {
		imageProperties.original.width = imageElement.prop("naturalWidth");
		imageProperties.original.height = imageElement.prop("naturalHeight");
		imageProperties.original.url = imageElement.prop("src");

		//Compute fit sizes
		var originalWidth = imageElement.prop("naturalWidth");
		var originalHeight = imageElement.prop("naturalHeight");
		var containerWidth = imageContainer.width();
		var containerHeight = imageContainer.height();

		if(originalWidth <= containerWidth) {
			if(originalHeight <= containerHeight) {
				imageProperties.fit.width = originalWidth;
				imageProperties.fit.height = originalHeight;
			}
			else {
				imageProperties.fit.width = originalWidth * containerHeight / originalHeight;
				imageProperties.fit.height = containerHeight;
			}
		}
		else {
			if(originalHeight <= containerHeight) {
				imageProperties.fit.width = containerWidth;
				imageProperties.fit.height = originalHeight * containerWidth / originalWidth;
			}
			else {
				var adjustedWidth = originalWidth * containerHeight / originalHeight;

				if(adjustedWidth <= containerWidth) {
					imageProperties.fit.width = adjustedWidth;
					imageProperties.fit.height = originalHeight * adjustedWidth / originalWidth;
				}
				else {
					imageProperties.fit.width = containerWidth;
					imageProperties.fit.height = originalHeight * containerWidth / originalWidth;
				}
			}
		}
		// End Compute fit sizes

		imageProperties.minZoom.width = imageProperties.fit.width / 2;
		imageProperties.minZoom.height = imageProperties.fit.height / 2;

		imageProperties.maxZoom.width = imageProperties.original.width * 2;
		imageProperties.maxZoom.height = imageProperties.original.height * 2;
	}

	function updateCustomFilters() {
		var t1 = new Date().getTime();
		var t2;

		var toApplyGrayscaleFilter = grayscaleControl.prop("checked") == 1;
		var toApplyDifferenceFilter = differenceControl.prop("checked") == 1;
		var toApplyHistogramEqualizationFilter = false; //histogramEqualizationControl.prop("checked") == 1;
		var toApplyFalseColorFilter = falseColorControl.children(":selected").val() != "";

		if(toApplyGrayscaleFilter
			|| toApplyDifferenceFilter
			|| toApplyHistogramEqualizationFilter
			|| toApplyFalseColorFilter) {
			canvasElement = $("<canvas></canvas>")
			.prop("width", imageProperties.original.width)
			.prop("height", imageProperties.original.height);

			var originalImage = $("<img>").prop("src", imageProperties.original.url);

			canvasElement[0].getContext("2d").drawImage(originalImage[0], 0, 0, imageProperties.original.width, imageProperties.original.height);

			t2 = new Date().getTime(); console.log("WRITE IMG TO CANVAS TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

			var canvasData = canvasElement[0].getContext("2d").getImageData(0, 0, imageProperties.original.width, imageProperties.original.height);

			t2 = new Date().getTime(); console.log("GET CANVAS DATA TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

			if(toApplyHistogramEqualizationFilter
				|| toApplyFalseColorFilter) {
				toApplyGrayscaleFilter = true;
				grayscaleControl.prop("checked", 1);
			}

			if(toApplyGrayscaleFilter) {
				applyGrayscaleFilterToPixelData(canvasData.data);
			}
			if(toApplyDifferenceFilter) {
				applyDifferenceFilterToPixelData(canvasData.data);
			}
			if(toApplyHistogramEqualizationFilter) {
				applyHistogramEqualizationFilterToPixelData(canvasData.data);
			}
			if(toApplyFalseColorFilter) {
				applyFalseColorFilterToPixelData(canvasData.data, falseColorControl.children(":selected").val());
			}
			
			t2 = new Date().getTime(); console.log("APPLY FILTER TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

			canvasElement[0].getContext("2d").putImageData(canvasData, 0, 0);

			t2 = new Date().getTime(); console.log("WRITE-BACK DATA TO CANVAS TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

			imageElement.prop("src", canvasElement[0].toDataURL("image/jpeg", 0.9));
			//imageElement.prop("src", canvasElement[0].toDataURL("image/png"));

			t2 = new Date().getTime(); console.log("CANVAS TO IMG CONVERSION TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG
		}
		else {
			imageElement.prop("src", imageProperties.original.url);
		}

		console.log("=== END OF REPORT ===") // DEBUG
		console.log("");
	}

	function applyGrayscaleFilterToPixelData(pixelData) {
		for(var i = 0; i < pixelData.length; i += 4) {
			// Luminosity method: 0.21 R + 0.72 G + 0.07 B
			var newColor = Math.round(0.21 * pixelData[i] + 0.72 * pixelData[i+1] + 0.07 * pixelData[i+2]);
			pixelData[i] = newColor;
			pixelData[i+1] = newColor;
			pixelData[i+2] = newColor;
		}
	}

	function applyDifferenceFilterToPixelData(pixelData) {
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

	// function applyHistogramEqualizationFilterToPixelData(pixelData) {
	// 	// Assumption: image is in grayscale.
	// 	var colorCount = new Array(256);
	// 	for(var i = 0; i < 256; i++) {
	// 		colorCount[i] = 0;
	// 	}

	// 	for(var i = 0; i < pixelData.length; i += 4) {
	// 		colorCount[pixelData[i]]++;
	// 	}

	// 	console.log(colorCount);
	// }

	// function applyContrastStretchFilterToPixelData(pixelData) {
	// 	// Assumption: image is in grayscale.
	// }

	function applyFalseColorFilterToPixelData(pixelData, chosenFalseColorPalette) {
		// Assumption: image is in grayscale.

		var falseColorPaletteToUse = falseColorPalette[chosenFalseColorPalette]["values"];

		for(var i = 0; i < pixelData.length; i += 4) {
			var falseColorToUse = falseColorPaletteToUse[pixelData[i]];

			pixelData[i] = falseColorToUse[0];
			pixelData[i+1] = falseColorToUse[1];
			pixelData[i+2] = falseColorToUse[2];
		}
	}

	function adjustImageFilters() {
		imageElement.css("-webkit-filter",
				"brightness(" + brightnessControl.val() + ")"
				+ "contrast(" + contrastControl.val() + ")"
				+ "invert(" + (invertControl.prop("checked") ? 1 : 0) + ")");
	}
};

sewi.inherits(sewi.ImageResourceViewer, sewi.ConfiguratorElement);