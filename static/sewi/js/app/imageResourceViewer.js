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

        this.previousCustomFiltersSettings = {};

        this.controls = null;
        this.imagePanZoomWidget = null;
    };

    sewi.inherits(sewi.ImageResourceViewer, sewi.ResourceViewer);

    sewi.ImageResourceViewer.prototype.resize = function() {
        if(this.imagePanZoomWidget != null)
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

        loadImageUrl.call(this);
    };

    function loadImageUrl() {
        $.ajax({
            dataType: 'json',
            type: 'GET',
            async: true,
            url: sewi.constants.IMAGE_RESOURCE_RESOURCE_URL_PREFIX + this.originalImageInfo.id,
        })
        .done(loadImageUrlSuccess.bind(this))
        .error(loadImageUrlFailure.bind(this));
    };

    function loadImageUrlSuccess(data) {
        this.imageElement.prop("src", data.url);
    };

    function loadImageUrlFailure() {
        this.showError(sewi.constants.IMAGE_RESOURCE_LOAD_RESOURCE_ERROR_MESSAGE);
    };

    // Records the original image's information & setups controls after the image has been loaded.
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

    // This setups the zoom controls and events. Note that zoom events from both the
    // PanZoomWidget and the ImageControls can be triggered. As both accepts zoom-related
    // input from the user, the events are meant to update the corresponding component's
    // settings/views.
    function setupZoomControls() {
        this.imagePanZoomWidget = new sewi.PanZoomWidget(this.imageElement, this.imageContainer);

        this.on(
            sewi.constants.PAN_ZOOM_WIDGET_TARGET_ZOOM_CHANGED_EVENT,
            updateControlsZoomLevelControlValue.bind(this)
        );

        this.controls.on(
            sewi.constants.IMAGE_CONTROLS_ZOOM_LEVEL_CHANGED_EVENT, 
            setPanZoomWidgetCurrentZoomLevel.bind(this)
        );

        this.controls.on(
            sewi.constants.IMAGE_CONTROLS_ZOOM_TO_FIT_REQUESTED_EVENT,
            setPanZoomWidgetZoomLevelZoomToFit.bind(this)
        );

        // Update controls to the correct values (the value may have changed during construction,
        // and the event not captured due to the event being registered after the construction)
        this.controls.updateZoomControlValue({
            zoomSettings: {
                max: this.imagePanZoomWidget.getMaximumZoomLevel(),
                min: this.imagePanZoomWidget.getMinimumZoomLevel()
            }
            zoomLevel: this.imagePanZoomWidget.getCurrentZoomLevel()
        });
    };

    // Set the zoom's slider to the respective value.
    function updateControlsZoomLevelControlValue(event, newZoomPercentage) {
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


    // The parameter settings is an object representing the state of all custom filters
    // (i.e. which filters are selected/not-selected), with the following form:

    // settings.colorize: (String)
    //      The colorize filter to selected. Current possible
    //      values are IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE and the keys of the 
    //      IMAGE_RESOURCE_FALSE_COLOR_PALETTE object (i.e. "flame", "rainbow", "spectrum").
    //      If no filters are selected, the value will be IMAGE_RESOURCE_COLORIZE_FILTER_NAME_NONE.

    // settings.difference: (Boolean)
    //      True if the difference filter is selected; false otherwise.

    // settings.invert: (Boolean)
    //      True if the invert filter is selected; false otherwise.

    // settings.autoContrast: (Boolean)
    //      True if the autoContrast (histogram equalization) filter is selected; false otherwise.
    //      Note that if the auto-contrast filter is selected, the one of the colorize filter must be applied.
    //      If the no colorize filter is selected, the IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE filter will be
    //      chosen automatically; however, it is not recommneded to rely on this check as no feedback will be provided
    //      to the user.

    // settings.contrastStretchMode: (String)
    //      If a contrast-stretching filter is selected, this
    //      element will take one of three possible values: IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_SHADOWS,
    //      IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_MIDTONES, or IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_HIGHLIGHTS.
    //      If none is selected, the value will be IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE.
    //      Note that if the contrast-stretching filter is selected, the one of the colorize filter must be applied.
    //      If the no colorize filter is selected, the IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE filter will be
    //      chosen automatically; however, it is not recommneded to rely on this check as no feedback will be provided
    //      to the user.

    // settings.contrastStretchValue: (Number)
    //      The intensity of the contrast-stretching filter,
    //      subjected to the limits between IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_SLIDER_MIN_VALUE and
    //      IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_SLIDER_MAX_VALUE.
    function applyCustomImageFilters(event, settings) {
        // Set up the filter flags based on settings.
        var filterFlags = {
            toApplyGrayscaleFilter: settings.colorize !== sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_NONE,
            toApplyDifferenceFilter: settings.difference,
            toApplyInvertFilter: settings.invert,
            toApplyHistogramEqualizationFilter: settings.autoContrast,
            toApplyFalseColorFilter:
                settings.colorize !== sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_NONE &&
                settings.colorize !== sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE,
            toApplyContrastStretchingFilter: settings.contrastStretchMode !== sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE
        }

        // Check: Choose grayscale if constrast-stretching or histogram equalization is selected, but
        // neither grayscale or colorize is selected.
        if((filterFlags.toApplyHistogramEqualizationFilter || filterFlags.toApplyContrastStretchingFilter) && 
            !(filterFlags.toApplyGrayscaleFilter || filterFlags.toApplyFalseColorFilter)) {
            settings.colorize = sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE;
            filterFlags.toApplyGrayscaleFilter = true;
        }

        if(_.isEqual(this.previousCustomFiltersSettings, settings)) {
            // Do nothing, as the filters are the same.
        }
        // Elseif there is at least 1 filter selected
        else if(_.reduce(filterFlags, OrReduce, false)) { // OR every element inside filterFlags (i.e. filterFlags.a || filterFlags.b || etc...)
            this.showProgressBar("Applying Filters");
            this.updateProgressBar(100);

            var originalImage = $(sewi.constants.IMAGE_RESOURCE_IN_MEMORY_IMAGE_ELEMENT);

            originalImage.one("load", applyCustomImageFiltersOnOriginalImageLoad.bind(this, settings, filterFlags, originalImage));

            originalImage.prop("src", this.originalImageInfo.url);
        }
        else {
            this.imageElement.prop("src", this.originalImageInfo.url);
        }

        this.previousCustomFiltersSettings = settings;
    };

    // Function to allow an OR reduction on the collection of values.
    function OrReduce(accumulator, value) {
        return accumulator || value;
    }

    function applyCustomImageFiltersOnOriginalImageLoad(settings, filterFlags, originalImage) {
        var canvasElement = $(sewi.constants.IMAGE_RESOURCE_IN_MEMORY_CANVAS_ELEMENT)
                .prop("width", this.originalImageInfo.width)
                .prop("height", this.originalImageInfo.height);

        canvasElement[0].getContext("2d").drawImage(originalImage[0], 0, 0, this.originalImageInfo.width, this.originalImageInfo.height);

        var canvasData = canvasElement[0].getContext("2d").getImageData(0, 0, this.originalImageInfo.width, this.originalImageInfo.height);

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
        if(filterFlags.toApplyContrastStretchingFilter) {
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

            applyContrastStretchingFilterToPixelData(
                canvasData.data,
                selectedRangeStart,
                selectedRangeEnd, 
                settings.contrastStretchValue
            );
        }
        if(filterFlags.toApplyFalseColorFilter) {
            applyFalseColorFilterToPixelData(canvasData.data, settings.colorize);
        }

        canvasElement[0].getContext("2d").putImageData(canvasData, 0, 0);

        this.imageElement.prop("src", canvasElement[0].toDataURL(//"image/png"));
            sewi.constants.IMAGE_RESOURCE_GENERATED_IMAGE_TYPE_JPEG,
            sewi.constants.IMAGE_RESOURCE_GENERATED_IMAGE_QUALITY_JPEG
        ));

        this.hideProgressBar();
    }

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
            // The formula is the reduced form of Abs(Invert(pixel_color) - Original(pixel_color))
            newValuesMapping[i] = Math.abs(255 - 2 * i);
        }

        for(i = 0; i < pixelData.length; i += 4) {
            pixelData[i] = newValuesMapping[pixelData[i]];
            pixelData[i+1] = newValuesMapping[pixelData[i+1]];
            pixelData[i+2] = newValuesMapping[pixelData[i+2]];
        }
    };

    function applyInvertFilterToPixelData(pixelData) {
        for(var i = 0; i < pixelData.length; i += 4) {
            // Direct computation is faster than using a values-mapping array
            pixelData[i] = 255 - pixelData[i];
            pixelData[i+1] = 255 - pixelData[i+1];
            pixelData[i+2] = 255 - pixelData[i+2];
        }
    };

    function applyHistogramEqualizationFilterToPixelData(pixelData) {
        // Assumption: image is in grayscale.

        // We get the frequency (count) of each color
        var colorCount = new Array(256);
        for(var i = 0; i < 256; i++) {
            colorCount[i] = 0;
        }

        for(i = 0; i < pixelData.length; i += 4) {
            colorCount[pixelData[i]]++;
        }

        // We find the origianl cumulative distribution function (CDF) of the color count of the original image
        var cdfMin = 0;
        var cdfOriginal = new Array(256);
        cdfOriginal[0] = colorCount[0];
        for(i = 1; i < 256; i++) {
            cdfOriginal[i] = cdfOriginal[i-1] + colorCount[i];

            if(cdfMin === 0 && cdfOriginal[i] !== 0)
                cdfMin = cdfOriginal[i];
        }

        // We now scale the original CDF to make use of the entire 0-255 range.
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

    function applyContrastStretchingFilterToPixelData(pixelData, startOfRange, endOfRange, intensity) {
        // Assumption: image is in grayscale.

        // Find the default outer ranges
        // Outer range = the ranges outside of [startOfRange, endOfRange] that will be compressed
        // the give the [startOfRange, endOfRange] more values.
        // Pre(outer) range = the range before [startOfRange, endOfRange]
        // Post(outer) range = the range after [startOfRange, endOfRange]
        var defaultRangeLength = endOfRange - startOfRange + 1;
        var expandedRangeLength = Math.round(defaultRangeLength * intensity);

        var defaultOuterRangeLength = 256 - defaultRangeLength;
        var compressedOuterRangeLength = 256 - expandedRangeLength;

        var defaultPreRangeLength = startOfRange - 0;
        var defaultPostRangeLength = 255 - endOfRange;

        // Calculate the compressed outer ranges.
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

        for(i = 0; i < defaultRangeLength; i++) {
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

    /**
     * The controls for the ImageResourceViewer.
     *
     * @class sewi.ImageControls
     * @constructor
     */
    sewi.ImageControls = function(options) {
        // Safeguard if function is called without `new` keyword
        if (!(this instanceof sewi.ImageControls))
            return new sewi.ImageControls();

        sewi.ConfiguratorElement.call(this);

        initDOM.call(this);
        initEvents.call(this);
    };

    sewi.inherits(sewi.ImageControls, sewi.ConfiguratorElement);

    /**
     * Updates the values of the zoom controls. Used to update the ImageControl view when
     * the image is resized via other user inputs (e.g. via mousewheel events monitored by the
     * PanZoomWidget).
     *
     * @class sewi.ImageControls
     * @constructor
     */
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

    sewi.ImageControls.prototype.disableTooltips = function() {
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_BRIGHTNESS_BUTTON_CLASS).tooltip('destroy');
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_CONTRAST_BUTTON_CLASS).tooltip('destroy');
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_GRAYSCALE_OPTION_CLASS).tooltip('destroy');
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_FLAME_OPTION_CLASS).tooltip('destroy');
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_RAINBOW_OPTION_CLASS).tooltip('destroy');
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_SPECTRUM_OPTION_CLASS).tooltip('destroy');
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_INVERT_OPTION_CLASS).tooltip('destroy');
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_DIFFERENCE_OPTION_CLASS).tooltip('destroy');
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_AUTO_CONTRAST_OPTION_CLASS).tooltip('destroy');
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_BUTTON_CLASS).tooltip('destroy');
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_ZOOM_TO_FIT_BUTTON_CLASS).tooltip('destroy');
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_ZOOM_BUTTON_CLASS).tooltip('destroy');
    };

    sewi.ImageControls.prototype.enableTooltips = function() {

        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_BRIGHTNESS_BUTTON_CLASS).tooltip({
            html: true,
            title: sewi.constants.IMAGE_CONTROLS_BRIGHTNESS_BUTTON_TOOLTIP_HTML,
            container: 'body',
            placement: 'right'
        });

        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_CONTRAST_BUTTON_CLASS).tooltip({
            html: true,
            title: sewi.constants.IMAGE_CONTROLS_CONTRAST_BUTTON_TOOLTIP_HTML,
            container: 'body',
            placement: 'right'
        });

        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_GRAYSCALE_OPTION_CLASS).tooltip({
            html: true,
            title: sewi.constants.IMAGE_CONTROLS_GRAYSCALE_OPTION_TOOLTIP_HTML,
            container: 'body',
            placement: 'right'
        });

        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_FLAME_OPTION_CLASS).tooltip({
            html: true,
            title: sewi.constants.IMAGE_CONTROLS_FLAME_OPTION_TOOLTIP_HTML,
            container: 'body',
            placement: 'right'
        });

        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_RAINBOW_OPTION_CLASS).tooltip({
            html: true,
            title: sewi.constants.IMAGE_CONTROLS_RAINBOW_OPTION_TOOLTIP_HTML,
            container: 'body',
            placement: 'right'
        });

        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_SPECTRUM_OPTION_CLASS).tooltip({
            html: true,
            title: sewi.constants.IMAGE_CONTROLS_SPECTRUM_OPTION_TOOLTIP_HTML,
            container: 'body',
            placement: 'right'
        });

        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_INVERT_OPTION_CLASS).tooltip({
            html: true,
            title: sewi.constants.IMAGE_CONTROLS_INVERT_OPTION_TOOLTIP_HTML,
            container: 'body',
            placement: 'right'
        });

        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_DIFFERENCE_OPTION_CLASS).tooltip({
            html: true,
            title: sewi.constants.IMAGE_CONTROLS_DIFFERENCE_OPTION_TOOLTIP_HTML,
            container: $('body'),
            placement: 'right'
        });

        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_AUTO_CONTRAST_OPTION_CLASS).tooltip({
            html: true,
            title: sewi.constants.IMAGE_CONTROLS_AUTO_CONTRAST_OPTION_TOOLTIP_HTML,
            container: 'body',
            placement: 'right'
        });

        // Remove the attribute as bootstrap-select uses the title as well (it interferes with tooltip if we don't remove it first.)
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_BUTTON_CLASS).removeAttr("title");
        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_BUTTON_CLASS).tooltip({
            html: true,
            title: sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_BUTTON_TOOLTIP_HTML,
            container: 'body',
            placement: 'right'
        });

        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_ZOOM_TO_FIT_BUTTON_CLASS).tooltip({
            html: true,
            title: sewi.constants.IMAGE_CONTROLS_ZOOM_TO_FIT_BUTTON_TOOLTIP_HTML,
            container: 'body',
            placement: 'left'
        });

        this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_ZOOM_BUTTON_CLASS).tooltip({
            html: true,
            title: sewi.constants.IMAGE_CONTROLS_ZOOM_BUTTON_TOOLTIP_HTML,
            container: 'body',
            placement: 'left'
        });
    };

    function initDOM() {
        this.mainDOMElement
            .addClass(sewi.constants.IMAGE_CONTROLS_MAIN_DOM_ELEMENT_CLASS)
            .addClass(sewi.constants.IMAGE_CONTROLS_ANIMATED_CLASS);

        var button = $(sewi.constants.IMAGE_CONTROLS_DEFAULT_BUTTON_ELEMENT);
        var slider = $(sewi.constants.IMAGE_CONTROLS_DEFAULT_SLIDER_ELEMENT);
        var innerPanel = $(sewi.constants.IMAGE_CONTROLS_INNER_PANEL_ELEMENT);

        var leftButtonPanel = innerPanel
            .clone()
            .addClass(sewi.constants.IMAGE_CONTROLS_LEFT_BUTTON_PANEL_CLASS);

        var rightButtonPanel = innerPanel
            .clone()
            .addClass(sewi.constants.IMAGE_CONTROLS_RIGHT_BUTTON_PANEL_CLASS);

        this.brightnessButton = button
            .clone()
            .addClass(sewi.constants.IMAGE_CONTROLS_BRIGHTNESS_BUTTON_CLASS)
            .append(sewi.constants.IMAGE_CONTROLS_BRIGHTNESS_BUTTON_INNER_LABEL_ELEMENT);

        this.contrastButton = button
            .clone()
            .addClass(sewi.constants.IMAGE_CONTROLS_CONTRAST_BUTTON_CLASS)
            .append(sewi.constants.IMAGE_CONTROLS_CONTRAST_BUTTON_INNER_LABEL_ELEMENT);

        this.contrastStretchingSettingsButton = button
            .clone()
            .addClass(sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_BUTTON_CLASS)
            .append(sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_BUTTON_INNER_LABEL_ELEMENT);

        this.zoomToFitButton = button
            .clone()
            .addClass(sewi.constants.IMAGE_CONTROLS_ZOOM_TO_FIT_BUTTON_CLASS)
            .append(sewi.constants.IMAGE_CONTROLS_ZOOM_TO_FIT_BUTTON_INNER_LABEL_ELEMENT);

        this.zoomButton = button
            .clone()
            .addClass(sewi.constants.IMAGE_CONTROLS_ZOOM_BUTTON_CLASS)
            .append(sewi.constants.IMAGE_CONTROLS_ZOOM_BUTTON_INNER_LABEL_ELEMENT);

        this.brightnessSlider = slider
            .clone()
            .addClass(sewi.constants.IMAGE_CONTROLS_BRIGHTNESS_SLIDER_CLASS);

        this.contrastSlider = slider
            .clone()
            .addClass(sewi.constants.IMAGE_CONTROLS_CONTRAST_SLIDER_CLASS);

        this.contrastStretchingSettingsSlider = slider
            .clone()
            .addClass(sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_SLIDER_CLASS)
            .attr({
                min: sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_SLIDER_MIN_VALUE,
                max: sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_SLIDER_MAX_VALUE,
                value: sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_SLIDER_DEFAULT_VALUE
            });

        this.zoomSlider = slider
            .clone()
            .addClass(sewi.constants.IMAGE_CONTROLS_ZOOM_SLIDER_CLASS)
            .attr({
                max: sewi.constants.IMAGE_CONTROLS_ZOOM_SLIDER_MIN_VALUE,
                min: sewi.constants.IMAGE_CONTROLS_ZOOM_SLIDER_MAX_VALUE,
                value: sewi.constants.IMAGE_CONTROLS_ZOOM_SLIDER_DEFAULT_VALUE,
                step: sewi.constants.IMAGE_CONTROLS_ZOOM_SLIDER_STEP_SIZE
            });

        var colorizeFilterGroup = $(sewi.constants.IMAGE_CONTROLS_COLORIZE_OPTGROUP_ELEMENT)
            .append(
                $(sewi.constants.IMAGE_CONTROLS_GRAYSCALE_OPTION_ELEMENT)
                    .addClass(sewi.constants.IMAGE_CONTROLS_GRAYSCALE_OPTION_CLASS)
            )
            .append(
                $(sewi.constants.IMAGE_CONTROLS_FLAME_OPTION_ELEMENT)
                    .addClass(sewi.constants.IMAGE_CONTROLS_FLAME_OPTION_CLASS)
            )
            .append(
                $(sewi.constants.IMAGE_CONTROLS_RAINBOW_OPTION_ELEMENT)
                    .addClass(sewi.constants.IMAGE_CONTROLS_RAINBOW_OPTION_CLASS)
            )
            .append(
                $(sewi.constants.IMAGE_CONTROLS_SPECTRUM_OPTION_ELEMENT)
                    .addClass(sewi.constants.IMAGE_CONTROLS_SPECTRUM_OPTION_CLASS)
            );

        var advancedFilterGroup = $(sewi.constants.IMAGE_CONTROLS_ADVANCED_FILTERS_OPTGROUP_ELEMENT)
            .append(
                $(sewi.constants.IMAGE_CONTROLS_INVERT_OPTION_ELEMENT)
                    .addClass(sewi.constants.IMAGE_CONTROLS_INVERT_OPTION_CLASS)
            )
            .append(
                $(sewi.constants.IMAGE_CONTROLS_DIFFERENCE_OPTION_ELEMENT)
                    .addClass(sewi.constants.IMAGE_CONTROLS_DIFFERENCE_OPTION_CLASS)
            )
            .append(
                $(sewi.constants.IMAGE_CONTROLS_AUTO_CONTRAST_OPTION_ELEMENT)
                    .addClass(sewi.constants.IMAGE_CONTROLS_AUTO_CONTRAST_OPTION_CLASS)
            );

        this.filterMenu = $(sewi.constants.IMAGE_CONTROLS_FILTER_MENU_ELEMENT)
            .append(colorizeFilterGroup)
            .append(advancedFilterGroup);

        this.contrastStretchingMenu = $(sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_ELEMENT)
            .append(sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_SHADOWS_OPTION_ELEMENT)
            .append(sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_MIDTONES_OPTION_ELEMENT)
            .append(sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_HIGHLIGHTS_OPTION_ELEMENT);

        var brightnessControl = sewi.createVerticalSlider(this.brightnessSlider, this.brightnessButton);
        var contrastControl = sewi.createVerticalSlider(this.contrastSlider, this.contrastButton);
        this.contrastStretchingSettingsControl = sewi.createVerticalSlider(this.contrastStretchingSettingsSlider, this.contrastStretchingSettingsButton).addClass('hidden');
        var zoomControl = sewi.createVerticalSlider(this.zoomSlider, this.zoomButton);

        leftButtonPanel.append(brightnessControl)
             .append(contrastControl)
             .append(this.filterMenu)
             .append(this.contrastStretchingMenu)
             .append(this.contrastStretchingSettingsControl);

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

        this.contrastStretchingMenu.selectpicker({
            selectedTextFormat: 'values',
            width: '95px',
            dropupAuto: false,
        });
    };

    function initEvents() {
        this.brightnessSlider.on('input', brightnessChanged.bind(this));    
        this.contrastSlider.on('input', contrastChanged.bind(this));
        this.brightnessButton.on('click', brightnessReset.bind(this));
        this.contrastButton.on('click', contrastReset.bind(this));
        this.zoomSlider.on('input', zoomLevelChanged.bind(this));
        this.zoomButton.on('click', zoomLevelReset.bind(this));
        this.zoomToFitButton.on('click', zoomToFit.bind(this));
        this.filterMenu.on('change', filtersChanged.bind(this));
        this.contrastStretchingMenu.on('change', contrastStretchingMenuSelectionChanged.bind(this));
        this.contrastStretchingMenu.on('change', filtersChanged.bind(this));
        this.contrastStretchingSettingsSlider.on('change', filtersChanged.bind(this));
    };

    function brightnessChanged() {
        this.trigger(sewi.constants.IMAGE_CONTROLS_BRIGHTNESS_CHANGED_EVENT, this.brightnessSlider.val());
    };

    function contrastChanged() {
        this.trigger(sewi.constants.IMAGE_CONTROLS_CONTRAST_CHANGED_EVENT, this.contrastSlider.val());
    };

    function brightnessReset() {
        this.brightnessSlider.val(1);
        brightnessChanged.call(this);
    };

    function contrastReset() {
        this.contrastSlider.val(1);
        contrastChanged.call(this);
    };

    function zoomLevelChanged() {
        this.trigger(sewi.constants.IMAGE_CONTROLS_ZOOM_LEVEL_CHANGED_EVENT, this.zoomSlider.val());
    };

    function zoomLevelReset() {
        this.zoomSlider.val(100);
        zoomLevelChanged.call(this);
    };

    function zoomToFit() {
        this.trigger(sewi.constants.IMAGE_CONTROLS_ZOOM_TO_FIT_REQUESTED_EVENT);
    };

    function filtersChanged() {
        var filterMenuValues = this.filterMenu.val() || [];
        var contrastStretchMenuValues = this.contrastStretchingMenu.val() || [];

        var filterSettingsReturnObject = {
            colorize: sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_NONE,
            difference: false,
            invert: false,
            autoContrast: false,
            contrastStretchMode: sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE,
            contrastStretchValue: 1
        };

        // Figure out colorize
        if(filterMenuValues.length !== 0 && filterMenuValues[0].indexOf(sewi.constants.IMAGE_CONTROLS_COLORIZE_VALUES_PREFIX) != -1) {
            filterSettingsReturnObject.colorize = filterMenuValues[0].substr(sewi.constants.IMAGE_CONTROLS_COLORIZE_VALUES_PREFIX.length); //remove the prefix.
            filterMenuValues.shift();
        }

        // Figure out filters (invert, difference, autoContrast). What's left in the filterMenuValues array should be strings starting with "filter."
        while(filterMenuValues.length !== 0) {
            var chosenFilter = filterMenuValues[0].substr(sewi.constants.IMAGE_CONTROLS_ADVANCED_FILTERS_VALUES_PREFIX.length); //remove the prefix
            filterSettingsReturnObject[chosenFilter] = true;
            filterMenuValues.shift();
        }

        // Figure out the contrast stretch filter
        if (contrastStretchMenuValues.length !== 0) {
            filterSettingsReturnObject.contrastStretchMode = contrastStretchMenuValues[0];
            filterSettingsReturnObject.contrastStretchValue = parseFloat(this.contrastStretchingSettingsSlider.val());
        }

        // Ensure that at least grayscale is selected when Auto Contrast or Contrast Stretch is used
        // (false-colors - e.g. flame - are implicitly grayscale, so they satisfy the condition)
        if (filterSettingsReturnObject.colorize === sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_NONE && 
            (filterSettingsReturnObject.autoContrast || filterSettingsReturnObject.contrastStretchMode !== sewi.constants.IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE)) {
            filterSettingsReturnObject.colorize = sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE;

            // Propagate the changes to the UI
            var newFilterMenuValues = this.filterMenu.val() || [];
            newFilterMenuValues.unshift(sewi.constants.IMAGE_CONTROLS_COLORIZE_VALUES_PREFIX + sewi.constants.IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE);
            this.filterMenu.selectpicker('val', newFilterMenuValues);
        }

        this.trigger(sewi.constants.IMAGE_CONTROLS_CUSTOM_FILTERS_CHANGED_EVENT, filterSettingsReturnObject);
    };

    function contrastStretchingMenuSelectionChanged() {
        var value = this.contrastStretchingMenu.val();
        if (value !== null) {
            this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_BUTTON_CLASS)
                .addClass(sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_BUTTON_OPTION_SELECTED_CLASS);
            this.contrastStretchingSettingsControl.removeClass(sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_BUTTON_HIDDEN_CLASS);
        }
        else {
            this.mainDOMElement.find('.' + sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_BUTTON_CLASS)
                .removeClass(sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_BUTTON_OPTION_SELECTED_CLASS);
            this.contrastStretchingSettingsControl.addClass(sewi.constants.IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_BUTTON_HIDDEN_CLASS);
        }
    };

    if(sewi.testMode) {
        sewi.ImageResourceViewer.prototype.privates = {
            afterImageLoadSetup: afterImageLoadSetup,
            loadImageUrlSuccess: loadImageUrlSuccess,
            applyCustomImageFilters: applyCustomImageFilters,
            getImageUri: getImageUri
        };
    }
})();