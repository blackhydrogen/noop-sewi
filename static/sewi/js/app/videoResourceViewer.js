var sewi = sewi || {};

(function() {
    /**
     * Defines a control panel suitable for controlling and manipulating media.
     *
     * @class sewi.MediaControls
     * @constructor
     * @extends sewi.ConfiguratorElement
     *
     * @param {Object} [options] Configuration options for MediaControls
     * @param {boolean} [options.isSeekBarHidden=false] If true, the seeking bar
     * will be hidden, and the user will not be able to seek the desired media.
     * @param {boolean} [options.isDurationHidden=false] If true, the duration
     * and current position of the media will be hidden.
     * @param {Object} [options.extraButtons] Additional buttons that can be
     * included within this instance of MediaControls.
     * @param {jQuery[]} [options.extraButtons.left] jQuery selectors that
     * describe buttons to be added to the left side of the MediaControls,
     * to the right of the play button.
     * @param {jQuery[]} [options.extraButtons.right] jQuery selectors that
     * describe buttons to be added to the right side of the MediaControls,
     * to the left of the mute button.
     */
    sewi.MediaControls = function(options) {
        // Safeguard if function is called without `new` keyword
        if (!(this instanceof sewi.MediaControls))
            return new sewi.MediaControls();

        sewi.ConfiguratorElement.call(this);

        var defaults = {
            isSeekHidden: false,
            isDurationHidden: false,
            extraButtons: {}
        };

        options = options || {};
        _.defaults(options, defaults);
        _.assign(this, _.pick(options, [
            'isSeekBarHidden',
            'isDurationHidden',
            'extraButtons'
        ]));

        _.assign(this, {
            isPlaying: false,
            isMuted: false,
            progress: 0.0,
            duration: 0.0,
            numOfBufferBars: 0
        });

        initDOM.call(this);
        initEvents.call(this);
    }

    sewi.inherits(sewi.MediaControls, sewi.ConfiguratorElement);

    /*
     * Helper function that formats the text for the duration
     * Takes an object with the following parameters:
     * {
     *	    currentMins: The displayed number of minutes for the current time.
     *	    currentSecs: The displayed number of seconds for the current time.
     *	    durationMins: The displayed number of minutes for the duration.
     *	    durationSecs: The displayed number of seconds for the duration.
     * }
     */
    var generateDurationText = _.template('<%= currentMins %>:<%= currentSecs %>/<%= durationMins %>:<%= durationSecs %>');

    // MediaControls private methods begin
    function initDOM() {
        this.mainDOMElement.addClass(sewi.constants.MEDIA_CONTROLS_DOM_CLASS);

        var innerPanel = $(sewi.constants.MEDIA_CONTROLS_INNER_PANEL_DOM);

        var leftButtonPanel = innerPanel.clone()
                                        .addClass(sewi.constants.MEDIA_CONTROLS_LEFT_PANEL_CLASS);
        var rightButtonPanel = innerPanel.clone()
                                         .addClass(sewi.constants.MEDIA_CONTROLS_RIGHT_PANEL_CLASS);
        var seekSliderPanel = innerPanel.clone()
                                        .addClass('center');
        var seekBarElement = $(sewi.constants.MEDIA_CONTROLS_SEEK_BAR_DOM);
        var seekBarBackgroundElement = $(sewi.constants.MEDIA_CONTROLS_SEEK_BAR_BACKGROUND_DOM);
        this.seekBarBufferContainer = $(sewi.constants.MEDIA_CONTROLS_SEEK_BAR_BUFFER_CONTAINER_DOM);

        this.playPauseButton = $(sewi.constants.MEDIA_CONTROLS_PLAY_BUTTON_DOM);
        this.muteButton = $(sewi.constants.MEDIA_CONTROLS_MUTE_BUTTON_DOM);
        this.volumeSlider = $(sewi.constants.MEDIA_CONTROLS_VOLUME_SLIDER_DOM);
        this.progressSlider = $(sewi.constants.MEDIA_CONTROLS_PROGRESS_SLIDER_DOM);

        var volumeControl = sewi.createVerticalSlider(this.volumeSlider,
                                                      this.muteButton,
                                                      sewi.constants.MEDIA_CONTROLS_VOLUME_POPUP_CLASS);

        leftButtonPanel.append(this.playPauseButton);
        rightButtonPanel.append(volumeControl);
        seekSliderPanel.append(seekBarElement);

        seekBarElement.append(seekBarBackgroundElement)
                      .append(this.seekBarBufferContainer)
                      .append(this.progressSlider);

        initExtraButtons.call(this, leftButtonPanel, rightButtonPanel);

        this.mainDOMElement.append(leftButtonPanel)
                           .append(rightButtonPanel);

        initDurationText.call(this);

        if (!this.isSeekBarHidden) {
            this.mainDOMElement.append(seekSliderPanel);
        }
    }

    function initExtraButtons(leftButtonPanel, rightButtonPanel) {
        // Add extra buttons to the left and right, if any.
        if (this.extraButtons) {
            if (this.extraButtons.left) {
                leftButtonPanel.append(this.extraButtons.left);
            }
            if (this.extraButtons.right) {
                rightButtonPanel.prepend(this.extraButtons.right);
            }
        }
    }

    function initDurationText() {

        this.durationTextPanel = $(sewi.constants.MEDIA_CONTROLS_INNER_PANEL_DOM)
            .addClass(sewi.constants.MEDIA_CONTROLS_RIGHT_PANEL_CLASS)
            .addClass(sewi.constants.MEDIA_CONTROLS_DURATION_CLASS);

        this.durationTextPanel.text(generateDurationText({
            currentSecs: '--',
            currentMins: '--',
            durationSecs: '--',
            durationMins: '--'
        }));

        if (!this.isDurationHidden) {
            this.mainDOMElement.append(this.durationTextPanel);
        }
    }

    function initEvents() {
        this.playPauseButton.click(playPauseClicked.bind(this));
        this.muteButton.click(muteClicked.bind(this));
        this.volumeSlider.on('input', volumeChanged.bind(this));
        this.progressSlider.on('input', progressSeeking.bind(this));
        this.progressSlider.on('change', progressChanged.bind(this));
    }

    function setNumberOfBufferBars(numOfBars) {
        var seekBarBufferElement = $(sewi.constants.MEDIA_CONTROLS_SEEK_BAR_BUFFER_DOM);
        var difference = numOfBars - this.numOfBufferBars;
        if (difference < 0) {
            var excessBars = this.seekBarBufferContainer.children().slice(difference);
            excessBars.remove();
        } else if (difference > 0) {
            var seekBarBufferElements = repeatString(sewi.constants.MEDIA_CONTROLS_SEEK_BAR_BUFFER_DOM, difference);
            this.seekBarBufferContainer.append(seekBarBufferElements);
        }

        this.numOfBufferBars = numOfBars;
    }

    function repeatString(string, numOfTimes) {
        return new Array(numOfTimes + 1).join(string);
    }

    function setBufferBarPositions(positions) {
        this.seekBarBufferContainer.children().each(_.partial(setBufferBarPosition, positions));
    }

    function setBufferBarPosition(positions, index) {
        $(this).css({
            left:  positions[index].left,
            right: positions[index].right
        });
    }

    function getOwnElements() {
        var elements = this.playPauseButton.add(this.muteButton)
                                           .add(this.volumeSlider)
                                           .add(this.progressSlider);

        return elements;
    }

    function playPauseClicked() {
        this.togglePlay();
    }

    function muteClicked() {
        this.toggleMute();
    }

    function volumeChanged() {
        var newVolume = parseFloat(this.volumeSlider[0].value);
        this.volume(newVolume);
    }

    function progressSeeking() {
        this.isSeeking = true;
    }

    function progressChanged() {
        var newPosition = parseFloat(this.progressSlider[0].value);
        this.isSeeking = false;
        this.playbackPosition(newPosition);
    }

    function getTimeDigits(number) {
        return ('0' + number).slice(-2);
    }

    function limitToRange(value, min, max) {
        if (value < min) {
            value = min;
        } else if (!_.isUndefined(max) && value > max) {
            value = max;
        }
        return value;
    }

    // MediaControls public methods

    /**
     * Toggles the play state of the MediaControls, and its target media.
     */
    sewi.MediaControls.prototype.togglePlay = function() {
        var isPlaying = this.isPlaying;

        this.update({ playing: !this.isPlaying });

        if (isPlaying) {
            this.mainDOMElement.trigger(sewi.constants.MEDIA_CONTROLS_PAUSED_EVENT);
        } else {
            this.mainDOMElement.trigger(sewi.constants.MEDIA_CONTROLS_PLAYING_EVENT);
        }
    }

    /**
     * Toggles the mute state of the MediaControls, and its target media.
     */
    sewi.MediaControls.prototype.toggleMute = function() {
        this.update({ muted: !this.isMuted });

        if (this.isMuted) {
            this.mainDOMElement.trigger(sewi.constants.MEDIA_CONTROLS_MUTED_EVENT);
        } else {
            this.mainDOMElement.trigger(sewi.constants.MEDIA_CONTROLS_UNMUTED_EVENT);
        }
    }

    /**
     * Gets or sets the volume of the MediaControls.
     *
     * @param  {number} [volume] The new volume.
     * @return {Number} The current volume.
     */
    sewi.MediaControls.prototype.volume = function(volume) {
        if (!_.isUndefined(volume)) {
            if (this.isMuted) {
                this.mainDOMElement.trigger(sewi.constants.MEDIA_CONTROLS_UNMUTED_EVENT);
            }

            this.update({ volume: volume });

            this.mainDOMElement.trigger(sewi.constants.MEDIA_CONTROLS_VOLUME_CHANGED_EVENT, volume);
        }

        return this.volumeSlider[0].value;
    }

    /**
     * Gets or sets the playback position of the MediaControls.
     *
     * @param  {number} [volume] The new playback position.
     * @return {Number} The current playback position.
     */
    sewi.MediaControls.prototype.playbackPosition = function(position) {
        if (!_.isUndefined(position)) {
            this.update({ position: position });

            this.mainDOMElement.trigger(sewi.constants.MEDIA_CONTROLS_POSITION_CHANGED_EVENT, position);
        }
        return this.progressSlider[0].value;
    }

    /**
     * Updates the displayed values of the MediaControls instance.
     *
     * @param  {Object} [options] A dictionary containing all values that will
     * be updated.
     * @param {boolean} [options.playing] Whether the media is currently
     * playing.
     * @param {number} [options.duration] The new duration of the media. If less
     * than 0, it will default to 0.
     * @param {number} [options.currentTime] The new playback position of the
     * media in seconds. Updates the duration display. If less than 0, it will
     * default to 0. If it is greater than <code>duration</code>, it will round
     * to the value of <code>duration</code>.
     * @param {number} [options.position] The new playback position of the media
     * as a percentage. Updates the seeking bar. Ranges from 0.0 to 100.0. If
     * outside the range, it will round to the nearest valid value.
     * @param {number} [options.volume] The new volume of the media. Ranges from
     * 0.0 to 1.0. If specified, <code>options.muted</code> will be set to
     * <code>false</code>. If outside the range, it will round to the nearest
     * valid value.
     * @param {number} [options.muted] Whether the media is current muted. Will
     * be overridden if <code>options.volume</code> is set.
     * @param {Array} [options.buffer] The locations of the streaming buffers
     * of the media.
     * @param {number} [options.buffer.start] The starting location of a
     * streaming buffer, in seconds.
     * @param {number} [options.buffer.end] The end location of a streaming
     * buffer, in seconds.
     * @return {MediaControls} The current instance of MediaControls.
     */
    sewi.MediaControls.prototype.update = function(options) {
        options = options || {};

        if (!_.isUndefined(options.playing)) {

            this.isPlaying = !!options.playing;

            if (!this.isPlaying) {
                this.mainDOMElement.removeClass('playing');
            } else {
                this.mainDOMElement.addClass('playing');
            }
        }

        if (_.isNumber(options.duration)) {
            options.duration = limitToRange(options.duration, 0);

            this.duration = options.duration;
            options.currentTime = options.currentTime || this.currentTime || 0;
        }

        if (_.isNumber(options.currentTime) && options.currentTime >= 0) {
            options.currentTime = limitToRange(options.currentTime, 0);
            this.currentTime = options.currentTime;

            if (!_.isUndefined(this.duration)) {
                this.currentTime = limitToRange(this.currentTime, 0, this.duration);

                var currentMins = Math.floor(this.currentTime / 60);
                var currentSecs = Math.floor(this.currentTime % 60);

                var durationMins = Math.floor(this.duration / 60);
                var durationSecs = Math.floor(this.duration % 60);

                this.durationTextPanel.text(generateDurationText({
                    currentMins: getTimeDigits(currentMins),
                    currentSecs: getTimeDigits(currentSecs),
                    durationMins: getTimeDigits(durationMins),
                    durationSecs: getTimeDigits(durationSecs),
                }));
            }
        }

        if (_.isNumber(options.position) && !this.isSeeking) {
            options.position = limitToRange(options.position, 0, 100);
            this.progressSlider[0].value = options.position;
        }

        if (_.isNumber(options.volume)) {
            options.volume = limitToRange(options.volume, 0, 1);
            this.volumeSlider[0].value = options.volume;
            options.muted = false;
        }

        if (!_.isUndefined(options.muted)) {
            this.isMuted = !!options.muted;

            if (this.isMuted) {
                this.mainDOMElement.addClass('muted');
            } else {
                this.mainDOMElement.removeClass('muted');
            }
        }

        if (_.isArray(options.buffers) && options.buffers.length > 0) {
            var duration = this.duration;
            var numOfBuffers = options.buffers.length;

            var positions = [];

            for (var i = 0; i < numOfBuffers; i++) {
                var start = limitToRange(options.buffers[i].start / duration, 0, 1);
                var end = limitToRange(options.buffers[i].end / duration, 0, 1);
                var position = {
                    left:  ((start) * 100) + '%',
                    right: ((1 - end) * 100) + '%'
                };
                positions.push(position);
            }

            setNumberOfBufferBars.call(this, numOfBuffers);
            setBufferBarPositions.call(this, positions);

        }
    }

    /**
     * Allows tooltips within the MediaControls to be displayed when the buttons
     * are under the mouse cursor.
     */
    sewi.MediaControls.prototype.showTooltips = function() {
        var elements = getOwnElements.call(this);

        if (!this.initializedTooltips) {
            elements.tooltip({
                container: 'body'
            });
            this.initializedTooltips = true;
        }
    }

    /**
     * Hides tooltips previously made visible via
     * {@link sewi.MediaControls#showTooltips}.
     */
    sewi.MediaControls.prototype.hideTooltips = function() {
        var elements = getOwnElements.call(this);

        if (this.initializedTooltips) {
            elements.tooltip('destroy');
            this.initializedTooltips = false;
        }
    }

})();

(function(){
    /**
     * Displays a streaming video resource for an encounter.
     *
     * @class sewi.VideoResourceViewer
     * @constructor
     * @param {Object} options Configuration options for the VideoResourceViewer
     * @param {string} options.id The UUID of the video resource to be displayed.
     */
    sewi.VideoResourceViewer = function(options) {
        // Safeguard if function is called without `new` keyword
        if (!(this instanceof sewi.VideoResourceViewer))
            return new sewi.VideoResourceViewer(options);

        sewi.ResourceViewer.call(this);
        var defaults = {

        };

        options = options || {};
        _.defaults(options, defaults);
        _.assign(this, _.pick(options, [
            'id',
        ]));

        this.isLoaded = false;

        validateArguments.call(this);
        initDOM.call(this);
        attachVideoEventHandlers.call(this);
        setUpInactivityEventHandlers.call(this);
    }

    sewi.inherits(sewi.VideoResourceViewer, sewi.ResourceViewer);

    /**
     * Fired when the video resource data has been loaded from the server.
     *
     * @event Loaded
     * @memberof sewi.VideoResourceViewer
     */

    // VideoResourceViewer private methods
    function validateArguments() {
        if (!_.isString(this.id)) {
            throw new Error('options: Valid resource id must be provided.');
        }
    }

    function initDOM() {
        this.mainDOMElement.addClass(sewi.constants.VIDEO_RESOURCE_VIEWER_DOM_CLASS);

        this.contentElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_CONTENT_DOM);
        //this.boundaryElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_BOUNDARY_DOM);
        this.videoContainerElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_CONTAINER_DOM);

        this.videoElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_VIDEO_DOM);
        this.videoElement.addClass(sewi.constants.VIDEO_RESOURCE_VIEWER_VIDEO_ID_CLASS + this.id)
                            .attr('width', '100%')
                            .attr('height', 'auto')
                            .appendTo(this.videoContainerElement);

        this.videoContainerElement.appendTo(this.contentElement);

        this.mainDOMElement.append(this.contentElement);
    }

    function initControls() {
        this.resetZoomButton = $(sewi.constants.VIDEO_RESOURCE_VIEWER_RESET_ZOOM_BUTTON_DOM);
        this.zoomToFitButton = $(sewi.constants.VIDEO_RESOURCE_VIEWER_ZOOM_TO_FIT_BUTTON_DOM);
        this.zoomSlider = $(sewi.constants.VIDEO_RESOURCE_VIEWER_ZOOM_SLIDER_DOM);

        var zoomControl = sewi.createVerticalSlider(this.zoomSlider, this.resetZoomButton);

        var zoomButtons = [];
        zoomButtons.push(this.zoomToFitButton);
        zoomButtons.push(zoomControl);

        // Ensure that the bounds of the zoom slider conform to the possible zoom levels of the PanZoomWidget
        this.zoomSlider.attr('min', this.panZoomWidget.getMinimumZoomLevel());
        this.zoomSlider.attr('max', this.panZoomWidget.getMaximumZoomLevel());

        this.controls = new sewi.MediaControls({
            extraButtons: {
                right: zoomButtons
            }
        });

        this.controlPanelElement = this.controls.getDOM();
        this.mainDOMElement.append(this.controlPanelElement);
    }

    function initPanZoomWidget(videoWidth, videoHeight) {
        this.panZoomWidget = new sewi.PanZoomWidget(this.videoContainerElement, this.contentElement, videoWidth, videoHeight);
        this.videoContainerElement.on("zoomchange", updateZoomLevel.bind(this));
    }

    function attachVideoEventHandlers() {
        this.videoElement.on('canplay', this.hideProgressBar.bind(this));
        this.videoElement.on('loadedmetadata', updateDimensions.bind(this));
        this.videoElement.on('error', playbackFailed.bind(this));
    }

    function attachControlsEventHandlers() {
        this.videoElement.on('durationchange', updateDuration.bind(this));
        this.videoElement.on('timeupdate seeked', updateTime.bind(this));
        this.videoElement.on('timeupdate progress', updateBufferedProgress.bind(this));
        this.videoElement.on('play pause', updatePlayingStatus.bind(this));
        this.videoElement.on('volumechange', updateVolume.bind(this));

        this.controlPanelElement.on(sewi.constants.MEDIA_CONTROLS_PLAYING_EVENT, playEvent.bind(this));
        this.controlPanelElement.on(sewi.constants.MEDIA_CONTROLS_PAUSED_EVENT, pauseEvent.bind(this));
        this.controlPanelElement.on(sewi.constants.MEDIA_CONTROLS_MUTED_EVENT, muteEvent.bind(this));
        this.controlPanelElement.on(sewi.constants.MEDIA_CONTROLS_UNMUTED_EVENT, unmuteEvent.bind(this));
        this.controlPanelElement.on(sewi.constants.MEDIA_CONTROLS_POSITION_CHANGED_EVENT, positionEvent.bind(this));
        this.controlPanelElement.on(sewi.constants.MEDIA_CONTROLS_VOLUME_CHANGED_EVENT, volumeEvent.bind(this));

        this.zoomSlider.on('input change', zoomLevelChanged.bind(this));
        this.resetZoomButton.click(zoomLevelReset.bind(this));
        this.zoomToFitButton.click(zoomToFitRequested.bind(this));
    }

    function setUpInactivityEventHandlers() {
        this.mainDOMElement.mousemove(showControlsTemporarily.bind(this));
    }

    function playEvent() {
        this.videoElement[0].play();
    }

    function pauseEvent() {
        this.videoElement[0].pause();
    }

    function muteEvent() {
        this.videoElement[0].muted = true;
    }

    function unmuteEvent() {
        this.videoElement[0].muted = false;
    }

    function positionEvent(event, position) {
        this.videoElement[0].currentTime = this.videoElement[0].duration * position / 100.0;
    }

    function volumeEvent(event, volume) {
        this.videoElement[0].volume = volume;
    }

    function updateDuration() {
        this.controls.update({
            duration: this.videoElement[0].duration
        });
    }

    function updateBufferedProgress() {
        var bufferedRanges = this.videoElement[0].buffered;
        var numOfBuffers = bufferedRanges.length;

        if (bufferedRanges.length > 0) {

            var buffers = [];

            for (var i = 0; i < numOfBuffers; i++) {
                var buffer = {
                    start: bufferedRanges.start(i),
                    end: bufferedRanges.end(i)
                }
                buffers.push(buffer);
            }

            this.controls.update({
                buffers: buffers
            });
        }
    }

    function updateDimensions() {
        var videoWidth = this.videoElement[0].videoWidth;
        var videoHeight = this.videoElement[0].videoHeight;

        this.videoContainerElement.css({
            width: videoWidth
        });

        //setBoundarySize.call(this, { width: videoWidth, height: videoHeight });

        if (_.isUndefined(this.panZoomWidget)) {
            initPanZoomWidget.call(this, videoWidth, videoHeight);

            initControls.call(this);
            attachControlsEventHandlers.call(this);
            updateDuration.call(this);
        }
    }

    function updateTime() {
        var currentPosition = this.videoElement[0].currentTime / this.videoElement[0].duration * 100.0;
        this.controls.update({
            position: currentPosition,
            currentTime: this.videoElement[0].currentTime
        });
    }

    function updatePlayingStatus() {
        var paused = this.videoElement[0].paused;
        this.controls.update({ playing: !paused });
    }

    function updateVolume() {
        var options = {};
        options.muted = this.videoElement[0].muted;
        if (!options.muted) {
            options.volume = this.videoElement[0].volume;
        }

        this.controls.update(options);
    }

    function playbackFailed(event) {
        var errorCode = event.target.error.code;

        switch(errorCode) {
            case event.target.error.MEDIA_ERR_ABORTED:

                //break;
            case event.target.error.MEDIA_ERR_NETWORK:

                //break;
            case event.target.error.MEDIA_ERR_DECODE:

                //break;
            case event.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:

                //break;
            default:
                this.showError(sewi.constants.VIDEO_RESOURCE_VIEWER_LOAD_FAILED_MESSAGE);
                break;
        }
    }

    function showControlsTemporarily(event) {
        // Bugfix: Some browsers trigger mousemove event when the mouse is perfectly still.
        if (this.lastMouseX != event.clientX ||
            this.lastMouseY != event.clientY) {

            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;

            this.mainDOMElement.addClass('active');
            if (this.hideTimerId) {
                clearTimeout(this.hideTimerId);
                delete this.hideTimerId;
            }
            this.hideTimerId = _.delay(hideControls.bind(this), 2000);
        }
    }

    function hideControls() {
        this.mainDOMElement.removeClass('active');
    }

    function updateZoomLevel(event, zoomLevel) {
        this.zoomSlider.val(zoomLevel);
    }

    function zoomLevelChanged() {
        var zoomLevel = parseInt(this.zoomSlider.val());

        if (!_.isUndefined(this.panZoomWidget)) {
            this.panZoomWidget.setCurrentZoomLevel(zoomLevel);
        } else {
            this.zoomSlider.val(100);
        }
    }

    function zoomLevelReset() {
        this.zoomSlider.val(100);
        zoomLevelChanged.call(this);
    }

    function zoomToFitRequested() {
        if (!_.isUndefined(this.panZoomWidget)) {
            this.panZoomWidget.setZoomLevelToZoomToFit();
        }
    }

    // Retrieve all elements that have tooltips
    function getOwnElements() {
        var elements = this.zoomToFitButton.add(this.resetZoomButton)
                                           .add(this.zoomSlider);

        return elements;
    }

    // Load video information from the server
    function loadVideoData() {
        var videoResourceURL = sewi.constants.VIDEO_RESOURCE_URL + this.id;

        this.showProgressBar();

        $.ajax({
            dataType: 'json',
            type: 'GET',
            async: true,
            url: videoResourceURL
        }).done(retrieveVideo.bind(this))
          .fail(loadFailed.bind(this));
    }

    function retrieveVideo(videoData) {
        console.log('Video data retrieved.');
        this.videoData = videoData;
        this.isLoaded = true;
        this.mainDOMElement.trigger(sewi.constants.VIDEO_RESOURCE_VIEWER_LOADED_EVENT);
        var videoSourceElement = $(sewi.constants.VIDEO_RESOURCE_VIEWER_VIDEO_SOURCE_DOM);
        videoSourceElement.attr({
            src: this.videoData.url,
            type: this.videoData.type,
        });

        this.updateProgressBar(80, sewi.constants.VIDEO_RESOURCE_VIEWER_LOADING_VIDEO_MESSAGE);

        videoSourceElement.appendTo(this.videoElement);

        this.addDownloadButton(this.videoData.url);
    }

    function loadFailed() {
        this.showError(sewi.constants.VIDEO_RESOURCE_VIEWER_LOAD_ERROR_MESSAGE);
    }

    // VideoResourceViewer public methods
    sewi.VideoResourceViewer.prototype.load = function() {
        if (!this.isLoaded) {
            loadVideoData.call(this);
        }
    }

    sewi.VideoResourceViewer.prototype.resize = function() {
        if (this.panZoomWidget) {
            this.panZoomWidget.centreTargetOnContainer();
        }
    }

    sewi.VideoResourceViewer.prototype.showTooltips = function() {
        this.controls.showTooltips();
        var elements = getOwnElements.call(this);

        elements.tooltip({
            container: 'body'
        });
    }

    sewi.VideoResourceViewer.prototype.hideTooltips = function() {
        this.controls.hideTooltips();
        var elements = getOwnElements.call(this);

        elements.tooltip('destroy');
    }

})();
