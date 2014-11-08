/**
 * Global class that contains all components and shared properties of SEWI.
 *
 * @namespace sewi
 */
var sewi = sewi || {};

(function() {

    /**
     * Helper function to ensure that a class inherits another class.
     * Note that classes must still use <code>NameOfSuperClass.call(this)</code>
     * in their constructor to initialize themselves.
     *
     * @param  {Function} subClass   Function definition of the sub class.
     * @param  {Function} superClass Function definition of the super class.
     */
    sewi.inherits = function(subClass, superClass) {
        if (_.isFunction(subClass) && _.isFunction(superClass)) {
            subClass.prototype = _.create(superClass.prototype, {'constructor': subClass});
        } else {
            throw new Error('Only class definitions can inherit other class definitions.');
        }
    }

    /**
     * Generates the DOM elements necessary to produce a vertical slider.
     *
     * @param {jQuery} sliderDOMElement  The slider DOM element
     * @param {jQuery} triggerDOMElement A visible DOM element that acts as the
     *                                   hover trigger.
     */
    sewi.createVerticalSlider = function(sliderDOMElement, triggerDOMElement, verticalSliderClass) {
        var verticalSliderContainer = $(sewi.constants.VERTICAL_SLIDER_CONTAINER_DOM);
        var popupElement = $(sewi.constants.VERTICAL_SLIDER_POPUP_DOM);

        popupElement.append(sliderDOMElement)
                    .addClass(verticalSliderClass);

        verticalSliderContainer.append(popupElement)
                               .append(triggerDOMElement);

        sliderDOMElement.focus(verticalSliderFocused)
                        .blur(verticalSliderUnfocused);

        return verticalSliderContainer;
    }

    function verticalSliderFocused(event) {
        $(event.target).parent().addClass('active');
    }

    function verticalSliderUnfocused(event) {
        $(event.target).parent().removeClass('active');
    }

    /**
     * Contains all constants used by the components that make up SEWI.
     * @constant
     * @type Object
     */
    sewi.constants = {

        // Encounter URL Constants
        ENCOUNTER_BASE_URL: '/sewi/encounter/',

        //Vertical Slider Constants
        VERTICAL_SLIDER_CONTAINER_DOM: '<div class="vertical-slider-container"></div>',
        VERTICAL_SLIDER_POPUP_DOM: '<div class="vertical-slider-popup animated"></div>',

        //Tab Constants
        TAB_MAX_NUM_TABS: 5,
        TAB_DROP_AREA_POSITIONS: {TOP: 0, BOTTOM: 1, LEFT: 2, RIGHT: 3},
        TAB_PANEL_POSITIONS: {FULL: 0, LEFT: 1, RIGHT: 2, BOTTOM: 3, TOP: 4, TOP_LEFT: 5, TOP_RIGHT: 6, BOTTOM_LEFT: 7, BOTTOM_RIGHT: 8},
        TAB_PREVIOUS_DROP_AREA : {NONE: 0, LEFT: 1, RIGHT: 2, BOTTOM: 3, TOP: 4},

        //Error Screen Constants
        ERROR_SCREEN_CLASS: 'error-screen',
        ERROR_SCREEN_TEXT_DOM: '<div class="error-text"></div>',

        //Progress Constants
        PROGRESS_BAR_DOM: '<div class="progress"></div>',
        PROGRESS_BAR_AMOUNT_DOM: '<div class="progress-bar" role="progressbar"></div>',
        PROGRESS_BAR_TEXT_DOM: '<div class="progress-bar-text"></div>',
        PROGRESS_BAR_ANIMATED_CLASS: 'progress-bar-striped active',
        PROGRESS_BAR_BACKDROP_CLASS: 'progress-bar-backdrop',

        //Resource constants
        RESOURCE_INFO_RESOURCE_ID: 'data-res-id',
        RESOURCE_INFO_RESOURCE_TYPE: 'data-res-type',

        //Basic Encounter Information Viewer Constants
        BEI_MAIN_DOM_CLASS: 'basic-encounter-info-container',
        BEI_BASIC_INFO_URL_SUFFIX: '/basicInfo',
        BEI_HEADER_DOM: '<div class="basic-encounter-info-header"></div>',
        BEI_ENTRY_DOM: '<div class="basic-encounter-info-entry"></div>',
        BEI_ENTRY_KEY_DOM: '<span class="basic-encounter-info-entry-key"></span>',
        BEI_ENTRY_VALUE_DOM: '<span class="basic-encounter-info-entry-value"></span>',

        //Resource Gallery Constants
        RESOURCE_GALLERY_URL_SUFFIX: '/resourceList',
        RESOURCE_GALLERY_THUMBNAIL_URL_BASE: '/sewi/resources/',
        RESOURCE_GALLERY_THUMBNAIL_URL_SUFFIX: '/thumb',
        RESOURCE_GALLERY_RESOURCE_DOM: '<div class="resource">',
        RESOURCE_GALLERY_RESOURCE_THUMBNAIL_DOM: '<div class="resource-thumbnail-container"><img class="resource-thumbnail"></div>',
        RESOURCE_GALLERY_RESOURCE_HEADER_DOM: '<p class="resource-title">',
        RESOURCE_GALLERY_DOM_CLASS: 'resource-explorer-container',
        RESOURCE_GALLERY_RESOURCE_CLASS: 'resource',
        RESOURCE_GALLERY_THUMBNAIL_CLASS: 'resource-thumbnail',
        RESOURCE_GALLERY_RESOURCE_HEADER_CLASS: 'resource-title',
        RESOURCE_GALLERY_DRAGGED_RESOURCE_CLASS: 'resource-dragged',
        RESOURCE_GALLERY_TOOLTIP_HEADER: 'Last modified: ',
        RESOURCE_GALLERY_LOAD_ERROR_MESSAGE: 'Failed to load resource gallery, please close and re-open browser window',
        RESOURCE_GALLERY_DEFAULT_THUMBNAIL: '/static/sewi/images/default_thumbnail.png',

        //Resource Viewer Constants
        RESOURCE_VIEWER_BASIC_DOM: '<div></div>',
        RESOURCE_VIEWER_PLACEHOLDER_DOM: '<div class="placeholder"></div>',
        RESOURCE_VIEWER_CLASS: 'resource-viewer',
        RESOURCE_VIEWER_CLOSE_BUTTON_DOM: '<button type="button" class="btn btn-danger close-button" title="Close"><span aria-hidden="true" class="glyphicon glyphicon-remove"></span></button>',
        RESOURCE_VIEWER_FULLSCREEN_BUTTON_DOM: '<button type="button" class="btn btn-default fullscreen-button" title="Fullscreen"><span aria-hidden="true" class="glyphicon glyphicon-fullscreen"></span></button>',
        RESOURCE_VIEWER_TOOLTIPS_BUTTON_DOM: '<label class="btn btn-default tooltips-button" data-toggle="buttons" title="Toggle Tooltips"><span aria-hidden="true" class="glyphicon glyphicon-info-sign"></span></label>',
        RESOURCE_VIEWER_TOOLTIPS_BUTTON_TRACKER_DOM: '<input type="checkbox" />',
        RESOURCE_VIEWER_DOWNLOAD_BUTTON_DOM: '<a class="btn btn-default" download title="Download"><span aria-hidden="true" class="glyphicon glyphicon-download"></span></a>',
        RESOURCE_VIEWER_DOWNLOAD_BUTTON_CLASS: 'download-button',
        RESOURCE_VIEWER_BUTTON_GROUP_DOM: '<div class="btn-group"></div>',
        RESOURCE_VIEWER_PANEL_DOM: '<div class="top-panel fullscreen-hidden animated"></div>',
        RESOURCE_VIEWER_DEFAULT_LOADING_MESSAGE: 'Loading Resource',

        //Video Resource Constants
        VIDEO_RESOURCE_URL: '/sewi/resources/video/',
        VIDEO_RESOURCE_THUMBNAIL_URL: '/thumb',
        VIDEO_RESOURCE_VIEWER_VIDEO_SOURCE_DOM: '<source />',
        VIDEO_RESOURCE_VIEWER_VIDEO_DOM: '<video preload="auto"></video>',
        VIDEO_RESOURCE_VIEWER_DOM_CLASS: 'video-resource-container',
        VIDEO_RESOURCE_VIEWER_VIDEO_ID_CLASS: 'video-resource-',
        VIDEO_RESOURCE_VIEWER_VIDEO_SOURCE_DOM: '<source />',
        VIDEO_RESOURCE_VIEWER_CONTENT_DOM: '<div class="video-content animated"></div>',
        VIDEO_RESOURCE_VIEWER_BOUNDARY_DOM: '<div class="video-boundary"></div>',
        VIDEO_RESOURCE_VIEWER_CONTAINER_DOM: '<div class="video-container"></div>',
        VIDEO_RESOURCE_VIEWER_LOADING_VIDEO_MESSAGE: 'Loading Video',
        VIDEO_RESOURCE_VIEWER_LOAD_ERROR_MESSAGE: 'Failed to load video, please close and re-open video',
        VIDEO_RESOURCE_VIEWER_RESET_ZOOM_BUTTON_DOM: '<button class="btn btn-default sewi-icon zoom-button" title="Reset zoom"></button>',
        VIDEO_RESOURCE_VIEWER_ZOOM_TO_FIT_BUTTON_DOM: '<button class="btn btn-default sewi-icon zoom-to-fit-button" title="Zoom to fit"></button>',
        VIDEO_RESOURCE_VIEWER_ZOOM_SLIDER_DOM: '<input type="range" min="50" max="200" value="100" step="1" title="Adjust zoom level" data-placement="left" />',

        //Audio Resource Constants
        AUDIO_RESOURCE_URL: '/sewi/resources/audio/',
        AUDIO_ZOOM_TO_FIT_BUTTON: '<button type="button" class="btn btn-default sewi-icon-graph-select-all" id="zoomToFit"></button>',
        AUDIO_ZOOM_TO_SELECTION_BUTTON: '<button type="button" class="btn btn-default sewi-icon-graph-select-part" id="zoomToSelection"></button>',
        AUDIO_CLEAR_SELECTION_BUTTON: '<button type="button" class="btn btn-default sewi-icon-graph-select-none" id="clearSelection"></button>',
        AUDIO_ERROR_MSG_WEB_AUDIO_API_NOT_SUPPORTED: 'Error: Web Audio API is not supported by the browser.',
        AUDIO_ERROR_MSG_FILE_REQUEST_OPERATION_ABORTED:'Error: File request operation has been aborted.',
        AUDIO_ERROR_MSG_FAIL_TO_RETRIEVE_FILE: 'Error: Failed to retrieve the file',
        AUDIO_MSG_GENERATING_AMPLITUDE_WAVE_GRAPH : 'generating amplitude wave graph', 
        AUDIO_MSG_FETCHING_AUDIO_CLIP: 'fetching audio clip',
        AUDIO_ZOOM_TO_FIT_TOOLTIP: 'Zoom To Fit: zoom out to view the entire wave.',
        AUDIO_ZOOM_TO_SELECTION_TOOLTIP: 'Zoom To Selection: zoom to the selected region.',
        AUDIO_CLEAR_SELECTION_TOOLTIP: 'Clear the Selection: clear the highlighted region and reset playback duration to 100%.',
        AUDIO_WAVE_STROKE_COLOR: 'rgba(102,102,255,0.9)',
        AUDIO_COLOR_ACTIVE_TOP: '#BBB',
        AUDIO_COLOR_ACTIVE_BOTTOM: '#BBB',
        AUDIO_COLOR_INACTIVE_TOP: '#AAA',
        AUDIO_COLOR_INACTIVE_BOTTOM: '#AAA',
        AUDIO_COLOR_MOUSE_DOWN_TOP: '#AAA',
        AUDIO_COLOR_MOUSE_DOWN_BOTTOM: '#AAA',
        AUDIO_COLOR_SELECTION_STROKE: 'rgba(0, 0, 255, 0.5',
        AUDIO_COLOR_SELECTION_FILL: 'rgba(0, 0, 255, 0.2)',
        AUDIO_HORIZONTAL_LINE_STROKE_COLOR: 'rgba(0, 0, 0, 0.5)',
        AUDIO_PLOT_TECHNIQUE: {COMPRESSED: 1, DETAILED: 2},
        AUDIO_TEXT_COLOR: 'rgba(0,0,0,1)',
        AUDIO_TEXT_SHADOW_COLOR: 'rgba(0,0,0,0.25)',

        //Chart Resource Constants
        CHART_RESOURCE_URL: '/sewi/resources/chart/',
        CHART_RESOURCE_VIEWER_LOAD_ERROR_MESSAGE: 'Failed to load chart, please close and re-open chart',
        // the time interval(in ms) within which the peakDetection algorithm searches for a peak
        CHART_RESOURCE_PEAK_SEARCH_INTERVAL: 200,

        //Media Controls Constants
        MEDIA_CONTROLS_DOM_CLASS: 'media-control-panel',
        MEDIA_CONTROLS_BUTTON_DOM: '<button class="btn btn-default"></button>',
        MEDIA_CONTROLS_INNER_PANEL_DOM: '<div></div>',
        MEDIA_CONTROLS_LEFT_PANEL_CLASS: 'left',
        MEDIA_CONTROLS_RIGHT_PANEL_CLASS: 'right',
        MEDIA_CONTROLS_LONG_PANEL_CLASS: 'long',
        MEDIA_CONTROLS_DURATION_CLASS: 'duration',
        MEDIA_CONTROLS_PLAY_BUTTON_DOM: '<button class="btn btn-default video-icon play-button" title="Play/Pause"></button>',
        MEDIA_CONTROLS_VOLUME_POPUP_CLASS: 'volume-popup',
        MEDIA_CONTROLS_MUTE_BUTTON_DOM: '<button class="btn btn-default video-icon mute-button" title="Toggle mute"></button>',
        MEDIA_CONTROLS_VOLUME_SLIDER_DOM: '<input class="volume-slider" type="range" min="0.0" max="1.0" value="1.0" step="0.01" title="Adjust volume" data-placement="left" />',
        MEDIA_CONTROLS_PROGRESS_SLIDER_DOM: '<input class="progress-slider" type="range" min="0.0" max="100.0" value="0" step="0.1" title="Seek" />',
        MEDIA_CONTROLS_SEEK_BAR_DOM: '<div class="seek-bar"></div>',
        MEDIA_CONTROLS_SEEK_BAR_BACKGROUND_DOM: '<div class="seek-bar-background"></div>',
        MEDIA_CONTROLS_SEEK_BAR_BUFFER_CONTAINER_DOM: '<div class="seek-bar-buffers"></div>',
        MEDIA_CONTROLS_SEEK_BAR_BUFFER_DOM: '<div class="buffer"></div>',

        //Chart Controls Constants
        CHART_CONTROLS_DOM_CLASS: 'chart-control-panel',
        CHART_CONTROLS_INNER_PANEL_DOM: '<div></div>',
        CHART_CONTROLS_LEFT_PANEL_CLASS: 'left',
        CHART_CONTROLS_RIGHT_PANEL_CLASS: 'right',
        CHART_CONTROLS_OPTIONS_DROPDOWN_DOM: '<select multiple class="dropup" data-style="btn-default options-dropdown" title="Options"></select>',
        CHART_CONTROLS_OPTIONS_DROPDOWN_CLASS: 'options-dropdown',
        CHART_CONTROLS_RESET_ALL_POINTS_BUTTON_DOM: '<option value="resetAll" class="reset-all-points-button">Reset all points</option>',
        CHART_CONTROLS_RESET_SHOWN_POINTS_BUTTON_DOM: '<option value="resetShown" class="reset-shown-points-button">Reset visible points</option>',
        CHART_CONTROLS_ZOOM_OUT_BUTTON_DOM: '<option value="zoomOutChart" class="zoom-out-button">Zoom Out</option>',
        CHART_CONTROLS_TIMING_DISPLAY_DOM: '<label for="interval" class="timing-display-label"> Interval:  <input type="text" id = "interval" class="timing-display" readonly /></label>',
        CHART_CONTROLS_TIMING_DISPLAY_LABEL_CLASS: 'timing-display-label',
        CHART_CONTROLS_RESET_ALL_POINTS_BUTTON_CLASS: 'reset-all-points-button',
        CHART_CONTROLS_RESET_SHOWN_POINTS_BUTTON_CLASS: 'reset-shown-points-button',
        CHART_CONTROLS_ZOOM_OUT_BUTTON_CLASS: 'zoom-out-button',        
        CHART_CONTROLS_RANGE_SELECTOR_VALUE: 'rangeSelector',
        CHART_CONTROLS_RESET_ALL_POINTS_VALUE: 'resetAll',
        CHART_CONTROLS_RESET_SHOWN_POINTS_VALUE: 'resetShown',
        CHART_CONTROLS_ZOOM_OUT_VALUE: 'zoomOutChart',
        CHART_CONTROLS_RESET_ALL_POINTS_TOOLTIP_TEXT: 'Resets all the points that are selected and reverts the graph back to its original state',
        CHART_CONTROLS_RESET_SHOWN_POINTS_TOOLTIP_TEXT: 'Resets only the points that are within the current visible range of the graph',
        CHART_CONTROLS_ZOOM_OUT_TOOLTIP_TEXT: 'Zooms out the graph to show the complete range',
        CHART_CONTROLS_TIMING_DISPLAY_TOOLTIP_TEXT: 'The average time interval (in seconds) between the points that are currently shown on the screen after sorting them in increasing order of time',

        //Configurator Constants
        CONFIGURATOR_TITLE_DOM: '<h2>',
        CONFIGURATOR_SUBTITLE_DOM: '<small>',
        CONFIGURATOR_TITLE_PREFIX: 'ID #',
        CONFIGURATOR_DEFAULT_TITLE: 'Loading',
        CONFIGURATOR_DEFAULT_SUBTITLE: 'Please wait',
        CONFIGURATOR_MINIMIZE_DOM: '<div class="minimize-button"></div>',
        CONFIGURATOR_MINIMIZED_CLASS: 'minimized',
        CONFIGURATOR_COLUMN_PREFIX_CLASS: 'col-xs-',
        CONFIGURATOR_COLUMN_PREFIX_REGEX: /(^|\s)col-xs-\S+/g,
        CONFIGURATOR_ERROR_SCREEN_RETRY_DOM: '<div class="retry"></div>',
        CONFIGURATOR_ERROR_SCREEN_MESSAGE_DOM: '<p></p>',
        CONFIGURATOR_ERROR_SCREEN_BUTTON_DOM: '<button class="btn btn-default"><span class="glyphicon glyphicon-repeat"></span></button>',
        CONFIGURATOR_ERROR_SCREEN_BACKDROP_DOM: '<div></div>',
        CONFIGURATOR_RELOAD_LINK_DOM: '<button class="btn btn-link">Reload</button>',
        CONFIGURATOR_ACTIVE_ALERT_CLASS: 'active',
        CONFIGURATOR_TITLEVIEW_EXCEPTION_MESSAGE: 'options: One titleView selector/element must be provided.',
        CONFIGURATOR_BASICINFOVIEW_EXCEPTION_MESSAGE: 'options: One basicInfoView selector/element must be provided.',
        CONFIGURATOR_RESVIEWERVIEW_EXCEPTION_MESSAGE: 'options: One resViewerView selector/element must be provided.',
        CONFIGURATOR_RESGALLERYVIEW_EXCEPTION_MESSAGE: 'options: One resGalleryView selector/element must be provided.',
        CONFIGURATOR_ALERTSVIEW_EXCEPTION_MESSAGE: 'options: One alertsView selector/element must be provided.',
        CONFIGURATOR_ENCOUNTERID_EXCEPTION_MESSAGE: 'options: encounterId must be a valid string.',
        CONFIGURATOR_ALERT_GENERAL_ERROR_MESSAGE: 'An error has occured! Please reload the page!',
        CONFIGURATOR_ALERT_RELOAD_COMPONENT_ERROR_MESSAGE: 'An error has occured! Press the button to reload!',


    };

})();
