var sewi = sewi || {};

sewi.VideoResourceViewer = function(options) {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.VideoResourceViewer))
        return new sewi.VideoResourceViewer(options);

    sewi.ConfiguratorElement.call(this);

    var selfRef = this;
    var defaults = {

    };

    options = options || {};
    _.defaults(options, defaults);
    _.assign(selfRef, _.pick(options, [
        'id',
    ]));

    selfRef.isLoaded = false;

    validateArguments();
    initDOM();

    return selfRef;

    function validateArguments() {
        if (!_.isString(selfRef.id)) {
            throw new Error('options: Valid resource id must be provided.');
        }
    }

    function initDOM() {
        selfRef.mainDOMElement.addClass(sewi.constants.VIDEO_RESOURCE_VIEWER_DOM_CLASS);

        selfRef.contentElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_CONTENT_DOM);

        selfRef.videoElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_VIDEO_DOM);
        selfRef.videoElement.attr({
                                'id': sewi.constants.VIDEO_RESOURCE_VIEWER_VIDEO_ID + selfRef.id,
                            })
                            .attr('width', '100%')
                            .attr('height', 'auto')
                            .appendTo(selfRef.contentElement);

        selfRef.mainDOMElement.append(selfRef.contentElement);
    }
}

sewi.inherits(sewi.VideoResourceViewer, sewi.ConfiguratorElement);

sewi.VideoResourceViewer.prototype.load = function() {
    var selfRef = this;
    if (!selfRef.isLoaded) {
        retrieveSource();

        selfRef.videoElement.css('min-width', '320px');
        selfRef.isLoaded = true;
    }

    return selfRef;

    function retrieveSource() {
        // TODO: Load this.id from server into mainDOMElement
        var videoSource = $(sewi.constants.VIDEO_RESOURCE_VIEWER_VIDEO_SOURCE_DOM);
        videoSource.attr({
            src: 'http://techslides.com/demos/sample-videos/small.mp4',
            type: 'video/mp4',
        });
        videoSource.appendTo(selfRef.videoElement);
    }
}
