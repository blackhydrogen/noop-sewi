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
    VIDEO_RESOURCE_VIEWER_VIDEO_DOM: '<video preload="auto"></video>',
    VIDEO_RESOURCE_VIEWER_DOM_CLASS: 'video-resource-container',
    VIDEO_RESOURCE_VIEWER_VIDEO_ID: 'videoResource',
    VIDEO_RESOURCE_VIEWER_VIDEO_SOURCE_DOM: '<source />',
    VIDEO_RESOURCE_VIEWER_CONTENT_DOM: '<div class="video-content animated"></div>',

};
