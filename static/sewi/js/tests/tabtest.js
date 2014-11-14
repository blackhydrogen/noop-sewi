(function(){
    QUnit.module('tab container', {
        setup: function(){
            this.fixture = $('#qunit-fixture');
            this.sewi= window.sewi;
        },
        
        teardown: function(){
        }
    });

    QUnit.test('TC1: Initialization', function(assert){
        assert.ok(new sewi.TabContainer(), 'Tab Container initialized successfully');	
    });
})();
