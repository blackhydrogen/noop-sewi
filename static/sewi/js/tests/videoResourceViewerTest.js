(function() {
    var constants = {
        TEST_EXTRA_BUTTON_DOM: '<button type="button" class="extra-button"></button>',
        TEST_EXTRA_BUTTON_CLASS: 'extra-button',
        TEST_VALID_DURATION: 156,
        TEST_INVALID_DURATION_1: 'invalid',
        TEST_INVALID_DURATION_2: -1,
        TEST_INVALID_INITIAL_DURATION_TEXT: '00:00/00:00',
        TEST_VALID_INITIAL_DURATION_TEXT: '00:00/02:36',
        TEST_INVALID_TIME_1: 'invalid',
        TEST_INVALID_TIME_2: -1,
        TEST_VALID_TIME: 1,
        TEST_VALID_UPDATED_DURATION_TEXT: '00:01/02:36',
        TEST_INVALID_VOLUME_1: 'silent',
        TEST_INVALID_VOLUME_2: 1.1,
        TEST_VALID_VOLUME: 0.5,
        TEST_INVALID_UPDATED_VOLUME: 1.0,
        TEST_VALID_UPDATED_VOLUME: 0.5,
        TEST_INVALID_POSITION_1: 'silent',
        TEST_INVALID_POSITION_2: 101,
        TEST_VALID_POSITION: 45,
        TEST_INVALID_UPDATED_POSITION: 100,
        TEST_VALID_UPDATED_POSITION: 45.0,
        TEST_BUFFER_DURATION: 320,
        TEST_INVALID_BUFFER_1: { start: 'beginning', end: 'end' },
        TEST_INVALID_BUFFER_2: { start: -1, end: 321 },
        TEST_VALID_SINGLE_BUFFER: { start: 20, end: 205 },
        TEST_VALID_MULTIPLE_BUFFERS: [
            { start: 0, end: 21 },
            { start: 40, end: 100 },
            { start: 105, end: 106 },
            { start: 120, end: 140 },
            { start: 160, end: 186 },
            { start: 189, end: 205 },
            { start: 206, end: 260 },
            { start: 266, end: 290 },
            { start: 291, end: 302 },
            { start: 302, end: 303 },
        ],

        PLAY_BUTTON_CLASS: 'play-button',
        MUTE_BUTTON_CLASS: 'mute-button',
        VOLUME_SLIDER_CLASS: 'volume-slider',
        PROGRESS_SLIDER_CLASS: 'progress-slider',
        DURATION_CLASS: 'duration',
        BUFFER_CLASS: 'buffer',
        PLAYING_CLASS: 'playing',
        MUTED_CLASS: 'muted',

        PLAYING_EVENT: sewi.constants.MEDIA_CONTROLS_PLAYING_EVENT,
        PAUSED_EVENT: sewi.constants.MEDIA_CONTROLS_PAUSED_EVENT,
        MUTED_EVENT: sewi.constants.MEDIA_CONTROLS_MUTED_EVENT,
        UNMUTED_EVENT: sewi.constants.MEDIA_CONTROLS_UNMUTED_EVENT,
        VOLUME_CHANGED_EVENT: sewi.constants.MEDIA_CONTROLS_VOLUME_CHANGED_EVENT,
        POSITION_CHANGED_EVENT: sewi.constants.MEDIA_CONTROLS_POSITION_CHANGED_EVENT,

    };

    function isIn(containerElement, htmlClass) {
        return containerElement.find('.' + htmlClass).length > 0;
    }

    QUnit.module('Media Controls', {
        setup: function() {
            this.fixture = $('#qunit-fixture');
            this.sewi = window.sewi;
        }
    });

    QUnit.test('Basic Initialization', function(assert) {
        var controls = new this.sewi.MediaControls();

        this.fixture.append(controls.getDOM());

        assert.ok(isIn(this.fixture, constants.PLAY_BUTTON_CLASS), 'Media controls adds the play/pause button.');
        assert.ok(isIn(this.fixture, constants.MUTE_BUTTON_CLASS), 'Media controls adds the mute button.');
        assert.ok(isIn(this.fixture, constants.VOLUME_SLIDER_CLASS), 'Media controls adds the volume slider.');
        assert.ok(isIn(this.fixture, constants.PROGRESS_SLIDER_CLASS), 'Media controls adds the progress slider.');
        assert.ok(isIn(this.fixture, constants.DURATION_CLASS), 'Media controls adds the duration display.');
    });

    QUnit.test('Initialization Without Seek Bar', function(assert) {
        var controls = new this.sewi.MediaControls({
            isSeekBarHidden: true
        });

        this.fixture.append(controls.getDOM());

        assert.ok(!isIn(this.fixture, constants.PROGRESS_SLIDER_CLASS), 'Media controls can remove the progress slider.');
        assert.ok(isIn(this.fixture, constants.PLAY_BUTTON_CLASS), 'Play/pause button not affected.');
        assert.ok(isIn(this.fixture, constants.MUTE_BUTTON_CLASS), 'Mute button not affected.');
        assert.ok(isIn(this.fixture, constants.VOLUME_SLIDER_CLASS), 'Volume slider not affected.');
        assert.ok(isIn(this.fixture, constants.DURATION_CLASS), 'Duration display not affected.');
    });

    QUnit.test('Initialization Without Duration Display', function(assert) {
        var controls = new this.sewi.MediaControls({
            isDurationHidden: true
        });

        this.fixture.append(controls.getDOM());

        assert.ok(!isIn(this.fixture, constants.DURATION_CLASS), 'Media controls can remove the duration display.');
        assert.ok(isIn(this.fixture, constants.PLAY_BUTTON_CLASS), 'Play/pause button not affected.');
        assert.ok(isIn(this.fixture, constants.MUTE_BUTTON_CLASS), 'Mute button not affected.');
        assert.ok(isIn(this.fixture, constants.VOLUME_SLIDER_CLASS), 'Volume slider not affected.');
        assert.ok(isIn(this.fixture, constants.PROGRESS_SLIDER_CLASS), 'Progress slider not affected.');
    });

    QUnit.test('Initialization With Extra Buttons', function(assert) {
        var leftExtraButton = $(constants.TEST_EXTRA_BUTTON_DOM);
        var rightExtraButton1 = $(constants.TEST_EXTRA_BUTTON_DOM);
        var rightExtraButton2 = $(constants.TEST_EXTRA_BUTTON_DOM);

        var controls = new this.sewi.MediaControls({
            extraButtons: {
                left: leftExtraButton,
                right: [ rightExtraButton1, rightExtraButton2 ]
            }
        });

        this.fixture.append(controls.getDOM());

        var numOfExtraButtons = this.fixture.find('.' + constants.TEST_EXTRA_BUTTON_CLASS).length;
        assert.equal(numOfExtraButtons, 3, 'All 3 extra buttons were added successfully.');
    });

    QUnit.asyncTest('Playing and Pausing', function(assert) {
        QUnit.stop(1);
        var controls = new this.sewi.MediaControls();
        var controlsElement = controls.getDOM();

        controlsElement.on(constants.PLAYING_EVENT, function() {
            assert.ok(controlsElement.hasClass(constants.PLAYING_CLASS), 'Controls can play media.');
            QUnit.start();
        });

        controlsElement.on(constants.PAUSED_EVENT, function() {
            assert.ok(!controlsElement.hasClass(constants.PLAYING_CLASS), 'Controls can pause media.');
            QUnit.start();
        });

        this.fixture.append(controls.getDOM());

        var playButton = this.fixture.find('.' + constants.PLAY_BUTTON_CLASS);

        playButton.click();
        playButton.click();
    });

    QUnit.asyncTest('Muting and Unmuting', function(assert) {
        QUnit.stop(1);

        var controls = new this.sewi.MediaControls();
        this.fixture.append(controls.getDOM());
        var controlsElement = controls.getDOM();

        var volumeSlider = this.fixture.find('.' + constants.VOLUME_SLIDER_CLASS);
        var muteButton = this.fixture.find('.' + constants.MUTE_BUTTON_CLASS);

        controlsElement.on(constants.MUTED_EVENT, function() {
            assert.ok(controlsElement.hasClass(constants.MUTED_CLASS), 'Controls can mute media.');
            QUnit.start();
        });

        controlsElement.on(constants.UNMUTED_EVENT, function() {
            assert.ok(!controlsElement.hasClass(constants.MUTED_CLASS), 'Controls can unmute media.');
            QUnit.start();
        });

        muteButton.click();
        muteButton.click();
    });

    QUnit.asyncTest('Adjusting Volume', function(assert) {
        QUnit.stop(1);

        var controls = new this.sewi.MediaControls();
        this.fixture.append(controls.getDOM());
        var controlsElement = controls.getDOM();

        var volumeSlider = this.fixture.find('.' + constants.VOLUME_SLIDER_CLASS);
        var muteButton = this.fixture.find('.' + constants.MUTE_BUTTON_CLASS);

        controlsElement.one(constants.VOLUME_CHANGED_EVENT, function(event, volume) {
            assert.equal(volumeSlider.val(), constants.TEST_VALID_VOLUME, 'Controls can adjust volume.');
            QUnit.start();
        });

        controlsElement.on(constants.UNMUTED_EVENT, function() {
            assert.ok(true, 'Adjusting volume unmutes the media.');
            QUnit.start();
        });

        muteButton.click();
        volumeSlider.val(constants.TEST_VALID_VOLUME).trigger('input').trigger('change');
    });

    QUnit.test('Updating Time and Duration', function(assert) {
        var controls = new this.sewi.MediaControls();
        this.fixture.append(controls.getDOM());

        var durationDisplay = this.fixture.find('.' + constants.DURATION_CLASS);
        var initialDisplayText = durationDisplay.text();

        controls.update({
            duration: constants.TEST_INVALID_DURATION_1,
        });
        assert.equal(durationDisplay.text(), initialDisplayText, 'Duration display does not update when non-number is provided.');

        controls.update({
            duration: constants.TEST_INVALID_DURATION_2,
        });
        assert.equal(durationDisplay.text(), constants.TEST_INVALID_INITIAL_DURATION_TEXT, 'Duration display defaults to 0 when negative number is provided.');

        controls.update({
            duration: constants.TEST_VALID_DURATION,
        });
        assert.equal(durationDisplay.text(), constants.TEST_VALID_INITIAL_DURATION_TEXT, 'Duration display updates when non-negative number is provided.');

        controls.update({
            currentTime: constants.TEST_INVALID_TIME_1,
        });
        assert.equal(durationDisplay.text(), constants.TEST_VALID_INITIAL_DURATION_TEXT, 'Current time does not update when non-number is provided.');

        controls.update({
            currentTime: constants.TEST_INVALID_TIME_2,
        });
        assert.equal(durationDisplay.text(), constants.TEST_VALID_INITIAL_DURATION_TEXT, 'Current time does not update when negative number is provided..');

        controls.update({
            currentTime: constants.TEST_VALID_TIME,
        });
        assert.equal(durationDisplay.text(), constants.TEST_VALID_UPDATED_DURATION_TEXT, 'Current time updates when non-negative number is provided.');
    });

    QUnit.test('Updating Volume', function(assert) {
        var controls = new this.sewi.MediaControls();
        this.fixture.append(controls.getDOM());
        var controlsElement = controls.getDOM();

        var volumeSlider = this.fixture.find('.' + constants.VOLUME_SLIDER_CLASS);
        var muteButton = this.fixture.find('.' + constants.MUTE_BUTTON_CLASS);
        var initialVolume = volumeSlider.val();

        controls.update({
            volume: constants.TEST_INVALID_VOLUME_1,
        });
        assert.equal(volumeSlider.val(), initialVolume, 'Volume does not update when non-number is provided.');

        controls.update({
            volume: constants.TEST_INVALID_VOLUME_2,
        });
        assert.equal(volumeSlider.val(), constants.TEST_INVALID_UPDATED_VOLUME, 'Volume defaults to 1 when number is over the valid range.');

        controls.update({
            volume: constants.TEST_VALID_VOLUME,
        });
        assert.equal(volumeSlider.val(), constants.TEST_VALID_UPDATED_VOLUME, 'Volume updates when number between 0 and 1 is provided.');

        muteButton.click();

        controls.update({
            volume: constants.TEST_VALID_VOLUME,
        });

        assert.ok(!controlsElement.hasClass(constants.MUTED_CLASS), 'Controls are unmuted when volume is updated.');
    });

    QUnit.test('Updating Playback Position', function(assert) {
        var controls = new this.sewi.MediaControls();
        this.fixture.append(controls.getDOM());
        var controlsElement = controls.getDOM();

        var progressSlider = this.fixture.find('.' + constants.PROGRESS_SLIDER_CLASS);
        var initialPosition = progressSlider.val();

        controls.update({
            position: constants.TEST_INVALID_POSITION_1,
        });
        assert.equal(progressSlider.val(), initialPosition, 'Position does not update when non-number is provided.');

        controls.update({
            position: constants.TEST_INVALID_POSITION_2,
        });
        assert.equal(progressSlider.val(), constants.TEST_INVALID_UPDATED_POSITION, 'Position defaults to 1 when number is over the valid range.');

        controls.update({
            position: constants.TEST_VALID_POSITION,
        });
        assert.equal(progressSlider.val(), constants.TEST_VALID_UPDATED_POSITION, 'Position updates when number between 0 and 1 is provided.');
    });

    QUnit.test('Updating Playback State', function(assert) {
        var controls = new this.sewi.MediaControls();
        this.fixture.append(controls.getDOM());
        var controlsElement = controls.getDOM();

        controls.update({
            playing: true,
        });
        assert.ok(controlsElement.hasClass(constants.PLAYING_CLASS), 'Controls can emulate playing mode.');

        controls.update({
            playing: false,
        });
        assert.ok(!controlsElement.hasClass(constants.PLAYING_CLASS), 'Controls can emulate paused mode.');
    });

    QUnit.test('Updating Displayed Buffers', function(assert) {
        var controls = new this.sewi.MediaControls();
        this.fixture.append(controls.getDOM());
        var controlsElement = controls.getDOM();

        controls.update({
            duration: constants.TEST_BUFFER_DURATION,
        });

        controls.update({
            buffers: [constants.TEST_INVALID_BUFFER_1],
        });
        var numOfBuffers = controlsElement.find('.' + constants.BUFFER_CLASS).length;
        assert.equal(numOfBuffers, 0, 'No buffers are created if they are invalid.');

        controls.update({
            buffers: [constants.TEST_INVALID_BUFFER_2],
        });
        numOfBuffers = controlsElement.find('.' + constants.BUFFER_CLASS).length;
        assert.equal(numOfBuffers, 1, 'Buffers can be created if they are out of the valid range.');
        var bufferElement = controlsElement.find('.' + constants.BUFFER_CLASS);

        controls.update({
            buffers: [constants.TEST_VALID_SINGLE_BUFFER],
        });
        numOfBuffers = controlsElement.find('.' + constants.BUFFER_CLASS).length;
        assert.equal(numOfBuffers, 1, 'Buffers within valid range can be created.');

        controls.update({
            buffers: constants.TEST_VALID_MULTIPLE_BUFFERS,
        });
        numOfBuffers = controlsElement.find('.' + constants.BUFFER_CLASS).length;
        assert.equal(numOfBuffers, 10, 'Multiple buffers are created if they are valid.');

        controls.update({
            buffers: [],
        });
        numOfBuffers = controlsElement.find('.' + constants.BUFFER_CLASS).length;
        assert.equal(numOfBuffers, 0, 'Buffers can be cleared.');
    });
})();

// Video Resource Viewer unit tests
(function() {
    var constants = {
        TEST_INVALID_RESOURCE_ID: 1234,
        TEST_NONEXISTANT_RESOURCE_ID: 'FKOSPFKSDO',
        TEST_VALID_RESOURCE_ID: 'c1dee25d-fe89-49c3-b837-0e328adb7cb5',
        TEST_CONTROLS_CLASS: 'media-controls',
        TEST_VOLUME_LEVEL: 0.45,

        TEST_TRIGGER_PLAY_EVENT: 'testPlayVideo',
        TEST_TRIGGER_PAUSE_EVENT: 'testPauseVideo',
        TEST_TRIGGER_SEEK_EVENT: 'testSeekVideo',
        TEST_TRIGGER_VOLUME_EVENT: 'testAdjustVolume',
        TEST_TRIGGER_MUTE_EVENT: 'testMuteVideo',
        TEST_TRIGGER_UNMUTE_EVENT: 'testUnmuteVideo',
        TEST_CONTROLS_UPDATED_EVENT: 'testControlsUpdated',

        ERROR_SCREEN_CLASS: 'error-screen',
        VIDEO_ELEMENT: 'video',

        LOADED_EVENT: 'loaded',
        CONTROLS_PLAYING_EVENT: sewi.constants.MEDIA_CONTROLS_PLAYING_EVENT,
        CONTROLS_PAUSED_EVENT: sewi.constants.MEDIA_CONTROLS_PAUSED_EVENT,
        CONTROLS_MUTED_EVENT: sewi.constants.MEDIA_CONTROLS_MUTED_EVENT,
        CONTROLS_UNMUTED_EVENT: sewi.constants.MEDIA_CONTROLS_UNMUTED_EVENT,
        CONTROLS_VOLUME_EVENT: sewi.constants.MEDIA_CONTROLS_VOLUME_CHANGED_EVENT,
        CONTROLS_POSITION_EVENT: sewi.constants.MEDIA_CONTROLS_POSITION_CHANGED_EVENT,
    };

    function MediaControlsTestDriver() {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.TEST_CONTROLS_CLASS);
        this.on(constants.TEST_TRIGGER_PLAY_EVENT, testPlayingVideo.bind(this));
        this.on(constants.TEST_TRIGGER_PAUSE_EVENT, testPausingVideo.bind(this));
        this.on(constants.TEST_TRIGGER_SEEK_EVENT, testSeekingVideo.bind(this));
        this.on(constants.TEST_TRIGGER_VOLUME_EVENT, testAdjustingVolume.bind(this));
        this.on(constants.TEST_TRIGGER_MUTE_EVENT, testMuteVideo.bind(this));
        this.on(constants.TEST_TRIGGER_UNMUTE_EVENT, testUnmuteVideo.bind(this));
    }
    sewi.inherits(MediaControlsTestDriver, sewi.ConfiguratorElement);

    MediaControlsTestDriver.prototype.update = function(options) {
        this.trigger(constants.TEST_CONTROLS_UPDATED_EVENT, options);
    };

    MediaControlsTestDriver.prototype.showTooltips = function(options) {

    };

    MediaControlsTestDriver.prototype.hideTooltips = function(options) {

    };

    function testPlayingVideo() {
        this.trigger(constants.CONTROLS_PLAYING_EVENT);
    }

    function testPausingVideo() {
        this.trigger(constants.CONTROLS_PAUSED_EVENT);
    }

    function testSeekingVideo() {
        this.trigger(constants.CONTROLS_PAUSED_EVENT);
    }

    function testAdjustingVolume() {
        this.trigger(constants.CONTROLS_VOLUME_EVENT, constants.TEST_VOLUME_LEVEL);
    }

    function testMuteVideo() {
        this.trigger(constants.CONTROLS_MUTED_EVENT);
    }

    function testUnmuteVideo() {
        this.trigger(constants.CONTROLS_UNMUTED_EVENT);
    }

    QUnit.module('Video Resource Viewer', {
        setup: function() {
            this.fixture = $('#qunit-fixture');
            this.oldSewi = window.sewi;
            window.sewi = _.clone(window.sewi);
            window.sewi.MediaControls = MediaControlsTestDriver;
        },
        teardown: function() {
            window.sewi = this.oldSewi;
        }
    });

    QUnit.asyncTest('Initialization', function(assert) {
        QUnit.stop(2);

        assert.throws(function() {
            new window.sewi.VideoResourceViewer();
        }, Error, 'Viewer cannot be initialized without an ID.');

        assert.throws(function() {
            new window.sewi.VideoResourceViewer({
                id: constants.TEST_INVALID_RESOURCE_ID
            });
        }, Error, 'Viewer cannot be initialized with an invalid ID.');

        var nonExistentViewer = new window.sewi.VideoResourceViewer({
            id: constants.TEST_NONEXISTANT_RESOURCE_ID
        });
        var validViewer = new window.sewi.VideoResourceViewer({
            id: constants.TEST_VALID_RESOURCE_ID
        });
        // Neither of these should throw an error.
        assert.ok(true, 'Viewer can be initialized with a valid ID.');

        var nonExistentViewerElement = nonExistentViewer.getDOM();
        this.fixture.append(nonExistentViewerElement);
        nonExistentViewer.load();

        var validViewerElement = validViewer.getDOM();
        this.fixture.append(validViewerElement);

        validViewerElement.on(constants.LOADED_EVENT, function() {
            assert.ok(true, 'Viewer loaded successfully with valid existing ID.');
            QUnit.start();
        });

        validViewer.load();

        setTimeout(function() {
            var errorScreen = nonExistentViewerElement.find('.' + constants.ERROR_SCREEN_CLASS);
            assert.equal(errorScreen.length, 1, 'Viewer displays an error if the resource does not exist.');
            QUnit.start();
        }, 1000);

        setTimeout(function() {
            var errorScreen = validViewerElement.find('.' + constants.ERROR_SCREEN_CLASS);
            assert.equal(errorScreen.length, 0, 'Viewer does not display an error if the resource exists.');
            QUnit.start();
            validViewer.cleanUp();
        }, 1000);
    });

    QUnit.asyncTest('Video Playback', function(assert) {
        QUnit.stop(1);
        var selfRef = this;

        var viewer = new window.sewi.VideoResourceViewer({
            id: constants.TEST_VALID_RESOURCE_ID
        });

        var viewerElement = viewer.getDOM();
        var videoElement = viewerElement.find(constants.VIDEO_ELEMENT);
        this.fixture.append(viewerElement);

        viewerElement.on(constants.LOADED_EVENT, function() {
            selfRef.controlsElement = viewerElement.find('.' + constants.TEST_CONTROLS_CLASS);
            selfRef.controlsElement.trigger(constants.TEST_TRIGGER_PLAY_EVENT);
        });

        videoElement.on('play', function() {
            assert.ok(true, 'Video can play');
            QUnit.start();

            selfRef.controlsElement.trigger(constants.TEST_TRIGGER_PAUSE_EVENT);
        });

        videoElement.on('pause', function() {
            assert.ok(true, 'Video can pause');
            QUnit.start();

            viewer.cleanUp();
        });

        viewer.load();
    });

    QUnit.asyncTest('Adjusting Volume', function(assert) {
        var selfRef = this;

        var viewer = new window.sewi.VideoResourceViewer({
            id: constants.TEST_VALID_RESOURCE_ID
        });

        var viewerElement = viewer.getDOM();
        var videoElement = viewerElement.find(constants.VIDEO_ELEMENT);
        this.fixture.append(viewerElement);

        viewerElement.on(constants.LOADED_EVENT, function() {
            selfRef.controlsElement = viewerElement.find('.' + constants.TEST_CONTROLS_CLASS);
            selfRef.controlsElement.trigger(constants.TEST_TRIGGER_VOLUME_EVENT);
        });

        videoElement.on('volumechange', function() {
            assert.equal(videoElement[0].volume, constants.TEST_VOLUME_LEVEL, 'Video volume can be adjusted.');
            QUnit.start();

            viewer.cleanUp();
        });

        viewer.load();
    });

    QUnit.asyncTest('Toggling Mute', function(assert) {
        QUnit.stop(1);
        var selfRef = this;

        var viewer = new window.sewi.VideoResourceViewer({
            id: constants.TEST_VALID_RESOURCE_ID
        });

        var viewerElement = viewer.getDOM();
        var videoElement = viewerElement.find(constants.VIDEO_ELEMENT);
        this.fixture.append(viewerElement);

        viewerElement.on(constants.LOADED_EVENT, function() {
            selfRef.controlsElement = viewerElement.find('.' + constants.TEST_CONTROLS_CLASS);
            selfRef.controlsElement.trigger(constants.TEST_TRIGGER_MUTE_EVENT);
        });

        // Detect muted event
        videoElement.one('volumechange', function() {
            assert.ok(videoElement[0].muted, 'Video can be muted.');
            QUnit.start();

            // Detect unmuted event
            videoElement.one('volumechange', function() {
                assert.ok(!videoElement[0].muted, 'Video can be unmuted.');
                QUnit.start();

                viewer.cleanUp();
            });

            selfRef.controlsElement.trigger(constants.TEST_TRIGGER_UNMUTE_EVENT);
        });

        viewer.load();
    });
})();
