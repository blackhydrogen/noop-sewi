var sewi = sewi || {};

(function() {

    /**
     * Helper function to ensure that a class inherits another class.
     * Note that classes must still use {NameOfSuperClass}.call(this) in their
     * constructor to initialize themselves.
     * @param  {function} subClass   Function definition of the sub class.
     * @param  {function} superClass Function definition of the super class.
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

    /** Declare all constants in this object. */
    sewi.constants = {
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
        PROGRESS_CLASS: 'progress',
        PROGRESS_BAR_DOM: '<div class="progress-bar" role="progressbar"></div>',
        PROGRESS_BAR_TEXT_DOM: '<div class="progress-bar-text"></div>',
        PROGRESS_BAR_ANIMATED_CLASS: 'progress-bar-striped active',

        //Resource Gallery Constants
        RESOURCE_GALLERY_DOM_CLASS: 'resource-explorer-container',
        RESOURCE_GALLERY_THUMBNAIL_CLASS: 'resource',
        RESOURCE_GALLERY_THUMBNAIL_IMAGE_CLASS: 'media-thumbnail',
        RESOURCE_GALLERY_THUMBNAIL_HEADER_CLASS: 'media-header',

        //Resource Viewer Constants
        RESOURCE_VIEWER_CLASS: 'resource-viewer',
        RESOURCE_VIEWER_CLOSE_BUTTON_DOM: '<button type="button" class="btn btn-danger close-button" title="Close"><span aria-hidden="true" class="glyphicon glyphicon-remove"></span></button>',
        RESOURCE_VIEWER_FULLSCREEN_BUTTON_DOM: '<button type="button" class="btn btn-default fullscreen-button" title="Fullscreen"><span aria-hidden="true" class="glyphicon glyphicon-fullscreen"></span></button>',
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
        VIDEO_RESOURCE_VIEWER_RESET_ZOOM_BUTTON_DOM: '<button class="btn btn-default"></button>',
        VIDEO_RESOURCE_VIEWER_ZOOM_TO_FIT_BUTTON_DOM: '<button class="btn btn-default"></button>',
        VIDEO_RESOURCE_VIEWER_ZOOM_SLIDER_DOM: '<input type="range" min="50" max="200" value="100" step="1" />',

        //Media Controls Constants
        MEDIA_CONTROLS_DOM_CLASS: 'media-control-panel',
        MEDIA_CONTROLS_BUTTON_DOM: '<button class="btn btn-default"></button>',
        MEDIA_CONTROLS_INNER_PANEL_DOM: '<div></div>',
        MEDIA_CONTROLS_LEFT_PANEL_CLASS: 'left',
        MEDIA_CONTROLS_RIGHT_PANEL_CLASS: 'right',
        MEDIA_CONTROLS_LONG_PANEL_CLASS: 'long',
        MEDIA_CONTROLS_DURATION_CLASS: 'duration',
        MEDIA_CONTROLS_PLAY_CLASS: 'play-button',
        MEDIA_CONTROLS_VOLUME_POPUP_CLASS: 'volume-popup',
        MEDIA_CONTROLS_MUTE_CLASS: 'mute-button',
        MEDIA_CONTROLS_VOLUME_SLIDER_DOM: '<input class="volume-slider" type="range" min="0.0" max="1.0" value="1.0" step="0.01" />',
        MEDIA_CONTROLS_PROGRESS_SLIDER_DOM: '<input class="progress-slider" type="range" min="0.0" max="100.0" value="0" step="0.1" />',
        MEDIA_CONTROLS_SEEK_BAR_DOM: '<div class="seek-bar"></div>',
        MEDIA_CONTROLS_SEEK_BAR_BACKGROUND_DOM: '<div class="seek-bar-background"></div>',
        MEDIA_CONTROLS_SEEK_BAR_BUFFER_CONTAINER_DOM: '<div class="seek-bar-buffers"></div>',
        MEDIA_CONTROLS_SEEK_BAR_BUFFER_DOM: '<div class="buffer"></div>',

        //Configurator Constants
        CONFIGURATOR_ERROR_SCREEN_RETRY_DOM: '<div class="retry"></div>',
        CONFIGURATOR_ERROR_SCREEN_MESSAGE_DOM: '<p></p>',
        CONFIGURATOR_ERROR_SCREEN_BUTTON_DOM: '<button class="btn btn-default"><span class="glyphicon glyphicon-repeat"></span></button>',
        CONFIGURATOR_ERROR_SCREEN_BACKDROP_DOM: '<div></div>',
        CONFIGURATOR_RELOAD_LINK_DOM: '<button class="btn btn-link">Reload</button>',
        CONFIGURATOR_ACTIVE_ALERT_CLASS: 'active',
        CONFIGURATOR_ALERT_GENERAL_ERROR_MESSAGE: 'An error has occured! Please reload the page!',
    };

})();
