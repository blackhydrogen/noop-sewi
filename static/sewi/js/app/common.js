var sewi = sewi || {};

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

/** Declare all constants in this object. */
sewi.constants = {
    //Vertical Slider Constants
    VERTICAL_SLIDER_CONTAINER_DOM: '<div class="vertical-slider-container"></div>',
    VERTICAL_SLIDER_POPUP_DOM: '<div class="vertical-slider-popup animated"></div>',

    //Tab Constants
    TAB_MAX_NUM_TABS: 5,
    TAB_DROP_AREA_POSITIONS: {TOP: 0, BOTTOM: 1, LEFT: 2, RIGHT: 3},
    TAB_PANEL_POSITIONS: {FULL: 0, LEFT: 1, RIGHT: 2, BOTTOM: 3, TOP: 4, TOP_LEFT: 5, TOP_RIGHT: 6, BOTTOM_LEFT: 7, BOTTOM_RIGHT: 8},

    //Resource Viewer Constants
    RESOURCE_VIEWER_CLASS: 'resource-viewer',
    RESOURCE_VIEWER_CLOSE_BUTTON_DOM: '<button type="button" class="btn btn-danger close-button" title="Close"><span aria-hidden="true" class="glyphicon glyphicon-remove"></span></button>',
    RESOURCE_VIEWER_FULLSCREEN_BUTTON_DOM: '<button type="button" class="btn btn-default fullscreen-button" title="Fullscreen"><span aria-hidden="true" class="glyphicon glyphicon-fullscreen"></span></button>',
    RESOURCE_VIEWER_DOWNLOAD_BUTTON_DOM: '<a class="btn btn-default" download title="Download"><span aria-hidden="true" class="glyphicon glyphicon-download"></span></a>',
    RESOURCE_VIEWER_DOWNLOAD_BUTTON_CLASS: 'download-button',
    RESOURCE_VIEWER_PANEL_DOM: '<div class="top-panel fullscreen-hidden animated"></div>',

    //Video Resource Constants
    VIDEO_RESOURCE_URL: '/sewi/resources/video/',
    VIDEO_RESOURCE_THUMBNAIL_URL: '/thumb',
    VIDEO_RESOURCE_VIEWER_VIDEO_SOURCE_DOM: '<source />',
    VIDEO_RESOURCE_VIEWER_VIDEO_DOM: '<video preload="auto"></video>',
    VIDEO_RESOURCE_VIEWER_DOM_CLASS: 'video-resource-container',
    VIDEO_RESOURCE_VIEWER_VIDEO_ID: 'videoResource',
    VIDEO_RESOURCE_VIEWER_VIDEO_SOURCE_DOM: '<source />',
    VIDEO_RESOURCE_VIEWER_CONTENT_DOM: '<div class="video-content animated"></div>',
    VIDEO_RESOURCE_VIEWER_BOUNDARY_DOM: '<div class="video-boundary"></div>',
    VIDEO_RESOURCE_VIEWER_CONTAINER_DOM: '<div class="video-container"></div>',

    //Media Controls Constants
    MEDIA_CONTROLS_DOM_CLASS: 'media-control-panel',
    MEDIA_CONTROLS_BUTTON_DOM: '<button class="btn btn-default"></button>',
    MEDIA_CONTROLS_INNER_PANEL_DOM: '<div></div>',
    MEDIA_CONTROLS_LEFT_PANEL_CLASS: 'left',
    MEDIA_CONTROLS_RIGHT_PANEL_CLASS: 'right',
    MEDIA_CONTROLS_LONG_PANEL_CLASS: 'long',
    MEDIA_CONTROLS_DURATION_CLASS: 'duration',
    MEDIA_CONTROLS_PLAY_CLASS: 'btn-block play-button',
    MEDIA_CONTROLS_MUTE_CLASS: 'mute-button',
    MEDIA_CONTROLS_VOLUME_SLIDER_DOM: '<input class="volume-slider" type="range" min="0.0" max="1.0" value="1.0" step="0.01" />',
    MEDIA_CONTROLS_PROGRESS_SLIDER_DOM: '<input class="progress-slider" type="range" min="0.0" max="100.0" value="0" step="0.1" />',
};
