var sewi = sewi || {};

sewi.VideoControls = function() {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.VideoControls))
        return new sewi.VideoControls();

    sewi.ConfiguratorElement.call(this);

    var selfRef = this;

    initDOM();
    initEvents();

    _.assign(selfRef, {
        isPlaying: false,
        isMuted: false,
        progress: 0.0,
    });

    function initDOM() {
        selfRef.mainDOMElement.addClass(sewi.constants.VIDEO_CONTROLS_DOM_CLASS);

        var button = $(sewi.constants.VIDEO_CONTROLS_BUTTON_DOM);
        var innerPanel = $(sewi.constants.VIDEO_CONTROLS_INNER_PANEL_DOM);

        var leftInnerPanel = innerPanel.clone()
                                       .addClass(sewi.constants.VIDEO_CONTROLS_LEFT_PANEL_CLASS);
        var rightInnerPanel = innerPanel.clone()
                                        .addClass(sewi.constants.VIDEO_CONTROLS_RIGHT_PANEL_CLASS);
        var extremeRightInnerPanel = innerPanel.clone()
                                               .addClass(sewi.constants.VIDEO_CONTROLS_RIGHT_PANEL_CLASS)
                                               .addClass(sewi.constants.VIDEO_CONTROLS_LONG_PANEL_CLASS);
        var centerInnerPanel = innerPanel.clone()
                                         .addClass('center');

        selfRef.playPauseButton = button.clone()
                                        .addClass(sewi.constants.VIDEO_CONTROLS_PLAY_CLASS);
        selfRef.muteButton = button.clone()
                                   .addClass(sewi.constants.VIDEO_CONTROLS_MUTE_CLASS);
        selfRef.volumeSlider = $(sewi.constants.VIDEO_CONTROLS_VOLUME_SLIDER_DOM);
        selfRef.progressSlider = $(sewi.constants.VIDEO_CONTROLS_PROGRESS_SLIDER_DOM);

        leftInnerPanel.append(selfRef.playPauseButton);
        rightInnerPanel.append(selfRef.muteButton)
        extremeRightInnerPanel.append(selfRef.volumeSlider);
        centerInnerPanel.append(selfRef.progressSlider);

        selfRef.mainDOMElement.append(leftInnerPanel)
                              .append(extremeRightInnerPanel)
                              .append(rightInnerPanel)
                              .append(centerInnerPanel);
    }

    function initEvents() {
        selfRef.playPauseButton.click(playPauseClicked);
        selfRef.muteButton.click(muteClicked);
        selfRef.volumeSlider.on('input', volumeChanged);
        selfRef.progressSlider.on('change', progressChanged);
    }

    function playPauseClicked() {
        selfRef.togglePlay();
    }

    function muteClicked() {
        selfRef.toggleMute();
    }

    function volumeChanged() {
        selfRef.volume(selfRef.volumeSlider[0].value);
    }

    function progressChanged() {
        selfRef.playbackPosition(selfRef.progressSlider[0].value);
        //selfRef.setPlaybackProgress(??);
    }
}

sewi.inherits(sewi.VideoControls, sewi.ConfiguratorElement);

sewi.VideoControls.prototype.togglePlay = function() {
    var selfRef = this;

    if (selfRef.isPlaying) {
        selfRef.mainDOMElement.trigger('Paused');
    } else {
        selfRef.mainDOMElement.trigger('Playing');
    }

    selfRef.update({ playing: !selfRef.isPlaying });

    return this;
}

sewi.VideoControls.prototype.toggleMute = function() {
    var selfRef = this;

    if (selfRef.isMuted) {
        selfRef.mainDOMElement.trigger('Unmuted');
    } else {
        selfRef.mainDOMElement.trigger('Muted');
    }

    selfRef.update({ muted: !selfRef.isMuted });

    return this;
}

sewi.VideoControls.prototype.volume = function(volume) {
    var selfRef = this;

    if (_.isUndefined(volume)) {
        return selfRef.volumeSlider[0].value;
    }

    if (selfRef.isMuted) {
        selfRef.mainDOMElement.trigger('Unmuted');
    }

    selfRef.update({ volume: volume });

    selfRef.mainDOMElement.trigger('VolumeChanged', volume);

    return this;
}

sewi.VideoControls.prototype.playbackPosition = function(position) {
    var selfRef = this;

    if (_.isUndefined(position)) {
        return selfRef.progressSlider[0].value;
    }

    selfRef.update({ position: position });

    selfRef.mainDOMElement.trigger('PositionChanged', position);

    return this;
}

sewi.VideoControls.prototype.downloadProgress = function(progress) {
    var selfRef = this;


}

/**
 * Updates the displayed values of the VideoControls instance.
 * @param  {object} options A dictionary containing all values that will be changed.
 * @return {VideoControls} This instance of VideoControls.
 */
sewi.VideoControls.prototype.update = function(options) {
    options = options || {};

    var selfRef = this;

    if (!_.isUndefined(options.playing)) {

        selfRef.isPlaying = !!options.playing;

        if (!selfRef.isPlaying) {
            selfRef.mainDOMElement.removeClass('playing');
        } else {
            selfRef.mainDOMElement.addClass('playing');
        }
    }

    if (!_.isUndefined(options.position)) {
        selfRef.progressSlider[0].value = options.position;
    }

    if (!_.isUndefined(options.volume)) {
        selfRef.volumeSlider[0].value = options.volume;
        options.muted = false;
    }

    if (!_.isUndefined(options.muted)) {
        selfRef.isMuted = !!options.muted;

        if (!selfRef.isMuted) {
            selfRef.mainDOMElement.removeClass('muted');
        } else {
            selfRef.mainDOMElement.addClass('muted');
        }
    }
}

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
