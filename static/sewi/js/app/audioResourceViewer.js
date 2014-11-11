// Created by: Le Beier
var sewi = sewi || {};

// Audio Resource Viewer Class
(function(){
    
    /**
     * This initialized a audio media resource viewer which loads the audio file from the server.
     * After the initial load, it will perform to draw the wave amplitude graph for visualization.
     *
     * @class  sewi.AudioResourceViewer
     * @constructor
     * @extends sewi.ResourceViewer
     * 
     * @param {Object} options The configuratin option for audio resource viewer
     * @param {String} options.id The observation id associated with the resource. 
     *                              Note: please do not use the encounter id.            
     */
    sewi.AudioResourceViewer = function(options){
        if(!(this instanceof sewi.AudioResourceViewer)){
            return new sewi.AudioResourceViewer();
        }
        sewi.ResourceViewer.call(this);
        
        var defaults = {};
       
        this.options = options || {};
        _.defaults(options, defaults);
        _.assign(this, _.pick(options, ['id']));
        
        setupVariables.call(this);
    };

    sewi.inherits(sewi.AudioResourceViewer, sewi.ResourceViewer);

    // This overrides the load function of Resource Viewer
    sewi.AudioResourceViewer.prototype.load = function(){
             
        loadAudioURL.call(this);
    };

    function setupVariables(){
    
        this.offset = 0;
        this.gainValue = 0;
        this.beginTime = 0;
        this.startTime = 0;
        this.endTime = 0;
        this.duration = 0;
        this.audioBuffer = null;
        this.isPlaying = false;
        this.id = this.options.id;
        this.contentDOM = null;
        this.audioAmplitudeGraphs = [];
        this.audioSequences = [];
        this.updateInterval = 0.1;
        this.lastUpdated = 0;
        this.drawTimer = 0;
        this.offsetValueChanged = false;
        this.url = "";
        this.loadSuccess = false;
        
        this.scriptProcessorBufferSize = 512;
        this.scriptProcessorInputChannels = 1;
        this.scriptProcessorOutputChannels = 1;

        this.scrollBar = null;
        
        this.buffersReady = 0;
        
        //Control Buttons
        this.zoomToFitBtn = $(sewi.constants.AUDIO_RESOURCE_ZOOM_TO_FIT_BUTTON);
        this.zoomToSelectionBtn = $(sewi.constants.AUDIO_RESOURCE_ZOOM_TO_SELECTION_BUTTON);
        this.clearSelectionBtn = $(sewi.constants.AUDIO_RESOURCE_CLEAR_SELECTION_BUTTON);
        
        //Web audio API objects
        this.audioContext = null;
        this.scriptProcessor = null;
        this.gainNode = null;

        //XHR Object for ajax call
        this.request = null;
    }
    
    function loadAudioURL(){
        var audioResourceEndPoint = sewi.constants.AUDIO_RESOURCE_URL + this.id;

        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: audioResourceEndPoint,
        }).done(retrieveAudio.bind(this))
            .fail(failToRetrieveAudio.bind(this));

    }

    function failToRetrieveAudio(){
        this.showError(sewi.constants.AUDIO_RESOURCE_ERROR_MSG_FAIL_TO_RETRIEVE_FILE);
    }

    function retrieveAudio(data){
        this.loadedSuccess = true;
        this.url = data.url;
        init.call(this);
        initControls.call(this);
        this.trigger("loaded");
    }

    function init(){
        this.mainDOMElement.addClass(sewi.constants.AUDIO_RESOURCE_AUDIO_RESOURCE_VIEWER_CSS);
        
        var contextClass = (window.AudioContext || 
                            window.webkitAudioContext || 
                            window.mozAudioContext || 
                            window.oAudioContext || 
                            window.msAudioContext);
  
        if(contextClass){
            this.audioContext =new contextClass();
            this.showProgressBar(sewi.constants.AUDIO_RESOURCE_MSG_FETCHING_AUDIO_CLIP);
            this.contentDOM = $(sewi.constants.AUDIO_RESOURCE_CONTENT_DOM);
            this.mainDOMElement.append(this.contentDOM);
            
            this.scriptProcessor = this.audioContext.createScriptProcessor(this.scriptProcessorBufferSize,
                                                                            this.scriptProcessorInputChannels,
                                                                            this.scriptProcessorOutputChannels);
            this.scriptProcessor.connect(this.audioContext.destination);
            this.scriptProcessor.onaudioprocess = updateMediaControl.bind(this);

            //Set up the Gain Node with a default value of 1(max volume).
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = 1;

            this.request = new XMLHttpRequest();
            this.request.open('GET', this.url, true);
            this.request.responseType = 'arraybuffer';
            this.request.onreadystatechange = onReadyStateChange.bind(this);

            this.request.addEventListener('progress', onProgress.bind(this), false);
            this.request.addEventListener('load', onComplete.bind(this), false);
            this.request.addEventListener('abort', onAbort.bind(this), false);
            this.request.addEventListener('error', onError.bind(this), false);
            this.request.send();

        } else {
            this.showError(sewi.constants.AUDIO_RESOURCE_ERROR_MSG_WEB_AUDIO_API_NOT_SUPPORTED);
        }

    }
    
    function onReadyStateChange(event){
        event.preventDefault();        
        if(this.request.readyState > 2 && this.request.status == 200){
        }
    }

    function onProgress(event){
        event.preventDefault();        
        if(event.lengthComputable){
            var percent = (event.loaded/event.total) * 100;
            this.updateProgressBar(percent);
        }
    }

    function onComplete(event){
        event.preventDefault();
        var audioData = this.request.response;
        this.updateProgressBar(50, sewi.constants.AUDIO_RESOURCE_MSG_GENERATING_AMPLITUDE_WAVE_GRAPH);
        this.audioContext.decodeAudioData(audioData, onAudioDecodeFinish.bind(this), onAudioDecodeFail.bind(this)); 
    }

    function onAbort(event){
        event.preventDefault();
        this.showError(sewi.constants.AUDIO_RESOURCE_ERROR_MSG_FILE_REQUEST_OPERATION_ABORTED);
    }

    function onError(event){ 
        event.preventDefault();
        this.showError(sewi.constants.AUDIO_RESOURCE_ERROR_MSG_FAIL_TO_RETRIEVE_FILE);
    }

    /**
     * This function extracts the data buffer from the audio buffer object 
     * and create the graph objects which is used to render the amplitude wave graph.
     * param  {AudioBuffer} buffer The audio buffer object from the audio context which contains information about the audio file. 
     */
    function onAudioDecodeFinish(buffer){
        this.audioBuffer = buffer;
        var sampleRate = buffer.sampleRate; 
        var duration = buffer.duration; 
        var numChannels = buffer.numberOfChannels;

        this.duration = duration;
        this.startTime = 0;
        this.endTime = duration;
        this.controls.update({duration : duration, currentTime : this.offset});
        
        for(var i=0; i < numChannels; i++){
            var audioSequence = new sewi.AudioSequence(sampleRate, this);
            this.on(sewi.constants.AUDIO_RESOURCE_EVENT_BUFFER_COPIED, onAudioBufferCopied.bind(this, numChannels));
            audioSequence.startCopyingBuffer(buffer.getChannelData(i));
            this.audioSequences.push(audioSequence);
        }
    }

    function onAudioDecodeFail(event){
        event.preventDefault();
        this.showError(sewi.constants.AUDIO_RESOURCE_ERROR_MSG_FAILED_TO_DECODE_AUDIO_FILE);
    }
    
    function onAudioBufferCopied(numChannels, event){
        this.buffersReady++;
        if(this.buffersReady === numChannels){
            var channelName = [sewi.constants.AUDIO_RESOURCE_CHANNEL_CSS_CLASS.LEFT, sewi.constants.AUDIO_RESOURCE_CHANNEL_CSS_CLASS.RIGHT];
            for(var i=0; i < numChannels; i++){
                var audioAmplitudeGraph = createAmplitudeWaveGraph.call(this, channelName[i], this.audioSequences[i]);
                this.audioAmplitudeGraphs.push(audioAmplitudeGraph);
            }

            // Link the left channel and right channels graphs together for canvas update
            if(this.audioAmplitudeGraphs.length == 2){
                this.audioAmplitudeGraphs[0].link(this.audioAmplitudeGraphs[1]);
            }

            this.scrollBar = new sewi.ScrollBar();
            this.contentDOM.append(this.scrollBar.getDOM());
            this.scrollBar.setWidthScale(1);
            this.scrollBar.on('move', scrollBarMove.bind(this));
        }
    }

    function createAmplitudeWaveGraph(channelName, audioSequence){
        var graphDOM = $('<div class="wave-graph '+channelName+'" id="'+this.id+'" title="'+channelName+'"></div>');
        this.contentDOM.append(graphDOM);
        this.hideProgressBar();
        var graph =  new sewi.AudioAmplitudeGraph(graphDOM, audioSequence, this); 

        return graph;
    }

    function updateGraphPlaybackPosition(positionInSec){
        for(var i=0; i < this.audioAmplitudeGraphs.length; i++) {
            var graph = this.audioAmplitudeGraphs[i];
            
            graph.playbackPos = positionInSec;
            
            if(graph.playbackPos > graph.viewPos + graph.viewResolution){
                graph.viewPos = graph.playbackPos;
                
                if(graph.viewPos + graph.viewResolution > this.duration){
                    graph.viewPos = this.duration - graph.viewResolution;
                }
                
                graph.updateGraph();
            }
            
            graph.draw();
        }
    }

    function createMediaButtons(){
        var buttons = [];
        
        this.zoomToFitBtn.on('click', zoomToFitBtnClickEvent.bind(this));
        this.zoomToSelectionBtn.on('click', zoomToSelectionBtnClickEvent.bind(this));
        this.clearSelectionBtn.on('click', clearSelectionBtnClickEvent.bind(this));
        
        buttons.push(this.zoomToFitBtn);
        buttons.push(this.zoomToSelectionBtn);
        buttons.push(this.clearSelectionBtn);
        
        return buttons;
    }

    
    function createToolTips(){
       this.zoomToFitBtn.tooltip({  title : AUDIO_RESOURCE_ZOOM_TO_FIT_TOOLTIP,
                                    container: 'body'});
       this.zoomToSelectionBtn.tooltip({title : AUDIO_RESOURCE_ZOOM_TO_SELECTION_TOOLTIP,
                                        container: 'body'});
       this.clearSelectionBtn.tooltip({ title : AUDIO_RESOURCE_CLEAR_SELECTION_TOOLTIP,
                                        container: 'body'});
    }               

    function destroyToolTips(){
       this.zoomToFitBtn.tooltip('destroy');
       this.zoomToSelectionBtn.tooltip('destroy');
       this.clearSelectionBtn.tooltip('destroy'); 
    }

    function zoomToFitBtnClickEvent(event){
        event.preventDefault();
        for(var i=0; i < this.audioAmplitudeGraphs.length; i++){
            this.audioAmplitudeGraphs[i].zoomToFit();
            this.audioAmplitudeGraphs[i].updateGraph();
        }
        
        this.startTime = 0;
        this.endTime = this.duration;
        
        this.scrollBar.setWidthScale(1);
        this.scrollBar.setPosition(0);
    }

    function zoomToSelectionBtnClickEvent(event){
        event.preventDefault();
        if(this.audioAmplitudeGraphs[0]){
            if(this.audioAmplitudeGraphs[0].hasSelectedRegion()){
                
                for(var i=0; i < this.audioAmplitudeGraphs.length; i++){
                    this.audioAmplitudeGraphs[i].zoomToSelection();
                    this.audioAmplitudeGraphs[i].updateGraph();
                }
                
                var playbackPos = this.audioAmplitudeGraphs[0].viewPos / (this.duration - this.audioAmplitudeGraphs[0].viewResolution);
                var widthScale = this.audioAmplitudeGraphs[0].viewResolution / this.duration;

                this.scrollBar.setWidthScale(widthScale);
                this.scrollBar.setPosition(playbackPos);
            }
        }
    }

    function clearSelectionBtnClickEvent(event){
        event.preventDefault();
        for(var i=0; i < this.audioAmplitudeGraphs.length; i++){
            this.audioAmplitudeGraphs[i].clearSelection();
            this.audioAmplitudeGraphs[i].updateGraph();
        } 
        this.startTime = 0;
        this.endTime = this.duration;
    }

    function scrollBarMove(event){
        event.preventDefault();
        var pos = this.scrollBar.getPosition();
        for(var i =0; i < this.audioAmplitudeGraphs.length; i++){
            this.audioAmplitudeGraphs[i].viewPos = pos * (this.duration - this.audioAmplitudeGraphs[i].viewResolution);
            this.audioAmplitudeGraphs[i].updateGraph();
        }
    }

    function initControls(){
        if(this.audioContext){
            this.addDownloadButton(this.url);
            var buttons = createMediaButtons.call(this);
            this.controls = new sewi.MediaControls({ isSeekBarHidden : true, 
                                                    extraButtons : { left : buttons } });
            
            this.controls.on('Playing', this.playAudio.bind(this));
            this.controls.on('Paused', this.pauseAudio.bind(this));
            this.controls.on('VolumeChanged', volumeSliderChanged.bind(this));
            this.controls.on('Unmuted', volumeUnmuted.bind(this));
            this.controls.on('Muted', volumeMuted.bind(this));
            
            this.mainDOMElement.append(this.controls.getDOM());
        }
    }

    function updateMediaControl(event){ 
        event.preventDefault();
        if(this.source && this.isPlaying){
            if(!this.offsetValueChanged){
                var duration = this.source.buffer.duration;
                var currentTime = ((Date.now() - this.beginTime) / 1000 + this.offset);
                var percent = (currentTime / duration) * 100;
                var length = this.duration - this.audioAmplitudeGraphs[0].viewResolution;
                
                this.controls.update({position : percent, 
                                    currentTime : currentTime });
                this.drawTimer += (currentTime - this.lastUpdated);

                //Update the graph at 10 fps
                if(this.drawTimer > this.updateInterval){
                    updateGraphPlaybackPosition.call(this, currentTime);
                    this.scrollBar.setPosition(this.audioAmplitudeGraphs[0].viewPos / length);
                    this.drawTimer = 0;
                }
                
                this.lastUpdated = currentTime;

                if(this.endTime - currentTime < 0.01){
                    this.pauseAudio();
                    this.offset = this.startTime;
                    this.controls.update({position : (this.offset / duration) * 100});

                    this.lastUpdated = this.offset;
                    this.drawTimer = 0;
                    updateGraphPlaybackPosition.call(this, this.offset);
                    this.scrollBar.setPosition(this.audioAmplitudeGraphs[0].viewPos / length);
                } 

            } else {
                this.pauseAudio();
                this.offset = this.audioAmplitudeGraphs[0].playbackPos;
                this.playAudio();
                this.offsetValueChanged = false;
            }
        }
    }
    
    function volumeSliderChanged(event, volume){
        event.preventDefault();
        this.gainNode.gain.value = volume;
    };

    function volumeUnmuted(event){
        event.preventDefault();
        this.gainNode.gain.value = this.gainValue;
    };

    function volumeMuted(event){
        event.preventDefault();
        this.gainValue = this.gainNode.gain.value;
        this.gainNode.gain.value = 0;
    };

    // This overrides the showTooltips function of Resource Viewer
    sewi.AudioResourceViewer.prototype.showTooltips = function(){
        createToolTips.call(this);
        this.controls.showTooltips();
    };

    // This overrides the hideTooltips function of Resource Viewer
    sewi.AudioResourceViewer.prototype.hideTooltips = function(){
        destroyToolTips.call(this);
        this.controls.hideTooltips();
    };

    /**
     * This function updates the offset of the audio playback position in the audio source.
     * @param  {float} position The playback position from the beginning of the audio in seconds.
     */
    sewi.AudioResourceViewer.prototype.offsetChanged = function(position){
        if(this.isPlaying){
            this.offsetValueChanged = true;
        }

        //If the selected position fall outside of the selected region, reset the playback duration to 100%
        if(position > this.endTime || position < this.startTime){
            this.startTime = 0;
            this.endTime = this.duration;
        }

        this.offset = position;
        this.lastUpdated = this.offset;
        this.drawTimer = 0;
        this.controls.update({currentTime : this.offset});
        updateGraphPlaybackPosition.call(this, this.offset);
    };

    /**
     * This function plays the audio from the last playback position selected.
     * If there is no playback position selected, it will play from the beginning.
     */
    sewi.AudioResourceViewer.prototype.playAudio = function(){
        if(this.audioBuffer){
            this.source = this.audioContext.createBufferSource();   
            this.source.buffer = this.audioBuffer;
            this.source.connect(this.gainNode);
            this.source.connect(this.scriptProcessor);
            this.beginTime = Date.now();
            this.source.start(0, this.offset);
            this.isPlaying = true;
            this.controls.update({playing: this.isPlaying});
            updateGraphPlaybackPosition.call(this, this.offset);        
        }
    };

    /**
     * This function pauses/stops the audio.
     */
    sewi.AudioResourceViewer.prototype.pauseAudio = function(){
        if(this.source){
            this.offset += (Date.now() - this.beginTime) / 1000;
            this.source.stop(0);
            this.source.disconnect(this.gainNode);
            this.source.disconnect(this.scriptProcessor);
            this.isPlaying = false;
            this.controls.update({playing: this.isPlaying});
        }
    };

    // This function overrides the resize function of the Resource Viewer
    sewi.AudioResourceViewer.prototype.resize = function(){
        for(var i=0; i < this.audioAmplitudeGraphs.length; i++) {
            this.audioAmplitudeGraphs[i].updateCanvasDimensions();
            this.audioAmplitudeGraphs[i].updateGraph();
        }
    
        if(this.scrollBar){
            this.scrollBar.resize();
        }
    };

    // This function overrides the cleanUp function of the Resource Viewer
    // Note: As there is no audio tag appended to the page, it is very important to call the cleanUp function.
    //       Unless we manually stop/disconnect the audio source, deleting the DOM of the resource viewer will not be able to disable the audio.
    sewi.AudioResourceViewer.prototype.cleanUp = function(){
        if(this.isPlaying){
            this.source.stop(0);
            this.source.disconnect(this.gainNode);
            this.source.disconnect(this.scriptProcessor);
        }
    };

})();


// AudioAmplitudeGraph Class
(function(){
    /**
     * This creates a object that is used to represent the Amplitude Wave Graph of the Audio.
     *
     * @class  sewi.AudioAmplitudeGraph
     * @constructor
     * 
     * @param {jQuery} graphDOM This holds a reference to the jQuery object which is appended to the page.
     * @param {[type]} audioSequence This holds a reference to the audio sequence object which holds the audio data buffer and sample rate
     * @param {[type]} resourceViewer The audio resource viewer that this graph is associated with.
     */
    sewi.AudioAmplitudeGraph = function(graphDOM, audioSequence, resourceViewer){
        this.resourceViewer = resourceViewer;
        this.graphDOM = graphDOM;
        this.name=this.graphDOM.attr('title');
        this.audioSequence = audioSequence;

        setupCanvasVariables.call(this);
        setupMouseVariables.call(this);
        setupColorVariables.call(this);
        setupMiscVariables.call(this);

        createCanvas.call(this);
    };

    function setupCanvasVariables(){
        //Set the canvas height and width
        this.canvasHeight = this.graphDOM.height();
        this.canvasWidth = this.graphDOM.width();
    }

    function setupMouseVariables(){        
        // is the mouse inside of the editor (for background coloring)
        this.mouseInside = false;
        
        // state of the mouse button
        this.mouseDown = false;
        
        // is the mouse clicked inside of the selection
        this.mouseInsideOfSelection = false;

        // is the start or end bar selected
        this.mouseSelectionOfStart = false;
        this.mouseSelectionOfEnd = false;

        // current and previous position of the mouse
        this.mouseX = 0;
        this.mouseY = 0;
        this.previousMouseX = 0;
        this.previousMouseY = 0;

        // position of the selection (if equal, the selection is disabled)
        this.selectionStart = 0;
        this.selectionEnd = 0;

        this.allowance = 5;
    }

    function setupColorVariables(){
        // colors when the mouse is outside of the editor box
        this.colorInactiveTop = sewi.constants.AUDIO_RESOURCE_COLOR_INACTIVE_TOP;
        this.colorInactiveBottom = sewi.constants.AUDIO_RESOURCE_COLOR_INACTIVE_BOTTOM;
        
        // colors when the mouse is inside of the editor box
        this.colorActiveTop = sewi.constants.AUDIO_RESOURCE_COLOR_ACTIVE_TOP;
        this.colorActiveBottom = sewi.constants.AUDIO_RESOURCE_COLOR_ACTIVE_BOTTOM;

        // color when the mouse is pressed during inside of the editor box
        this.colorMouseDownTop = sewi.constants.AUDIO_RESOURCE_COLOR_MOUSE_DOWN_TOP;
        this.colorMouseDownBottom = sewi.constants.AUDIO_RESOURCE_COLOR_MOUSE_DOWN_BOTTOM;
        
        // color of the selection frame
        this.colorSelectionStroke = sewi.constants.AUDIO_RESOURCE_COLOR_SELECTION_STROKE;
        this.colorSelectionFill = sewi.constants.AUDIO_RESOURCE_COLOR_SELECTION_FILL;
    }

    function setupMiscVariables(){
        this.plotTechnique = 0;
        this.canvasDOM = null;
        
        // temporary optimized visualization data    
        this.visualizationData = [];
        
        // handle focus for copy, paste & cut
        this.hasFocus = true;    
        
        // a list of editors which are linked to this one
        this.linkedGraph = null;
        
        // zoom
        this.viewResolution = 10; // default 10 seconds
        this.viewPos = 0; // at 0 seconds
        
        // playback
        this.playbackPos = 0;

        this.regionMoved = false;
    }
    
    function createCanvas(){
        this.canvasDOM = $('<canvas></canvas>');
        this.canvasDOM.attr({
                    'width' : this.canvasWidth,
                    'height': this.canvasHeight
                });
        this.graphDOM.append(this.canvasDOM);
        addEventListeners.call(this);
        this.zoomToFit();
        this.updateGraph();
    }

    function addEventListeners(){
        var canvasHTMLElement = this.canvasDOM[0];
        canvasHTMLElement.onmouseover = canvasMouseOverEvent.bind(this);
        canvasHTMLElement.onmousedown = canvasMouseDownEvent.bind(this);
        canvasHTMLElement.onmouseout = canvasMouseOutEvent.bind(this);
        canvasHTMLElement.onmousemove = canvasMouseMoveEvent.bind(this);
        canvasHTMLElement.onmouseup = canvasMouseUpEvent.bind(this);
        canvasHTMLElement.ondblclick = canvasDoubleClickEvent.bind(this);
    }

    function canvasMouseOverEvent(event){
        event.preventDefault();
        this.mouseInside = true;
        this.draw.call(this);
    }

    function canvasMouseDownEvent(event){
        event.preventDefault();
        var allowance = this.allowance;
        this.mouseDown = true;
        
        var selectionStartPixel = getAbsoluteToPixel.call(this, this.selectionStart);
        var selectionEndPixel = getAbsoluteToPixel.call(this, this.selectionEnd);

        // is the mouse inside of the selection right now
        if (this.mouseX > selectionStartPixel + allowance && this.mouseX <= selectionEndPixel - allowance){
            this.mouseInsideOfSelection = true;
        }
        // is the mouse on the left bar of the selection
        else if (this.mouseX > selectionStartPixel - allowance && this.mouseX < selectionStartPixel + allowance){
            this.mouseSelectionOfStart = true;
        }
        // is the mouse on the right bar of the selection
        else if (this.mouseX < selectionEndPixel + allowance && this.mouseX > selectionEndPixel - allowance){
            this.mouseSelectionOfEnd = true;
        }
        // if the mouse is somewhere else, start a new selection
        else{
            this.selectionStart = getPixelToAbsolute.call(this, this.mouseX);
            this.selectionEnd = this.selectionStart;
        }
        
        this.draw.call(this);
        updateLinkedGraph.call(this);
    }

    function canvasMouseMoveEvent(event){
        event.preventDefault();
        var canvasHTMLElement = this.canvasDOM[0];
        var boundingBox = canvasHTMLElement.getBoundingClientRect();
        this.previousMouseX = this.mouseX;
        this.previousMouseY = this.mouseY;
        this.mouseX = event.clientX - boundingBox.left;
        this.mouseY = event.clientY - boundingBox.top;

        var allowance = this.allowance;
        var selectionStartPixel = getAbsoluteToPixel.call(this, this.selectionStart);
        var selectionEndPixel = getAbsoluteToPixel.call(this, this.selectionEnd);
        
        if (this.mouseDown){
            // if the mouse is inside of a selection, then move the whole selection
            if (this.mouseInsideOfSelection){
                var absDelta = getPixelToAbsolute.call(this, this.mouseX) - getPixelToAbsolute.call(this, this.previousMouseX);
                this.canvasDOM.css({'cursor' : '-webkit-grabbing'});
                // move the selection with the delta
                this.selectionStart += absDelta;
                this.selectionEnd += absDelta;
                if(absDelta != 0){
                    this.regionMoved = true;
                    updateResourceViewer.call(this);
                }
            }
            // if the left bar is selected, then move it only
            else if (this.mouseSelectionOfStart){
                this.selectionStart = getPixelToAbsolute.call(this, this.mouseX);
                updateResourceViewer.call(this);
            }
            // if the right bar is selected (default during creation of a selection), then move it only
            else{
                this.selectionEnd = getPixelToAbsolute.call(this, this.mouseX);
                updateResourceViewer.call(this);
            }
        } 
        
        if (this.mouseX > selectionStartPixel + allowance && this.mouseX <= selectionEndPixel - allowance){
            this.canvasDOM.css({'cursor' : '-webkit-grab'});
        } else if ((this.mouseX > selectionStartPixel - allowance && this.mouseX < selectionStartPixel + allowance) || 
                    (this.mouseX < selectionEndPixel + allowance && this.mouseX > selectionEndPixel - allowance)){
            this.canvasDOM.css({'cursor' : 'ew-resize'});
        } else {
            this.canvasDOM.css({'cursor' : 'default'});
        }

        this.draw.call(this);
        updateLinkedGraph.call(this);
    }

    function updateResourceViewer(){
        var resourceViewer = this.resourceViewer;
        var start = this.selectionStart > this.selectionEnd ? this.selectionEnd : this.selectionStart;
        var end = this.selectionStart > this.selectionEnd ? this.selectionStart : this.selectionEnd;
        
        if(this.regionMoved){
            resourceViewer.pauseAudio();
        }

        if(start !== end){ 
            resourceViewer.startTime = start / this.audioSequence.sampleRate;
            resourceViewer.endTime = end / this.audioSequence.sampleRate; 
            resourceViewer.offset = resourceViewer.startTime;
            resourceViewer.lastUpdated = resourceViewer.startTime;
            resourceViewer.drawTimer = 0;
            resourceViewer.controls.update({currentTime : resourceViewer.offset, 
                                            position : resourceViewer.offset / this.audioSequence.duration});
        }

    }

    function canvasMouseUpEvent(event){
        event.preventDefault();
        // swap the selection position if start is bigger then end
        if (this.selectionStart > this.selectionEnd){
            var temp = this.selectionStart;
            this.selectionStart = this.selectionEnd;
            this.selectionEnd = temp;
        }

        if(this.mouseInsideOfSelection && !this.regionMoved){ 
            this.resourceViewer.offsetChanged(getPixelToAbsolute.call(this, this.mouseX) / this.audioSequence.sampleRate);
        }
        else {    
            this.resourceViewer.offsetChanged(this.selectionStart / this.audioSequence.sampleRate);
        }

        // reset the selection mouse states for the selection
        this.mouseInsideOfSelection = false;
        this.mouseSelectionOfStart = false;
        this.mouseSelectionOfEnd = false;
        this.mouseDown = false;
        this.regionMoved = false;
       
        updateLinkedGraph.call(this);
    }

    function canvasMouseOutEvent(event){
        event.preventDefault();
        // swap the selection position if start is bigger then end
        if (this.selectionStart > this.selectionEnd){
            var temp = this.selectionStart;
            this.selectionStart = this.selectionEnd;
            this.selectionEnd = temp;
        }

        // reset the selection mouse states for the selection
        this.mouseInsideOfSelection = false;
        this.mouseSelectionOfStart = false;
        this.mouseSelectionOfEnd = false;
        this.mouseDown = false;
        this.mouseInside = false;

        this.draw.call(this);
        updateLinkedGraph.call(this);    
    }

    function canvasDoubleClickEvent(event){
        event.preventDefault();
        // reset the selection mouse states for the selection
        this.mouseInsideOfSelection = false;
        this.mouseSelectionOfStart = false;
        this.mouseSelectionOfEnd = false;
        this.mouseDown = false;
        
        updateLinkedGraph.call(this);
    }

    function clearCanvas(canvasContext){
        canvasContext.clearRect(0, 0, this.canvasDOM.width(), this.canvasDOM.height());
    }

    function drawBackground(canvasContext){
        var colorStop1;
        var colorStop2;
        
        var gradient = canvasContext.createLinearGradient(0, 0, 0, this.canvasDOM.height());        
        
        if(this.mouseInside){
            if(this.mouseDown){
                colorStop1 = this.colorMouseDownTop;
                colorStop2 = this.colorMouseDownBottom;
            } else {
                colorStop1 = this.colorActiveTop;
                colorStop2 = this.colorActiveBottom;
            }
        } else {
            colorStop1 = this.colorInactiveTop;
            colorStop2 = this.colorInactiveBottom;
        }

        gradient.addColorStop(0, colorStop1);
        gradient.addColorStop(1, colorStop2);

        canvasContext.fillStyle = gradient;
        canvasContext.fillRect(0, 0, this.canvasDOM.width(), this.canvasDOM.height());
    }
   
    function drawWaveForm(canvasContext){
        var i = 0;
        var center = this.canvasDOM.height() / 2;
        var verticalMultiplier = 1.0;
        var canvasWidth = this.canvasDOM.width();
        //canvasContext.setLineWidth(1);
        canvasContext.strokeStyle = sewi.constants.AUDIO_RESOURCE_WAVE_STROKE_COLOR;                
        canvasContext.beginPath();
        canvasContext.moveTo(0, center);

        // choose the drawing style of the waveform
        if (this.plotTechnique == sewi.constants.AUDIO_RESOURCE_PLOT_TECHNIQUE.COMPRESSED){
            // data per pixel
            for (i = 0; i < canvasWidth; ++i){
                var peakAtFrame = this.visualizationData[i];
                canvasContext.moveTo(i + 0.5, center + peakAtFrame.min * verticalMultiplier * -center);
                canvasContext.lineTo(i + 0.5, (center + peakAtFrame.max * verticalMultiplier * -center) + 1.0);
            }

        } else if (this.plotTechnique == sewi.constants.AUDIO_RESOURCE_PLOT_TECHNIQUE.DETAILED) {
            var s = 1;
            var len = this.visualizationData.length;
            for(i = 0; i < len; ++i){
                var x = this.visualizationData[i].x;
                var y = center + this.visualizationData[i].y * verticalMultiplier * - center;                   

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
        canvasContext.strokeStyle = sewi.constants.AUDIO_RESOURCE_HORIZONTAL_LINE_STROKE_COLOR;                
        canvasContext.beginPath();
        canvasContext.moveTo(0, center);
        canvasContext.lineTo(this.canvasDOM.width(), center);
        canvasContext.stroke(); 
    }

    function drawSelector(canvasContext){
        var selectionStartPixel = getAbsoluteToPixel.call(this, this.selectionStart);
        var selectionEndPixel = getAbsoluteToPixel.call(this, this.selectionEnd);
        
        if (this.selectionStart !== this.selectionEnd){
            //Check if the selection is made from front to back or back to front. 
            var start = (selectionStartPixel < selectionEndPixel) ? selectionStartPixel : selectionEndPixel;
            var width = (selectionStartPixel < selectionEndPixel) ? selectionEndPixel - selectionStartPixel : selectionStartPixel - selectionEndPixel;

            canvasContext.fillStyle = this.colorSelectionFill;
            canvasContext.fillRect(start, 0, width, this.canvasHeight);

            canvasContext.strokeStyle = this.colorSelectionStroke;
            canvasContext.strokeRect(start, 0, width, this.canvasHeight);

        } else if(this.playbackPos === this.selectionStart){
                canvasContext.strokeStyle = this.colorSelectionStroke;               
                canvasContext.beginPath();
                canvasContext.moveTo(selectionStartPixel, 0);
                canvasContext.lineTo(selectionStartPixel, this.canvasHeight);
                canvasContext.stroke(); 
        }

    }

    function drawPlaybackLineIndicator(canvasContext){
        var playbackPixelPos = getAbsoluteToPixel.call(this, this.playbackPos * this.audioSequence.sampleRate);
        if (playbackPixelPos > 0 && playbackPixelPos < this.canvasWidth){
            canvasContext.strokeStyle = this.colorSelectionStroke;
            canvasContext.beginPath();
            canvasContext.moveTo(playbackPixelPos, 0);
            canvasContext.lineTo(playbackPixelPos, this.canvasHeight);
            canvasContext.stroke();
        }
    }

    function drawText(canvasContext){
        drawTextWithShadow(this.name, 1, 10, sewi.constants.AUDIO_RESOURCE_TEXT_COLOR, canvasContext);
    }

    function drawTextWithShadow(text, x, y, style, canvasContext){
        canvasContext.fillStyle = sewi.constants.AUDIO_RESOURCE_TEXT_SHADOW_COLOR;
        canvasContext.fillText(text,x + 1, y + 1);

        canvasContext.fillStyle = style;
        canvasContext.fillText(text,x, y);
    }
    
    function getDataInResolution(){
        var i = 0;
        //Reset the data
        this.visualizationData = [];
        
        var offset = this.viewPos;
        var resolution = this.viewResolution;

        var sampleRate = this.audioSequence.sampleRate;
        var channelData = this.audioSequence.channelData;
        var offsetR = sampleRate * offset;
    
        // get the offset and length in samples
        var from = Math.round(offset * sampleRate);
        var len = Math.round(resolution * sampleRate);

        // Store this as local variable to improve performance
        var canvasWidth = this.canvasDOM.width();

        // when the region width is larger than canvas width, apply data aggregation technique
        if (len > canvasWidth){
            var dataPerPixel = len / canvasWidth;
            
            for (i = 0; i < canvasWidth; ++i){
                var dataFrom = i * dataPerPixel + offsetR;
                var dataTo = (i + 1) * dataPerPixel + offsetR + 1; 

                if (dataFrom >= 0 && dataFrom < channelData.length &&
                        dataTo >= 0 && dataTo < channelData.length){
                    var peakAtFrame = getPeakInFrame.call(this, dataFrom, dataTo, channelData);
                    this.visualizationData.push(peakAtFrame);
                } else {
                    this.visualizationData.push({   min : 0.0, 
                                                    max : 0.0});
                }
            }
            this.plotTechnique = sewi.constants.AUDIO_RESOURCE_PLOT_TECHNIQUE.COMPRESSED;
        } else {
            var pixelPerData = canvasWidth / len;
            var x = 0;

            for (i = from; i <= from + len; ++i){
                // if outside of the data range
                if (i < 0 || i >= channelData.length){
                    this.visualizationData.push({   y : 0.0, 
                                                    x : x });
                } else {
                    this.visualizationData.push({   y : channelData[i], 
                                                    x : x});
                }
                x += pixelPerData;
            }
            this.plotTechnique = sewi.constants.AUDIO_RESOURCE_PLOT_TECHNIQUE.DETAILED;
        }
    }

    function getPeakInFrame(dataFrom, dataTo, channelData){
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
    
    function getAbsoluteToPixel(absoluteValue){
        var totalSamplesInResolution = this.viewResolution * this.audioSequence.sampleRate;
        var totalSamplesOffset = this.viewPos * this.audioSequence.sampleRate;

        return (absoluteValue - totalSamplesOffset) / totalSamplesInResolution * this.canvasDOM.width(); 
    }

    function getPixelToAbsolute(pixelValue){
        var totalSamplesInResolution = this.viewResolution * this.audioSequence.sampleRate;
        var totalSamplesOffset = this.viewPos * this.audioSequence.sampleRate;

        return Math.round(totalSamplesInResolution / this.canvasDOM.width() * pixelValue + totalSamplesOffset);
    }

    function updateLinkedGraph(){
        var linkedGraph = this.linkedGraph;
        linkedGraph.selectionStart = this.selectionStart;
        linkedGraph.selectionEnd = this.selectionEnd;

        if (linkedGraph.viewPos != this.viewPos || linkedGraph.viewResolution != this.viewResolution){
            linkedGraph.viewPos = this.viewPos;
            linkedGraph.viewResolution = this.viewResolution;
        }
        
        linkedGraph.updateGraph();
    }
    
    /**
     * This function resets the zoom level, making it zoom to fit the whole canvas.
     */
    sewi.AudioAmplitudeGraph.prototype.zoomToFit = function(){
        this.viewPos = 0;
        this.viewResolution = this.audioSequence.channelData.length / this.audioSequence.sampleRate;
    };

    /**
     * This function zooms to the selected region.
     */
    sewi.AudioAmplitudeGraph.prototype.zoomToSelection = function(){
        this.viewPos = this.selectionStart / this.audioSequence.sampleRate;
        this.viewResolution = (this.selectionEnd - this.selectionStart) / this.audioSequence.sampleRate;
    };

    /**
     * This function clears the selected region from the graph.
     */
    sewi.AudioAmplitudeGraph.prototype.clearSelection = function(){
       this.selectionStart = 0;
       this.selectionEnd = 0;
    };

    /**
     * This function draws the graph onto the canvas object.
     */
    sewi.AudioAmplitudeGraph.prototype.draw = function(){
        var canvasContext = this.canvasDOM[0].getContext('2d');
        
        // Clear the canvas
        clearCanvas.call(this, canvasContext);
        // Draw background
        drawBackground.call(this, canvasContext);
        // Draw the wave form
        drawWaveForm.call(this, canvasContext);
        // Draw the selector
        drawSelector.call(this, canvasContext);
        // Draw the playback line indicator
        drawPlaybackLineIndicator.call(this, canvasContext);
        // Draw text
        drawText.call(this, canvasContext);
    };

    /**
     * This function will recalculate the dimension of the canvas based on the DOM dimension that it is currently residing in.
     * This function is usually called after a resize has occurred.
     */
    sewi.AudioAmplitudeGraph.prototype.updateCanvasDimensions = function(){
        this.canvasHeight = this.graphDOM.height();
        this.canvasWidth = this.graphDOM.width();
        this.canvasDOM.attr({
                    'width' : this.canvasWidth,
                    'height': this.canvasHeight
                });
    };

    /**
     * This function updates data points on the graph. 
     * After the update, It will redraw the graph.
     */
    sewi.AudioAmplitudeGraph.prototype.updateGraph = function(){
        getDataInResolution.call(this);                       
        this.draw.call(this);
    };

    /**
     * This function creates a link between 2 graphs. 
     * Usually linking the left and right channel graphs.
     * @param  {AudioAmplitudeGraph} otherGraph The graph to be linked. 
     */
    sewi.AudioAmplitudeGraph.prototype.link = function(otherGraph){ 
        this.linkedGraph = otherGraph;
        otherGraph.linkedGraph = this;
    };

    /**
     * This function checks if there is a selected region on the graph
     * @return {Boolean} If a region is selected, return true. 
     *                   Otherwise return false.
     */
    sewi.AudioAmplitudeGraph.prototype.hasSelectedRegion = function(){
        return this.selectionStart === this.selectionEnd ? false : true;
    };

})();

//Audio Sequence Class
(function(){
    /**
     * This class is used to hold the audio buffer data as well as the sample rate of the audio
     *
     * @class  sewi.AudioSequence
     * @constructor
     * @param {int} sampleRate This is the sample rate of the audio data.
     * @param {Float32Array} channelData This holds the array of audio buffers in Float32 format.
     */
    sewi.AudioSequence = function(sampleRate, audioResourceViewer){
        this.sampleRate = sampleRate;
        this.channelData = [];
        this.audioResourceViewer = audioResourceViewer;
        // this.channelData = Array.prototype.slice.call(channelData);
    };
   
    sewi.AudioSequence.prototype.startCopyingBuffer = function(channelData){
        window.requestAnimationFrame(copyBuffer.bind(this, 0, channelData, 0));
        this.audioResourceViewer.updateProgressBar(0);
    };

    // Make a copy of the channel data. 
    // This array is used for the drawing of the graph which is usef for visualization.
    // This is extremely important as the original data will be replaced once the audio starts to play, therefore a shallow copy will not work.
    function copyBuffer(index, channelData, steps){
        var len = channelData.length;
        var blockSize = 10000;
        var end = index+blockSize;
    
        for(var i = index; i < len && i < end; i++){
            this.channelData.push(channelData[i]);
        }
        
        var percent = 50 + (i/len) * 50;
        this.audioResourceViewer.updateProgressBar(percent);
        
        if(i < len){
            window.requestAnimationFrame(copyBuffer.bind(this, i, channelData));
        } else {
            this.audioResourceViewer.trigger(sewi.constants.AUDIO_RESOURCE_EVENT_BUFFER_COPIED);
        }
    }
})();
