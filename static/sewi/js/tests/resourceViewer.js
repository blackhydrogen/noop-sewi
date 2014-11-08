(function(){
    var constants = {
        TEST_RESOURCE_VIEWER_TEST_EVENT: 'testEvent',
        TEST_RESOURCE_VIEWER_TEST_EVENT_2: 'testEvent2',
        TEST_RESOURCE_VIEWER_TEST_EVENT_3: 'testEvent3',
        TEST_RESOURCE_VIEWER_TOOLTIPS_SHOWN_EVENT: 'testTooltipsShown',
        TEST_RESOURCE_VIEWER_TOOLTIPS_HIDDEN_EVENT: 'testTooltipsHidden',
        TEST_RESOURCE_VIEWER_CLASS: 'test-resource-viewer',
        TEST_PROGRESS_BAR_MESSAGE: 'Loading test...',
        TEST_PROGRESS_BAR_CHANGED_MESSAGE: 'Loading more...',

        RESOURCE_VIEWER_FULLSCREEN_EVENT: 'FullscreenToggled',
        RESOURCE_VIEWER_CLOSING_EVENT: 'Closing',
        TOOLTIPS_BUTTON_CLASS: 'tooltips-button',
        FULLSCREEN_BUTTON_CLASS: 'fullscreen-button',
        CLOSE_BUTTON_CLASS: 'close-button',
        DOWNLOAD_BUTTON_CLASS: 'download-button',
        PROGRESS_CLASS: 'progress',
        PROGRESS_BAR_CLASS: 'progress-bar',
        PROGRESS_BAR_TEXT_CLASS: 'progress-bar-text',
        PROGRESS_BAR_DEFAULT_MESSAGE: 'Loading Resource',

    }

    function TestResourceViewer() {
        sewi.ResourceViewer.call(this);

        this.mainDOMElement.addClass(constants.TEST_RESOURCE_VIEWER_CLASS);
    }

    sewi.inherits(TestResourceViewer, sewi.ResourceViewer);

    TestResourceViewer.prototype.showTooltips = function() {
        this.trigger(constants.TEST_RESOURCE_VIEWER_TOOLTIPS_SHOWN_EVENT);
    };

    TestResourceViewer.prototype.hideTooltips = function() {
        this.trigger(constants.TEST_RESOURCE_VIEWER_TOOLTIPS_HIDDEN_EVENT);
    };

    QUnit.module('Resource Viewer', {
        setup: function() {
            // set up fixture elements
            this.fixture = $('#qunit-fixture');
            this.sewi = window.sewi;
            this.testResViewer = new TestResourceViewer();
        }
    });

    QUnit.asyncTest('Resource Viewer Events', function(assert) {
        expect(3);
        QUnit.stop(2);

        var testResViewer = this.testResViewer;
        var testResView = testResViewer.getDOM().find('.' + constants.TEST_RESOURCE_VIEWER_CLASS);

        testResViewer.on(constants.TEST_RESOURCE_VIEWER_TEST_EVENT, function() {
            assert.ok(true, 'Resource Viewer adds event handlers properly.');
            QUnit.start();
        });

        testResViewer.on(constants.TEST_RESOURCE_VIEWER_TEST_EVENT_2, function() {
            assert.ok(true, 'Events on the owned DOM propogate to the resource viewer.');
            QUnit.start();
        });

        testResView.on(constants.TEST_RESOURCE_VIEWER_TEST_EVENT_3, function() {
            assert.ok(true, 'Events on the resource viewer propogate to the owned DOM.');
            QUnit.start();
        });

        testResViewer.trigger(constants.TEST_RESOURCE_VIEWER_TEST_EVENT);
        testResView.trigger(constants.TEST_RESOURCE_VIEWER_TEST_EVENT_2);
        testResViewer.trigger(constants.TEST_RESOURCE_VIEWER_TEST_EVENT_3);
    });

    QUnit.asyncTest('Resource Viewer Top Panel', function(assert) {
        expect(5);
        QUnit.stop(4);

        var testResViewer = this.testResViewer;
        var testResViewContainer = testResViewer.getDOM();
        this.fixture.append(testResViewContainer);

        var tooltipsButton = testResViewContainer.find('.' + constants.TOOLTIPS_BUTTON_CLASS);
        var fullscreenButton = testResViewContainer.find('.' + constants.FULLSCREEN_BUTTON_CLASS);
        var closeButton = testResViewContainer.find('.' + constants.CLOSE_BUTTON_CLASS);

        testResViewer.on(constants.TEST_RESOURCE_VIEWER_TOOLTIPS_SHOWN_EVENT, function() {
            assert.ok(true, 'Resource viewer tooltips shown when tooltips button is clicked.');
            QUnit.start();
            // Allow test time to ensure tooltips have been toggled properly.
            setTimeout(function() {
                tooltipsButton.click();
            }, 500);
        });

        testResViewer.on(constants.TEST_RESOURCE_VIEWER_TOOLTIPS_HIDDEN_EVENT, function() {
            assert.ok(true, 'Resource viewer tooltips hidden when tooltips button is clicked again.');
            QUnit.start();
        });

        testResViewer.on(constants.RESOURCE_VIEWER_FULLSCREEN_EVENT, function() {
            assert.ok(true, 'Resource viewer emits the fullscreen event when the fullscreen button is clicked.');
            QUnit.start();
        });

        testResViewer.on(constants.RESOURCE_VIEWER_CLOSING_EVENT, function() {
            assert.ok(true, 'Resource viewer emits the closing event when the closed button is clicked.');
            QUnit.start();
        });

        tooltipsButton.click();
        fullscreenButton.click();
        closeButton.click();

        testResViewer.addDownloadButton(function() {
            assert.ok(true, 'Resource viewer allows downloading via function');
            QUnit.start();
            return '/';
        });

        var downloadButton = testResViewContainer.find('.download-button');
        downloadButton.click();

    });

    QUnit.asyncTest('Resource Viewer Progress Bar', function(assert) {
        QUnit.start();
        var testResViewer = this.testResViewer;
        var testResViewContainer = testResViewer.getDOM();
        this.fixture.append(testResViewContainer);

        assert.strictEqual(testResViewContainer.has('.' + constants.PROGRESS_BAR_CLASS).length, 0, 'Progress bar is initially not in DOM.');

        testResViewer.showProgressBar();
        var progress = testResViewContainer.find('.' + constants.PROGRESS_CLASS);
        var progressBar = testResViewContainer.find('.' + constants.PROGRESS_BAR_CLASS);
        var progressBarText = testResViewContainer.find('.' + constants.PROGRESS_BAR_TEXT_CLASS);

        var progressWidth = progress.width();

        assert.ok(progressBar, 'Progress bar added to DOM successfully.');
        assert.strictEqual(progressBar.width(), 0, 'Progress bar is initially set to 0% width.');
        assert.equal(progressBarText.text(), constants.PROGRESS_BAR_DEFAULT_MESSAGE, 'Progress bar initially shows default message.');

        testResViewer.showProgressBar(constants.TEST_PROGRESS_BAR_MESSAGE);
        assert.equal(progressBarText.text(), constants.TEST_PROGRESS_BAR_MESSAGE, 'Progress bar can be initialised with a custom message.');

        testResViewer.updateProgressBar(25);
        var currentWidth = progressBar.width() / progressWidth;
        assert.strictEqual(currentWidth, 0.25, 'Progress bar width can be altered.');

        testResViewer.updateProgressBar('a');
        currentWidth = progressBar.width() / progressWidth;
        assert.strictEqual(currentWidth, 0.25, 'Progress bar width can only be set using a number.');

        testResViewer.updateProgressBar(101);
        currentWidth = progressBar.width() / progressWidth;
        assert.strictEqual(currentWidth, 0.25, 'Progress bar width will not change if the value is outside the valid range.');

        testResViewer.updateProgressBar(50, constants.TEST_PROGRESS_BAR_CHANGED_MESSAGE);

        // Allow the DOM time to update the progress bar width.
        QUnit.stop();
        setTimeout(function() {
            currentWidth = progressBar.width() / progressWidth;
            assert.strictEqual(currentWidth, 0.5, 'Progress bar width can be updated with its text.');
            assert.strictEqual(progressBarText.text(), constants.TEST_PROGRESS_BAR_CHANGED_MESSAGE, 'Progress bar text can be updated with its width.');
            testResViewer.hideProgressBar();
            assert.strictEqual(testResViewContainer.has('.' + constants.PROGRESS_BAR_CLASS).length, 0, 'Progress bar can be hidden after showing.');
            QUnit.start();
        }, 500);
    });

})();
