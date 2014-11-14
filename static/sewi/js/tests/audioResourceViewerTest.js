(function(){
    QUnit.module('Audio Resource Viewer', {
        setup: function(){
            this.fixture = $('#qunit-fixture');
            this.sewi = window.sewi;
        }
    });

    QUnit.test('Class Initialization', function(assert){
        var audioResourceViewer = new sewi.AudioResourceViewer({id :'23e8e15f-a155-4f8c-b587-2f4855187279'});
        assert.ok(audioResourceViewer, 'Audio Resource Viewer initialized successfully'); 
    });
    
    QUnit.asyncTest('Class Load Data', function(assert){
        expect(3);
        QUnit.stop(2);

        var audioResourceViewer = new sewi.AudioResourceViewer({id :'23e8e15f-a155-4f8c-b587-2f4855187279'});
        var audioResourceViewer2 = new sewi.AudioResourceViewer({id :'a-a155-4f8c-b587-2f4855187279'});
        
        var dom = audioResourceViewer.getDOM();
        var dom2 = audioResourceViewer2.getDOM();

        this.fixture.append(dom);
        this.fixture.append(dom);
        
        audioResourceViewer.on('loaded', function(){
                assert.equal(audioResourceViewer.url, "/media/core/observation/The_Spidrmans.mp3", "url loaded");
                QUnit.start();
            });
        audioResourceViewer.on('bufferReady', function(){
                 assert.equal(audioResourceViewer.audioAmplitudeGraphs.length, 2, "buffer copied");
                 QUnit.start();
            });

        audioResourceViewer2.on('loadFailed', function(){
                assert.equal($(sewi.constants.ERROR_SCREEN_TEXT_DOM).length, 1, "Load Failed");
                QUnit.start();
            });
        audioResourceViewer.load();
        audioResourceViewer2.load();

    });

    QUnit.asyncTest('Audio Play/Pause', function(assert){
        QUnit.stop(1);
        var audioResourceViewer = new sewi.AudioResourceViewer({id :'23e8e15f-a155-4f8c-b587-2f4855187279'});
        var dom = audioResourceViewer.getDOM();
        this.fixture.append(dom);
        
        audioResourceViewer.on('bufferReady', function(){
                audioResourceViewer.playAudio();
                assert.equal(audioResourceViewer.isPlaying, true, "Audio Started");
                QUnit.start();
            });

        audioResourceViewer.on('audioPaused', function(){
                assert.equal(audioResourceViewer.isPlaying, false, "Audio Stopped");
                QUnit.start();
            });
        
        audioResourceViewer.load();
    })
})();
