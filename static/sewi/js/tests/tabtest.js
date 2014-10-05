module('tab container', {
	setup: function(){
		this.fixture = $('#qunit-fixture');
	},
	
	teardown: function(){
	}
});

test('Initialization', function(assert){
	assert.ok(new sewi.TabContainer(), 'Tab Container initialized successfully');	
});

test('Add New Tab', function(assert){
	var tabContainer = new sewi.TabContainer();
	this.fixture.append(tabContainer.getDOM());
	tabContainer.addNewTab("Tab", "Tab", true);
	assert.equal($('.tab-pane').length, 1, "Tab added successfully.");
});

test('Addition and removal of all tabs', function(assert){
	var tabContainer = new sewi.TabContainer();
	this.fixture.append(tabContainer.getDOM());
	for(var i =0; i < 10; i++){
		tabContainer.addNewTab("Tab"+i, "", true);
	}
	assert.equal($('.tab-pane').length, 10, "10 tabs added successfully.");

	
	while($('.glyphicon-remove').length > 0){
		$('.glyphicon-remove').click();
	}
	assert.equal($('.tab-pane').length, 0, "All tabs removed successfully");
});

/*test('Adding multiple DOMs into the tab', function(assert){
	

});*/
