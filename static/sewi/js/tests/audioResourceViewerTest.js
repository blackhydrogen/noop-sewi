(function(){
    QUnit.module('Audio Resource Viewer', {
        setup: function(){
            this.fixture = $('#qunit-fixture');
            this.sewi = window.sewi;
        }
    });

    QUnit.asyncTest('Class Initialization', function(assert){
        expect(2);
        
        var audioResourceViewer = new sewi.AudioResourceViewer({id :'c4294403-7f38-4588-a698-93554a7fda29'});
        assert.ok(audioResourceViewer, 'Audio Resource Viewer initialized successfully'); 
        var dom = audioResourceViewer.getDOM();
        this.fixture.append(dom);
        
        audioResourceViewer.on('loaded', function(){
                assert.equal(audioResourceViewer.url, "/media/core/observation/Early_Riser.mp3");
                QUnit.start();
            });
        audioResourceViewer.load();
    });

})();
