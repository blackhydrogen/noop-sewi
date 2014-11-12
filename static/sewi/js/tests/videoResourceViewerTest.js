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

        PLAY_BUTTON_CLASS: 'play-button',
        MUTE_BUTTON_CLASS: 'mute-button',
        VOLUME_SLIDER_CLASS: 'volume-slider',
        PROGRESS_SLIDER_CLASS: 'progress-slider',
        DURATION_CLASS: 'duration',
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
})();
