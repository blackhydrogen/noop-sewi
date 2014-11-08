(function() {
    var constants = {
        CLASS_ONE_MESSAGE: 'I am class one!',
        CLASS_TWO_MESSAGE: 'I am class two!',
        CLASS_ONE_VALUE: 5,

        SLIDER_DOM: '<input class="a-slider" type="range" min="0.0" max="100.0" value="0" step="0.1" title="Seek" />',
        SLIDER_TRIGGER_BUTTON_DOM: '<button></button>',
        SLIDER_TEST_CLASS: 'test-class',
        SLIDER_ACTIVE_CLASS: 'active',
    }

    QUnit.module('Common Functions', {
        setup: function() {
            // set up fixture elements
            this.fixture = $('#qunit-fixture');
            this.sewi = window.sewi;
            this.slider = $(constants.SLIDER_DOM);
            this.triggerButton = $(constants.SLIDER_TRIGGER_BUTTON_DOM);
        },
    });

    QUnit.test('Class Inheritance', function(assert) {
        expect(6);

        function ClassOne() {
            this.value = constants.CLASS_ONE_VALUE;
        }

        ClassOne.prototype.getMessage = function() {
            return constants.CLASS_ONE_MESSAGE;
        }

        function ClassTwo() {
            ClassOne.call(this);
        }
        sewi.inherits(ClassTwo, ClassOne);

        ClassTwo.prototype.getMessage = function() {
            return constants.CLASS_TWO_MESSAGE;
        }

        var objectOne = new ClassOne();
        var objectTwo = new ClassTwo();

        assert.throws(function() {
            sewi.inherits('A string', ClassOne);
        }, Error, 'Only classes can inherit each other.');

        assert.notDeepEqual(objectOne, objectTwo, 'Instance of subclass is not equal to instance of superclass.');
        assert.ok(!(objectOne instanceof ClassTwo), 'Instance of superclass is not an instance of the subclass.');
        assert.ok(objectTwo instanceof ClassOne, 'Instance of subclass is also an instance of the superclass.');

        assert.notEqual(objectOne.getMessage(), objectTwo.getMessage(), 'Subclass properly overrides its superclass prototype.');
        assert.equal(objectOne.value, objectTwo.value, 'Subclass inherits the properties of the superclass.');
    });

    QUnit.test('Vertical Slider Creation', function(assert) {
        expect(3);

        var slider = this.slider.clone();
        var triggerButton = this.triggerButton.clone();

        var verticalSliderControl = sewi.createVerticalSlider(slider, triggerButton, constants.SLIDER_TEST_CLASS);
        this.fixture.append(verticalSliderControl);

        var sliderContainer = this.fixture.find('.' + constants.SLIDER_TEST_CLASS);
        assert.equal(sliderContainer.length, 1, 'Vertical pop-up panel uses the class.');

        assert.equal(sliderContainer.find(slider).length, 1, 'Slider is added to the DOM.');
        assert.equal(this.fixture.find(triggerButton).length, 1, 'Trigger button is added to the DOM.');
    });

    QUnit.asyncTest('Vertical Slider Events', function(assert) {
        expect(2);
        QUnit.stop();

        var slider = this.slider.clone();
        var triggerButton = this.triggerButton.clone();

        var verticalSliderControl = sewi.createVerticalSlider(slider, triggerButton, constants.SLIDER_TEST_CLASS);
        this.fixture.append(verticalSliderControl);

        var sliderContainer = this.fixture.find('.' + constants.SLIDER_TEST_CLASS);

        slider.focus();

        setTimeout(function() {
            assert.ok(sliderContainer.hasClass(constants.SLIDER_ACTIVE_CLASS), 'Slider has active class when focused');
            QUnit.start();
            slider.blur();
        }, 200);

        setTimeout(function() {
            assert.ok(!sliderContainer.hasClass(constants.SLIDER_ACTIVE_CLASS), 'Slider loses active class when unfocused');
            QUnit.start();
        }, 400);
    });
})();
