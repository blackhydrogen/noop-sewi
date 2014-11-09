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
        GALLERY_CLICKED_EVENT: 'resourceClick',
    };

    function BasicEncounterInfoTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.BASIC_ENCOUNTER_INFO_CLASS);
        this.encounterId = options.encounterId;
    }
    sewi.inherits(BasicEncounterInfoTestDriver, sewi.ConfiguratorElement);

    BasicEncounterInfoTestDriver.prototype.resize = testDriverResized;

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

    function ResViewerTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.RES_VIEWER_CLASS);
    }
    sewi.inherits(ResViewerTestDriver, sewi.ConfiguratorElement);

    ResViewerTestDriver.prototype.resize = testDriverResized;
    ResViewerTestDriver.prototype.addObjectToNewTab = function(resourceDOM) {
        this.trigger(constants.TEST_RESOURCE_OPENED_EVENT, resourceDOM);
    };

    function ResGalleryTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.RES_GALLERY_CLASS);
        this.encounterId = options.encounterId;
        this.on(constants.TEST_OPEN_RESOURCE_EVENT, testOpenResource.bind(this));
    }
    sewi.inherits(ResGalleryTestDriver, sewi.ConfiguratorElement);

    ResGalleryTestDriver.prototype.resize = testDriverResized;

    function testOpenResource() {
        var resource = $(constants.TEST_RESOURCE_DOM);
        this.trigger(constants.GALLERY_CLICKED_EVENT, [ resource ]);
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

    QUnit.test('Initialization', function(assert) {

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

    QUnit.test('Basic DOM Elements', function(assert) {
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

    QUnit.test('Title and Subtitle', function(assert) {
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

    QUnit.test('Loading title from sub-component', function(assert) {
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

    QUnit.asyncTest('Window resize propogation', function(assert) {
        QUnit.expect(3);
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

    QUnit.asyncTest('View resize propogation in default mode', function(assert) {
        QUnit.expect(1);

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

    QUnit.asyncTest('View resize propogation when resource already opened', function(assert) {
        QUnit.expect(1);

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

    QUnit.asyncTest('Opening resource', function(assert) {
        QUnit.expect(3);

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

    QUnit.asyncTest('Tranferring resource from gallery to viewer', function(assert) {
        QUnit.expect(1);

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

})();
