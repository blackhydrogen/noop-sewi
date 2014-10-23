var sewi = sewi || {};
(function(){
    // Audio Resource Viewer Class
    sewi.AudioResourceViewer = function(){
        if(!(this instanceof sewi.AudioResourceViewer)){
            return new sewi.AudioResourceViewer();
        }
        sewi.ResourceViewer.call(this);
        var selfRef = this;
        selfRef.uuid = "U"+Date.now();
        selfRef.graphUpdateTimer = null;
        selfRef.offset = 0;
        selfRef.gainValue = 0;
        selfRef.startTime = 0;
        selfRef.endTime = 0;
        selfRef.amplitudeData = [];
        selfRef.audioContext = null;
        selfRef.playable = false;
        selfRef.isPlaying = false;
        selfRef.contentDOM = null;
        selfRef.graph = $('<div class="audio-graph" id="'+selfRef.uuid+'"></div>');
        selfRef.errorScreen = new sewi.ErrorScreen();
        selfRef.progressBar = new sewi.ProgressBar(true);
        init.call(selfRef);
        initControls.call(selfRef);	
    }

    sewi.inherits(sewi.AudioResourceViewer, sewi.ResourceViewer);

    sewi.AudioResourceViewer.prototype.load = function(url, type){
        return $('<source src="'+url+'" type="'+type+'">');
    }

    function init(){
        var selfRef = this;
        selfRef.mainDOMElement.addClass('audio-resource-viewer');
        
        var url = '/static/sewi/media/Early_Riser.mp3';
        var contextClass = (window.AudioContext || 
                            window.webkitAudioContext || 
                            window.mozAudioContext || 
                            window.oAudioContext || 
                            window.msAudioContext);
        //contextClass = null;	
        if(contextClass){
            selfRef.audioContext =new contextClass();
            selfRef.progressBar.update(100);
            selfRef.progressBar.setText('buffering audio clip');
            selfRef.contentDOM = $('<div class="audio-content"></div>');
            selfRef.contentDOM.append(selfRef.progressBar.getDOM());
            selfRef.mainDOMElement.append(selfRef.contentDOM);
            
            selfRef.scriptProcessor = selfRef.audioContext.createScriptProcessor(512, 1, 1); 
            selfRef.scriptProcessor.connect(selfRef.audioContext.destination);
            selfRef.scriptProcessor.onaudioprocess = selfRef.updateMediaControl.bind(this);

            selfRef.analyserNode = selfRef.audioContext.createAnalyser();
            selfRef.analyserNode.connect(selfRef.scriptProcessor);
            selfRef.amplitudeArray = new Uint8Array(selfRef.analyserNode.frequencyBinCount);

            selfRef.gainNode = selfRef.audioContext.createGain();
            selfRef.gainNode.connect(selfRef.audioContext.destination);
            selfRef.gainNode.gain.value = 1;

            selfRef.audio = new Audio();
            //selfRef.audio.preload = true; //Preload will not work properly. The work around solution is found in onCanPlayThrough.
            selfRef.audio.src = url;
            selfRef.audio.onloadedmetadata = onLoadedMetaData.bind(this);
            selfRef.audio.oncanplay = onCanPlay.bind(this);
            selfRef.audio.onstalled = onStalled.bind(this);
            selfRef.audio.onended = onEnded.bind(this);

            selfRef.audioSource = selfRef.audioContext.createMediaElementSource(selfRef.audio);
            selfRef.audioSource.connect(selfRef.gainNode);
            selfRef.audioSource.connect(selfRef.analyserNode);
            
        } else {
            selfRef.errorScreen.setText('Error: Web Audio API is not supported by the browser.');
            selfRef.mainDOMElement.append(selfRef.errorScreen.getDOM());
        }

    }
  
    function onEnded(event){
        var selfRef = this;
        console.log("onEnded:"+selfRef.amplitudeData.length);
        selfRef.isPlaying = false;
        selfRef.audio.currentTime = 0;
        selfRef.controls.update({position: 0, currentTime: 0, playing : selfRef.isPlaying});
        clearInterval(selfRef.updateTimer);
    }

    function onStalled(event){
        var selfRef = this;
        console.log("onStalled");
        
        if(selfRef.contentDOM) 
            selfRef.contentDOM.remove();
        
        selfRef.errorScreen.setText('Error: Audio file is currently unavailable.');
        selfRef.mainDOMElement.append(selfRef.errorScreen.getDOM());
    }

    function onCanPlay(event){
        var selfRef = this;
        console.log("canPlay");
        selfRef.progressBar.getDOM().remove();
        //Have the audio play and pause if you are using preload = true. This is to counter a bug in preload.
        //selfRef.audio.play();
        //selfRef.audio.pause();
        selfRef.contentDOM.append(selfRef.graph);
        if(!selfRef.g){
            selfRef.g = new Dygraph(selfRef.graph[0], selfRef.amplitudeData,
                            {
                                valueRange: [-1.2, 1.2],
                                labels: ['Time', 'Amplitude'],
                                zoomCallback: function(minX, maxX){
                                        console.log(minX+","+maxX);
                                        selfRef.startTime = minX;
                                        selfRef.endTime = maxX;
                                        selfRef.audio.currentTime = selfRef.startTime;
                                        var percent = (selfRef.audio.currentTime/selfRef.audio.duration) * 100; 
                                        selfRef.controls.update({position: percent, currentTime: selfRef.audio.currentTime});
                                        console.log("zoomed");
                                    }
                             });
        }
        selfRef.playable = true;
    }

    function onLoadedMetaData(event){
        var selfRef = this;
        selfRef.startTime = 0;
        selfRef.endTime = selfRef.audio.duration;
        selfRef.controls.update({duration : selfRef.audio.duration, currentTime : selfRef.audio.currentTime});
    }

    function initControls(){
        var selfRef = this;
        if(selfRef.audioContext){
            selfRef.controls = new sewi.MediaControls();
            selfRef.controls.on('Playing', selfRef.playAudio.bind(this));
            selfRef.controls.on('Paused', selfRef.pauseAudio.bind(this));
            selfRef.controls.on('PositionChanged', selfRef.sliderChanged.bind(this));
            selfRef.controls.on('VolumeChanged', selfRef.volumeSliderChanged.bind(this));
            selfRef.controls.on('Unmuted', selfRef.volumeUnmuted.bind(this));
            selfRef.controls.on('Muted', selfRef.volumeMuted.bind(this));
            selfRef.mainDOMElement.append(selfRef.controls.getDOM());
        }
    }

    function updateTimer(){
        var selfRef = this;
        //console.log("timer:"+selfRef.amplitudeData.length);
        selfRef.g.updateOptions({'file' : selfRef.amplitudeData});
    }

    sewi.AudioResourceViewer.prototype.sliderChanged = function(event, position){
        var selfRef = this;
        var percent = (selfRef.audio.currentTime/selfRef.audio.duration) * 100; 
        
        selfRef.audio.currentTime = (position/100) * selfRef.audio.duration;
        selfRef.controls.update({position: percent, currentTime: selfRef.audio.currentTime});
    }

    sewi.AudioResourceViewer.prototype.volumeSliderChanged = function(event, volume){
        var selfRef = this;
        selfRef.gainNode.gain.value = volume;
    }

    sewi.AudioResourceViewer.prototype.volumeUnmuted = function(event){
        var selfRef = this;
        selfRef.gainNode.gain.value = selfRef.gainValue;
    }

    sewi.AudioResourceViewer.prototype.volumeMuted = function(event){
        var selfRef = this;
        selfRef.gainValue = selfRef.gainNode.gain.value;
        selfRef.gainNode.gain.value = 0;
    }

    sewi.AudioResourceViewer.prototype.updateMediaControl = function(event){
        var selfRef = this;
//      console.log(selfRef.amplitudeArray[0]);
        if(selfRef.isPlaying){
            selfRef.amplitudeArray = new Uint8Array(selfRef.analyserNode.frequencyBinCount);
            selfRef.analyserNode.getByteTimeDomainData(selfRef.amplitudeArray);
            var sum = 0;
            for(var i = 0; i < selfRef.amplitudeArray.length; i++){
              //  selfRef.amplitudeData.push([new Date(), (selfRef.amplitudeArray[i]/128) - 1]); 
                sum += (selfRef.amplitudeArray[i]/128); 
            }
            //var avg = (sum / selfRef.amplitudeArray.length) - 1;
            selfRef.amplitudeData.push([selfRef.audio.currentTime, (selfRef.amplitudeArray[0]/128) - 1]); 
            
            if(selfRef.endTime - selfRef.audio.currentTime < 0.1){
                selfRef.audio.pause();
                selfRef.isPlaying = false;
                selfRef.audio.currentTime = selfRef.startTime;
            }
            var percent = (selfRef.audio.currentTime/selfRef.audio.duration) * 100; 
            selfRef.controls.update({position: percent, currentTime: selfRef.audio.currentTime, playing: !selfRef.isPlaying});
        }
    }

    sewi.AudioResourceViewer.prototype.playAudio = function(){
        var selfRef = this;
        console.log('audio playing');
        if(selfRef.playable && !selfRef.isPlaying){
            selfRef.audio.play();
            selfRef.isPlaying = true;
            if(!selfRef.graphUpdateTimer){
                selfRef.graphUpdateTimer = setInterval(updateTimer.bind(this), 1000); 
            }
        }
        selfRef.controls.update({playing : !selfRef.isPlaying});
    }

    sewi.AudioResourceViewer.prototype.pauseAudio = function(){
        var selfRef = this;
        console.log('audio paused');
        if(selfRef.playable && selfRef.isPlaying){
            selfRef.audio.pause();
            selfRef.isPlaying = false;
        }
        selfRef.controls.update({playing : !selfRef.isPlaying});
    }

    sewi.AudioResourceViewer.prototype.onAudioFinish = function(event){
        var selfRef = this;
        console.log("Audio ended");
    }

    sewi.AudioResourceViewer.prototype.resize = function(){
    
    }
})();
