var sewi = sewi || {};

(function() {
    sewi.MediaControls = function() {
        // Safeguard if function is called without `new` keyword
        if (!(this instanceof sewi.MediaControls))
            return new sewi.MediaControls();

        sewi.ConfiguratorElement.call(this);

        var selfRef = this;

        initDOM.call(selfRef);
        initEvents.call(selfRef);

        _.assign(selfRef, {
            isPlaying: false,
            isMuted: false,
            progress: 0.0,
            duration: 0.0
        });
    }

    sewi.inherits(sewi.MediaControls, sewi.ConfiguratorElement);

    var generateDurationText = _.template('<%= currentMins %>:<%= currentSecs %>/<%= durationMins %>:<%= durationSecs %>');

    // MediaControls private methods begin
    function initDOM() {
        var selfRef = this;

        selfRef.mainDOMElement.addClass(sewi.constants.MEDIA_CONTROLS_DOM_CLASS);

        var button = $(sewi.constants.MEDIA_CONTROLS_BUTTON_DOM);
        var innerPanel = $(sewi.constants.MEDIA_CONTROLS_INNER_PANEL_DOM);

        var playButtonPanel = innerPanel.clone()
                                        .addClass(sewi.constants.MEDIA_CONTROLS_LEFT_PANEL_CLASS);
        selfRef.durationTextPanel = innerPanel.clone()
                                           .addClass(sewi.constants.MEDIA_CONTROLS_RIGHT_PANEL_CLASS)
                                           .addClass(sewi.constants.MEDIA_CONTROLS_DURATION_CLASS);
        var muteButtonPanel = innerPanel.clone()
                                        .addClass(sewi.constants.MEDIA_CONTROLS_RIGHT_PANEL_CLASS);
        var seekSliderPanel = innerPanel.clone()
                                        .addClass('center');

        selfRef.playPauseButton = button.clone()
                                        .addClass(sewi.constants.MEDIA_CONTROLS_PLAY_CLASS);
        selfRef.muteButton = button.clone()
                                   .addClass(sewi.constants.MEDIA_CONTROLS_MUTE_CLASS);
        selfRef.volumeSlider = $(sewi.constants.MEDIA_CONTROLS_VOLUME_SLIDER_DOM);
        selfRef.progressSlider = $(sewi.constants.MEDIA_CONTROLS_PROGRESS_SLIDER_DOM);

        var volumeControl = sewi.createVerticalSlider(selfRef.volumeSlider,
                                                      selfRef.muteButton,
                                                      sewi.constants.MEDIA_CONTROLS_VOLUME_POPUP_CLASS);

        playButtonPanel.append(selfRef.playPauseButton);
        muteButtonPanel.append(volumeControl);
        seekSliderPanel.append(selfRef.progressSlider);

        selfRef.durationTextPanel.text(generateDurationText({
            currentSecs: '--',
            currentMins: '--',
            durationSecs: '--',
            durationMins: '--'
        }));

        selfRef.mainDOMElement.append(playButtonPanel)
                              .append(muteButtonPanel)
                              .append(selfRef.durationTextPanel)
                              .append(seekSliderPanel);
    }

    function initEvents() {
        var selfRef = this;

        selfRef.playPauseButton.click(playPauseClicked.bind(selfRef));
        selfRef.muteButton.click(muteClicked.bind(selfRef));
        selfRef.volumeSlider.on('input', volumeChanged.bind(selfRef));
        selfRef.progressSlider.on('change', progressChanged.bind(selfRef));
    }

    function playPauseClicked() {
        var selfRef = this;

        selfRef.togglePlay();
    }

    function muteClicked() {
        var selfRef = this;

        selfRef.toggleMute();
    }

    function volumeChanged() {
        var selfRef = this;

        selfRef.volume(selfRef.volumeSlider[0].value);
    }

    function progressChanged() {
        var selfRef = this;

        selfRef.playbackPosition(selfRef.progressSlider[0].value);
        //selfRef.setPlaybackProgress(??);
    }

    function getTimeDigits(number) {
        return ('0' + number).slice(-2);
    }

    // MediaControls public methods
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

        if (!_.isUndefined(options.duration)) {
            selfRef.duration = options.duration;
        }

        if (!_.isUndefined(options.currentTime)) {
            var currentMins = Math.floor(options.currentTime / 60);
            var currentSecs = Math.floor(options.currentTime % 60);

            var durationMins = Math.floor(selfRef.duration / 60);
            var durationSecs = Math.floor(selfRef.duration % 60);

            selfRef.durationTextPanel.text(generateDurationText({
                currentMins: getTimeDigits(currentMins),
                currentSecs: getTimeDigits(currentSecs),
                durationMins: getTimeDigits(durationMins),
                durationSecs: getTimeDigits(durationSecs),
            }));
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

})();

(function(){
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

        validateArguments.call(selfRef);
        initDOM.call(selfRef);
        initControls.call(selfRef);
        attachVideoEventHandlers.call(selfRef);
        attachControlsEventHandlers.call(selfRef);
        setUpInactivityEventHandlers.call(selfRef);

        return selfRef;
    }

    sewi.inherits(sewi.VideoResourceViewer, sewi.ResourceViewer);

    // VideoResourceViewer private methods
    function validateArguments() {
        var selfRef = this;
        if (!_.isString(selfRef.id)) {
            throw new Error('options: Valid resource id must be provided.');
        }
    }

    function initDOM() {
        var selfRef = this;
        selfRef.mainDOMElement.addClass(sewi.constants.VIDEO_RESOURCE_VIEWER_DOM_CLASS);

        selfRef.contentElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_CONTENT_DOM);
        selfRef.boundaryElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_BOUNDARY_DOM);
        selfRef.videoContainerElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_CONTAINER_DOM);

        selfRef.videoElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_VIDEO_DOM);
        selfRef.videoElement.attr({
                                'id': sewi.constants.VIDEO_RESOURCE_VIEWER_VIDEO_ID + selfRef.id,
                            })
                            .attr('width', '100%')
                            .attr('height', 'auto')
                            .appendTo(selfRef.videoContainerElement);

        selfRef.boundaryElement.appendTo(selfRef.contentElement);
        selfRef.videoContainerElement.appendTo(selfRef.contentElement);

        selfRef.mainDOMElement.append(selfRef.contentElement);

        selfRef.videoContainerElement.draggable({
            containment: selfRef.boundaryElement,
            scope: 'video'
        });
    }

    function initControls() {
        var selfRef = this;
        selfRef.controls = new sewi.MediaControls();

        selfRef.controlPanelElement = selfRef.controls.getDOM();
        selfRef.mainDOMElement.append(selfRef.controlPanelElement);
    }

    function attachVideoEventHandlers() {
        var selfRef = this;
        selfRef.videoElement.on('durationchange', updateDuration.bind(selfRef));
        selfRef.videoElement.on('loadedmetadata', updateDimensions.bind(selfRef));
        selfRef.videoElement.on('timeupdate seeked', updateTime.bind(selfRef));
        selfRef.videoElement.on('play pause', updatePlayingStatus.bind(selfRef));
        selfRef.videoElement.on('volumechange', updateVolume.bind(selfRef));
    }

    function attachControlsEventHandlers() {
        var selfRef = this;
        selfRef.controlPanelElement.on('Playing', playEvent.bind(selfRef));
        selfRef.controlPanelElement.on('Paused', pauseEvent.bind(selfRef));
        selfRef.controlPanelElement.on('Muted', muteEvent.bind(selfRef));
        selfRef.controlPanelElement.on('Unmuted', unmuteEvent.bind(selfRef));
        selfRef.controlPanelElement.on('PositionChanged', positionEvent.bind(selfRef));
        selfRef.controlPanelElement.on('VolumeChanged', volumeEvent.bind(selfRef));
    }

    function setUpInactivityEventHandlers() {
        var selfRef = this;
        selfRef.mainDOMElement.mousemove(showControlsTemporarily.bind(selfRef));
    }

    function setBoundarySize(videoSize) {
        var selfRef = this;

        if (!_.isObject(videoSize)){
            videoSize = getSize(selfRef.videoContainer);
        }

        var boundaryLeft;
        var boundaryRight;
        var boundaryTop;
        var boundaryBottom;

        boundaryLeft = boundaryRight = -videoSize.width / 2;
        boundaryTop = boundaryBottom = -videoSize.height / 2;

        selfRef.boundaryElement.css({
            left: boundaryLeft,
            right: boundaryRight,
            top: boundaryTop,
            bottom: boundaryBottom
        });

        // Reset the boundary containment
        //selfRef.videoContainerElement.draggable('option', 'containment', selfRef.boundaryElement)
    }

    function getSize(element) {
        return {
            width: $(element).width(),
            height: $(element).height()
        }
    }

    function playEvent() {
        var selfRef = this;
        selfRef.videoElement[0].play();
    }

    function pauseEvent() {
        var selfRef = this;
        selfRef.videoElement[0].pause();
    }

    function muteEvent() {
        var selfRef = this;
        selfRef.videoElement[0].muted = true;
    }

    function unmuteEvent() {
        var selfRef = this;
        selfRef.videoElement[0].muted = false;
    }

    function positionEvent(event, position) {
        var selfRef = this;
        selfRef.videoElement[0].currentTime = selfRef.videoElement[0].duration * position / 100.0;
    }

    function volumeEvent(event, volume) {
        var selfRef = this;
        selfRef.videoElement[0].volume = volume;
    }

    function updateDuration() {
        var selfRef = this;
        selfRef.controls.update({
            duration: selfRef.videoElement[0].duration
        });
    }

    function updateDimensions() {
        var selfRef = this;

        var videoWidth = selfRef.videoElement[0].videoWidth;
        var videoHeight = selfRef.videoElement[0].videoHeight;

        selfRef.videoContainerElement.css({
            width: videoWidth,
            height: videoHeight
        })
        setBoundarySize.call(selfRef, { width: videoWidth, height: videoHeight });
    }

    function updateTime() {
        var selfRef = this;

        var currentPosition = selfRef.videoElement[0].currentTime / selfRef.videoElement[0].duration * 100.0;
        selfRef.controls.update({
            position: currentPosition,
            currentTime: selfRef.videoElement[0].currentTime
        });
    }

    function updatePlayingStatus() {
        var selfRef = this;
        var paused = selfRef.videoElement[0].paused;
        selfRef.controls.update({ playing: !paused });
    }

    function updateVolume() {
        var selfRef = this;
        var options = {};
        options.muted = selfRef.videoElement[0].muted;
        if (!options.muted) {
            options.volume = selfRef.videoElement[0].volume;
        }

        selfRef.controls.update(options);
    }

    function showControlsTemporarily() {
        var selfRef = this;
        selfRef.contentElement.addClass('active');
        if (selfRef.hideTimerId) {
            clearTimeout(selfRef.hideTimerId);
            delete selfRef.hideTimerId;
        }
        selfRef.hideTimerId = _.delay(hideControls, 2000, selfRef);
    }

    function hideControls(selfRef) {
        selfRef.contentElement.removeClass('active');
    }

    // Load video information from the server
    function loadVideoData() {
        var selfRef = this;
        var videoResourceURL = sewi.constants.VIDEO_RESOURCE_URL + selfRef.id;

        $.ajax({
            dataType: 'json',
            type: 'GET',
            async: true,
            url: videoResourceURL
        }).done(retrieveVideo.bind(selfRef));
    }

    function retrieveVideo(videoData) {
        var selfRef = this;

        console.log('Video data retrieved.');
        selfRef.videoData = videoData;
        selfRef.isLoaded = true;
        selfRef.mainDOMElement.trigger('Loaded');
        var videoSourceElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_VIDEO_SOURCE_DOM);
        videoSourceElement.attr({
            src: selfRef.videoData.url,
            type: selfRef.videoData.type,
        });
        videoSourceElement.appendTo(selfRef.videoElement);

        selfRef.addDownloadButton(selfRef.videoData.url);
    }

    // VideoResourceViewer public methods
    sewi.VideoResourceViewer.prototype.load = function() {
        var selfRef = this;

        if (!selfRef.isLoaded) {
            loadVideoData.call(selfRef);
        }

        return selfRef;
    }

})();
