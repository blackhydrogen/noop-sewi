(function(){

var constants = {
	TEST_INVALID_RESOURCE_ID: 121,
    TEST_VALID_RESOURCE_ID: '121'
};
QUnit.module('Chart Resource Viewer', {
	setup: function(){
		this.fixture = $('#qunit-fixture');
	},

	teardown: function(){
	}
});

QUnit.test('Initialization', function(assert){

	assert.throws(function() {
            var chartResourceViewer = new sewi.ChartResourceViewer();
        }, Error, 'Throws Error when no id is passed on initialization');

	var options = {id: constants.TEST_INVALID_RESOURCE_ID}
	assert.throws(function() {
            var chartResourceViewer = new sewi.ChartResourceViewer(options);
        }, Error, 'Throws Error when invalid id is passed on initialization');	

	options.id = constants.TEST_VALID_RESOURCE_ID;
	assert.ok(new sewi.ChartResourceViewer(options), 'Chart Resource Viewer initialized successfully');
});


})();
