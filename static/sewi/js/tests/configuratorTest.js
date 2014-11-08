(function() {

    function BasicEncounterInfoTestDriver() {
        this.container = $('<div>').addClass('basic-encounter-container');
    }

    BasicEncounterInfoTestDriver.prototype.getDOM = function() {
        return this.container;
    }

    function ResViewerTestDriver() {
        this.container = $('<div>').addClass('resource-viewer-container');
    }

    ResViewerTestDriver.prototype.getDOM = function() {
        return this.container;
    }

    function ResGalleryTestDriver() {
        this.container = $('<div>').addClass('resource-gallery-container');
    }

    ResGalleryTestDriver.prototype.getDOM = function() {
        return this.container;
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

    module('Configurator', {
        setup: function() {
            // set up fixture elements
            this.fixture = $('#qunit-fixture');
            this.titleView = $('<div>').attr('id','titleView').addClass('row').appendTo(this.fixture);
            var rowDiv = $('<div>').addClass('row').appendTo(this.fixture);
            this.basicInfoView = $('<div>').attr('id','basicInfoView').appendTo(rowDiv);
            this.resViewerView = $('<div>').attr('id','resViewerView').appendTo(rowDiv);
            this.resGalleryView = $('<div>').attr('id','resGalleryView').appendTo(rowDiv);

            // override SEWI global vars
            this.oldSewi = sewi;
            sewi = {
                TabContainer: ResViewerTestDriver,
                ResourceGallery: ResGalleryTestDriver,
                BasicEncounterInfoViewer: BasicEncounterInfoTestDriver,
                Configurator: sewi.Configurator
            };
        },

        teardown: function() {
            // restore global vars (for other test modules to work)
            sewi = this.oldSewi;
        }
    });

    test('Initialization', function(assert) {

        assert.throws(function() {
            var configurator = new sewi.Configurator();
        }, Error, 'Throws Error when DIV selectors/elements are not provided.');

        assert.throws(function() { throw new Error() });

        assert.throws(function() {
            var configurator = new sewi.Configurator({
                titleView: '#invalidId',
                basicInfoView: '#invalidId',
                resViewerView: '#invalidId',
                resGalleryView: '#invalidId',
            });
        }, Error, 'Throws Error when DIV selectors/elements are invalid.');

        var configurator = new sewi.Configurator({
            titleView: '#titleView',
            basicInfoView: '#basicInfoView',
            resViewerView: '#resViewerView',
            resGalleryView: '#resGalleryView',
        });
        assert.ok(configurator, 'Configurator can init successfully with selectors/DIVs provided.');
    });

    test('Basic DOM Elements', function(assert) {
        var configurator = new sewi.Configurator({
            titleView: '#titleView',
            basicInfoView: '#basicInfoView',
            resViewerView: '#resViewerView',
            resGalleryView: '#resGalleryView',
        });
        assert.equal(this.titleView.children('h1').length, 1, 'Configurator adds a <h1> element to the title view DIV.');
        assert.notEqual(this.basicInfoView.children().length, 0, 'Configurator populates encounter basic information view DIV.');
        assert.notEqual(this.resViewerView.children().length, 0, 'Configurator populates encounter resource viewer DIV.');
        assert.notEqual(this.resGalleryView.children().length, 0, 'Configurator populates encounter resource gallery DIV.');

        console.log(this.basicInfoView.children());
        assert.equal(this.basicInfoView.children('div.basic-encounter-container').length, 1, 'Configurator adds the basic information container to the encounter basic information view DIV.');
        assert.equal(this.resViewerView.children('div.resource-viewer-container').length, 1, 'Configurator adds the resource viewer container to the encounter resource viewer DIV.');
        assert.equal(this.resGalleryView.children('div.resource-gallery-container').length, 1, 'Configurator adds the resource gallery container to the encounter resource gallery DIV.');
    });

    test('Title and Subtitle', function(assert) {
        var configurator = new sewi.Configurator({
            titleView: '#titleView',
            basicInfoView: '#basicInfoView',
            resViewerView: '#resViewerView',
            resGalleryView: '#resGalleryView',

            title: 'Title for Test Case',
            subtitle: 'Subtitle for Test Case'
        });
        var titleDiv = this.titleView.children('h1');
        var subtitleDiv = titleDiv.children('small');

        assert.equal(subtitleDiv.length, 1, 'Subtitle is displayed with title.');
        assert.equal(getTitleText(titleDiv), 'Title for Test Case', 'Title text from constructor is displayed correctly.');
        assert.equal(subtitleDiv.text(), 'Subtitle for Test Case', 'Subtitle text from constructor is displayed correctly.');

        configurator.setTitle('New title', 'New subtitle');
        assert.equal(getTitleText(titleDiv), 'New title', 'Title text is changed correctly.');
        assert.equal(subtitleDiv.text(), 'New subtitle', 'Subtitle text is changed correctly.');
    });

})();
