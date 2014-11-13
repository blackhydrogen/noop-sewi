var sewi = sewi || {};

(function() {
     /**
     * Displays an image resource for an encounter.
     *
     * @class sewi.ImageResourceViewer
     * @constructor
     * @param {Object} options Configuration options for the ImageResourceViewer
     * @param {string} options.id The UUID of the image resource to be displayed.
     */
    sewi.ImageResourceViewer = function(options) {
        sewi.ResourceViewer.call(this);

        options = options || {};

        this.originalImageInfo = {
            width: 0,
            height: 0,
            url: "",
            id: options.id
        };

        this.mainDOMElement.addClass(sewi.constants.IMAGE_RESOURCE_MAIN_DOM_ELEMENT_CLASS);

        this.imageContainer = $(sewi.constants.IMAGE_RESOURCE_CONTAINER_ELEMENT)
            .appendTo(this.mainDOMElement);

        this.imageElement = $(sewi.constants.IMAGE_RESOURCE_IMAGE_ELEMENT)
            .appendTo(this.imageContainer);

        this.brightness = 1;
        this.contrast = 1;

        this.controls = null;
        this.imagePanZoomWidget = null;
    };

    sewi.inherits(sewi.ImageResourceViewer, sewi.ResourceViewer);

    sewi.ImageResourceViewer.prototype.resize = function() {
        this.imagePanZoomWidget.recalculateTargetDimensions();
    };

    sewi.ImageResourceViewer.prototype.showTooltips = function() {
        this.controls.enableTooltips();
    };

    sewi.ImageResourceViewer.prototype.hideTooltips = function() {
        this.controls.disableTooltips();
    };

    sewi.ImageResourceViewer.prototype.load = function() {
        this.showProgressBar();
        this.updateProgressBar(100);

        this.imageElement.one("load", afterImageLoadSetup.bind(this));

        loadImage.call(this);
    };

    function loadImage() {
        $.ajax({
            dataType: 'json',
            type: 'GET',
            async: true,
            url: sewi.constants.IMAGE_RESOURCE_RESOURCE_URL_PREFIX + this.originalImageInfo.id,
        })
        .done((function(data) {
            this.imageElement.prop("src", data.url);
        }).bind(this))
        .error((function() {
            this.showError(sewi.constants.IMAGE_RESOURCE_LOAD_RESOURCE_ERROR_MESSAGE);
        }).bind(this));
    };

    function afterImageLoadSetup() {
        this.originalImageInfo.width = this.imageElement.prop("naturalWidth");
        this.originalImageInfo.height = this.imageElement.prop("naturalHeight");
        this.originalImageInfo.url = this.imageElement.prop("src");

        this.controls = new sewi.ImageControls();
        
        this.controls.on(sewi.constants.IMAGE_CONTROLS_BRIGHTNESS_CHANGED_EVENT, applyInbuiltImageBrightness.bind(this));
        this.controls.on(sewi.constants.IMAGE_CONTROLS_CONTRAST_CHANGED_EVENT, applyInbuiltImageContrast.bind(this));
        this.controls.on(sewi.constants.IMAGE_CONTROLS_CUSTOM_FILTERS_CHANGED_EVENT, applyCustomImageFilters.bind(this));

        this.mainDOMElement.append(this.controls.getDOM());

        this.addDownloadButton(getImageUri.bind(this));

        setupZoomControls.call(this);

        this.hideProgressBar();
    };

    function getImageUri() {
        return this.imageElement.attr("src");
    }

    function setupZoomControls() {
        this.imagePanZoomWidget = new sewi.PanZoomWidget(this.imageElement, this.imageContainer);

        this.on(
            sewi.constants.PAN_ZOOM_WIDGET_TARGET_ZOOM_CHANGED_EVENT,
            updateControlsZoomControlValue.bind(this)
        );

        this.controls.on(
            sewi.constants.IMAGE_CONTROLS_ZOOM_CHANGED_EVENT, 
            setPanZoomWidgetCurrentZoomLevel.bind(this)
        );

        this.controls.on(
            sewi.constants.IMAGE_CONTROLS_ZOOM_TO_FIT_REQUESTED_EVENT,
            setPanZoomWidgetZoomLevelZoomToFit.bind(this)
        );

        // TODO set the correct min and max values.

        // Update controls to the correct values (the value may have changed during construction,
        // and the event not captured due to the event being registered after the construction)
        this.controls.updateZoomControlValue({
            zoomLevel: this.imagePanZoomWidget.getCurrentZoomLevel()
        });
    };

    function updateControlsZoomControlValue(event, newZoomPercentage) {
        this.controls.updateZoomControlValue({
            zoomLevel: newZoomPercentage
        });
    }

    function setPanZoomWidgetCurrentZoomLevel(event, zoomLevel) {
        this.imagePanZoomWidget.setCurrentZoomLevel(zoomLevel);
    }

    function setPanZoomWidgetZoomLevelZoomToFit(event) {
        this.imagePanZoomWidget.setZoomLevelToZoomToFit();
    }

    function applyCustomImageFilters(event, settings) {
        var filterFlags = {
            toApplyGrayscaleFilter: settings.colorize !== sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_NONE,
            toApplyDifferenceFilter: settings.difference,
            toApplyInvertFilter: settings.invert,
            toApplyHistogramEqualizationFilter: settings.autoContrast,
            toApplyFalseColorFilter:
                settings.colorize !== sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_NONE &&
                settings.colorize !== sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE,
            toApplySelectiveStretchingFilter: settings.contrastStretchMode !== sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE
        }

        if(_.reduce(
            filterFlags,
            function(accumulator, value) { return accumulator || value; },
            false
        )) {
            var originalImage = $(sewi.constants.IMAGE_RESOURCE_IN_MEMORY_IMAGE_ELEMENT);

            originalImage.one("load", applyCustomImageFiltersOnOriginalImageLoad.bind(this, settings, filterFlags, originalImage));

            originalImage.prop("src", this.originalImageInfo.url);
        }
        else {
            this.imageElement.prop("src", this.originalImageInfo.url);
        }
    };

    function applyCustomImageFiltersOnOriginalImageLoad(settings, filterFlags, originalImage) {
        // var t1 = new Date().getTime();
        // var t2;

        var canvasElement = $(sewi.constants.IMAGE_RESOURCE_IN_MEMORY_CANVAS_ELEMENT)
                .prop("width", this.originalImageInfo.width)
                .prop("height", this.originalImageInfo.height);

        canvasElement[0].getContext("2d").drawImage(originalImage[0], 0, 0, this.originalImageInfo.width, this.originalImageInfo.height);

        // t2 = new Date().getTime(); console.log("WRITE IMG TO CANVAS TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

        var canvasData = canvasElement[0].getContext("2d").getImageData(0, 0, this.originalImageInfo.width, this.originalImageInfo.height);

        // t2 = new Date().getTime(); console.log("GET CANVAS DATA TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

        if(filterFlags.toApplyGrayscaleFilter) {
            applyGrayscaleFilterToPixelData(canvasData.data);
        }
        if(filterFlags.toApplyDifferenceFilter) {
            applyDifferenceFilterToPixelData(canvasData.data);
        }
        if(filterFlags.toApplyInvertFilter) {
            applyInvertFilterToPixelData(canvasData.data);
        }
        if(filterFlags.toApplyHistogramEqualizationFilter) {
            applyHistogramEqualizationFilterToPixelData(canvasData.data);
        }
        if(filterFlags.toApplySelectiveStretchingFilter) {
            switch(settings.contrastStretchMode) {
                case sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_SHADOWS:
                    var selectedRangeStart = 0;
                    var selectedRangeEnd = 80;
                    break;
                case sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_MIDTONES:
                    var selectedRangeStart = 81;
                    var selectedRangeEnd = 174;
                    break;
                case sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_HIGHLIGHTS:
                    var selectedRangeStart = 175;
                    var selectedRangeEnd = 255;
                    break;
            }

            applySelectiveStretchingFilterToPixelData(
                canvasData.data,
                selectedRangeStart,
                selectedRangeEnd, 
                settings.contrastStretchValue
            );
        }
        if(filterFlags.toApplyFalseColorFilter) {
            applyFalseColorFilterToPixelData(canvasData.data, settings.colorize);
        }

        // t2 = new Date().getTime(); console.log("APPLY FILTER TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

        canvasElement[0].getContext("2d").putImageData(canvasData, 0, 0);

        // t2 = new Date().getTime(); console.log("WRITE-BACK DATA TO CANVAS TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

        this.imageElement.prop("src", canvasElement[0].toDataURL(
            sewi.constants.IMAGE_RESOURCE_GENERATED_IMAGE_TYPE_JPEG,
            sewi.constants.IMAGE_RESOURCE_GENERATED_IMAGE_QUALITY_JPEG
        ));

        // t2 = new Date().getTime(); console.log("CANVAS TO IMG CONVERSION TIMING: " + (t2 - t1) + " ms"); t1 = t2; // DEBUG

        // console.log("=== END OF REPORT ==="); // DEBUG
        // console.log(""); // DEBUG
    }

    function applyInvertFilterToPixelData(pixelData) {
        for(var i = 0; i < pixelData.length; i += 4) {
            // Direct computation is faster than using an array
            pixelData[i] = 255 - pixelData[i];
            pixelData[i+1] = 255 - pixelData[i+1];
            pixelData[i+2] = 255 - pixelData[i+2];
        }
    };

    function applyGrayscaleFilterToPixelData(pixelData) {
        for(var i = 0; i < pixelData.length; i += 4) {
            // Luminosity method: 0.21 R + 0.72 G + 0.07 B
            var newColor = Math.round(0.21 * pixelData[i] + 0.72 * pixelData[i+1] + 0.07 * pixelData[i+2]);
            pixelData[i] = newColor;
            pixelData[i+1] = newColor;
            pixelData[i+2] = newColor;
        }
    };

    function applyDifferenceFilterToPixelData(pixelData) {
        var newValuesMapping = new Array(256);
        for(var i = 0; i < 256; i++) {
            newValuesMapping[i] = Math.abs(255 - 2 * i);
        }

        for(i = 0; i < pixelData.length; i += 4) {
            pixelData[i] = newValuesMapping[pixelData[i]];
            pixelData[i+1] = newValuesMapping[pixelData[i+1]];
            pixelData[i+2] = newValuesMapping[pixelData[i+2]];
        }
    };

    function applyHistogramEqualizationFilterToPixelData(pixelData) {
        // Assumption: image is in grayscale.
        var colorCount = new Array(256);
        for(var i = 0; i < 256; i++) {
            colorCount[i] = 0;
        }

        for(i = 0; i < pixelData.length; i += 4) {
            colorCount[pixelData[i]]++;
        }

        var cdfMin = 0;
        var cdfOriginal = new Array(256);
        cdfOriginal[0] = colorCount[0];
        for(i = 1; i < 256; i++) {
            cdfOriginal[i] = cdfOriginal[i-1] + colorCount[i];

            if(cdfMin === 0 && cdfOriginal[i] !== 0)
                cdfMin = cdfOriginal[i];
        }

        var cdfScaled = new Array(256);
        var totalNumberOfPixelsSubtractCdfMin = pixelData.length / 4 - cdfMin;
        for(i = 0; i < 256; i++) {
            cdfScaled[i] = Math.round( ( (cdfOriginal[i] - cdfMin) / totalNumberOfPixelsSubtractCdfMin) * 255);
        }

        for(i = 0; i < pixelData.length; i += 4) {
            pixelData[i] = cdfScaled[pixelData[i]];
            pixelData[i+1] = cdfScaled[pixelData[i+1]];
            pixelData[i+2] = cdfScaled[pixelData[i+2]];
        }
    };

    function applySelectiveStretchingFilterToPixelData(pixelData, startOfRange, endOfRange, intensity) {
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

        for(i = 0; i < defaultPostRangeLength; i++) {
            newValuesMapping[255 - i] = Math.round(255 - i * compressedPostRangeLength / defaultPostRangeLength);
        }

        var testValuesMapping = new Array(256);
        for(i = 0; i < defaultRangeLength; i++) {
            testValuesMapping[defaultPreRangeLength + i] = Math.round(compressedPreRangeLength + i * expandedRangeLength / defaultRangeLength);
            newValuesMapping[defaultPreRangeLength + i] = Math.round(compressedPreRangeLength + i * expandedRangeLength / defaultRangeLength);
        }

        for(i = 0; i < pixelData.length; i += 4) {
            pixelData[i] = newValuesMapping[pixelData[i]];
            pixelData[i+1] = newValuesMapping[pixelData[i+1]];
            pixelData[i+2] = newValuesMapping[pixelData[i+2]];
        }
    };

    function applyFalseColorFilterToPixelData(pixelData, chosenFalseColorPalette) {
        // Assumption: image is in grayscale.

        var falseColorPaletteToUse = sewi.constants.IMAGE_RESOURCE_FALSE_COLOR_PALETTE[chosenFalseColorPalette].values;

        for(var i = 0; i < pixelData.length; i += 4) {
            var falseColorToUse = falseColorPaletteToUse[pixelData[i]];

            pixelData[i] = falseColorToUse[0];
            pixelData[i+1] = falseColorToUse[1];
            pixelData[i+2] = falseColorToUse[2];
        }
    };

    function applyInbuiltImageBrightness(event, brightness) {
        this.brightness = brightness;
        applyInbuiltImageFilters.call(this);
    };

    function applyInbuiltImageContrast(event, contrast) {
        this.contrast = contrast;
        applyInbuiltImageFilters.call(this);
    };

    function applyInbuiltImageFilters() {
        this.imageElement.css("-webkit-filter",
            "brightness(" + this.brightness + ")" +
            "contrast(" + this.contrast + ")"
        );
    };





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
        var slider = $('<input type="range" min="0" max="2" value="1" step="0.1" />');
        var innerPanel = $('<div>');

        var leftButtonPanel = innerPanel
            .clone()
            .addClass('left');

        var rightButtonPanel = innerPanel
            .clone()
            .addClass('right');

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
    };

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
    };

    sewi.ImageControls.prototype.disableTooltips = function() {
        this.mainDOMElement.find(".grayscale-option").tooltip('destroy');
        this.mainDOMElement.find(".flame-option").tooltip('destroy');
        this.mainDOMElement.find(".spectrum-option").tooltip('destroy');
        this.mainDOMElement.find(".hsv-option").tooltip('destroy');
        this.mainDOMElement.find(".difference-option").tooltip('destroy');
        this.mainDOMElement.find(".invert-option").tooltip('destroy');
        this.mainDOMElement.find(".autoContrast-option").tooltip('destroy');
        this.mainDOMElement.find(".contrast-menu-button").tooltip('destroy');
    };

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
    };

    sewi.ImageControls.prototype.brightnessChanged = function() {
        this.trigger('brightnessChanged', this.brightnessSlider.val());
    };

    sewi.ImageControls.prototype.contrastChanged = function() {
        this.trigger('contrastChanged', this.contrastSlider.val());
    };

    sewi.ImageControls.prototype.brightnessReset = function() {
        this.brightnessSlider.val(1);
        this.brightnessChanged();
    };

    sewi.ImageControls.prototype.contrastReset = function() {
        this.contrastSlider.val(1);
        this.contrastChanged();
    };

    sewi.ImageControls.prototype.zoomLevelChanged = function() {
        this.trigger('zoomChanged', this.zoomSlider.val());
    };

    sewi.ImageControls.prototype.zoomLevelReset = function() {
        this.zoomSlider.val(100);
        this.zoomLevelChanged();
    };

    sewi.ImageControls.prototype.zoomToFit = function() {
        this.trigger('zoomToFitRequested');
    };

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
        if(filterMenuValues.length !== 0 && filterMenuValues[0].indexOf("colorize.") != -1) {
            filterSettingsReturnObject.colorize = filterMenuValues[0].substr(9); //remove the leading "colorize."
            filterMenuValues.shift();
        }

        // Figure out filters (invert, difference, autoContrast). What's left in the filterMenuValues array should be strings starting with "filter."
        while(filterMenuValues.length !== 0) {
            var chosenFilter = filterMenuValues[0].substr(7); //remove the leading "filter."
            filterSettingsReturnObject[chosenFilter] = true;
            filterMenuValues.shift();
        }

        // Figure out the contrast stretch filter
        if (contrastStretchMenuValues.length !== 0) {
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
    };

    sewi.ImageControls.prototype.contrastPlusMenuSelectionChanged = function() {
        var value = this.contrastPlusMenu.val();
        if (value !== null) {
            this.contrastPlusControl.removeClass('hidden');
            this.mainDOMElement.find('.contrast-menu-button')
                .addClass('option-selected');
        }
        else {
            this.mainDOMElement.find('.contrast-menu-button')
                .removeClass('option-selected');
            this.contrastPlusControl.addClass('hidden');
        }
    };

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
    };

})();