(function(){
    var constants = {
        TEST_RESOURCE_VIEWER_TEST_EVENT: 'testEvent',
        TEST_RESOURCE_VIEWER_TEST_EVENT_2: 'testEvent2',
        TEST_RESOURCE_VIEWER_TEST_EVENT_3: 'testEvent3',
        TEST_RESOURCE_VIEWER_TOOLTIPS_SHOWN_EVENT: 'testTooltipsShown',
        TEST_RESOURCE_VIEWER_TOOLTIPS_HIDDEN_EVENT: 'testTooltipsHidden',
        TEST_RESOURCE_VIEWER_CLASS: 'test-resource-viewer',

        RESOURCE_VIEWER_FULLSCREEN_EVENT: 'FullscreenToggled',
        RESOURCE_VIEWER_CLOSING_EVENT: 'Closing',
        TOOLTIPS_BUTTON_CLASS: 'tooltips-button',
        FULLSCREEN_BUTTON_CLASS: 'fullscreen-button',
        CLOSE_BUTTON_CLASS: 'close-button',
        DOWNLOAD_BUTTON_CLASS: 'download-button',
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
            return "/";
        });

        var downloadButton = testResViewContainer.find('.download-button');
        downloadButton.click();

    });

})();
