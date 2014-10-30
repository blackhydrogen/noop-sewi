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
		.append('<option class="grayscale-option" value="1.1">Grayscale</option>')
		.append('<option class="flame-option" value="1.2">Flame</option>')
		.append('<option class="spectrum-option" value="1.3">Spectrum</option>')
		.append('<option class="hsv-option" value="1.4">HSV</option>');

	var advancedFilterGroup = $('<optgroup label="Advanced Filters">')
		.append('<option class="invert-option" value="2.1">Invert</option>')
		.append('<option class="difference-option" value="2.2">Difference</option>')
		.append('<option class="autoContrast-option" value="2.3">Auto Contrast</option>');

	this.filterMenu = $('<select class="dropup" multiple role="menu" title="Filters" data-style="btn-default filter-menu-button">')
		.append(recolorFilterGroup)
		.append(advancedFilterGroup);

	this.contrastPlusMenu = $('<select class="dropup" multiple role="menu" title="Stretch" data-style="btn-default contrast-menu-button" data-max-options="1">')
		.append('<option value="1">Shadows</option>')
		.append('<option value="2">Midtones</option>')
		.append('<option value="3">Highlights</option>');

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

	this.mainDOMElement.find('button').tooltip();
}

sewi.ImageControls.prototype.initEvents = function() {
	this.brightnessSlider.on('input', this.brightnessChanged.bind(this));	
	this.contrastSlider.on('input', this.contrastChanged.bind(this));
	this.brightnessButton.click(this.brightnessReset.bind(this));
	this.contrastButton.click(this.contrastReset.bind(this));
	this.zoomSlider.on('input', this.zoomLevelChanged.bind(this));
	this.zoomButton.click(this.zoomLevelReset.bind(this));
	this.zoomToFitButton.click(this.zoomToFit.bind(this));
	this.filterMenu.change(this.filtersChanged.bind(this));
	this.contrastPlusMenu.change(this.contrastPlusMenuSelectionChanged.bind(this));
	this.contrastPlusMenu.change(this.filtersChanged.bind(this));
	this.contrastPlusSlider.change(this.filtersChanged.bind(this));
}

sewi.ImageControls.prototype.initTooltips = function() {
	this.mainDOMElement.find(".grayscale-option").tooltip({
		html: true,
		title: 'Removes color details from the image, forming a grayscale respresentation.<br><img src="tooltip_grayscale.png">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".difference-option").tooltip({
		html: true,
		title: 'Produces an image that represents the difference in color intensity between the original and inverted image. Generally this filter improves the contrast of the image.<br><img src="tooltip_difference.png">',
		container: $("body"),
		placement: "right"
	});

	this.mainDOMElement.find(".invert-option").tooltip({
		html: true,
		title: 'Inverts the colors of image. Simply stated, on a grayscale image, white becomes black, while black becomes white.<br><img src="tooltip_invert.png">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".autoContrast-option").tooltip({
		html: true,
		title: 'Artifically stretches the colors of the image to make use of the entire grayscale spectrum, which intensifies the difference among the various shades of gray, generally improving contrast.<br><img src="tooltip_histogram_equalization.png">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".flame-option").tooltip({
		html: true,
		title: 'Artifically colors a grayscale image with a predefined color spectrum. This filter may highlight hard-to-see differences in the shades of gray of the original image. Different color spectrum filters will provide different levels of details at different areas of the image.<br><img src="tooltip_false_color_flame.png">',
		container: "body",
		placement: "right"
	});

	this.mainDOMElement.find(".contrast-plus-button").tooltip({
		html: true,
		title: 'Artifically stretches the grayscale range of a specific region at the cost of other regions. This improves the constrast for the stretched region, but reduces the constrast for the other regions. The example below stretches the range of the middle region (i.e. mid-shades of grays), while the range of the upper (white/lighter shades of grays) and lower regions (black/darker shades of grays) are compressed. There are 3 regions to choose from, and you may vary the degree of intensity to stretch the range of the region selected.<br><img src="tooltip_contrast_stretch_middle.png">',
		container: "body",
		placement: "right"
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
	var filterValues = this.filterMenu.val();
	var contrastPlusValues = this.contrastPlusMenu.val();

	var colorValue = 0;
	var advancedFilters = [];
	var contrastPlusValue = 0;

	if (filterValues != null) {
		for (var i = 0; i < filterValues.length; i++) {
			var value = filterValues[i].split('.');

			var group = parseInt(value[0]);
			var filter = parseInt(value[1]);

			if (group == 1) {
				colorValue = filter;
			} else {
				advancedFilters.push(filter);
			}
		}
	}

	// Ensure at least grayscale is selected when Auto Contrast or contrast+ is used
	if ((_.contains(advancedFilters, 3) || contrastPlusValues != null) && colorValue == 0) {
		if(filterValues == null)
			filterValues = [];
		filterValues.unshift('1.1');
		this.filterMenu.selectpicker('val', filterValues);
		colorValue = 1;
	}

	var filterSettings = {};

	switch (colorValue) {
		case 1:
			filterSettings.colorFilter = 'grayscale';
			break;
		case 2:
			filterSettings.colorFilter = 'fire';
			break;
		case 3:
			filterSettings.colorFilter = 'spectrum';
			break;
		case 4:
			filterSettings.colorFilter = 'hsv';
			break;
		default:
			filterSettings.colorFilter = 'none';
	}

	filterSettings.invert = _.contains(advancedFilters, 1);
	filterSettings.difference = _.contains(advancedFilters, 2);
	filterSettings.autoContrast = _.contains(advancedFilters, 3);

	if (contrastPlusValues != null) {
		contrastPlusValue = parseInt(contrastPlusValues[0]);
	}
	switch (contrastPlusValue) {
		case 1:
			filterSettings.contrastLevelMode = '0-80';
			break;
		case 2:
			filterSettings.contrastLevelMode = '81-174';
			break;
		case 3:
			filterSettings.contrastLevelMode = '175-255';
			break;
		default:
			filterSettings.contrastLevelMode = 'none';
	}

	filterSettings.contrastLevelValue = parseFloat(this.contrastPlusSlider.val());

	this.trigger('filtersChanged', filterSettings);
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