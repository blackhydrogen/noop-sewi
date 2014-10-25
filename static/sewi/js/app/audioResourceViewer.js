var sewi = sewi || {};
(function(){
    // Audio Resource Viewer Class
    sewi.AudioResourceViewer = function(options){
        if(!(this instanceof sewi.AudioResourceViewer)){
            return new sewi.AudioResourceViewer();
        }
        sewi.ResourceViewer.call(this);
        var selfRef = this;
        var defaults = {};
       
        options = options || {};
        _.defaults(options, defaults);
        _.assign(selfRef, _.pick(options, ['id']));

        selfRef.offset = 0;
        selfRef.gainValue = 0;
        selfRef.startTime = 0;
        selfRef.audioBuffer = null;
        selfRef.isPlaying = false;
        selfRef.id = options.id;
        selfRef.contentDOM = null;
        selfRef.init();
        selfRef.initControls();	
    }

    sewi.inherits(sewi.AudioResourceViewer, sewi.ResourceViewer);

    sewi.AudioResourceViewer.prototype.load = function(url, type){
        return $('<source src="'+url+'" type="'+type+'">');
    }

    sewi.AudioResourceViewer.prototype.init = function(){
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
            selfRef.progressBar = new sewi.ProgressBar(true);
            selfRef.progressBar.setText('fetching audio clip');
            selfRef.contentDOM = $('<div class="audio-content"></div>');
            selfRef.contentDOM.append(selfRef.progressBar.getDOM());
            selfRef.mainDOMElement.append(selfRef.contentDOM);
            
            selfRef.scriptProcessor = selfRef.audioContext.createScriptProcessor(512, 1, 1); 
            selfRef.scriptProcessor.connect(selfRef.audioContext.destination);
            selfRef.scriptProcessor.onaudioprocess = selfRef.updateMediaControl.bind(this);

            selfRef.gainNode = selfRef.audioContext.createGain();
            selfRef.gainNode.connect(selfRef.audioContext.destination);
            selfRef.gainNode.gain.value = 1;

            selfRef.request = new XMLHttpRequest();
            selfRef.request.open('GET', url, true);
            selfRef.request.responseType = 'arraybuffer';
            selfRef.request.onreadystatechange = onReadyStateChange.bind(this);

            selfRef.request.addEventListener('progress', onProgress.bind(this), false);
            selfRef.request.addEventListener('load', onComplete.bind(this), false);
            selfRef.request.addEventListener('abort', onAbort.bind(this), false);
            selfRef.request.addEventListener('error', onError.bind(this), false);
            selfRef.request.send();

        } else {
            var error = new sewi.ErrorScreen();
            error.setText('Error: Web Audio API is not supported by the browser.');
            selfRef.mainDOMElement.append(error.getDOM());
        }

    }
    
    function onReadyStateChange(event){
        var selfRef = this;
        if(selfRef.request.readyState > 2 && selfRef.request.status == 200){
            //console.log("response:" + selfRef.request.response);
        }
    }

    function onProgress(event){
        var selfRef = this;
        if(event.lengthComputable){
            var percent = (event.loaded/event.total) * 100
            console.log((event.loaded / event.total) * 100);
            selfRef.progressBar.update(percent);
        }
    }

    function onComplete(event){
        var selfRef = this;
        console.log("file loaded");
        var audioData = selfRef.request.response;
        selfRef.audioContext.decodeAudioData(audioData, onAudioDecodeFinish.bind(this), onAudioDecodeFail.bind(this)); 
    }

    function onAbort(event){
        var selfRef = this;
    }

    function onError(event){
        var selfRef = this;
    }

    function onAudioDecodeFinish(buffer){
        var selfRef = this;
        selfRef.audioBuffer = buffer;
        var sampleRate = buffer.sampleRate; // samples per second (float)
        var length = buffer.length; // audio data in samples (float)
        var duration = buffer.duration; // in seconds (float)
        var numChannels = buffer.numberOfChannels; // (unsigned int)
        var channelName = ['left-channel','right-channel'];

        selfRef.controls.update({duration : duration, currentTime : selfRef.offset});

        for(var i=0; i < numChannels; i++){
            var audioSequence = new sewi.AudioSequence(sampleRate, buffer.getChannelData(i));
            var audioAmplitudeGraph = createAmplitudeWaveGraph.call(this, channelName[i], audioSequence);
        }
    }

    function onAudioDecodeFail(event){
    
    }

    function createAmplitudeWaveGraph(channelName, audioSequence){
        var selfRef = this;
        var graphDOM = $('<div class="wave-graph '+ channelName+'" id="'+selfRef.id+'" title="'+channelName+'"></div>');
        selfRef.contentDOM.append(graphDOM);
        if(selfRef.progressBar){
            selfRef.progressBar.getDOM().remove();
            delete selfRef.progressBar;
        }
        var graph =  new sewi.AudioAmplitudeGraph(graphDOM, audioSequence); 

        return graph;
    }

    sewi.AudioResourceViewer.prototype.initControls = function(){
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
        if(selfRef.audioBuffer){
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
    }

    sewi.AudioResourceViewer.prototype.pauseAudio = function(){
        var selfRef = this;
        console.log('audio paused');
        if(selfRef.source){
            selfRef.isPlaying = false;
            selfRef.offset += (Date.now() - selfRef.startTime) / 1000;
            selfRef.source.stop(0);
            selfRef.controls.update({isPlaying: selfRef.isPlaying});
        }
    }

    sewi.AudioResourceViewer.prototype.onAudioFinish = function(event){
        var selfRef = this;
        console.log("Audio ended");
        if(selfRef.source){
            selfRef.source.disconnect(selfRef.gainNode);
            selfRef.source.disconnect(selfRef.scriptProcessor);
        }
    }
})();


// AudioAmplitudeGraph Class
(function(){

    sewi.AudioAmplitudeGraph = function(graphDOM, audioSequence){
        var selfRef = this;
        selfRef.graphDOM = graphDOM;
        selfRef.name=selfRef.graphDOM.attr('title');
        selfRef.audioSequence = audioSequence;

        setupCanvasVariables.call(this);
        setupMouseVariables.call(this);
        setupColorVariables.call(this);
        setupMiscVariables.call(this);

        createCanvas.call(this);
    }

    function setupCanvasVariables(){
        var selfRef = this;
        //Set the canvas height and width
        selfRef.canvasHeight = selfRef.graphDOM.height();
        selfRef.canvasWidth = selfRef.graphDOM.width();
    }

    function setupMouseVariables(){
        var selfRef = this;
        // is the mouse inside of the editor (for background coloring)
        selfRef.mouseInside = false;
        // state of the mouse button
        selfRef.mouseDown = false;
        // is the mouse clicked inside of the selection
        selfRef.mouseInsideOfSelection = false;

        // is the start or end bar selected
        selfRef.mouseSelectionOfStart = false;
        selfRef.mouseSelectionOfEnd = false;

        // current and previous position of the mouse
        selfRef.mouseX = 0;
        selfRef.mouseY = 0;
        selfRef.previousMouseX = 0;
        selfRef.previousMouseY = 0;

        // position of the selection (if equal, the selection is disabled)
        selfRef.selectionStart = 0;
        selfRef.selectionEnd = 0;
    }

    function setupColorVariables(){
        var selfRef = this;
        // colors when the mouse is outside of the editor box
        selfRef.colorInactiveTop = "#d7e5c7";
        selfRef.colorInactiveBottom = "#d7e5c7";
        // colors when the mouse is inside of the editor box
        selfRef.colorActiveTop = "#e8f6d8";
        selfRef.colorActiveBottom = "#e8f6d8";
        // color when the mouse is pressed during inside of the editor box
        selfRef.colorMouseDownTop = "#d7e5c7";
        selfRef.colorMouseDownBottom = "#d7e5c7";
        // color of the selection frame
        selfRef.colorSelectionStroke = "rgba(255,0,0,0.5)";
        selfRef.colorSelectionFill = "rgba(255,0,0,0.2)";
    }

    function setupMiscVariables(){
        var selfRef = this;

        selfRef.plotTechnique = 0;
        selfRef.canvasDOM = null;
        // temporary optimized visualization data    
        selfRef.visualizationData = [];
        // handle focus for copy, paste & cut
        selfRef.hasFocus = true;    
        // a list of editors which are linked to this one
        selfRef.linkedEditors = [];
        // movement
        selfRef.movePos = 0;
        selfRef.movementActive = false;
        // zoom
        selfRef.viewResolution = 10; // default 10 seconds
        selfRef.viewPos = 0; // at 0 seconds
        // playback
        selfRef.playbackPos = 0;
    }
    
    function createCanvas(){
        var selfRef = this;
        selfRef.canvasDOM = $('<canvas></canvas>');
        selfRef.canvasDOM.attr({
                    'width' : selfRef.canvasWidth,
                    'height': selfRef.canvasHeight
                });
        selfRef.graphDOM.append(selfRef.canvasDOM);
        
        // add the mouse listener to the canvas
  //      this.addEventlistener();
        
        zoomToFit.call(this);
        updateGraph.call(this);
    }

    function draw(){
        console.log("draw");
        var selfRef = this;
        var canvasContext = selfRef.canvasDOM[0].getContext('2d');
        
        // Clear the canvas
        clearCanvas.call(this, canvasContext);
        // Draw background
        drawBackground.call(this, canvasContext);
        // Draw the wave form
        drawWaveForm.call(this, canvasContext);
    }

    function clearCanvas(canvasContext){
        console.log("clearCanvas");
        var selfRef = this;
        canvasContext.clearRect(0, 0, selfRef.canvasDOM.width(), selfRef.canvasDOM.height());
    }

    function drawBackground(canvasContext){
        console.log("paintBackground");
        var selfRef = this;
        var colorStop1;
        var colorStop2;
        
        var gradient = canvasContext.createLinearGradient(0, 0, 0, selfRef.canvasDOM.height());        
        
        if(selfRef.mouseInside){
            if(selfRef.mouseDown){
                colorStop1 = selfRef.colorMouseDownTop;
                colorStop2 = selfRef.colorMouseDownBottom;
            } else {
                colorStop1 = selfRef.colorActiveTop;
                colorStop2 = selfRef.colorActiveBottom;
            }
        } else {
            colorStop1 = selfRef.colorInactiveTop;
            colorStop2 = selfRef.colorInactiveBottom;
        }

        gradient.addColorStop(0, colorStop1);
        gradient.addColorStop(1, colorStop2);

        canvasContext.fillStyle = gradient;
        canvasContext.fillRect(0, 0, selfRef.canvasDOM.width(), selfRef.canvasDOM.height());
    }
   
    function drawWaveForm(canvasContext){
        console.log("drawWaveForm");
        var selfRef = this;
        var center = selfRef.canvasDOM.height() / 2;
        var seq = selfRef.audioSequence;
        var verticalMultiplier = 1.0;
        var data = seq.channelData;
        var canvasWidth = selfRef.canvasDOM.width();
        //canvasContext.setLineWidth(1);
        canvasContext.strokeStyle = "rgba(0, 0,0,0.5)";                
        canvasContext.beginPath();
        canvasContext.moveTo(0, center);

        // choose the drawing style of the waveform
        if (selfRef.plotTechnique == 1)
        {
            // data per pixel
            for (var i = 0; i < canvasWidth; ++i)
            {
                var peakAtFrame = selfRef.visualizationData[i];
                canvasContext.moveTo(i + 0.5, center + peakAtFrame.min * verticalMultiplier * -center);
                canvasContext.lineTo(i + 0.5, (center + peakAtFrame.max * verticalMultiplier * -center) + 1.0);
            }

        }
        else if (selfRef.plotTechnique == 2)
        {
            var s = 1;
            var len = selfRef.visualizationData.length;
            for(var i = 0; i < len; ++i)
            {
                var x = selfRef.visualizationData[i].x;
                var y = center + selfRef.visualizationData[i].y * verticalMultiplier * - center;                   

                canvasContext.lineTo(x, y);

                // draw edges around each data point
                canvasContext.moveTo(x + s, y - s);
                canvasContext.lineTo(x + s, y + s);
                canvasContext.moveTo(x - s, y - s);
                canvasContext.lineTo(x - s, y + s);
                canvasContext.moveTo(x - s, y + s);
                canvasContext.lineTo(x + s, y + s);
                canvasContext.moveTo(x - s, y - s);
                canvasContext.lineTo(x + s, y - s);

                canvasContext.moveTo(x, y);
            }
        }

        canvasContext.stroke(); 

        // Draw the horizontal line at the center
        //canvasContext.setLineWidth(1.0);
        canvasContext.strokeStyle = "rgba(0, 0, 0, 0.5)";                
        canvasContext.beginPath();
        canvasContext.moveTo(0, center);
        canvasContext.lineTo(selfRef.canvasDOM.width(), center);
        canvasContext.stroke(); 
   }

   function updateGraph(){
        var selfRef = this;
        getDataInResolution.call(selfRef);                       
        draw.call(selfRef);
    }

    function getDataInResolution(){
        var selfRef = this;

        //Reset the data
        selfRef.visualizationData = [];
        
        var offset = selfRef.viewPos;
        var resolution = selfRef.viewResolution;

        var sampleRate = selfRef.audioSequence.sampleRate;
        var channelData = selfRef.audioSequence.channelData;
        var offsetR = sampleRate * offset;
    
        // get the offset and length in samples
        var from = Math.round(offset * sampleRate);
        var len = Math.round(resolution * sampleRate);

        // Store this as local variable to improve performance
        var canvasWidth = selfRef.canvasDOM.width();

        // when the spot is to large
        if (len > canvasWidth){
            var dataPerPixel = len / canvasWidth;
            
            for (var i = 0; i < canvasWidth; ++i){
                var dataFrom = i * dataPerPixel + offsetR;
                var dataTo = (i + 1) * dataPerPixel + offsetR + 1; 

                if (dataFrom >= 0 && dataFrom < channelData.length &&
                        dataTo >= 0 && dataTo < channelData.length){
                    var peakAtFrame = getPeakInFrame.call(selfRef, dataFrom, dataTo, channelData);
                    selfRef.visualizationData.push(peakAtFrame);
                } else {
                    selfRef.visualizationData.push({ min : 0.0, max : 0.0});
                }
            }
            selfRef.plotTechnique = 1;
        } else {
            var pixelPerData = this.canvasReference.width / len;
            var x = 0;

            for (var i = from; i <= from + len; ++i){
                // if outside of the data range
                if (i < 0 || i >= data.length)
                {
                    this.visualizationData.push({ y : 0.0, x : x });
                } else {
                    this.visualizationData.push({y : data[i], x : x});
                }
                x += pixelPerData;
            }
            selfRef.plotTechnique = 2;
        }
    }

    function getPeakInFrame(dataFrom, dataTo, channelData){
        var selfRef = this;
        var fromRounded = Math.round(dataFrom);
        var toRounded = Math.round(dataTo);
        var min = 1.0;
        var max = -1.0;

        for (var i = fromRounded; i < toRounded; ++i){
            var sample = channelData[i];

            max = (sample > max) ? sample : max;
            min = (sample < min) ? sample : min;
        }
        return { min : min, max : max };
    }

    function zoomToFit(){
        var selfRef = this;
        selfRef.viewPos = 0;
        selfRef.viewResolution = selfRef.audioSequence.channelData.length / selfRef.audioSequence.sampleRate;
    }

    function zoomToSelection(){
        var selfRef = this;
        selfRef.viewPos = selfRef.selectionStart / selfRef.audioSequence.sampleRate;
        selfRef.viewResolution = (selfRef.selectionEnd - selfRef.selectionStart) / selfRef.audioSequence.sampleRate;
    }

})();

//Audio Sequence Class
(function(){
    sewi.AudioSequence = function(sampleRate, channelData){
        var selfRef = this;
        //selfRef.name = name;
        selfRef.sampleRate = sampleRate;
        selfRef.channelData = channelData;

    }
})();
