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
    };

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
    };

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

        //Encounter URL Constants
        ENCOUNTER_BASE_URL: '/sewi/encounter/',

        //Resource Types
        RESOURCE_TYPE:{IMAGE: 'image', VIDEO: 'video', AUDIO: 'audio', CHART: 'chart'},

        //DATA ATTRIBUTES
        DATA_ATTR: {ID:'resId', TYPE:'resType'},

        //Vertical Slider Constants
        VERTICAL_SLIDER_CONTAINER_DOM: '<div class="vertical-slider-container"></div>',
        VERTICAL_SLIDER_POPUP_DOM: '<div class="vertical-slider-popup animated"></div>',

        //Tab Constants
        TAB_MAX_NUM_TABS: 5,
        TAB_DROP_AREA_POSITIONS: {  TOP: 0,
                                    BOTTOM: 1,
                                    LEFT: 2,
                                    RIGHT: 3},
        TAB_PANEL_POSITIONS: {  FULL: 0,
                                LEFT: 1,
                                RIGHT: 2,
                                BOTTOM: 3,
                                TOP: 4,
                                TOP_LEFT: 5,
                                TOP_RIGHT: 6,
                                BOTTOM_LEFT: 7,
                                BOTTOM_RIGHT: 8},
        TAB_PREVIOUS_DROP_AREA : {  NONE: 0,
                                    LEFT: 1,
                                    RIGHT: 2,
                                    BOTTOM: 3,
                                    TOP: 4},
        TAB_CSS_CLASS_STR_PANEL_INDICATOR: '.panel-indicator',
        TAB_CONTAINER_DOM: '<div class="tab-container"></div>',
        TAB_TAB_PANEL_DOM: '<div class="tab-pane" id=""><div class="panel-content"></div></div>',
        TAB_TAB_BUTTON_GROUP_DOM: '<ul id="tab-button-group" class="nav nav-tabs" role="tablist"></ul>',
        TAB_TAB_CONTENT_DOM: '<div class="tab-content"></div>',
        TAB_ADD_TAB_BUTTON_DOM:'<li><a class="add-tab-button"><span class="glyphicon glyphicon-plus"></span></a></li>',
        TAB_CLICK_EVENT_STR: 'click',
        TAB_TAB_BUTTON_DOM:'<li class="tab-button"><a href="" role="tab" data-toggle="tab"></a></li>',
        TAB_ACTIVE_CSS:'active',
        TAB_DROP_AREA_VISIBLE_STR: 'panel-drop-area-visible',
        TAB_DROP_AREA_HOVER_STR: 'panel-drop-area-hover',
        TAB_DROP_AREA_DOM: '<div class="panel-drop-area panel-drop-area-full"></div>',
        TAB_PANEL_INDICATOR_DOM: '<div class="panel-indicator"></div>',
        TAB_PANEL_INDICATOR_DROP_AREA_DOM:'<div></div>',
        TAB_PANEL_INDICATOR_POSITION_CSS_CLASS:{RIGHT: 'panel-indicator-right',
                                                LEFT: 'panel-indicator-left',
                                                TOP: 'panel-indicator-top',
                                                BOTTOM: 'panel-indicator-bottom',
                                                TOP_LEFT: 'panel-indicator-top-left',
                                                BOTTOM_LEFT: 'panel-indicator-bottom-left',
                                                TOP_RIGHT: 'panel-indicator-top-right',
                                                BOTTOM_RIGHT: 'panel-indicator-bottom-right',
                                                LEFT_TOP: 'panel-indicator-left-top',
                                                RIGHT_TOP: 'panel-indicator-right-top',
                                                LEFT_BOTTOM: 'panel-indicator-left-bottom',
                                                RIGHT_BOTTOM: 'panel-indicator-right-bottom'},
        TAB_NO_TAB_EVENT: 'noTab',
        TAB_REMOVE_BUTTON_DOM: '<span class="glyphicon glyphicon-remove"></span>',
        TAB_PANEL_STR: 'PANEL',
        TAB_PANEL_DOM: '<div class="animated panel"></div>',
        TAB_PANEL_STATE_CSS_CLASS :{FULL: 'panel-full',
                                    LEFT: 'panel-left',
                                    RIGHT: 'panel-right',
                                    BOTTOM: 'panel-bottom',
                                    TOP: 'panel-top',
                                    TOP_LEFT: 'panel-top-left',
                                    TOP_RIGHT: 'panel-top-right',
                                    BOTTOM_LEFT: 'panel-bottom-left',
                                    BOTTOM_RIGHT: 'panel-bottom-right'},
        TAB_PANEL_DROP_AREA_RIGHT_DOM: '<div class="panel-drop-area panel-drop-area-right"></div>',
        TAB_PANEL_DROP_AREA_LEFT_DOM: '<div class="panel-drop-area panel-drop-area-left"></div>',
        TAB_PANEL_DROP_AREA_TOP_DOM: '<div class="panel-drop-area panel-drop-area-top"></div>',
        TAB_PANEL_DROP_AREA_BOTTOM_DOM: '<div class="panel-drop-area panel-drop-area-bottom"></div>',

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
        /**
         * Fired when the basic encounter information has been loaded and the patient's
         * name and ID is known. This is fired to pass the name and ID along to the Configurator
         * for display as a header.
         * @event BEILoaded
         * @memberof sewi.BasicEncounterInfoViewer
         * @param {Object} patientDetails An object holding the patient's name and details.
         * @param {String} patientDetails.id The patient's ID.
         * @param {String} patientDetails.name The patient's name, in the format of
         * "LastName, FirstName".
         */
        BEI_BEI_LOADED_EVENT: 'BEILoaded',

        //Resource Gallery Constants
        RESOURCE_GALLERY_URL_SUFFIX: '/resourceList',
        RESOURCE_GALLERY_THUMBNAIL_URL_BASE: '/sewi/resources/',
        RESOURCE_GALLERY_THUMBNAIL_URL_SUFFIX: '/thumb',
        RESOURCE_GALLERY_RESOURCE_DOM: '<div class="resource">',
        RESOURCE_GALLERY_RESOURCE_THUMBNAIL_DOM: '<div class="resource-thumbnail-container"><img class="resource-thumbnail" src="/static/sewi/images/loading.gif"></div>',
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
        RESOURCE_VIEWER_TOOLTIPS_BUTTON_DOM: '<label class="btn btn-default tooltips-button" data-toggle="buttons" title="Toggle Tooltips"><span aria-hidden="true" class="glyphicon glyphicon-question-sign"></span></label>',
        RESOURCE_VIEWER_TOOLTIPS_BUTTON_TRACKER_DOM: '<input type="checkbox" />',
        RESOURCE_VIEWER_DOWNLOAD_BUTTON_DOM: '<a class="btn btn-default download-button" download title="Download"><span aria-hidden="true" class="glyphicon glyphicon-download"></span></a>',
        RESOURCE_VIEWER_DOWNLOAD_BUTTON_CLASS: 'download-button',
        RESOURCE_VIEWER_BUTTON_GROUP_DOM: '<div class="btn-group"></div>',
        RESOURCE_VIEWER_PANEL_DOM: '<div class="top-panel fullscreen-hidden animated"></div>',
        RESOURCE_VIEWER_DEFAULT_LOADING_MESSAGE: 'Loading Resource',

        /**
         * Fired when the resource viewer is to enter fullscreen mode.
         * @event fullscreenToggled
         * @memberof sewi.ResourceViewer
         */
        RESOURCE_VIEWER_FULLSCREEN_TOGGLED_EVENT: 'fullscreenToggled',

        /**
         * Fired when the resource viewer is closing.
         * @event closing
         * @memberof sewi.ResourceViewer
         */
        RESOURCE_VIEWER_CLOSING_EVENT: 'closing',

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
        VIDEO_RESOURCE_VIEWER_ZOOM_SLIDER_DOM: '<input class="zoom-slider" type="range" min="50" max="200" value="100" step="1" title="Adjust zoom level" data-placement="left" />',

        /**
         * Fired when the media is muted.
         * @event loaded
         * @memberof sewi.MediaControls
         */
        VIDEO_RESOURCE_VIEWER_LOADED_EVENT: 'loaded',

        //Audio Resource Constants
        AUDIO_RESOURCE_URL: '/sewi/resources/audio/',
        AUDIO_RESOURCE_ZOOM_TO_FIT_BUTTON: '<button type="button" class="btn btn-default sewi-icon-graph-select-all" id="zoomToFit"></button>',
        AUDIO_RESOURCE_ZOOM_TO_SELECTION_BUTTON: '<button type="button" class="btn btn-default sewi-icon-graph-select-part" id="zoomToSelection"></button>',
        AUDIO_RESOURCE_CLEAR_SELECTION_BUTTON: '<button type="button" class="btn btn-default sewi-icon-graph-select-none" id="clearSelection"></button>',
        AUDIO_RESOURCE_ERROR_MSG_WEB_AUDIO_API_NOT_SUPPORTED: 'Error: Web Audio API is not supported by the browser.',
        AUDIO_RESOURCE_ERROR_MSG_FILE_REQUEST_OPERATION_ABORTED:'Error: File request operation has been aborted.',
        AUDIO_RESOURCE_ERROR_MSG_FAIL_TO_RETRIEVE_FILE: 'Error: Failed to retrieve the file',
        AUDIO_RESOURCE_ERROR_MSG_FAILED_TO_DECODE_AUDIO_FILE: 'Error: failed to decode the audio file.',
        AUDIO_RESOURCE_MSG_GENERATING_AMPLITUDE_WAVE_GRAPH : 'generating amplitude wave graph',
        AUDIO_RESOURCE_MSG_FETCHING_AUDIO_CLIP: 'fetching audio clip',
        AUDIO_RESOURCE_ZOOM_TO_FIT_TOOLTIP: 'Zoom To Fit: zoom out to view the entire wave.',
        AUDIO_RESOURCE_ZOOM_TO_SELECTION_TOOLTIP: 'Zoom To Selection: zoom to the selected region.',
        AUDIO_RESOURCE_CLEAR_SELECTION_TOOLTIP: 'Clear the Selection: clear the highlighted region and reset playback duration to 100%.',
        AUDIO_RESOURCE_WAVE_STROKE_COLOR: 'rgba(102,102,255,0.9)',
        AUDIO_RESOURCE_COLOR_ACTIVE_TOP: '#BBB',
        AUDIO_RESOURCE_COLOR_ACTIVE_BOTTOM: '#BBB',
        AUDIO_RESOURCE_COLOR_INACTIVE_TOP: '#AAA',
        AUDIO_RESOURCE_COLOR_INACTIVE_BOTTOM: '#AAA',
        AUDIO_RESOURCE_COLOR_MOUSE_DOWN_TOP: '#AAA',
        AUDIO_RESOURCE_COLOR_MOUSE_DOWN_BOTTOM: '#AAA',
        AUDIO_RESOURCE_COLOR_SELECTION_STROKE: 'rgba(0, 0, 255, 0.5',
        AUDIO_RESOURCE_COLOR_SELECTION_FILL: 'rgba(0, 0, 255, 0.2)',
        AUDIO_RESOURCE_HORIZONTAL_LINE_STROKE_COLOR: 'rgba(0, 0, 0, 0.5)',
        AUDIO_RESOURCE_PLOT_TECHNIQUE: {COMPRESSED: 1, DETAILED: 2},
        AUDIO_RESOURCE_TEXT_COLOR: 'rgba(0,0,0,1)',
        AUDIO_RESOURCE_TEXT_SHADOW_COLOR: 'rgba(0,0,0,0.25)',
        AUDIO_RESOURCE_AUDIO_RESOURCE_VIEWER_CSS: 'audio-resource-viewer',
        AUDIO_RESOURCE_CONTENT_DOM:'<div class="audio-content"></div>',
        AUDIO_RESOURCE_EVENT_BUFFER_COPIED: 'bufferCopied',
        AUDIO_RESOURCE_CHANNEL_CSS_CLASS: {LEFT: 'left-channel', RIGHT: 'right-channel'},

        //Chart Resource Constants
        CHART_RESOURCE_LEGEND_CONTAINER_DOM: '<div class="legend-container"> </div>',
        CHART_RESOURCE_CHART_CONTAINER_DOM: '<div class="main-graph-container"> </div>',
        CHART_RESOURCE_MAIN_DOM_CLASS: 'time-series-graph-container',
        CHART_RESOURCE_URL: '/sewi/resources/chart/',
        CHART_RESOURCE_VIEWER_LOAD_ERROR_MESSAGE: 'Failed to load chart, please close and re-open chart',
        CHART_RESOURCE_INVALID_RESOURCEID_ERROR: 'options: Valid resource id must be provided.',
        CHART_RESOURCE_PEAK_SEARCH_INTERVAL: 200, // the time interval(in ms) within which the peakDetection algorithm searches for a peak
        CHART_RESOURCE_LEGEND_X_DOM: '<b style="color:#c61055">Time</b>: ',
        CHART_RESOURCE_X_AXIS_UNIT: 'ms ',
        CHART_RESOURCE_Y_AXIS_UNIT: 'mV',
        CHART_RESOURCE_LEGEND_Y_DOM: '<b style="color:#c61055"></b>',
        CHART_RESOURCE_SELECTED_POINT_HIGHLIGHT_COLOR: '#000',
        CHART_RESOURCE_LINE_GRAPH_COLOR: '#c61055',
        CHART_RESOURCE_X_AXIS_LABEL: 'Time',
        CHART_RESOURCE_Y_AXIS_LABEL: 'Value',
        CHART_RESOURCE_X_AXIS_LABEL_WIDTH: 55,
        CHART_RESOURCE_Y_AXIS_LABEL_WIDTH: 37,
        CHART_RESOURCE_HIGHLIGHT_POINT_SIZE: 4,
        CHART_RESOURCE_RESET_ALL_POINTS_EVENT: 'allPointsReset',
        CHART_RESOURCE_RESET_VISIBLE_POINTS_EVENT: 'visiblePointsReset',
        CHART_RESOURCE_ZOOM_OUT_GRAPH_EVENT: 'zoomOutGraph',
        CHART_RESOURCE_Y_AXIS_ZOOMED_EVENT: 'zoomedIntoY',
        CHART_RESOURCE_MINIMUM_DIFFERENCE_FOR_PEAK_IDENTIFICATION: 0.2,

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

        /**
         * Fired when the media is playing.
         * @event controlsPlaying
         * @memberof sewi.MediaControls
         */
        MEDIA_CONTROLS_PLAYING_EVENT: 'controlsPlaying',

        /**
         * Fired when the media is paused.
         * @event controlsPaused
         * @memberof sewi.MediaControls
         */
        MEDIA_CONTROLS_PAUSED_EVENT: 'controlsPaused',

        /**
         * Fired when the media is muted.
         * @event controlsMuted
         * @memberof sewi.MediaControls
         */
        MEDIA_CONTROLS_MUTED_EVENT: 'controlsMuted',

        /**
         * Fired when the media is unmuted.
         * @event controlsUnmuted
         * @memberof sewi.MediaControls
         */
        MEDIA_CONTROLS_UNMUTED_EVENT: 'controlsUnmuted',

        /**
         * Fired when the volume of the media is changed.
         * @event controlsVolumeChanged
         * @memberof sewi.MediaControls
         * @param {number} volume The current volume of the media.
         */
        MEDIA_CONTROLS_VOLUME_CHANGED_EVENT: 'controlsVolumeChanged',

        /**
         * Fired when the current playback position of the media is changed.
         * @event controlsPositionChanged
         * @memberof sewi.MediaControls
         * @param {number} volume The current playback position of the media.
         */
        MEDIA_CONTROLS_POSITION_CHANGED_EVENT: 'controlsPositionChanged',

        //Chart Controls Constants
        CHART_CONTROLS_DOM_CLASS: 'chart-control-panel',
        CHART_CONTROLS_INNER_PANEL_DOM: '<div></div>',
        CHART_CONTROLS_LEFT_PANEL_CLASS: 'left',
        CHART_CONTROLS_RIGHT_PANEL_CLASS: 'right',
        CHART_CONTROLS_OPTIONS_DROPDOWN_DOM: '<select multiple class="dropup" data-style="btn-default options-dropdown" title="Options"></select>',
        CHART_CONTROLS_OPTIONS_DROPDOWN_CLASS: 'options-dropdown',
        CHART_CONTROLS_RESET_ALL_POINTS_BUTTON_DOM: '<option value="resetAll" class="reset-all-points-button">Reset all points</option>',
        CHART_CONTROLS_RESET_VISIBLE_POINTS_BUTTON_DOM: '<option value="resetVisible" class="reset-visible-points-button">Reset visible points</option>',
        CHART_CONTROLS_ZOOM_OUT_BUTTON_DOM: '<option value="zoomOutChart" class="zoom-out-button">Zoom Out</option>',
        CHART_CONTROLS_TIMING_DISPLAY_DOM: '<label for="interval" class="timing-display-label"> Interval:  <input type="text" id = "interval" class="timing-display" readonly /></label>',
        CHART_CONTROLS_TIMING_DISPLAY_LABEL_CLASS: 'timing-display-label',
        CHART_CONTROLS_RESET_ALL_POINTS_BUTTON_CLASS: 'reset-all-points-button',
        CHART_CONTROLS_RESET_VISIBLE_POINTS_BUTTON_CLASS: 'reset-visible-points-button',
        CHART_CONTROLS_ZOOM_OUT_BUTTON_CLASS: 'zoom-out-button',
        CHART_CONTROLS_RANGE_SELECTOR_VALUE: 'rangeSelector',
        CHART_CONTROLS_RESET_ALL_POINTS_VALUE: 'resetAll',
        CHART_CONTROLS_RESET_VISIBLE_POINTS_VALUE: 'resetVisible',
        CHART_CONTROLS_ZOOM_OUT_VALUE: 'zoomOutChart',
        CHART_CONTROLS_RESET_ALL_POINTS_TOOLTIP_TEXT: 'Resets all the points that are selected and reverts the graph back to its original state',
        CHART_CONTROLS_RESET_VISIBLE_POINTS_TOOLTIP_TEXT: 'Resets only the points that are within the current visible range of the graph',
        CHART_CONTROLS_ZOOM_OUT_TOOLTIP_TEXT: 'Zooms out the graph to show the complete range',
        CHART_CONTROLS_TIMING_DISPLAY_TOOLTIP_TEXT: 'The average time interval (in seconds) between selected points that are currently on the screen after sorting them in increasing order of time',

        // Image Resource Constants
        IMAGE_RESOURCE_MAIN_DOM_ELEMENT_CLASS: 'image-resource-main-container',
        IMAGE_RESOURCE_CONTAINER_ELEMENT: '<div class="image-resource-image-container"></div>',
        IMAGE_RESOURCE_IMAGE_ELEMENT: '<img class="image-resource-image">',
        IMAGE_RESOURCE_RESOURCE_URL_PREFIX: '/sewi/resources/image/',
        IMAGE_RESOURCE_LOAD_RESOURCE_ERROR_MESSAGE: 'An error occurred while trying to load the image resource.',
        IMAGE_RESOURCE_IN_MEMORY_IMAGE_ELEMENT: '<img>',
        IMAGE_RESOURCE_IN_MEMORY_CANVAS_ELEMENT: '<canvas></canvas>',

        IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_NONE: 'none',
        IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_SHADOWS: 'shadows',
        IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_MIDTONES: 'midtones',
        IMAGE_RESOURCE_CONTRAST_STRETCHING_RANGE_HIGHLIGHTS: 'highlights',
        IMAGE_RESOURCE_COLORIZE_FILTER_NAME_NONE: 'none',
        IMAGE_RESOURCE_COLORIZE_FILTER_NAME_GRAYSCALE: 'grayscale',
        // False colors' filter names are implictly defined by each element inside IMAGE_RESOURCE_FALSE_COLOR_PALETTE

        IMAGE_RESOURCE_GENERATED_IMAGE_TYPE_JPEG: 'image/jpeg',
        IMAGE_RESOURCE_GENERATED_IMAGE_QUALITY_JPEG: 0.9,


        // This defines the mapping values for the false-color filters (Maps grayscale values to RGB.)
        // values[i] = [R, G, B], where i is the grayscale value (in grayscale, i = R = G = B).
        IMAGE_RESOURCE_FALSE_COLOR_PALETTE: {
            flame: {
                name: "Flame",
                values: [[3, 0, 0], [5, 0, 0], [5, 0, 0], [8, 0, 0], [8, 0, 0], [11, 0, 0], [11, 0, 0], [13, 0, 0], [13, 0, 0], [16, 0, 0], [19, 0, 0], [19, 0, 0], [21, 0, 0], [21, 0, 0], [24, 0, 0], [27, 0, 0], [27, 0, 0], [29, 0, 0], [32, 0, 0], [32, 0, 0], [35, 0, 0], [37, 0, 0], [40, 0, 0], [40, 0, 0], [43, 0, 0], [45, 0, 0], [48, 0, 0], [48, 0, 0], [50, 0, 0], [53, 0, 0], [56, 0, 0], [58, 0, 0], [58, 0, 0], [61, 0, 0], [64, 0, 0], [66, 0, 0], [69, 0, 0], [72, 0, 0], [74, 0, 0], [74, 0, 0], [77, 0, 0], [80, 0, 0], [82, 0, 0], [85, 0, 0], [88, 0, 0], [90, 0, 0], [93, 0, 0], [96, 0, 0], [98, 0, 0], [101, 0, 0], [104, 0, 0], [106, 0, 0], [109, 0, 0], [112, 0, 0], [114, 0, 0], [117, 0, 0], [120, 0, 0], [122, 0, 0], [125, 0, 0], [128, 0, 0], [130, 0, 0], [133, 0, 0], [135, 0, 0], [138, 0, 0], [141, 0, 0], [143, 0, 0], [146, 0, 0], [149, 0, 0], [151, 0, 0], [154, 0, 0], [157, 0, 0], [159, 0, 0], [162, 0, 0], [167, 0, 0], [170, 0, 0], [173, 0, 0], [175, 0, 0], [178, 0, 0], [181, 0, 0], [183, 0, 0], [186, 0, 0], [191, 0, 0], [194, 0, 0], [197, 0, 0], [199, 0, 0], [202, 0, 0], [205, 0, 0], [207, 0, 0], [213, 0, 0], [215, 0, 0], [218, 0, 0], [220, 0, 0], [223, 0, 0], [228, 0, 0], [231, 0, 0], [234, 0, 0], [236, 0, 0], [239, 0, 0], [244, 0, 0], [247, 0, 0], [250, 0, 0], [252, 0, 0], [255, 0, 0], [255, 5, 0], [255, 8, 0], [255, 11, 0], [255, 13, 0], [255, 16, 0], [255, 21, 0], [255, 24, 0], [255, 27, 0], [255, 29, 0], [255, 35, 0], [255, 37, 0], [255, 40, 0], [255, 43, 0], [255, 48, 0], [255, 50, 0], [255, 53, 0], [255, 56, 0], [255, 61, 0], [255, 64, 0], [255, 66, 0], [255, 69, 0], [255, 74, 0], [255, 77, 0], [255, 80, 0], [255, 82, 0], [255, 88, 0], [255, 90, 0], [255, 93, 0], [255, 96, 0], [255, 98, 0], [255, 104, 0], [255, 106, 0], [255, 109, 0], [255, 112, 0], [255, 117, 0], [255, 120, 0], [255, 122, 0], [255, 125, 0], [255, 130, 0], [255, 133, 0], [255, 135, 0], [255, 138, 0], [255, 143, 0], [255, 146, 0], [255, 149, 0], [255, 151, 0], [255, 157, 0], [255, 159, 0], [255, 162, 0], [255, 165, 0], [255, 167, 0], [255, 173, 0], [255, 175, 0], [255, 178, 0], [255, 181, 0], [255, 183, 0], [255, 189, 0], [255, 191, 0], [255, 194, 0], [255, 197, 0], [255, 199, 0], [255, 205, 0], [255, 207, 0], [255, 210, 0], [255, 213, 0], [255, 215, 0], [255, 220, 0], [255, 223, 0], [255, 226, 0], [255, 228, 0], [255, 231, 0], [255, 234, 0], [255, 236, 0], [255, 242, 0], [255, 244, 0], [255, 247, 0], [255, 250, 0], [255, 252, 0], [255, 255, 0], [255, 255, 4], [255, 255, 8], [255, 255, 16], [255, 255, 20], [255, 255, 24], [255, 255, 28], [255, 255, 32], [255, 255, 36], [255, 255, 40], [255, 255, 44], [255, 255, 48], [255, 255, 52], [255, 255, 56], [255, 255, 60], [255, 255, 64], [255, 255, 68], [255, 255, 72], [255, 255, 76], [255, 255, 80], [255, 255, 84], [255, 255, 88], [255, 255, 92], [255, 255, 96], [255, 255, 100], [255, 255, 104], [255, 255, 108], [255, 255, 112], [255, 255, 116], [255, 255, 120], [255, 255, 124], [255, 255, 128], [255, 255, 131], [255, 255, 135], [255, 255, 139], [255, 255, 143], [255, 255, 147], [255, 255, 147], [255, 255, 151], [255, 255, 155], [255, 255, 159], [255, 255, 163], [255, 255, 167], [255, 255, 171], [255, 255, 171], [255, 255, 175], [255, 255, 179], [255, 255, 183], [255, 255, 187], [255, 255, 187], [255, 255, 191], [255, 255, 195], [255, 255, 199], [255, 255, 199], [255, 255, 203], [255, 255, 207], [255, 255, 211], [255, 255, 211], [255, 255, 215], [255, 255, 219], [255, 255, 219], [255, 255, 223], [255, 255, 227], [255, 255, 227], [255, 255, 231], [255, 255, 231], [255, 255, 235], [255, 255, 239], [255, 255, 239], [255, 255, 243], [255, 255, 243], [255, 255, 247], [255, 255, 247], [255, 255, 251], [255, 255, 251]]
            },
            rainbow: {
                name: "Rainbow",
                values: [[0, 0, 131], [0, 0, 135], [0, 0, 135], [0, 0, 139], [0, 0, 139], [0, 0, 143], [0, 0, 143], [0, 0, 147], [0, 0, 147], [0, 0, 151], [0, 0, 155], [0, 0, 155], [0, 0, 159], [0, 0, 159], [0, 0, 163], [0, 0, 167], [0, 0, 167], [0, 0, 171], [0, 0, 175], [0, 0, 175], [0, 0, 179], [0, 0, 183], [0, 0, 187], [0, 0, 187], [0, 0, 191], [0, 0, 195], [0, 0, 199], [0, 0, 199], [0, 0, 203], [0, 0, 207], [0, 0, 211], [0, 0, 215], [0, 0, 215], [0, 0, 219], [0, 0, 223], [0, 0, 227], [0, 0, 231], [0, 0, 235], [0, 0, 239], [0, 0, 239], [0, 0, 243], [0, 0, 247], [0, 0, 251], [0, 0, 255], [0, 4, 255], [0, 8, 255], [0, 12, 255], [0, 16, 255], [0, 20, 255], [0, 24, 255], [0, 28, 255], [0, 32, 255], [0, 36, 255], [0, 40, 255], [0, 44, 255], [0, 48, 255], [0, 52, 255], [0, 56, 255], [0, 60, 255], [0, 64, 255], [0, 68, 255], [0, 72, 255], [0, 76, 255], [0, 80, 255], [0, 84, 255], [0, 88, 255], [0, 92, 255], [0, 96, 255], [0, 100, 255], [0, 104, 255], [0, 108, 255], [0, 112, 255], [0, 116, 255], [0, 124, 255], [0, 128, 255], [0, 131, 255], [0, 135, 255], [0, 139, 255], [0, 143, 255], [0, 147, 255], [0, 151, 255], [0, 159, 255], [0, 163, 255], [0, 167, 255], [0, 171, 255], [0, 175, 255], [0, 179, 255], [0, 183, 255], [0, 191, 255], [0, 195, 255], [0, 199, 255], [0, 203, 255], [0, 207, 255], [0, 215, 255], [0, 219, 255], [0, 223, 255], [0, 227, 255], [0, 231, 255], [0, 239, 255], [0, 243, 255], [0, 247, 255], [0, 251, 255], [0, 255, 255], [8, 255, 247], [12, 255, 243], [16, 255, 239], [20, 255, 235], [24, 255, 231], [32, 255, 223], [36, 255, 219], [40, 255, 215], [44, 255, 211], [52, 255, 203], [56, 255, 199], [60, 255, 195], [64, 255, 191], [72, 255, 183], [76, 255, 179], [80, 255, 175], [84, 255, 171], [92, 255, 163], [96, 255, 159], [100, 255, 155], [104, 255, 151], [112, 255, 143], [116, 255, 139], [120, 255, 135], [124, 255, 131], [131, 255, 124], [135, 255, 120], [139, 255, 116], [143, 255, 112], [147, 255, 108], [155, 255, 100], [159, 255, 96], [163, 255, 92], [167, 255, 88], [175, 255, 80], [179, 255, 76], [183, 255, 72], [187, 255, 68], [195, 255, 60], [199, 255, 56], [203, 255, 52], [207, 255, 48], [215, 255, 40], [219, 255, 36], [223, 255, 32], [227, 255, 28], [235, 255, 20], [239, 255, 16], [243, 255, 12], [247, 255, 8], [251, 255, 4], [255, 251, 0], [255, 247, 0], [255, 243, 0], [255, 239, 0], [255, 235, 0], [255, 227, 0], [255, 223, 0], [255, 219, 0], [255, 215, 0], [255, 211, 0], [255, 203, 0], [255, 199, 0], [255, 195, 0], [255, 191, 0], [255, 187, 0], [255, 179, 0], [255, 175, 0], [255, 171, 0], [255, 167, 0], [255, 163, 0], [255, 159, 0], [255, 155, 0], [255, 147, 0], [255, 143, 0], [255, 139, 0], [255, 135, 0], [255, 131, 0], [255, 128, 0], [255, 124, 0], [255, 120, 0], [255, 112, 0], [255, 108, 0], [255, 104, 0], [255, 100, 0], [255, 96, 0], [255, 92, 0], [255, 88, 0], [255, 84, 0], [255, 80, 0], [255, 76, 0], [255, 72, 0], [255, 68, 0], [255, 64, 0], [255, 60, 0], [255, 56, 0], [255, 52, 0], [255, 48, 0], [255, 44, 0], [255, 40, 0], [255, 36, 0], [255, 32, 0], [255, 28, 0], [255, 24, 0], [255, 20, 0], [255, 16, 0], [255, 12, 0], [255, 8, 0], [255, 4, 0], [255, 0, 0], [251, 0, 0], [247, 0, 0], [243, 0, 0], [239, 0, 0], [235, 0, 0], [235, 0, 0], [231, 0, 0], [227, 0, 0], [223, 0, 0], [219, 0, 0], [215, 0, 0], [211, 0, 0], [211, 0, 0], [207, 0, 0], [203, 0, 0], [199, 0, 0], [195, 0, 0], [195, 0, 0], [191, 0, 0], [187, 0, 0], [183, 0, 0], [183, 0, 0], [179, 0, 0], [175, 0, 0], [171, 0, 0], [171, 0, 0], [167, 0, 0], [163, 0, 0], [163, 0, 0], [159, 0, 0], [155, 0, 0], [155, 0, 0], [151, 0, 0], [151, 0, 0], [147, 0, 0], [143, 0, 0], [143, 0, 0], [139, 0, 0], [139, 0, 0], [135, 0, 0], [135, 0, 0], [131, 0, 0], [131, 0, 0]]
            },
            spectrum: {
                name: "Spectrum",
                values: [[255, 0, 0], [255, 6, 0], [255, 6, 0], [255, 12, 0], [255, 12, 0], [255, 18, 0], [255, 18, 0], [255, 24, 0], [255, 24, 0], [255, 30, 0], [255, 36, 0], [255, 36, 0], [255, 42, 0], [255, 42, 0], [255, 48, 0], [255, 54, 0], [255, 54, 0], [255, 60, 0], [255, 66, 0], [255, 66, 0], [255, 72, 0], [255, 78, 0], [255, 84, 0], [255, 84, 0], [255, 90, 0], [255, 96, 0], [255, 102, 0], [255, 102, 0], [255, 108, 0], [255, 114, 0], [255, 120, 0], [255, 126, 0], [255, 126, 0], [255, 131, 0], [255, 137, 0], [255, 143, 0], [255, 149, 0], [255, 155, 0], [255, 161, 0], [255, 161, 0], [255, 167, 0], [255, 173, 0], [255, 179, 0], [255, 185, 0], [255, 191, 0], [255, 197, 0], [255, 203, 0], [255, 209, 0], [255, 215, 0], [255, 221, 0], [255, 227, 0], [255, 233, 0], [255, 239, 0], [255, 245, 0], [255, 251, 0], [253, 255, 0], [247, 255, 0], [241, 255, 0], [235, 255, 0], [229, 255, 0], [223, 255, 0], [217, 255, 0], [211, 255, 0], [205, 255, 0], [199, 255, 0], [193, 255, 0], [187, 255, 0], [181, 255, 0], [175, 255, 0], [169, 255, 0], [163, 255, 0], [157, 255, 0], [151, 255, 0], [139, 255, 0], [133, 255, 0], [128, 255, 0], [122, 255, 0], [116, 255, 0], [110, 255, 0], [104, 255, 0], [98, 255, 0], [86, 255, 0], [80, 255, 0], [74, 255, 0], [68, 255, 0], [62, 255, 0], [56, 255, 0], [50, 255, 0], [38, 255, 0], [32, 255, 0], [26, 255, 0], [20, 255, 0], [14, 255, 0], [2, 255, 0], [0, 255, 4], [0, 255, 10], [0, 255, 16], [0, 255, 22], [0, 255, 34], [0, 255, 40], [0, 255, 46], [0, 255, 52], [0, 255, 58], [0, 255, 70], [0, 255, 76], [0, 255, 82], [0, 255, 88], [0, 255, 94], [0, 255, 106], [0, 255, 112], [0, 255, 118], [0, 255, 124], [0, 255, 135], [0, 255, 141], [0, 255, 147], [0, 255, 153], [0, 255, 165], [0, 255, 171], [0, 255, 177], [0, 255, 183], [0, 255, 195], [0, 255, 201], [0, 255, 207], [0, 255, 213], [0, 255, 225], [0, 255, 231], [0, 255, 237], [0, 255, 243], [0, 255, 255], [0, 249, 255], [0, 243, 255], [0, 237, 255], [0, 231, 255], [0, 219, 255], [0, 213, 255], [0, 207, 255], [0, 201, 255], [0, 189, 255], [0, 183, 255], [0, 177, 255], [0, 171, 255], [0, 159, 255], [0, 153, 255], [0, 147, 255], [0, 141, 255], [0, 129, 255], [0, 124, 255], [0, 118, 255], [0, 112, 255], [0, 100, 255], [0, 94, 255], [0, 88, 255], [0, 82, 255], [0, 76, 255], [0, 64, 255], [0, 58, 255], [0, 52, 255], [0, 46, 255], [0, 40, 255], [0, 28, 255], [0, 22, 255], [0, 16, 255], [0, 10, 255], [0, 4, 255], [8, 0, 255], [14, 0, 255], [20, 0, 255], [26, 0, 255], [32, 0, 255], [44, 0, 255], [50, 0, 255], [56, 0, 255], [62, 0, 255], [68, 0, 255], [74, 0, 255], [80, 0, 255], [92, 0, 255], [98, 0, 255], [104, 0, 255], [110, 0, 255], [116, 0, 255], [122, 0, 255], [128, 0, 255], [133, 0, 255], [145, 0, 255], [151, 0, 255], [157, 0, 255], [163, 0, 255], [169, 0, 255], [175, 0, 255], [181, 0, 255], [187, 0, 255], [193, 0, 255], [199, 0, 255], [205, 0, 255], [211, 0, 255], [217, 0, 255], [223, 0, 255], [229, 0, 255], [235, 0, 255], [241, 0, 255], [247, 0, 255], [253, 0, 255], [255, 0, 251], [255, 0, 245], [255, 0, 239], [255, 0, 233], [255, 0, 227], [255, 0, 221], [255, 0, 215], [255, 0, 209], [255, 0, 203], [255, 0, 197], [255, 0, 191], [255, 0, 185], [255, 0, 179], [255, 0, 173], [255, 0, 167], [255, 0, 167], [255, 0, 161], [255, 0, 155], [255, 0, 149], [255, 0, 143], [255, 0, 137], [255, 0, 131], [255, 0, 131], [255, 0, 126], [255, 0, 120], [255, 0, 114], [255, 0, 108], [255, 0, 108], [255, 0, 102], [255, 0, 96], [255, 0, 90], [255, 0, 90], [255, 0, 84], [255, 0, 78], [255, 0, 72], [255, 0, 72], [255, 0, 66], [255, 0, 60], [255, 0, 60], [255, 0, 54], [255, 0, 48], [255, 0, 48], [255, 0, 42], [255, 0, 42], [255, 0, 36], [255, 0, 30], [255, 0, 30], [255, 0, 24], [255, 0, 24], [255, 0, 18], [255, 0, 18], [255, 0, 12], [255, 0, 12]]
            }
        },

        // Image Control Constants
        /**
         * Fired when the brightness slider's value has changed.
         * @event brightnessChanged
         * @memberof sewi.ImageControls
         * @param {number} brightness The current value of the brightness slider.
         */
        IMAGE_CONTROLS_BRIGHTNESS_CHANGED_EVENT: 'brightnessChanged',
        /**
         * Fired when the contrast slider's value has changed.
         * @event contrastChanged
         * @memberof sewi.ImageControls
         * @param {number} contrast The current value of the contrast slider.
         */
        IMAGE_CONTROLS_CONTRAST_CHANGED_EVENT: 'contrastChanged',
        /**
         * Fired when any of the custom filters' controls have changed value.
         * @event filtersChanged
         * @memberof sewi.ImageControls
         * @param ...
         */
        IMAGE_CONTROLS_CUSTOM_FILTERS_CHANGED_EVENT: 'filtersChanged',
        /**
         * Fired when the contrast slider's value has changed.
         * @event contrastChanged
         * @memberof sewi.ImageControls
         * @param {number} contrast The current value of the contrast slider.
         */
        IMAGE_CONTROLS_ZOOM_LEVEL_CHANGED_EVENT: 'zoomLevelChanged',
        /**
         * Fired when the contrast slider's value has changed.
         * @event contrastChanged
         * @memberof sewi.ImageControls
         * @param {number} contrast The current value of the contrast slider.
         */
        IMAGE_CONTROLS_ZOOM_TO_FIT_REQUESTED_EVENT: 'zoomToFitRequested',

        IMAGE_CONTROLS_DEFAULT_BUTTON_ELEMENT: '<button class="btn btn-default">',
        IMAGE_CONTROLS_DEFAULT_SLIDER_ELEMENT: '<input type="range" min="0" max="2" value="1" step="0.1" />',

        IMAGE_CONTROLS_INNER_PANEL_ELEMENT: '<div>',
        IMAGE_CONTROLS_BRIGHTNESS_BUTTON_INNER_LABEL_ELEMENT: '<span class="sewi-icon-brightness-medium">',
        IMAGE_CONTROLS_CONTRAST_BUTTON_INNER_LABEL_ELEMENT: '<span class="sewi-icon-contrast">',
        IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_BUTTON_INNER_LABEL_ELEMENT: '<span class="glyphicon glyphicon-tasks">',
        IMAGE_CONTROLS_ZOOM_TO_FIT_BUTTON_INNER_LABEL_ELEMENT: '<span class="sewi-icon-zoom-to-fit">',
        IMAGE_CONTROLS_ZOOM_BUTTON_INNER_LABEL_ELEMENT: '<span class="sewi-icon-zoom-to-full">',

        IMAGE_CONTROLS_FILTER_MENU_ELEMENT: '<select class="dropup" multiple role="menu" title="Filters" data-style="btn-default filter-menu-button">',

        IMAGE_CONTROLS_COLORIZE_OPTGROUP_ELEMENT: '<optgroup label="Colorize" data-max-options="1">',
        IMAGE_CONTROLS_COLORIZE_VALUES_PREFIX: 'colorize.',
        IMAGE_CONTROLS_GRAYSCALE_OPTION_ELEMENT: '<option value="colorize.grayscale">Grayscale</option>',
        IMAGE_CONTROLS_FLAME_OPTION_ELEMENT: '<option value="colorize.flame">Flame</option>',
        IMAGE_CONTROLS_RAINBOW_OPTION_ELEMENT: '<option value="colorize.rainbow">Rainbow</option>',
        IMAGE_CONTROLS_SPECTRUM_OPTION_ELEMENT: '<option value="colorize.spectrum">Spectrum</option>',


        IMAGE_CONTROLS_ADVANCED_FILTERS_OPTGROUP_ELEMENT: '<optgroup label="Advanced Filters">',
        IMAGE_CONTROLS_ADVANCED_FILTERS_VALUES_PREFIX: 'filter.',
        IMAGE_CONTROLS_INVERT_OPTION_ELEMENT: '<option value="filter.invert">Invert</option>',
        IMAGE_CONTROLS_DIFFERENCE_OPTION_ELEMENT: '<option value="filter.difference">Difference</option>',
        IMAGE_CONTROLS_AUTO_CONTRAST_OPTION_ELEMENT: '<option value="filter.autoContrast">Auto Contrast</option>',

        IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_ELEMENT: '<select class="dropup" multiple role="menu" title="C. Stretch" data-style="btn-default contrast-stretching-menu-button" data-max-options="1">',

        IMAGE_CONTROLS_CONTRAST_STRETCHING_SHADOWS_OPTION_ELEMENT: '<option value="shadows">Shadows</option>',
        IMAGE_CONTROLS_CONTRAST_STRETCHING_MIDTONES_OPTION_ELEMENT: '<option value="midtones">Midtones</option>',
        IMAGE_CONTROLS_CONTRAST_STRETCHING_HIGHLIGHTS_OPTION_ELEMENT: '<option value="highlights">Highlights</option>',

        IMAGE_CONTROLS_ANIMATED_CLASS: 'animated',
        IMAGE_CONTROLS_MAIN_DOM_ELEMENT_CLASS: 'image-control-panel',
        IMAGE_CONTROLS_LEFT_BUTTON_PANEL_CLASS: 'left',
        IMAGE_CONTROLS_RIGHT_BUTTON_PANEL_CLASS: 'right',
        IMAGE_CONTROLS_BRIGHTNESS_BUTTON_CLASS: 'brightness-button',
        IMAGE_CONTROLS_BRIGHTNESS_SLIDER_CLASS: 'brightness-slider',
        IMAGE_CONTROLS_CONTRAST_BUTTON_CLASS: 'contrast-button',
        IMAGE_CONTROLS_CONTRAST_SLIDER_CLASS: 'contrast-slider',
        IMAGE_CONTROLS_GRAYSCALE_OPTION_CLASS: 'grayscale-option',
        IMAGE_CONTROLS_FLAME_OPTION_CLASS: 'flame-option',
        IMAGE_CONTROLS_RAINBOW_OPTION_CLASS: 'rainbow-option',
        IMAGE_CONTROLS_SPECTRUM_OPTION_CLASS: 'spectrum-option',
        IMAGE_CONTROLS_INVERT_OPTION_CLASS: 'invert-option',
        IMAGE_CONTROLS_DIFFERENCE_OPTION_CLASS: 'difference-option',
        IMAGE_CONTROLS_AUTO_CONTRAST_OPTION_CLASS: 'autoContrast-option',
        IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_BUTTON_CLASS: 'contrast-stretching-menu-button',
        IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_BUTTON_OPTION_SELECTED_CLASS: 'option-selected',
        IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_BUTTON_CLASS: 'contrast-stretching-settings-button',
        IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_BUTTON_HIDDEN_CLASS: 'hidden',
        IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_SLIDER_CLASS: 'contrast-stretching-settings-slider',
        IMAGE_CONTROLS_ZOOM_TO_FIT_BUTTON_CLASS: 'zoom-to-fit-button',
        IMAGE_CONTROLS_ZOOM_BUTTON_CLASS: 'zoom-button',
        IMAGE_CONTROLS_ZOOM_SLIDER_CLASS: 'zoom-slider',

        IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_SLIDER_MIN_VALUE: "1",
        IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_SLIDER_MAX_VALUE: "2.5",
        IMAGE_CONTROLS_CONTRAST_STRETCHING_SETTINGS_SLIDER_DEFAULT_VALUE: "1",

        IMAGE_CONTROLS_ZOOM_SLIDER_MIN_VALUE: "50",
        IMAGE_CONTROLS_ZOOM_SLIDER_MAX_VALUE: "200",
        IMAGE_CONTROLS_ZOOM_SLIDER_DEFAULT_VALUE: "100",
        IMAGE_CONTROLS_ZOOM_SLIDER_STEP_SIZE: "1",

        IMAGE_CONTROLS_BRIGHTNESS_BUTTON_TOOLTIP_HTML: 'Adjusts the brightness of the image. Additionally, you may click on this button to reset the image\'s brightness to its original value.',
        IMAGE_CONTROLS_CONTRAST_BUTTON_TOOLTIP_HTML: 'Adjusts the contrast of the image. Additionally, you may click on this button to reset the image\'s contrast to its original value.',
        IMAGE_CONTROLS_GRAYSCALE_OPTION_TOOLTIP_HTML: 'Removes color details from the image, forming a grayscale respresentation.<br><img src="' + sewi.staticPath +'images/image_tooltip_grayscale.png" height="100px" width="200px">',
        IMAGE_CONTROLS_FLAME_OPTION_TOOLTIP_HTML: 'Artifically colors a grayscale image with the flame color spectrum, where the darker shades are mapped to black and red, and the lighter shades mapped to yellow and white. This filter may highlight hard-to-see shade differences of the original image. Different color spectrum filters will provide different levels of details at different areas of the image.<br><img src="' + sewi.staticPath +'images/image_tooltip_false_color_flame.png" height="100px" width="200px">',
        IMAGE_CONTROLS_RAINBOW_OPTION_TOOLTIP_HTML: 'Artifically colors a grayscale image with the colors (largely) from the rainbow spectrum. Darker shades are mapped to blue, while the lighter shades are mapped to red; shades in-between the two extremes are mapped to the respective in-between colors of the rainbow. This filter may highlight hard-to-see shade differences of the original image. Different color spectrum filters will provide different levels of details at different areas of the image.<br><img src="' + sewi.staticPath +'images/image_tooltip_false_color_rainbow.png" height="100px" width="200px">',
        IMAGE_CONTROLS_SPECTRUM_OPTION_TOOLTIP_HTML: 'Artifically colors a grayscale image with the entire color spectrum. This filter may highlight hard-to-see shade differences of the original image. Different color spectrum filters will provide different levels of details at different areas of the image.<br><img src="' + sewi.staticPath +'images/image_tooltip_false_color_spectrum.png" height="100px" width="200px">',
        IMAGE_CONTROLS_INVERT_OPTION_TOOLTIP_HTML: 'Inverts the colors of image. Simply stated, on a grayscale image, white becomes black, while black becomes white.<br><img src="' + sewi.staticPath +'images/image_tooltip_invert.png" height="100px" width="200px">',
        IMAGE_CONTROLS_DIFFERENCE_OPTION_TOOLTIP_HTML: 'Produces an image that represents the difference in color intensity between the original and inverted image. Generally this filter improves the contrast of the image.<br><img src="' + sewi.staticPath +'images/image_tooltip_difference.png" height="100px" width="200px">',
        IMAGE_CONTROLS_AUTO_CONTRAST_OPTION_TOOLTIP_HTML: 'Artifically stretches the colors of the image to make use of the entire grayscale spectrum, which intensifies the difference among the various shades of gray, generally improving contrast.<br><img src="' + sewi.staticPath +'images/image_tooltip_histogram_equalization.png" height="100px" width="200px">',
        IMAGE_CONTROLS_CONTRAST_STRETCHING_MENU_BUTTON_TOOLTIP_HTML: '<span TOOLTIP_HTML="underline">Contrast Stretching</span><br>This filter artifically stretches the grayscale range of a specific region at the cost of other regions. This improves the constrast for the stretched region, but reduces the constrast for the other regions. The example below stretches the range of the middle region (i.e. mid-shades of grays), while the range of the upper (white/lighter shades of grays) and lower regions (black/darker shades of grays) are compressed. There are 3 regions to choose from, and you may vary the degree of intensity to stretch the range of the region selected.<br><img src="' + sewi.staticPath +'images/image_tooltip_contrast_stretch_middle.png"  height="100px" width="200px">',
        IMAGE_CONTROLS_ZOOM_TO_FIT_BUTTON_TOOLTIP_HTML: 'Scales the image to fit the available space.',
        IMAGE_CONTROLS_ZOOM_BUTTON_TOOLTIP_HTML: 'Adjusts the image\'s current zoom level. Additionally, you may click on this button to scale the image back to 100% - i.e. its original size.',

        // PanZoomWidget Constants
        /**
         * Fired when the target's zoom value has changed due to events monitored by PanZoomWidget (e.g. mousewheel events)
         * @event zoomChanged
         * @memberof sewi.PanZoomWidget
         * @param {number} newZoomPercentage The new zoom percentage value of the target.
         */
        PAN_ZOOM_WIDGET_TARGET_ZOOM_CHANGED_EVENT: 'targetZoomChanged',

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
        CONFIGURATOR_COMPONENT_ERROR_EVENT: 'errorOccured',

    };

})();
