var sewi = sewi || {};

(function(){
    // Tab Panel class
    sewi.TabPanel = function(resourceViewer, tabObject, state){
        var selfRef = this;
        var DOMObject = resourceViewer.getDOM();
        selfRef.resourceViewer = resourceViewer;
        selfRef.state = state;
        selfRef.tab = tabObject;
        selfRef.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
        selfRef.indicators = [];
        selfRef.panel = selfRef.setPanelDOM(state);
        selfRef.panelDropAreaRight = $('<div class="panel-drop-area panel-drop-area-right"></div>');
        selfRef.panelDropAreaLeft = $('<div class="panel-drop-area panel-drop-area-left"></div>');
        selfRef.panelDropAreaTop = $('<div class="panel-drop-area panel-drop-area-top"></div>');
        selfRef.panelDropAreaBottom = $('<div class="panel-drop-area panel-drop-area-bottom"></div>'); 

        selfRef.setDroppable(selfRef.panelDropAreaRight, sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT);
        selfRef.setDroppable(selfRef.panelDropAreaLeft, sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT);
        selfRef.setDroppable(selfRef.panelDropAreaTop, sewi.constants.TAB_DROP_AREA_POSITIONS.TOP);
        selfRef.setDroppable(selfRef.panelDropAreaBottom, sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM);

        selfRef.panel.append(selfRef.panelDropAreaRight);
        selfRef.panel.append(selfRef.panelDropAreaLeft);
        selfRef.panel.append(selfRef.panelDropAreaTop);
        selfRef.panel.append(selfRef.panelDropAreaBottom);

        selfRef.panel.append(DOMObject);
    
        $(DOMObject).on('Closing', onClose.bind(this));
 
        this.panel.on(getTransitionEvent(), onPanelTransitionEnd.bind(this));
        
        $(DOMObject).on('FullscreenToggled', toggleFullScreen);
    }
    
    function toggleFullScreen(){
        var requestFullscreen = this.requestFullscreen || 
                                this.mozRequestFullScreen || 
                                this.webkitRequestFullscreen || 
                                this.msRequestFullscreen;
        requestFullscreen.call(this); 
    }

    function onPanelTransitionEnd(event){
        if(event.currentTarget === event.target){
            var propertyName = event.originalEvent.propertyName;
            if(propertyName == "width" || propertyName == "height"){
                this.tab.resize();
            }
        }
    }

    function getTransitionEvent(){
        var el = document.createElement('fakeelement');
        var transitions = {
            'WebkitTransition' :'webkitTransitionEnd',
            'MozTransition'    :'transitionend',
            'MSTransition'     :'msTransitionEnd',
            'OTransition'      :'oTransitionEnd',
            'transition'       :'transitionEnd'
        }

        for(var t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

    function removeSelf(){
        var len = this.indicators.length;
        for(var i = 0; i < len; i++){
            this.indicators[i].remove(); 
        }
        
        this.resourceViewer.cleanUp();
        delete this.tab.panelList[this.state];
        this.panel.remove();     
    }

    sewi.TabPanel.prototype.removePanel = function(oldPosition, newPosition, addCSSClass, removeCSSClass){
        var selfRef = this;
        selfRef.tab.panelList[oldPosition].getDOM().addClass(addCSSClass).removeClass(removeCSSClass);
        selfRef.tab.panelList[oldPosition].state = newPosition;
        selfRef.tab.panelList[newPosition] = selfRef.tab.panelList[oldPosition];
        
        delete selfRef.tab.panelList[oldPosition];
    }

    sewi.TabPanel.prototype.setDroppable = function(dropArea, position){
        var selfRef = this;
        var indicatorDropArea = $('<div></div>');
        selfRef.indicators.push(indicatorDropArea);
        selfRef.tab.tabPanel.append(indicatorDropArea);
        selfRef.setIndicatorDroppable(indicatorDropArea, position);
        dropArea.droppable({
                over: onOver.bind(this, position, indicatorDropArea),
                out: onOut.bind(this, position, indicatorDropArea)
            });
    }

    function onClose(){          
        if (this.state == sewi.constants.TAB_PANEL_POSITIONS.FULL){
            this.tab.addDropArea();
            removeSelf.call(this);
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.LEFT){
            if(_.size(this.tab.panelList) == 3){ 
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.TOP, 'panel-top', 'panel-top-right');
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 'panel-bottom', 'panel-bottom-right');
            } else {
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.RIGHT, sewi.constants.TAB_PANEL_POSITIONS.FULL, 'panel-full', 'panel-right');
            }
            removeSelf.call(this);       
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.RIGHT){
            if(_.size(this.tab.panelList) == 3){ 
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.TOP, 'panel-top', 'panel-top-left');
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 'panel-bottom', 'panel-bottom-left');
            } else {
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.LEFT, sewi.constants.TAB_PANEL_POSITIONS.FULL, 'panel-full', 'panel-left');
            }
            removeSelf.call(this);       
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM){ 
            if(_.size(this.tab.panelList) == 3){ 
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 'panel-right', 'panel-top-right');
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.LEFT, 'panel-left', 'panel-top-left');
            } else {
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP, sewi.constants.TAB_PANEL_POSITIONS.FULL, 'panel-full', 'panel-top');
            }
            removeSelf.call(this);
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP){    
            if(_.size(this.tab.panelList) == 3){ 
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 'panel-right', 'panel-bottom-right');
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.LEFT, 'panel-left', 'panel-bottom-left');
            } else {
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, sewi.constants.TAB_PANEL_POSITIONS.FULL, 'panel-full', 'panel-bottom');
            }
            removeSelf.call(this);
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT){
            if(_.size(this.tab.panelList) == 3){
                if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT]) {
                    this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.TOP, 'panel-top', 'panel-top-right');
                } else if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT]) {
                    this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.LEFT, 'panel-left', 'panel-bottom-left');
                }
            } else {
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.TOP, 'panel-top', 'panel-top-right');
            }
            removeSelf.call(this);       
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT){  
            if(_.size(this.tab.panelList) == 3){
                if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT]){
                    this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 'panel-right', 'panel-bottom-right');
                } else if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT]) {
                    this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.TOP, 'panel-top', 'panel-top-left');
                }    
            } else {
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.TOP, 'panel-top', 'panel-top-left');
            }
            removeSelf.call(this);       
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT){
            if(_.size(this.tab.panelList) == 3){
                if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT]){
                    this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 'panel-bottom', 'panel-bottom-right');
                } else if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT]) {
                    this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.LEFT, 'panel-left', 'panel-top-left');
                }
            } else {
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 'panel-bottom', 'panel-bottom-right');
            }
            removeSelf.call(this);       
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT){
            if(_.size(this.tab.panelList) == 3){
                if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT]){
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 'panel-bottom', 'panel-bottom-left');
                } else if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT]) {
                    this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 'panel-right', 'panel-top-right');
                }
            } else {
                this.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 'panel-bottom', 'panel-bottom-left');
            }
            removeSelf.call(this);
        }
    }
    
    function onOver(position, indicatorDropArea, event, ui){
        event.preventDefault();
        if(this.state == sewi.constants.TAB_PANEL_POSITIONS.FULL){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                this.panel.addClass('panel-left').removeClass('panel-full');
                indicatorDropArea.addClass('panel-indicator-right');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                this.panel.addClass('panel-right').removeClass('panel-full');
                indicatorDropArea.addClass('panel-indicator-left');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                this.panel.addClass('panel-bottom').removeClass('panel-full');
                indicatorDropArea.addClass('panel-indicator-top');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                this.panel.addClass('panel-top').removeClass('panel-full');
                indicatorDropArea.addClass('panel-indicator-bottom');
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.LEFT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                this.panel.addClass('panel-bottom-left').removeClass('panel-left');
                indicatorDropArea.addClass('panel-indicator-top-left');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                this.panel.addClass('panel-top-left').removeClass('panel-left');
                indicatorDropArea.addClass('panel-indicator-bottom-left');  
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.RIGHT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                this.panel.addClass('panel-bottom-right').removeClass('panel-right');
                indicatorDropArea.addClass('panel-indicator-top-right');    
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                this.panel.addClass('panel-top-right').removeClass('panel-right');
                indicatorDropArea.addClass('panel-indicator-bottom-right');     
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                this.panel.addClass('panel-bottom-right').removeClass('panel-bottom');
                indicatorDropArea.addClass('panel-indicator-left-bottom');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                this.panel.addClass('panel-bottom-left').removeClass('panel-bottom');
                indicatorDropArea.addClass('panel-indicator-right-bottom'); 
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){   
                this.panel.addClass('panel-top-right').removeClass('panel-top');
                indicatorDropArea.addClass('panel-indicator-left-top');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){   
                this.panel.addClass('panel-top-left').removeClass('panel-top');
                indicatorDropArea.addClass('panel-indicator-right-top');
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP && 
                this.tab.tabPanel.has('.panel-bottom').length){
                this.tab.tabPanel.children('.panel-bottom').addClass('panel-bottom-right').removeClass('panel-bottom');
                this.panel.addClass('panel-bottom-left').removeClass('panel-top-left');
                indicatorDropArea.addClass('panel-indicator-top-left');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT &&
                this.tab.tabPanel.has('.panel-right').length){
                this.tab.tabPanel.children('.panel-right').addClass('panel-bottom-right').removeClass('panel-right');
                this.panel.addClass('panel-top-right').removeClass('panel-top-left');
                indicatorDropArea.addClass('panel-indicator-left-top');
                this.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.LEFT;
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP && 
                this.tab.tabPanel.has('.panel-bottom').length){
                this.tab.tabPanel.children('.panel-bottom').addClass('panel-bottom-left').removeClass('panel-bottom');
                this.panel.addClass('panel-bottom-right').removeClass('panel-top-right');
                indicatorDropArea.addClass('panel-indicator-top-right');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT &&
                this.tab.tabPanel.has('.panel-left').length){
                this.tab.tabPanel.children('.panel-left').addClass('panel-bottom-left').removeClass('panel-left');
                this.panel.addClass('panel-top-left').removeClass('panel-top-right');
                indicatorDropArea.addClass('panel-indicator-right-top');
                this.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.RIGHT;
            }           
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM && 
                this.tab.tabPanel.has('.panel-top').length){
                this.tab.tabPanel.children('.panel-top').addClass('panel-top-right').removeClass('panel-top');
                this.panel.addClass('panel-top-left').removeClass('panel-bottom-left');
                indicatorDropArea.addClass('panel-indicator-bottom-left');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT &&
                this.tab.tabPanel.has('.panel-right').length){
                this.tab.tabPanel.children('.panel-right').addClass('panel-top-right').removeClass('panel-right');
                this.panel.addClass('panel-bottom-right').removeClass('panel-bottom-left');
                indicatorDropArea.addClass('panel-indicator-left-bottom');
                this.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.LEFT;
            }

        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM && 
                this.tab.tabPanel.has('.panel-top').length){
                this.tab.tabPanel.children('.panel-top').addClass('panel-top-left').removeClass('panel-top');
                this.panel.addClass('panel-top-right').removeClass('panel-bottom-right');
                indicatorDropArea.addClass('panel-indicator-bottom-right');

            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT &&
                        this.tab.tabPanel.has('.panel-left').length){
                this.tab.tabPanel.children('.panel-left').addClass('panel-top-left').removeClass('panel-left');
                this.panel.addClass('panel-bottom-left').removeClass('panel-bottom-right');
                indicatorDropArea.addClass('panel-indicator-right-bottom');
                this.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.RIGHT;
            }
        }
    }

    function onOut(position, indicatorDropArea, event, ui){
        if (this.state == sewi.constants.TAB_PANEL_POSITIONS.FULL){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                this.panel.addClass('panel-full').removeClass('panel-left');
                indicatorDropArea.removeClass('panel-indicator-right');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                this.panel.addClass('panel-full').removeClass('panel-right');
                indicatorDropArea.removeClass('panel-indicator-left');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                this.panel.addClass('panel-full').removeClass('panel-bottom');
                indicatorDropArea.removeClass('panel-indicator-top');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                this.panel.addClass('panel-full').removeClass('panel-top');
                indicatorDropArea.removeClass('panel-indicator-bottom');
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.LEFT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                this.panel.addClass('panel-left').removeClass('panel-bottom-left');
                indicatorDropArea.removeClass('panel-indicator-top-left');  
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){  
                this.panel.addClass('panel-left').removeClass('panel-top-left');
                indicatorDropArea.removeClass('panel-indicator-bottom-left');   
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.RIGHT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                this.panel.addClass('panel-right').removeClass('panel-bottom-right');
                indicatorDropArea.removeClass('panel-indicator-top-right');     
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                this.panel.addClass('panel-right').removeClass('panel-top-right');
                indicatorDropArea.removeClass('panel-indicator-bottom-right');      
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){   
                this.panel.addClass('panel-bottom').removeClass('panel-bottom-right');
                indicatorDropArea.removeClass('panel-indicator-left-bottom');       
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){   
                this.panel.addClass('panel-bottom').removeClass('panel-bottom-left');
                indicatorDropArea.removeClass('panel-indicator-right-bottom');      
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                this.panel.addClass('panel-top').removeClass('panel-top-right');
                indicatorDropArea.removeClass('panel-indicator-left-top');      
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                this.panel.addClass('panel-top').removeClass('panel-top-left');
                indicatorDropArea.removeClass('panel-indicator-right-top');         
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT){ 
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP &&
                this.tab.tabPanel.has('.panel-bottom-right').length &&
                this.tab.tabPanel.has('.panel-top-right').length &&
                this.prevDropArea !== sewi.constants.TAB_PREVIOUS_DROP_AREA.LEFT && 
                _.size(this.tab.panelList) == 3){
                this.panel.addClass('panel-top-left').removeClass('panel-bottom-left');
                this.tab.tabPanel.children('.panel-bottom-right').addClass('panel-bottom').removeClass('panel-bottom-right');
                indicatorDropArea.removeClass('panel-indicator-top-left');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT &&
                this.tab.tabPanel.has('.panel-bottom-right').length &&
                this.tab.tabPanel.has('.panel-bottom-left').length &&
                _.size(this.tab.panelList) === 3){
                
                this.panel.addClass('panel-top-left').removeClass('panel-top-right');
                this.tab.tabPanel.children('.panel-bottom-right').addClass('panel-right').removeClass('panel-bottom-right');
                indicatorDropArea.removeClass('panel-indicator-left-top');
            }
            this.preDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
        } else if (this.state === sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT){
            if (position === sewi.constants.TAB_DROP_AREA_POSITIONS.TOP &&
                this.tab.tabPanel.has('.panel-bottom-left').length &&
                this.tab.tabPanel.has('.panel-top-left').length &&
                this.prevDropArea !== sewi.constants.TAB_PREVIOUS_DROP_AREA.RIGHT &&
                _.size(this.tab.panelList) === 3){
                this.panel.addClass('panel-top-right').removeClass('panel-bottom-right');
                this.tab.tabPanel.children('.panel-bottom-left').addClass('panel-bottom').removeClass('panel-bottom-left');
                indicatorDropArea.removeClass('panel-indicator-top-right');
            } else if (position === sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT &&
                this.tab.tabPanel.has('.panel-bottom-left').length &&
                this.tab.tabPanel.has('.panel-bottom-right').length &&                   
                _.size(this.tab.panelList) === 3){
                this.panel.addClass('panel-top-right').removeClass('panel-top-left');
                this.tab.tabPanel.children('.panel-bottom-left').addClass('panel-left').removeClass('panel-bottom-left');
                indicatorDropArea.removeClass('panel-indicator-right-top');
            }   
            this.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
        } else if (this.state === sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM &&
                this.tab.tabPanel.has('.panel-top-right').length &&
                this.tab.tabPanel.has('.panel-bottom-right').length &&
                this.prevDropArea !== sewi.constants.TAB_PREVIOUS_DROP_AREA.LEFT &&
                _.size(this.tab.panelList) === 3){

                this.panel.addClass('panel-bottom-left').removeClass('panel-top-left');
                this.tab.tabPanel.children('.panel-top-right').addClass('panel-top').removeClass('panel-top-right');
                indicatorDropArea.removeClass('panel-indicator-bottom-left');
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT &&
                this.tab.tabPanel.has('.panel-top-right').length &&
                this.tab.tabPanel.has('.panel-top-left').length &&
                _.size(this.tab.panelList) === 3){
                this.panel.addClass('panel-bottom-left').removeClass('panel-bottom-right');
                this.tab.tabPanel.children('.panel-top-right').addClass('panel-right').removeClass('panel-top-right');
                indicatorDropArea.removeClass('panel-indicator-left-bottom');
            }
            this.preDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
        } else if (this.state === sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT && 
                this.tab.tabPanel.has('.panel-top-left').length &&
                this.tab.tabPanel.has('.panel-top-right').length &&
                _.size(this.tab.panelList) === 3){
                this.panel.addClass('panel-bottom-right').removeClass('panel-bottom-left');
                this.tab.tabPanel.children('.panel-top-left').addClass('panel-left').removeClass('panel-top-left');
                indicatorDropArea.removeClass('panel-indicator-right-bottom');
                
            } else if (position === sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM &&
                this.tab.tabPanel.has('.panel-top-left').length &&
                this.tab.tabPanel.has('.panel-bottom-left').length && 
                this.prevDropArea !== sewi.constants.TAB_PREVIOUS_DROP_AREA.RIGHT &&
                _.size(this.tab.panelList) == 3){
                
                this.panel.addClass('panel-bottom-right').removeClass('panel-top-right');
                this.tab.tabPanel.children('.panel-top-left').addClass('panel-top').removeClass('panel-top-left');
                indicatorDropArea.removeClass('panel-indicator-bottom-right');
            }
            this.preDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
        }
    }

    sewi.TabPanel.prototype.addPanel = function(selfPanelPosition, newPanelPosition, DOMObject){
        var selfRef = this;
        delete selfRef.tab.panelList[selfRef.state];
        selfRef.state = selfPanelPosition;
        selfRef.tab.panelList[selfRef.state] = selfRef;
        selfRef.tab.append(DOMObject, newPanelPosition);
    }

    sewi.TabPanel.prototype.setIndicatorDroppable = function(dropArea, position){
        var selfRef = this;
        dropArea.droppable({
            drop: function(event, ui){
                event.preventDefault();
                if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.FULL){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.LEFT, sewi.constants.TAB_PANEL_POSITIONS.RIGHT, ui.draggable);
                        dropArea.removeClass('panel-indicator-right');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.RIGHT, sewi.constants.TAB_PANEL_POSITIONS.LEFT, ui.draggable);
                        dropArea.removeClass('panel-indicator-left');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, sewi.constants.TAB_PANEL_POSITIONS.TOP, ui.draggable);
                        dropArea.removeClass('panel-indicator-top');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.TOP, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, ui.draggable);
                        dropArea.removeClass('panel-indicator-bottom');
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.LEFT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, ui.draggable);
                        dropArea.removeClass('panel-indicator-top-left');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, ui.draggable);
                        dropArea.removeClass('panel-indicator-bottom-left');
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.RIGHT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, ui.draggable);
                        dropArea.removeClass('panel-indicator-top-right');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, ui.draggable);
                        dropArea.removeClass('panel-indicator-bottom-right');
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, ui.draggable);
                        dropArea.removeClass('panel-indicator-left-bottom');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, ui.draggable);
                        dropArea.removeClass('panel-indicator-right-bottom');
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.TOP){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, ui.draggable);
                        dropArea.removeClass('panel-indicator-left-top');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, ui.draggable);
                        dropArea.removeClass('panel-indicator-right-top');
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                        selfRef.updateState(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT);
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, ui.draggable);
                        dropArea.removeClass('panel-indicator-top-left');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                        selfRef.updateState(sewi.constants.TAB_PANEL_POSITIONS.RIGHT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT);                 
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, ui.draggable);
                        dropArea.removeClass('panel-indicator-left-top');
                    }   
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                                            selfRef.updateState(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT);
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, ui.draggable);
                        dropArea.removeClass('panel-indicator-top-right');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                        selfRef.updateState(sewi.constants.TAB_PANEL_POSITIONS.LEFT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT);
                                            selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, ui.draggable);
                        dropArea.removeClass('panel-indicator-right-top');
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                        selfRef.updateState(sewi.constants.TAB_PANEL_POSITIONS.RIGHT, sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT);
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, ui.draggable);
                        dropArea.removeClass('panel-indicator-left-bottom');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                        selfRef.updateState(sewi.constants.TAB_PANEL_POSITIONS.TOP, sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT);
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, ui.draggable);
                        dropArea.removeClass('panel-indicator-bottom-left');
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                        selfRef.updateState(sewi.constants.TAB_PANEL_POSITIONS.LEFT, sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT);
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, ui.draggable);
                        dropArea.removeClass('panel-indicator-right-bottom');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                        selfRef.updateState(sewi.constants.TAB_PANEL_POSITIONS.TOP, sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT);
                        selfRef.addPanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, ui.draggable);
                        dropArea.removeClass('panel-indicator-bottom-right');
                    }
                }
            },
        });
    }

    sewi.TabPanel.prototype.updateState = function(oldState, newState){
        var selfRef = this;
        selfRef.tab.panelList[newState] = selfRef.tab.panelList[oldState];
        selfRef.tab.panelList[newState].state = newState;
        delete selfRef.tab.panelList[oldState];
    }

    sewi.TabPanel.prototype.setPanelDOM = function(state){
        var selfRef = this;
        var DOM = $('<div class="animated panel"></div>');
        switch(state){
            case sewi.constants.TAB_PANEL_POSITIONS.FULL: 
                DOM.addClass('panel-full');
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.LEFT: 
                DOM.addClass('panel-left');
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.RIGHT: 
                DOM.addClass('panel-right');
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.BOTTOM: 
                DOM.addClass('panel-bottom');
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.TOP: 
                DOM.addClass('panel-top');
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT: 
                DOM.addClass('panel-top-left');
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT: 
                DOM.addClass('panel-top-right');
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT: 
                DOM.addClass('panel-bottom-left');
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT: 
                DOM.addClass('panel-bottom-right');
                break;
        }
        return DOM;
    }

    sewi.TabPanel.prototype.resize = function(){
        var selfRef = this;
        selfRef.resourceViewer.resize();
    }

    sewi.TabPanel.prototype.getDOM = function(){
        return this.panel;
    }
})();

// Tab class
(function(){
    sewi.Tab = function(tabContainer, id, name, hasDropArea){
        this.tabContainer = tabContainer;
        this.panelList={};
        this.tabButton = $('<li class="tab-button"><a href="#'+id+'" role="tab" data-toggle="tab">'+name+'</a></li>');
        this.tabPanel = $('<div class="tab-pane" id="'+id+'"><div class="panel-content">'+name+'</div></div>');
        
        // constant variables
        this.DROP_AREA_HOVER_STR = 'panel-drop-area-hover';
        this.PANEL_STR = 'panel';
        this.DROP_AREA_STR = '<div class="panel-drop-area panel-drop-area-full"></div>';


        var removeButton={containerRef : tabContainer,
                        tabButton : this.tabButton,
                        tabPanel : this.tabPanel,
                            DOM : $('<span class="glyphicon glyphicon-remove"></span>')};
        
        if(hasDropArea){
            this.addDropArea();
        }

        removeButton.DOM.on('click', removeButton, removeEvent.bind(this));
        this.tabButton.children('a').append(removeButton.DOM);
        this.tabButton.on('click', tabButtonEvent.bind(this));
    }

    function tabButtonEvent(){
        this.tabContainer.setCurrentActiveTab(this);
    }

    function removeEvent(event){
        event.preventDefault();
        var removeButton = event.data;
        var containerRef = removeButton.containerRef;
        var tabIndex = containerRef.tabs.indexOf(this);

        cleanUp.call(this);

        removeButton.tabPanel.remove();
        removeButton.tabButton.remove();

        containerRef.tabs.splice(tabIndex, 1);

        if (containerRef.currentActiveTab == this){
            if (tabIndex == containerRef.tabs.length){
                containerRef.setCurrentActiveTab(containerRef.tabs[tabIndex-1]);
            } else {
                containerRef.setCurrentActiveTab(containerRef.tabs[tabIndex]);
            }
        } 

        var lastIndex = containerRef.tabButtons.length-1;
        if (!containerRef.tabButtons[lastIndex].is(":visible")){
            containerRef.tabButtons[lastIndex].show();
        }

        if (containerRef.tabs.length == 0){
            this.tabContainer.container.trigger("NoTabs");
        }
    }

    sewi.Tab.prototype.append = function(DOMObject, state){
        var selfRef = this;
        var id = DOMObject.data('resId');
        var type = DOMObject.data('resType');
        var obj = null;
        switch(type){
            case sewi.constants.RESOURCE_TYPE.IMAGE:
                obj = new sewi.ImageResourceViewer({id:id});
                break;
            case sewi.constants.RESOURCE_TYPE.VIDEO:
                obj = new sewi.VideoResourceViewer({id:id});
                break;
            case sewi.constants.RESOURCE_TYPE.AUDIO:
                obj = new sewi.AudioResourceViewer({id:id});
                break;
            case sewi.constants.RESOURCE_TYPE.CHART:
                obj = new sewi.ChartResourceViewer({id:id});
                break;
        }
        
        if(obj){
            obj.load();
            selfRef.setPanel(obj, state);
        }
    }

    sewi.Tab.prototype.setPanel = function(ResourceViewer, state){
        var selfRef = this;
        var panel = new sewi.TabPanel(ResourceViewer, selfRef, state);          
        selfRef.tabPanel.append(panel.getDOM());
        selfRef.panelList[state] = panel;
    }

    sewi.Tab.prototype.activate = function(){
        var selfRef = this; 
        selfRef.tabButton.addClass('active');
        selfRef.tabPanel.addClass('active');
    }

    sewi.Tab.prototype.deactivate = function(){
        var selfRef = this;
        selfRef.tabButton.removeClass('active');
        selfRef.tabPanel.removeClass('active');
    }

    sewi.Tab.prototype.isHover = function(dropArea){
        var selfRef = this;
        return selfRef.tabPanel.children(dropArea).hasClass(selfRef.DROP_AREA_HOVER_STR);
    }

    sewi.Tab.prototype.addDropArea = function(){
        var dropAreaDOM = $(this.DROP_AREA_STR);
        this.tabPanel.append(dropAreaDOM);
        this.setDroppable(dropAreaDOM);
    }

    sewi.Tab.prototype.removeDropArea = function(dropArea){
        var selfRef = this;
        dropArea.remove();
        selfRef.tabPanel.children(sewi.constants.TAB_CSS_CLASS_STR_PANEL_INDICATOR).remove();
    }

    sewi.Tab.prototype.setDroppable = function(dropArea){
        var selfRef = this;
        dropArea.droppable({
            drop: dropAreaDropEvent.bind(this, dropArea),
            over: dropAreaOverEvent.bind(this),
            out: dropAreaOutEvent.bind(this),
            activeClass: 'panel-drop-area-visible',
            hoverClass: selfRef.DROP_AREA_HOVER_STR
        });
    }

    function dropAreaDropEvent(dropArea, event, ui){
        event.preventDefault();
        this.removeDropArea(dropArea);
        this.append(ui.draggable, sewi.constants.TAB_PANEL_POSITIONS.FULL); 
    }

    function dropAreaOverEvent(event, ui){
        event.preventDefault();
        this.tabPanel.append($('<div class="panel-indicator"></div>')); 
    }

    function dropAreaOutEvent(event, ui){
        event.preventDefault();
        this.tabPanel.children(sewi.constants.TAB_CSS_CLASS_STR_PANEL_INDICATOR).remove();
    }

    function cleanUp(){
        var panelList = this.panelList;
        for(var panel in panelList){
            if(panelList.hasOwnProperty(panel)){
                panelList[panel].resourceViewer.cleanUp();
            }
        }
    }

    sewi.Tab.prototype.resize = function(){
        var panelList = this.panelList;
        for(var panel in panelList){
            if(panelList.hasOwnProperty(panel)){
                panelList[panel].resize();
            }
        } 
    }
})();

// tab container class
(function(){
    
    /**
     * This defines a tab container component to hold all the tabs.
     * 
     * @class TabContainer
     * @constructor
     */
    sewi.TabContainer = function(){
        this.noOfTabs= 1;
        this.currentActiveTab;
        this.tabButtons=[];  
        this.tabs = [];
        this.container = $(sewi.constants.TAB_CONTAINER_DOM);
        this.tabButtonGroup = $(sewi.constants.TAB_TAB_BUTTON_GROUP_DOM);
        this.tabContent = $(sewi.constants.TAB_TAB_CONTENT_DOM);

        var addTabButton = $(sewi.constants.TAB_ADD_TAB_BUTTON_DOM);
        addTabButton.on(sewi.constants.TAB_CLICK_EVENT_STR, addTabButtonClickEvent.bind(this));

        this.tabButtons.push(addTabButton);
        this.tabButtonGroup.append(addTabButton);
                
        this.container.append(this.tabButtonGroup);
        this.container.append(this.tabContent);

    }

    function addTabButtonClickEvent(){
        var tabName = "Tab"+this.noOfTabs
        var tabText = "";
        var active = true;
        var hasDropArea = true;

        var result = addNewTab.call(this, tabName, tabText, active, hasDropArea);
        if(result){
            this.noOfTabs++;
        }
    }

    function addNewTab(tabName, tabText, active, hasDropArea){
        var hasNewTabAdded = false;
        if(this.tabs.length < sewi.constants.TAB_MAX_NUM_TABS){
            var newTab = new sewi.Tab(this, tabName, tabText, hasDropArea);
            this.tabs.push(newTab);

            if (active) this.setCurrentActiveTab.call(this, newTab);    
    
            var lastIndex = this.tabButtons.length-1;    
            newTab.tabButton.insertBefore(this.tabButtons[lastIndex]);
            this.tabContent.append(newTab.tabPanel);

            if(this.tabs.length == sewi.constants.TAB_MAX_NUM_TABS){
                this.tabButtons[lastIndex].hide();
            }
            hasNewTabAdded = true;
        }
        return hasNewTabAdded;
    }

    /**
     * This function sets target tab as the current active tab. 
     * @param  {Tab} tab The tab object that will be activated.
     */
    sewi.TabContainer.prototype.setCurrentActiveTab = function(tab){
        if (this.currentActiveTab){
            this.currentActiveTab.deactivate();
        }
        this.currentActiveTab = tab;
        if (tab){
            this.currentActiveTab.activate();
        }
    }
    
    /**
     * This function returns the jquery DOM to the caller
     * @return {jQuery} The reference to the jQuery DOM.
     */
    sewi.TabContainer.prototype.getDOM = function(){
        return this.container;
    }

    
    /**
     * This function initialized a new tab and adds the DOM to that tab.
     * @param  {jQuery} DOMObject It holds the reference to the jQuery DOM that will be appended. 
     */
    sewi.TabContainer.prototype.addObjectToNewTab = function(DOMObject){
        var tabName = "Tab"+this.noOfTabs
        var tabText = "";
        var active = true;
        var hasDropArea = false;
        
        var result = addNewTab.call(this, tabName, tabText, active, hasDropArea); 
        if(result){
            this.currentActiveTab.append(DOMObject, sewi.constants.TAB_PANEL_POSITIONS.FULL);
        }
    }

    /**
     * This function calls all the resize functions of the tabs
     */
    sewi.TabContainer.prototype.resize = function(){
        var tabsArrLength = this.tabs.length; 
        for(var i = 0; i < tabsArrLength; i++){ 
            this.tabs[i].resize();
        }
    }
})();
