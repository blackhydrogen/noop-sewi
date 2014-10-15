var sewi = sewi || {};

// Audio Resource Viewer Class
sewi.AudioResourceViewer = function(){
	if(!(this instanceof sewi.AudioResourceViewer))
		return new sewi.AudioResourceViewer();
	sewi.ResourceViewer.call(this);
	var selfRef = this;
    selfRef.offset = 0;
    selfRef.startTime = 0;
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
    selfRef.scriptProcessor.onaudioprocess = function(event){
   //     console.log(event.playbackTime);
    }

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
                                         selfRef.audioBuffer = buffer;}, 
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
    //selfRef.controls.on('PositionChanged', selfRef.updateAudioSlider.bind(this));
    selfRef.mainDOMElement.append(selfRef.controls.getDOM());
}

sewi.AudioResourceViewer.prototype.updateAudioSlider = function(event){
    var selfRef = this;
    selfRef.controls.update({position : (selfRef.offset / selfRef.source.duration)*100});
}

sewi.AudioResourceViewer.prototype.playAudio = function(){
    var selfRef = this;
    console.log('audio playing');
    console.log(selfRef.audioContext.currentTime);
    selfRef.source = selfRef.audioContext.createBufferSource();	
    selfRef.source.buffer = selfRef.audioBuffer;
	selfRef.source.connect(selfRef.audioContext.destination);
	selfRef.source.connect(selfRef.scriptProcessor);
    selfRef.startTime = Date.now();
    selfRef.source.start(0, selfRef.offset);
}

sewi.AudioResourceViewer.prototype.pauseAudio = function(){
    var selfRef = this;
    console.log('audio paused');
	selfRef.offset += (Date.now() - selfRef.startTime) / 1000;
    selfRef.source.stop(0);
}
