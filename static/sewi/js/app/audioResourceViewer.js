var sewi = sewi || {};

// Audio Resource Viewer Class
sewi.AudioResourceViewer = function(){
	if(!(this instanceof sewi.AudioResourceViewer))
		return new sewi.AudioResourceViewer();
	sewi.ResourceViewer.call(this);
	var selfRef = this;
    selfRef.offset = 0;
    selfRef.gainValue = 0;
    selfRef.startTime = 0;
    selfRef.audioBuffer = null;
    selfRef.isPlaying = false;
    selfRef.init();
    selfRef.initControls();	
}

sewi.inherits(sewi.AudioResourceViewer, sewi.ResourceViewer);

sewi.AudioResourceViewer.prototype.load = function(url, type){
	return $('<source src="'+url+'" type="'+type+'">');
}

sewi.AudioResourceViewer.prototype.init = function(){
	var selfRef = this;
    selfRef.progressBar = new sewi.ProgressBar(true);
    selfRef.progressBar.setText('fetching audio clip');
    var contentDOM = $('<div class="audio-content"></div>');
    contentDOM.append(selfRef.progressBar.getDOM());
    selfRef.mainDOMElement.append(contentDOM);
    selfRef.mainDOMElement.addClass('audio-resource-viewer');
	
    var url = '/static/sewi/media/gun_battle_sound.wav';
	var contextClass = (window.AudioContext || 
	  					window.webkitAudioContext || 
	    				window.mozAudioContext || 
		  				window.oAudioContext || 
		    			window.msAudioContext);
	
    if(contextClass){
		selfRef.audioContext =new contextClass();
	} else {
		//TO DO: web audio api not supported by the browser.
	}

	selfRef.scriptProcessor = selfRef.audioContext.createScriptProcessor(512, 1, 1); 
    selfRef.scriptProcessor.connect(selfRef.audioContext.destination);
    selfRef.scriptProcessor.onaudioprocess = selfRef.updateMediaControl.bind(this);

    selfRef.gainNode = selfRef.audioContext.createGain();
    selfRef.gainNode.connect(selfRef.audioContext.destination);
    selfRef.gainNode.gain.value = 1;

    selfRef.request = new XMLHttpRequest();
    selfRef.request.open('GET', url, true);
    selfRef.request.responseType = 'arraybuffer';

    selfRef.request.addEventListener('progress', selfRef.onProgress.bind(this), false);
    selfRef.request.addEventListener('load', selfRef.onComplete.bind(this), false);
    selfRef.request.addEventListener('abort', selfRef.onAbort.bind(this), false);
    selfRef.request.addEventListener('error', selfRef.onError.bind(this), false);
    selfRef.request.send();

    
}

sewi.AudioResourceViewer.prototype.onProgress = function(event){
    var selfRef = this;
    if(event.lengthComputable){
        var percent = (event.loaded/event.total) * 100
        console.log((event.loaded / event.total) * 100);
        selfRef.progressBar.update(percent);
    }
}

sewi.AudioResourceViewer.prototype.onComplete = function(event){
    console.log("file loaded");
    var selfRef = this;
    var audioData = selfRef.request.response;
    console.log(audioData);
    selfRef.audioContext.decodeAudioData(audioData, function(buffer){
                                            selfRef.audioBuffer = buffer;
                                            selfRef.controls.update({duration : selfRef.audioBuffer.duration, currentTime : selfRef.offset});
                                         }, 
                                         function(e){"Error with decoding audio data" + e.err}); 
}

sewi.AudioResourceViewer.prototype.onAbort = function(event){
    var selfRef = this;
}

sewi.AudioResourceViewer.prototype.onError = function(event){
    var selfRef = this;
}

sewi.AudioResourceViewer.prototype.initControls = function(){
    var selfRef = this;
    selfRef.controls = new sewi.MediaControls();
    selfRef.controls.on('Playing', selfRef.playAudio.bind(this));
    selfRef.controls.on('Paused', selfRef.pauseAudio.bind(this));
    selfRef.controls.on('PositionChanged', selfRef.sliderChanged.bind(this));
    selfRef.controls.on('VolumeChanged', selfRef.volumeSliderChanged.bind(this));
    selfRef.controls.on('Unmuted', selfRef.volumeUnmuted.bind(this));
    selfRef.controls.on('Muted', selfRef.volumeMuted.bind(this));
    selfRef.mainDOMElement.append(selfRef.controls.getDOM());
}

sewi.AudioResourceViewer.prototype.sliderChanged = function(event, position){
    var selfRef = this;
    selfRef.offset = (position/100) * selfRef.source.buffer.duration;
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
    if(selfRef.source){
        if(selfRef.isPlaying){
            var percent = (((Date.now()-selfRef.startTime)/1000 + selfRef.offset) / selfRef.source.buffer.duration)*100;
            selfRef.controls.update({position : percent, currentTime : ((Date.now()-selfRef.startTime)/1000 + selfRef.offset) });
            if(percent >= 100){
                selfRef.isPlaying = false;
                selfRef.offset = 0;
                selfRef.source.disconnect(selfRef.gainNode);
                selfRef.source.disconnect(selfRef.scriptProcessor);
                selfRef.controls.update({position : 0, 
                                        playing : selfRef.isPlaying});
            }
        }
   }
}

sewi.AudioResourceViewer.prototype.playAudio = function(){
    var selfRef = this;
    console.log('audio playing');
    selfRef.source = selfRef.audioContext.createBufferSource();	
    selfRef.source.buffer = selfRef.audioBuffer;
	selfRef.source.connect(selfRef.gainNode);
	selfRef.source.connect(selfRef.scriptProcessor);
    selfRef.source.onended = selfRef.onAudioFinish.bind(this);
    selfRef.startTime = Date.now();
    selfRef.source.start(0, selfRef.offset);
    selfRef.isPlaying = true;
    selfRef.controls.update({isPlaying: selfRef.isPlaying});
}

sewi.AudioResourceViewer.prototype.pauseAudio = function(){
    var selfRef = this;
    console.log('audio paused');
    selfRef.isPlaying = false;
	selfRef.offset += (Date.now() - selfRef.startTime) / 1000;
    selfRef.source.stop(0);
    selfRef.controls.update({isPlaying: selfRef.isPlaying});
}

sewi.AudioResourceViewer.prototype.onAudioFinish = function(event){
    var selfRef = this;
    console.log("Audio ended");
    selfRef.source.disconnect(selfRef.gainNode);
    selfRef.source.disconnect(selfRef.scriptProcessor);
}
