(function() {

    var constants = {
        TEST_INVALID_DOM_ID: '#invalidId',
        TEST_INVALID_ENCOUNTER_ID: 121,
        TEST_VALID_ENCOUNTER_ID: '77d09b28-abed-4a6a-b48b-6b368bd2fdb3',
        TEST_TITLE: 'Title for Test Case',
        TEST_SUBTITLE: 'Subtitle for Test Case',
        TEST_CHANGED_TITLE: 'New Title',
        TEST_CHANGED_SUBTITLE: 'New Subtitle',

        BASIC_ENCOUNTER_INFO_CLASS: 'basic-encounter-container',
        RES_VIEWER_CLASS: 'resource-viewer-container',
        RES_GALLERY_CLASS: 'resource-gallery-container',
        TITLE_DOM: 'h2',
        SUBTITLE_DOM: 'small',

        ROW_DOM: '<div class="row"></div>',
        TITLE_VIEW_DOM: '<div id="titleView" class="row"></div>',
        BASIC_INFO_VIEW_DOM: '<div id="basicInfoView"></div>',
        RES_VIEWER_VIEW_DOM: '<div id="resViewerView"></div>',
        RES_GALLERY_VIEW_DOM: '<div id="resGalleryView"></div>',
        ALERTS_VIEW_DOM: '<div id="alerts"></div>',
        TITLE_VIEW_ID: '#titleView',
        BASIC_INFO_VIEW_ID: '#basicInfoView',
        RES_VIEWER_VIEW_ID: '#resViewerView',
        RES_GALLERY_VIEW_ID: '#resGalleryView',
        ALERTS_VIEW_ID: '#alerts',
    };

    function BasicEncounterInfoTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.BASIC_ENCOUNTER_INFO_CLASS);
        this.encounterId = options.encounterId;
    }
    sewi.inherits(BasicEncounterInfoTestDriver, sewi.ConfiguratorElement);

    function ResViewerTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.RES_VIEWER_CLASS);
    }
    sewi.inherits(ResViewerTestDriver, sewi.ConfiguratorElement);

    function ResGalleryTestDriver(options) {
        sewi.ConfiguratorElement.call(this);

        this.mainDOMElement.addClass(constants.RES_GALLERY_CLASS);
        this.encounterId = options.encounterId;
    }
    sewi.inherits(ResGalleryTestDriver, sewi.ConfiguratorElement);

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
        console.log(this.titleView);
        assert.equal(this.titleView.children(constants.TITLE_DOM).length, 1, 'Configurator adds a <h1> element to the title view DIV.');
        assert.notEqual(this.basicInfoView.children().length, 0, 'Configurator populates encounter basic information view DIV.');
        assert.notEqual(this.resViewerView.children().length, 0, 'Configurator populates encounter resource viewer DIV.');
        assert.notEqual(this.resGalleryView.children().length, 0, 'Configurator populates encounter resource gallery DIV.');

        console.log(this.basicInfoView.children());
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

})();
