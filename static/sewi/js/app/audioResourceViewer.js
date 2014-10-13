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
	var audio = new Audio();
	audio.src = '/static/sewi/media/gun_battle_sound.wav';
	audio.controls = true;
	audio.preload = "auto";
	$(audio).addClass('audio-control');
	var contextClass = (window.AudioContext || 
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

	selfRef.mainDOMElement.append(audio); 	
}

sewi.AudioResourceViewer.prototype.initControls = function(){
    var selfRef = this;
    selfRef.controls = new sewi.MediaControls();
    selfRef.mainDOMElement.append(selfRef.controls.getDOM());
}
