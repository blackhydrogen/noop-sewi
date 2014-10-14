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
	var url = '/static/sewi/media/gun_battle_sound.wav';
	var request = XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arrayBuffer';
    request.addEventListener('progress', selfRef.onProgress, false);
    request.addEventListener('load', selfRef.onComplete, false);
    request.addEventListener('abort', selfRef.onAbort, false);
    request.addEventListener('error', selfRef.onError, false);
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
    var contentDOM = $('<div class="audio-content"></div>');
    selfRef.mainDOMElement.append(contentDOM);
    selfRef.mainDOMElement.addClass('audio-resource-viewer');
}

sewi.AudioResourceViewer.prototype.onProgress = function(event){

}

sewi.AudioResourceViewer.prototype.onComplete = function(event){
    console.log("file loaded");
}

sewi.AudioResourceViewer.prototype.onAbort = function(event){

}

sewi.AudioResourceViewer.prototype.onError = function(event){

}

sewi.AudioResourceViewer.prototype.initControls = function(){
    var selfRef = this;
    selfRef.controls = new sewi.MediaControls();
    selfRef.mainDOMElement.append(selfRef.controls.getDOM());
}
