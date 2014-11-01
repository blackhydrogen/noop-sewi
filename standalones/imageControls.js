sewi.ImageControls = function(options) {
	// Safeguard if function is called without `new` keyword
	if (!(this instanceof sewi.ImageControls))
		return new sewi.ImageControls();

	sewi.ConfiguratorElement.call(this);

	this.initDOM();
	this.initEvents();
	this.initTooltips();
};

sewi.inherits(sewi.ImageControls, sewi.ConfiguratorElement);

// ImageControls private methods begin
sewi.ImageControls.prototype.initDOM = function() {
	this.mainDOMElement.addClass('image-control-panel');

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
		.append('<span class="glyphicon glyphicon-asterisk">');

	this.contrastButton = button
		.clone()
		.addClass('contrast-button')
		.append('<span class="glyphicon glyphicon-adjust">');

	this.contrastPlusButton = button
		.clone()
		.addClass('contrast-plus-button')
		.append('<span class="glyphicon glyphicon-tasks">');

	this.zoomButton = button
		.clone()
		.addClass('zoom-button')
		.append('<span class="glyphicon glyphicon-zoom-in">');

	this.zoomToFitButton = button
		.clone()
		.addClass('fit-button')
		.append('<span class="glyphicon glyphicon-search">');

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

sewi.ImageControls.prototype.initTooltips = function() {
	this.mainDOMElement.find(".grayscale-option").tooltip({
		html: true,
		title: 'Removes color details from the image, forming a grayscale respresentation.<br><img src="tooltip_grayscale.png" height="100px" width="200px">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".flame-option").tooltip({
		html: true,
		title: 'Artifically colors a grayscale image with the flame color spectrum, where the darker shades are mapped to black and red, and the lighter shades mapped to yellow and white. This filter may highlight hard-to-see shade differences of the original image. Different color spectrum filters will provide different levels of details at different areas of the image.<br><img src="tooltip_false_color_flame.png" height="100px" width="200px">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".spectrum-option").tooltip({
		html: true,
		title: 'Artifically colors a grayscale image with the colors (largely) from the rainbow spectrum. Darker shades are mapped to blue, while the lighter shades are mapped to red; shades in-between the two extremes are mapped to the respective in-between colors of the rainbow. This filter may highlight hard-to-see shade differences of the original image. Different color spectrum filters will provide different levels of details at different areas of the image.<br><img src="tooltip_false_color_spectrum.png" height="100px" width="200px">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".hsv-option").tooltip({
		html: true,
		title: 'Artifically colors a grayscale image with the entire color spectrum. This filter may highlight hard-to-see shade differences of the original image. Different color spectrum filters will provide different levels of details at different areas of the image.<br><img src="tooltip_false_color_hsv.png" height="100px" width="200px">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".difference-option").tooltip({
		html: true,
		title: 'Produces an image that represents the difference in color intensity between the original and inverted image. Generally this filter improves the contrast of the image.<br><img src="tooltip_difference.png" height="100px" width="200px">',
		container: $("body"),
		placement: "right"
	});

	this.mainDOMElement.find(".invert-option").tooltip({
		html: true,
		title: 'Inverts the colors of image. Simply stated, on a grayscale image, white becomes black, while black becomes white.<br><img src="tooltip_invert.png" height="100px" width="200px">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".autoContrast-option").tooltip({
		html: true,
		title: 'Artifically stretches the colors of the image to make use of the entire grayscale spectrum, which intensifies the difference among the various shades of gray, generally improving contrast.<br><img src="tooltip_histogram_equalization.png" height="100px" width="200px">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".contrast-menu-button").removeAttr("title");
	this.mainDOMElement.find(".contrast-menu-button").tooltip({
		html: true,
		title: 'Artifically stretches the grayscale range of a specific region at the cost of other regions. This improves the constrast for the stretched region, but reduces the constrast for the other regions. The example below stretches the range of the middle region (i.e. mid-shades of grays), while the range of the upper (white/lighter shades of grays) and lower regions (black/darker shades of grays) are compressed. There are 3 regions to choose from, and you may vary the degree of intensity to stretch the range of the region selected.<br><img src="tooltip_contrast_stretch_middle.png"  height="100px" width="200px">',
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

sewi.ImageControls.prototype.update = function(options) {
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