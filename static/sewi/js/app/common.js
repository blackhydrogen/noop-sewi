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
    RESOURCE_VIEWER_CLASS: 'resource-viewer',
    RESOURCE_VIEWER_CLOSE_BUTTON_DOM: '<button type="button" class="btn btn-danger close-button"><span aria-hidden="true">&times;</span></button>',
    RESOURCE_VIEWER_FULLSCREEN_BUTTON_DOM: '<button type="button" class="btn btn-default fullscreen-button">F</button>',
    RESOURCE_VIEWER_MOVE_BUTTON_DOM: '<button type="button" class="btn btn-default move-button">M</button>',
    RESOURCE_VIEWER_PANEL_DOM: '<div class="top-panel fullscreen-hidden"></div>',

	MAX_NUM_TABS: 5,
	DROP_AREA_POSITIONS: {TOP: 0, BOTTOM: 1, LEFT: 2, RIGHT: 3},

    VIDEO_RESOURCE_URL: '/sewi/resources/video/',
    VIDEO_RESOURCE_THUMBNAIL_URL: '/thumb',
    VIDEO_RESOURCE_VIEWER_VIDEO_DOM: '<video preload="auto"></video>',
    VIDEO_RESOURCE_VIEWER_DOM_CLASS: 'video-resource-container',
    VIDEO_RESOURCE_VIEWER_VIDEO_ID: 'videoResource',
    VIDEO_RESOURCE_VIEWER_VIDEO_SOURCE_DOM: '<source />',
    VIDEO_RESOURCE_VIEWER_CONTENT_DOM: '<div class="video-content animated"></div>',

    VIDEO_CONTROLS_DOM_CLASS: 'video-control-panel',
    VIDEO_CONTROLS_BUTTON_DOM: '<button class="btn btn-default"></button>',
    VIDEO_CONTROLS_INNER_PANEL_DOM: '<div></div>',
    VIDEO_CONTROLS_LEFT_PANEL_CLASS: 'left',
    VIDEO_CONTROLS_RIGHT_PANEL_CLASS: 'right',
    VIDEO_CONTROLS_LONG_PANEL_CLASS: 'long',
    VIDEO_CONTROLS_PLAY_CLASS: 'btn-block play-button',
    VIDEO_CONTROLS_MUTE_CLASS: 'mute-button',
    VIDEO_CONTROLS_VOLUME_SLIDER_DOM: '<input class="volume-slider" type="range" min="0.0" max="1.0" value="1.0" step="0.01" />',
    VIDEO_CONTROLS_PROGRESS_SLIDER_DOM: '<input class="progress-slider" type="range" min="0.0" max="100.0" value="0" step="0.1" />',
};
