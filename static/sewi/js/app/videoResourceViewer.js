var sewi = sewi || {};

sewi.MediaControls = function() {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.MediaControls))
        return new sewi.MediaControls();

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
        selfRef.mainDOMElement.addClass(sewi.constants.MEDIA_CONTROLS_DOM_CLASS);

        var button = $(sewi.constants.MEDIA_CONTROLS_BUTTON_DOM);
        var innerPanel = $(sewi.constants.MEDIA_CONTROLS_INNER_PANEL_DOM);

        var leftInnerPanel = innerPanel.clone()
                                       .addClass(sewi.constants.MEDIA_CONTROLS_LEFT_PANEL_CLASS);
        var rightInnerPanel = innerPanel.clone()
                                        .addClass(sewi.constants.MEDIA_CONTROLS_RIGHT_PANEL_CLASS);
        var extremeRightInnerPanel = innerPanel.clone()
                                               .addClass(sewi.constants.MEDIA_CONTROLS_RIGHT_PANEL_CLASS)
                                               .addClass(sewi.constants.MEDIA_CONTROLS_LONG_PANEL_CLASS);
        var centerInnerPanel = innerPanel.clone()
                                         .addClass('center');

        selfRef.playPauseButton = button.clone()
                                        .addClass(sewi.constants.MEDIA_CONTROLS_PLAY_CLASS);
        selfRef.muteButton = button.clone()
                                   .addClass(sewi.constants.MEDIA_CONTROLS_MUTE_CLASS);
        selfRef.volumeSlider = $(sewi.constants.MEDIA_CONTROLS_VOLUME_SLIDER_DOM);
        selfRef.progressSlider = $(sewi.constants.MEDIA_CONTROLS_PROGRESS_SLIDER_DOM);

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

sewi.inherits(sewi.MediaControls, sewi.ConfiguratorElement);

sewi.MediaControls.prototype.togglePlay = function() {
    var selfRef = this;

    if (selfRef.isPlaying) {
        selfRef.mainDOMElement.trigger('Paused');
    } else {
        selfRef.mainDOMElement.trigger('Playing');
    }

    selfRef.update({ playing: !selfRef.isPlaying });

    return this;
}

sewi.MediaControls.prototype.toggleMute = function() {
    var selfRef = this;

    if (selfRef.isMuted) {
        selfRef.mainDOMElement.trigger('Unmuted');
    } else {
        selfRef.mainDOMElement.trigger('Muted');
    }

    selfRef.update({ muted: !selfRef.isMuted });

    return this;
}

sewi.MediaControls.prototype.volume = function(volume) {
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

sewi.MediaControls.prototype.playbackPosition = function(position) {
    var selfRef = this;

    if (_.isUndefined(position)) {
        return selfRef.progressSlider[0].value;
    }

    selfRef.update({ position: position });

    selfRef.mainDOMElement.trigger('PositionChanged', position);

    return this;
}

sewi.MediaControls.prototype.downloadProgress = function(progress) {
    var selfRef = this;


}

/**
 * Updates the displayed values of the MediaControls instance.
 * @param  {object} options A dictionary containing all values that will be changed.
 * @return {MediaControls} This instance of MediaControls.
 */
sewi.MediaControls.prototype.update = function(options) {
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

    sewi.ResourceViewer.call(this);

    var selfRef = this;
    var defaults = {

    };

    options = options || {};
    _.defaults(options, defaults);
    _.assign(selfRef, _.pick(options, [
        'id',
    ]));

    selfRef.isLoaded = false;
    selfRef.isDataLoaded = false;

    validateArguments();
    loadVideoData();
    initDOM();
    initControls();
    attachVideoEventHandlers();
    attachControlsEventHandlers();
    setUpInactivityEventHandlers();

    return selfRef;

    function validateArguments() {
        if (!_.isString(selfRef.id)) {
            throw new Error('options: Valid resource id must be provided.');
        }
    }

    // Load video information from the server
    function loadVideoData() {
        var videoResourceURL = sewi.constants.VIDEO_RESOURCE_URL + selfRef.id;

        $.ajax({
            dataType: 'json',
            type: 'GET',
            async: true,
            url: videoResourceURL
        }).done(function(data) {
            console.log('Video data retrieved.');
            selfRef.video = data;
            selfRef.isDataLoaded = true;
            selfRef.mainDOMElement.trigger('DataLoaded');
        });
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

    function initControls() {
        selfRef.controls = new sewi.MediaControls();

        selfRef.controlPanelElement = selfRef.controls.getDOM();
        selfRef.mainDOMElement.append(selfRef.controlPanelElement);
    }

    function attachVideoEventHandlers() {
        selfRef.videoElement.on('timeupdate seeked', updateTime);
        selfRef.videoElement.on('play pause', updatePlayingStatus);
        selfRef.videoElement.on('volumechange', updateVolume);
    }

    function attachControlsEventHandlers() {
        selfRef.controlPanelElement.on('Playing', playEvent);
        selfRef.controlPanelElement.on('Paused', pauseEvent);
        selfRef.controlPanelElement.on('Muted', muteEvent);
        selfRef.controlPanelElement.on('Unmuted', unmuteEvent);
        selfRef.controlPanelElement.on('PositionChanged', positionEvent);
        selfRef.controlPanelElement.on('VolumeChanged', volumeEvent);
    }

    function setUpInactivityEventHandlers() {
        selfRef.mainDOMElement.mousemove(showControlsTemporarily);
    }

    function playEvent() {
        selfRef.videoElement[0].play();
    }

    function pauseEvent() {
        selfRef.videoElement[0].pause();
    }

    function muteEvent() {
        selfRef.videoElement[0].muted = true;
    }

    function unmuteEvent() {
        selfRef.videoElement[0].muted = false;
    }

    function positionEvent(event, position) {
        selfRef.videoElement[0].currentTime = selfRef.videoElement[0].duration * position / 100.0;
    }

    function volumeEvent(event, volume) {
        selfRef.videoElement[0].volume = volume;
    }

    function updateTime() {
        var currentPosition = selfRef.videoElement[0].currentTime / selfRef.videoElement[0].duration * 100.0;
        selfRef.controls.update({ position: currentPosition });
    }

    function updatePlayingStatus() {
        var paused = selfRef.videoElement[0].paused;
        selfRef.controls.update({ playing: !paused });
    }

    function updateVolume() {
        var options = {};
        options.muted = selfRef.videoElement[0].muted;
        if (!options.muted) {
            options.volume = selfRef.videoElement[0].volume;
        }

        selfRef.controls.update(options);
    }

    function showControlsTemporarily() {
        selfRef.contentElement.addClass('active');
        if (selfRef.hideTimerId) {
            clearTimeout(selfRef.hideTimerId);
            delete selfRef.hideTimerId;
        }
        selfRef.hideTimerId = _.delay(hideControls, 2000);
    }

    function hideControls() {
        selfRef.contentElement.removeClass('active');
    }
}

sewi.inherits(sewi.VideoResourceViewer, sewi.ResourceViewer);

sewi.VideoResourceViewer.prototype.load = function() {
    var selfRef = this;
    if (!selfRef.isLoaded) {
        retrieveSource();

        selfRef.videoElement.css('min-width', '320px');
        selfRef.isLoaded = true;
        selfRef.mainDOMElement.trigger('Loaded');
    }

    return selfRef;

    function retrieveSource() {
        // TODO: Load this.id from server into mainDOMElement
        var videoSourceElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_VIDEO_SOURCE_DOM);
        videoSourceElement.attr({
            src: selfRef.video.url,
            type: selfRef.video.type,
        });
        videoSourceElement.appendTo(selfRef.videoElement);
    }
}
