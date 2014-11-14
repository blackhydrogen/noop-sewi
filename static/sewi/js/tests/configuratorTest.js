// Unit tests for Configurator
// Author: Muhammad Fazli Bin Rosli
(function() {

    var constants = {
        TEST_INVALID_DOM_ID: '#invalidId',
        TEST_INVALID_ENCOUNTER_ID: 121,
        TEST_VALID_ENCOUNTER_ID: '77d09b28-abed-4a6a-b48b-6b368bd2fdb3',
        TEST_TITLE: 'Title for Test Case',
        TEST_SUBTITLE: 'Subtitle for Test Case',
        TEST_CHANGED_TITLE: 'New Title',
        TEST_CHANGED_SUBTITLE: 'New Subtitle',
        TEST_DISPLAYED_PATIENT_NAME: 'John Smith',
        TEST_DISPLAYED_PATIENT_ID: '111',
        TEST_RESIZE_EVENT: 'testDriverResized',
        TEST_RESOURCE_DOM: '<div class="resource" data-res-id="someId" data-res-type="test"></div>',
        TEST_RESOURCE_ID_KEY: 'resId',
        TEST_RESOURCE_TYPE_KEY: 'resType',
        TEST_RESOURCE_ID: 'someId',
        TEST_RESOURCE_TYPE: 'test',
        TEST_OPEN_RESOURCE_EVENT: 'testOpenResource',
        TEST_RESOURCE_OPENED_EVENT: 'testResourceOpened',
        TEST_CLOSE_ALL_RESOURCES_EVENT: 'testCloseAllResources',

        BASIC_ENCOUNTER_INFO_CLASS: 'basic-encounter-container',
        RES_VIEWER_CLASS: 'resource-viewer-container',
        RES_GALLERY_CLASS: 'resource-gallery-container',
        TITLE_DOM: 'h2',
        SUBTITLE_DOM: 'small',
        TITLE_PREFIX: sewi.constants.CONFIGURATOR_TITLE_PREFIX,

        ROW_DOM: '<div class="row"></div>',
        TITLE_VIEW_DOM: '<div id="titleView" class="row"></div>',
        BASIC_INFO_VIEW_DOM: '<div id="basicInfoView" class="col-xs-3 animated"></div>',
        RES_VIEWER_VIEW_DOM: '<div id="resViewerView" class="col-xs-0 animated"></div>',
        RES_GALLERY_VIEW_DOM: '<div id="resGalleryView" class="col-xs-9 animated"></div>',
        ALERTS_VIEW_DOM: '<div id="alerts"></div>',
        TITLE_VIEW_ID: '#titleView',
        BASIC_INFO_VIEW_ID: '#basicInfoView',
        RES_VIEWER_VIEW_ID: '#resViewerView',
        RES_GALLERY_VIEW_ID: '#resGalleryView',
        ALERTS_VIEW_ID: '#alerts',
        RES_VIEWER_VIEW_SHOWN_CLASS: 'col-xs-8 animated',
        RES_GALLERY_VIEW_MINIMIZED_CLASS: 'col-xs-1 animated',
        MINIMIZE_BUTTON_CLASS: 'minimize-button',
        RELOAD_BUTTON_SELECTOR: '.error-screen .retry button',

        GALLERY_CLICKED_EVENT: 'resourceClick',
        VIEWER_NO_TABS_EVENT: sewi.constants.TAB_NO_TAB_EVENT,
        COMPONENT_CRASH_EVENT: sewi.constants.CONFIGURATOR_COMPONENT_ERROR_EVENT,
    };

    // Driver classes definitions

    function BasicEncounterInfoTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.BASIC_ENCOUNTER_INFO_CLASS);
        this.encounterId = options.encounterId;
    }
    sewi.inherits(BasicEncounterInfoTestDriver, sewi.ConfiguratorElement);

    BasicEncounterInfoTestDriver.prototype.resize = testDriverResized;

    function ResViewerTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.RES_VIEWER_CLASS);
        this.on(constants.TEST_CLOSE_ALL_RESOURCES_EVENT, testCloseAllTabs.bind(this));
    }
    sewi.inherits(ResViewerTestDriver, sewi.ConfiguratorElement);

    ResViewerTestDriver.prototype.resize = testDriverResized;
    ResViewerTestDriver.prototype.addObjectToNewTab = function(resourceDOM) {
        this.trigger(constants.TEST_RESOURCE_OPENED_EVENT, [ resourceDOM ]);
    };

    function ResGalleryTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.RES_GALLERY_CLASS);
        this.encounterId = options.encounterId;
        this.on(constants.TEST_OPEN_RESOURCE_EVENT, testOpenResource.bind(this));
    }
    sewi.inherits(ResGalleryTestDriver, sewi.ConfiguratorElement);

    ResGalleryTestDriver.prototype.resize = testDriverResized;

    // Special driver classes definitions

    // Variant of the basic encounter info viewer that initializes with a title.
    function BasicEncounterInfoWithTitleTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.BASIC_ENCOUNTER_INFO_CLASS);
    }
    sewi.inherits(BasicEncounterInfoWithTitleTestDriver, sewi.ConfiguratorElement);

    BasicEncounterInfoWithTitleTestDriver.prototype.load = function() {
        this.trigger('BEILoaded', {
            id: constants.TEST_DISPLAYED_PATIENT_ID,
            name: constants.TEST_DISPLAYED_PATIENT_NAME
        });
    };

    // Variant of the basic encounter info viewer that crashes immediately.
    function CrashingBasicEncounterInfoTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.BASIC_ENCOUNTER_INFO_CLASS);

        setTimeout(this.trigger.bind(this), 500, constants.COMPONENT_CRASH_EVENT);
    }
    sewi.inherits(CrashingBasicEncounterInfoTestDriver, sewi.ConfiguratorElement);

    // Variant of the resource viewer that crashes after a brief period.
    function CrashingResViewerTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.RES_VIEWER_CLASS);

        setTimeout(this.trigger.bind(this), 500, constants.COMPONENT_CRASH_EVENT);
    }
    sewi.inherits(CrashingResViewerTestDriver, sewi.ConfiguratorElement);

    // Variant of the resource gallery that crashes immediately.
    function CrashingResGalleryTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.RES_GALLERY_CLASS);

        setTimeout(this.trigger.bind(this), 500, constants.COMPONENT_CRASH_EVENT);
    }
    sewi.inherits(CrashingResGalleryTestDriver, sewi.ConfiguratorElement);

    // End driver class definitions

    function testOpenResource() {
        var resource = $(constants.TEST_RESOURCE_DOM);
        this.trigger(constants.GALLERY_CLICKED_EVENT, [ resource ]);
    }

    function testCloseAllTabs() {
        this.trigger(constants.VIEWER_NO_TABS_EVENT);
    }

    function testDriverResized() {
        this.trigger(constants.TEST_RESIZE_EVENT);
    }

    function getTitleText(titleDiv) {
        var titleText = titleDiv.clone()
                                .children()
                                .remove()
                                .end()
                                .text();
        // remove the last whitespace character from the title.
        return titleText.slice(0, -1);
    }

    QUnit.module('Configurator', {
        setup: function() {
            // set up fixture elements
            this.fixture = $('#qunit-fixture');
            this.titleView = $(constants.TITLE_VIEW_DOM).appendTo(this.fixture);
            var rowDiv = $(constants.ROW_DOM).appendTo(this.fixture);
            this.basicInfoView = $(constants.BASIC_INFO_VIEW_DOM).appendTo(rowDiv);
            this.resViewerView = $(constants.RES_VIEWER_VIEW_DOM).appendTo(rowDiv);
            this.resGalleryView = $(constants.RES_GALLERY_VIEW_DOM).appendTo(rowDiv);
            this.alertsView = $(constants.ALERTS_VIEW_DOM).appendTo(this.fixture);

            // override SEWI global vars
            this.oldSewi = window.sewi;
            window.sewi = _.clone(window.sewi);
            window.sewi.TabContainer = ResViewerTestDriver;
            window.sewi.ResourceGallery = ResGalleryTestDriver;
            window.sewi.BasicEncounterInfoViewer = BasicEncounterInfoTestDriver;
        },

        teardown: function() {
            // restore global vars (for other test modules to work)
            window.sewi = this.oldSewi;
        }
    });

    QUnit.test('CN1: Initialization', function(assert) {

        assert.throws(function() {
            var configurator = new sewi.Configurator();
        }, Error, 'Throws Error when DIV selectors/elements are not provided.');

        assert.throws(function() { throw new Error() });

        assert.throws(function() {
            var configurator = new sewi.Configurator({
                titleView: constants.TEST_INVALID_DOM_ID,
                basicInfoView: constants.TEST_INVALID_DOM_ID,
                resViewerView: constants.TEST_INVALID_DOM_ID,
                resGalleryView: constants.TEST_INVALID_DOM_ID,
                alertsView: constants.TEST_INVALID_DOM_ID,
                encounterId: constants.TEST_VALID_ENCOUNTER_ID
            });
        }, Error, 'Throws Error when DIV selectors/elements are invalid.');

        assert.throws(function() {
            var configurator = new sewi.Configurator({
                titleView: constants.TITLE_VIEW_ID,
                basicInfoView: constants.BASIC_INFO_VIEW_ID,
                resViewerView: constants.RES_VIEWER_VIEW_ID,
                resGalleryView: constants.RES_GALLERY_VIEW_ID,
                alertsView: constants.ALERTS_VIEW_ID,
                encounterId: constants.TEST_INVALID_ENCOUNTER_ID,
            });
        }, Error, 'Throws Error when invalid encounter ID is provided.');

        var configurator = new sewi.Configurator({
            titleView: constants.TITLE_VIEW_ID,
            basicInfoView: constants.BASIC_INFO_VIEW_ID,
            resViewerView: constants.RES_VIEWER_VIEW_ID,
            resGalleryView: constants.RES_GALLERY_VIEW_ID,
            alertsView: constants.ALERTS_VIEW_ID,
            encounterId: constants.TEST_VALID_ENCOUNTER_ID,
        });
        assert.ok(configurator, 'Configurator can init successfully with selectors/DIVs provided.');
    });

    QUnit.test('CN2: Basic DOM Elements', function(assert) {
        var configurator = new sewi.Configurator({
            titleView: constants.TITLE_VIEW_ID,
            basicInfoView: constants.BASIC_INFO_VIEW_ID,
            resViewerView: constants.RES_VIEWER_VIEW_ID,
            resGalleryView: constants.RES_GALLERY_VIEW_ID,
            alertsView: constants.ALERTS_VIEW_ID,
            encounterId: constants.TEST_VALID_ENCOUNTER_ID,
        });

        assert.equal(this.titleView.children(constants.TITLE_DOM).length, 1, 'Configurator adds a <h1> element to the title view DIV.');
        assert.notEqual(this.basicInfoView.children().length, 0, 'Configurator populates encounter basic information view DIV.');
        assert.notEqual(this.resViewerView.children().length, 0, 'Configurator populates encounter resource viewer DIV.');
        assert.notEqual(this.resGalleryView.children().length, 0, 'Configurator populates encounter resource gallery DIV.');

        assert.equal(this.basicInfoView.children('.' + constants.BASIC_ENCOUNTER_INFO_CLASS).length, 1, 'Configurator adds the basic information container to the encounter basic information view DIV.');
        assert.equal(this.resViewerView.children('.' + constants.RES_VIEWER_CLASS).length, 1, 'Configurator adds the resource viewer container to the encounter resource viewer DIV.');
        assert.equal(this.resGalleryView.children('.' + constants.RES_GALLERY_CLASS).length, 1, 'Configurator adds the resource gallery container to the encounter resource gallery DIV.');
    });

    QUnit.test('CN3: Title and Subtitle', function(assert) {
        var configurator = new sewi.Configurator({
            titleView: constants.TITLE_VIEW_ID,
            basicInfoView: constants.BASIC_INFO_VIEW_ID,
            resViewerView: constants.RES_VIEWER_VIEW_ID,
            resGalleryView: constants.RES_GALLERY_VIEW_ID,
            alertsView: constants.ALERTS_VIEW_ID,
            encounterId: constants.TEST_VALID_ENCOUNTER_ID,

            title: constants.TEST_TITLE,
            subtitle: constants.TEST_SUBTITLE
        });
        var titleDiv = this.titleView.children(constants.TITLE_DOM);
        var subtitleDiv = titleDiv.children(constants.SUBTITLE_DOM);

        assert.equal(subtitleDiv.length, 1, 'Subtitle is displayed with title.');
        assert.equal(getTitleText(titleDiv), constants.TEST_TITLE, 'Title text from constructor is displayed correctly.');
        assert.equal(subtitleDiv.text(), constants.TEST_SUBTITLE, 'Subtitle text from constructor is displayed correctly.');

        configurator.setTitle(constants.TEST_CHANGED_TITLE, constants.TEST_CHANGED_SUBTITLE);
        assert.equal(getTitleText(titleDiv), constants.TEST_CHANGED_TITLE, 'Title text is changed correctly.');
        assert.equal(subtitleDiv.text(), constants.TEST_CHANGED_SUBTITLE, 'Subtitle text is changed correctly.');
    });

    QUnit.test('CN4: Loading title from sub-component', function(assert) {
        // Override with another test driver
        window.sewi.BasicEncounterInfoViewer = BasicEncounterInfoWithTitleTestDriver;

        var configurator = new sewi.Configurator({
            titleView: constants.TITLE_VIEW_ID,
            basicInfoView: constants.BASIC_INFO_VIEW_ID,
            resViewerView: constants.RES_VIEWER_VIEW_ID,
            resGalleryView: constants.RES_GALLERY_VIEW_ID,
            alertsView: constants.ALERTS_VIEW_ID,
            encounterId: constants.TEST_VALID_ENCOUNTER_ID,

            title: constants.TEST_TITLE,
            subtitle: constants.TEST_SUBTITLE
        });
        var titleDiv = this.titleView.children(constants.TITLE_DOM);
        var subtitleDiv = titleDiv.children(constants.SUBTITLE_DOM);

        var titleText = getTitleText(titleDiv);
        var subtitleText = subtitleDiv.text().replace(constants.TITLE_PREFIX, '');

        assert.strictEqual(titleText, constants.TEST_DISPLAYED_PATIENT_NAME, 'Title text from constructor is displayed correctly.');
        assert.strictEqual(subtitleText, constants.TEST_DISPLAYED_PATIENT_ID, 'Subtitle text from constructor is displayed correctly.');
    });

    QUnit.asyncTest('CN5: Window resize propogation', function(assert) {
        QUnit.stop(2);

        var configurator = new sewi.Configurator({
            titleView: constants.TITLE_VIEW_ID,
            basicInfoView: constants.BASIC_INFO_VIEW_ID,
            resViewerView: constants.RES_VIEWER_VIEW_ID,
            resGalleryView: constants.RES_GALLERY_VIEW_ID,
            alertsView: constants.ALERTS_VIEW_ID,
            encounterId: constants.TEST_VALID_ENCOUNTER_ID,
        });

        var basicInfoElement = this.basicInfoView.children('.' + constants.BASIC_ENCOUNTER_INFO_CLASS);
        var resViewerElement = this.resViewerView.children('.' + constants.RES_VIEWER_CLASS);
        var resGalleryElement = this.resGalleryView.children('.' + constants.RES_GALLERY_CLASS);

        basicInfoElement.on(constants.TEST_RESIZE_EVENT, function() {
            assert.ok(true, 'Configurator informs the basic information sub-component when the window resizes.');
            QUnit.start();
        });

        resViewerElement.on(constants.TEST_RESIZE_EVENT, function() {
            assert.ok(true, 'Configurator informs the resource viewer sub-component when the window resizes.');
            QUnit.start();
        });

        resGalleryElement.on(constants.TEST_RESIZE_EVENT, function() {
            assert.ok(true, 'Configurator informs the resource gallery sub-component when the window resizes.');
            QUnit.start();
        });

        $(window).resize();
    });

    QUnit.asyncTest('CN6: View resize propogation in default mode', function(assert) {
        var configurator = new sewi.Configurator({
            titleView: constants.TITLE_VIEW_ID,
            basicInfoView: constants.BASIC_INFO_VIEW_ID,
            resViewerView: constants.RES_VIEWER_VIEW_ID,
            resGalleryView: constants.RES_GALLERY_VIEW_ID,
            alertsView: constants.ALERTS_VIEW_ID,
            encounterId: constants.TEST_VALID_ENCOUNTER_ID,
        });

        var basicInfoElement = this.basicInfoView.children('.' + constants.BASIC_ENCOUNTER_INFO_CLASS);
        var resViewerElement = this.resViewerView.children('.' + constants.RES_VIEWER_CLASS);
        var resGalleryElement = this.resGalleryView.children('.' + constants.RES_GALLERY_CLASS);
        var minimizeButton = this.basicInfoView.children('.' + constants.MINIMIZE_BUTTON_CLASS);

        resViewerElement.on(constants.TEST_RESIZE_EVENT, function() {
            assert.ok(false, 'Resource viewer should not have been resized.');
            QUnit.start();
        });

        resGalleryElement.on(constants.TEST_RESIZE_EVENT, function() {
            assert.ok(true, 'Configurator informs the resource gallery sub-component when the view resizes.');
            QUnit.start();
        });

        setTimeout(minimizeButton.click.bind(minimizeButton), 500);
    });

    QUnit.asyncTest('CN7: View resize propogation when resource already opened', function(assert) {
        this.resViewerView.removeClass().addClass(constants.RES_VIEWER_VIEW_SHOWN_CLASS);
        this.resGalleryView.removeClass().addClass(constants.RES_GALLERY_VIEW_MINIMIZED_CLASS);

        var configurator = new sewi.Configurator({
            titleView: constants.TITLE_VIEW_ID,
            basicInfoView: constants.BASIC_INFO_VIEW_ID,
            resViewerView: constants.RES_VIEWER_VIEW_ID,
            resGalleryView: constants.RES_GALLERY_VIEW_ID,
            alertsView: constants.ALERTS_VIEW_ID,
            encounterId: constants.TEST_VALID_ENCOUNTER_ID,
            isResourceViewerHidden: false,
        });

        var resViewerElement = this.resViewerView.children('.' + constants.RES_VIEWER_CLASS);
        var resGalleryElement = this.resGalleryView.children('.' + constants.RES_GALLERY_CLASS);
        var minimizeButton = this.basicInfoView.children('.' + constants.MINIMIZE_BUTTON_CLASS);

        resViewerElement.on(constants.TEST_RESIZE_EVENT, function() {
            assert.ok(true, 'Configurator informs the resource viewer sub-component when the window resizes.');
            QUnit.start();
        });

        resGalleryElement.on(constants.TEST_RESIZE_EVENT, function() {
            assert.ok(false, 'Resource gallery should not have been resized.');
            QUnit.start();
        });

        setTimeout(minimizeButton.click.bind(minimizeButton), 500);
    });

    QUnit.asyncTest('CN8: Opening resource', function(assert) {
        var configurator = new sewi.Configurator({
            titleView: constants.TITLE_VIEW_ID,
            basicInfoView: constants.BASIC_INFO_VIEW_ID,
            resViewerView: constants.RES_VIEWER_VIEW_ID,
            resGalleryView: constants.RES_GALLERY_VIEW_ID,
            alertsView: constants.ALERTS_VIEW_ID,
            encounterId: constants.TEST_VALID_ENCOUNTER_ID,
        });

        var resViewerElement = this.resViewerView.children('.' + constants.RES_VIEWER_CLASS);
        var resGalleryElement = this.resGalleryView.children('.' + constants.RES_GALLERY_CLASS);

        resViewerElement.on(constants.TEST_RESOURCE_OPENED_EVENT, function(event, resource) {
            assert.ok(true, 'Resource viewer view can receive the resource DOM element from the configurator.');
            assert.strictEqual(resource.data(constants.TEST_RESOURCE_ID_KEY), constants.TEST_RESOURCE_ID, 'Resource ID was not mangled.');
            assert.strictEqual(resource.data(constants.TEST_RESOURCE_TYPE_KEY), constants.TEST_RESOURCE_TYPE, 'Resource type was not mangled.');
            QUnit.start();
        });

        var resourceDOM = $(constants.TEST_RESOURCE_DOM);
        configurator.privates.openResource.call(configurator, resourceDOM);
    });

    QUnit.asyncTest('CN9: Tranferring resource from gallery to viewer', function(assert) {
        var configurator = new sewi.Configurator({
            titleView: constants.TITLE_VIEW_ID,
            basicInfoView: constants.BASIC_INFO_VIEW_ID,
            resViewerView: constants.RES_VIEWER_VIEW_ID,
            resGalleryView: constants.RES_GALLERY_VIEW_ID,
            alertsView: constants.ALERTS_VIEW_ID,
            encounterId: constants.TEST_VALID_ENCOUNTER_ID,
        });

        var resViewerElement = this.resViewerView.children('.' + constants.RES_VIEWER_CLASS);
        var resGalleryElement = this.resGalleryView.children('.' + constants.RES_GALLERY_CLASS);

        resViewerElement.on(constants.TEST_RESOURCE_OPENED_EVENT, function(event, resource) {
            assert.ok(true, 'Resource element transferred successfully.');
            QUnit.start();
        });

        resGalleryElement.trigger(constants.TEST_OPEN_RESOURCE_EVENT);
    });

    QUnit.asyncTest('CN10: Configurator responding to sub-components opening and closing resources', function(assert) {
        QUnit.stop(3);

        var configurator = new sewi.Configurator({
            titleView: constants.TITLE_VIEW_ID,
            basicInfoView: constants.BASIC_INFO_VIEW_ID,
            resViewerView: constants.RES_VIEWER_VIEW_ID,
            resGalleryView: constants.RES_GALLERY_VIEW_ID,
            alertsView: constants.ALERTS_VIEW_ID,
            encounterId: constants.TEST_VALID_ENCOUNTER_ID,
        });

        var basicInfoElement = this.basicInfoView.children('.' + constants.BASIC_ENCOUNTER_INFO_CLASS);
        var resViewerElement = this.resViewerView.children('.' + constants.RES_VIEWER_CLASS);
        var resGalleryElement = this.resGalleryView.children('.' + constants.RES_GALLERY_CLASS);

        resViewerElement.one(constants.TEST_RESIZE_EVENT, function() {
            assert.ok(true, 'Resource viewer expands when resource is opened.');

            // Check whether the resource viewer resizes again after closing all resources.
            resViewerElement.one(constants.TEST_RESIZE_EVENT, function() {
                assert.ok(true, 'Resource viewer hides when all resources are closed.');
                QUnit.start();
            });

            resViewerElement.trigger(constants.TEST_CLOSE_ALL_RESOURCES_EVENT);

            QUnit.start();
        });

        resGalleryElement.one(constants.TEST_RESIZE_EVENT, function() {
            assert.ok(true, 'Resource gallery minimizes when resource is opened.');

            // Check whether the resource gallery resizes again after closing all resources.
            resGalleryElement.one(constants.TEST_RESIZE_EVENT, function() {
                assert.ok(true, 'Resource gallery maximizes when all resources are closed.');
                QUnit.start();
            });

            QUnit.start();
        });

        // Transitions need setup time before they can be tested.
        setTimeout(function() {
            resGalleryElement.trigger(constants.TEST_OPEN_RESOURCE_EVENT);
        }, 500);
    });

    QUnit.asyncTest('CN11: Configurator responding to crashing sub-components', function(assert) {

        // Ensure all views are visible.
        this.resViewerView.removeClass().addClass(constants.RES_VIEWER_VIEW_SHOWN_CLASS);
        this.resGalleryView.removeClass().addClass(constants.RES_GALLERY_VIEW_MINIMIZED_CLASS);

        // window.sewi.TabContainer = ResViewerTestDriver;
        // window.sewi.ResourceGallery = ResGalleryTestDriver;
        // window.sewi.BasicEncounterInfoViewer = BasicEncounterInfoTestDriver;

        // replace test drivers with crashing variants
        window.sewi.TabContainer = CrashingResViewerTestDriver;
        window.sewi.ResourceGallery = CrashingResGalleryTestDriver;
        window.sewi.BasicEncounterInfoViewer = CrashingBasicEncounterInfoTestDriver;

        var configurator = new sewi.Configurator({
            titleView: constants.TITLE_VIEW_ID,
            basicInfoView: constants.BASIC_INFO_VIEW_ID,
            resViewerView: constants.RES_VIEWER_VIEW_ID,
            resGalleryView: constants.RES_GALLERY_VIEW_ID,
            alertsView: constants.ALERTS_VIEW_ID,
            encounterId: constants.TEST_VALID_ENCOUNTER_ID,
            isResourceViewerHidden: false,
        });

        var selfRef = this;

        // Allow time for the driver classes to crash
        setTimeout(function() {

            var basicInfoElement = selfRef.basicInfoView.children('.' + constants.BASIC_ENCOUNTER_INFO_CLASS);
            var resViewerElement = selfRef.resViewerView.children('.' + constants.RES_VIEWER_CLASS);
            var resGalleryElement = selfRef.resGalleryView.children('.' + constants.RES_GALLERY_CLASS);

            assert.equal(basicInfoElement.length, 0, 'Basic info viewer element was removed when it crashed.');
            assert.equal(resViewerElement.length, 0, 'Resource viewer element was removed when it crashed.');
            assert.equal(resGalleryElement.length, 0, 'Resource gallery element was removed when it crashed.');

            var basicInfoReloadButton = selfRef.basicInfoView.find(constants.RELOAD_BUTTON_SELECTOR);
            var resViewerReloadButton = selfRef.resViewerView.find(constants.RELOAD_BUTTON_SELECTOR);
            var resGalleryReloadButton = selfRef.resGalleryView.find(constants.RELOAD_BUTTON_SELECTOR);

            assert.equal(basicInfoReloadButton.length, 1, 'Error screen shown with reload button when basic info viewer crashed.');
            assert.equal(resViewerReloadButton.length, 1, 'Error screen shown with reload button when resource viewer crashed.');
            assert.equal(resGalleryReloadButton.length, 1, 'Error screen shown with reload button when resource viewer crashed.');

            // Restore test drivers
            window.sewi.TabContainer = ResViewerTestDriver;
            window.sewi.ResourceGallery = ResGalleryTestDriver;
            window.sewi.BasicEncounterInfoViewer = BasicEncounterInfoTestDriver;

            basicInfoReloadButton.click();
            basicInfoElement = selfRef.basicInfoView.children('.' + constants.BASIC_ENCOUNTER_INFO_CLASS);
            assert.equal(basicInfoElement.length, 1, 'Basic info viewer element reloaded successfully.');

            resViewerReloadButton.click();
            resViewerElement = selfRef.basicInfoView.children('.' + constants.BASIC_ENCOUNTER_INFO_CLASS);
            assert.equal(resViewerElement.length, 1, 'Resource viewer element reloaded successfully.');

            resGalleryReloadButton.click();
            resGalleryElement = selfRef.basicInfoView.children('.' + constants.BASIC_ENCOUNTER_INFO_CLASS);
            assert.equal(resGalleryElement.length, 1, 'Resource gallery element reloaded successfully.');

            QUnit.start();

        }, 1000);
    });

})();
