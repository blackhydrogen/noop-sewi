var sewi = sewi || {};

// Audio Resource Viewer Class
sewi.AudioResourceViewer = function(){
	if(!(this instanceof sewi.AudioResourceViewer))
		return new sewi.AudioResourceViewer();
	sewi.ResourceViewer.call(this);
	var selfRef = this;
    selfRef.init();
    selfRef.initControls();	
}

sewi.inherits(sewi.AudioResourceViewer, sewi.ResourceViewer);

sewi.AudioResourceViewer.prototype.load = function(url, type){
	return $('<source src="'+url+'" type="'+type+'">');
}

sewi.AudioResourceViewer.prototype.init = function(){
	var selfRef = this;
    selfRef.progressBar = new sewi.ProgressBar();
    selfRef.progressBar.setText('fetching audio clip');
    var contentDOM = $('<div class="audio-content"></div>');
    contentDOM.append(selfRef.progressBar.getDOM());
    selfRef.mainDOMElement.append(contentDOM);
    selfRef.mainDOMElement.addClass('audio-resource-viewer');
	
    var url = '/static/sewi/media/gun_battle_sound.wav';
	var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arrayBuffer';

    request.addEventListener('progress', selfRef.onProgress.bind(this), false);
    request.addEventListener('load', selfRef.onComplete.bind(this), false);
    request.addEventListener('abort', selfRef.onAbort.bind(this), false);
    request.addEventListener('error', selfRef.onError.bind(this), false);
    request.send();

	/*var contextClass = (window.AudioContext || 
	  					window.webkitAudioContext || 
	    				window.mozAudioContext || 
		  				window.oAudioContext || 
		    			window.msAudioContext);
	if(contextClass){
		selfRef.audioContext =new contextClass();
		var source = selfRef.audioContext.createMediaElementSource(audio);	
		source.connect(selfRef.audioContext.destination);
	} else {
		//TO DO: web audio api not supported by the browser.
	}
    */
}

sewi.AudioResourceViewer.prototype.onProgress = function(event){
    var selfRef = this;
    console.log(selfRef);
    if(event.lengthComputable){
        var percent = (event.loaded/event.total) * 100
        console.log((event.loaded / event.total) * 100);
        selfRef.progressBar.update(percent);
    }
}

sewi.AudioResourceViewer.prototype.onComplete = function(event){
    var selfRef = this;
    console.log("file loaded");
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
    selfRef.mainDOMElement.append(selfRef.controls.getDOM());
}
