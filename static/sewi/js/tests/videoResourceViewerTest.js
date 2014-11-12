(function() {
    var constants = {
        TEST_EXTRA_BUTTON_DOM: '<button type="button" class="extra-button"></button>',
        TEST_EXTRA_BUTTON_CLASS: 'extra-button',

        PLAY_BUTTON_CLASS: 'play-button',
        MUTE_BUTTON_CLASS: 'mute-button',
        VOLUME_SLIDER_CLASS: 'volume-slider',
        PROGRESS_SLIDER_CLASS: 'progress-slider',
        DURATION_CLASS: 'duration'
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
})();
