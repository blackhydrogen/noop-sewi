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

    raises(function() {
        var configurator = new sewi.Configurator();
    }, Error, 'Throws Error when DIV selectors/elements are not provided.');

    raises(function() {
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
    assert.notEqual(this.basicInfoView.length, 0, 'Configurator populates encounter basic information view DIV.');
    assert.notEqual(this.resViewerView.length, 0, 'Configurator populates encounter resource viewer DIV.');
    assert.notEqual(this.resGalleryView.length, 0, 'Configurator populates encounter resource gallery DIV.');
});
