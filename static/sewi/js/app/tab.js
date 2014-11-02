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
    
        $(DOMObject).on('Closing', function(){
            console.log("CLOSED");
            if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.FULL){
                selfRef.tab.addDropArea();
                selfRef.removeSelf();
            } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.LEFT){
                if(_.size(selfRef.tab.panelList) == 3){ 
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.TOP, 'panel-top', 'panel-top-right');
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 'panel-bottom', 'panel-bottom-right');
                } else {
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.RIGHT, sewi.constants.TAB_PANEL_POSITIONS.FULL, 'panel-full', 'panel-right');
                }
                selfRef.removeSelf();       
            } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.RIGHT){
                if(_.size(selfRef.tab.panelList) == 3){ 
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.TOP, 'panel-top', 'panel-top-left');
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 'panel-bottom', 'panel-bottom-left');
                } else {
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.LEFT, sewi.constants.TAB_PANEL_POSITIONS.FULL, 'panel-full', 'panel-left');
                }
                selfRef.removeSelf();       
            } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM){ 
                if(_.size(selfRef.tab.panelList) == 3){ 
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 'panel-right', 'panel-top-right');
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.LEFT, 'panel-left', 'panel-top-left');
                } else {
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP, sewi.constants.TAB_PANEL_POSITIONS.FULL, 'panel-full', 'panel-top');
                }
                selfRef.removeSelf();
            } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.TOP){    
                if(_.size(selfRef.tab.panelList) == 3){ 
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 'panel-right', 'panel-bottom-right');
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.LEFT, 'panel-left', 'panel-bottom-left');
                } else {
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, sewi.constants.TAB_PANEL_POSITIONS.FULL, 'panel-full', 'panel-bottom');
                }
                selfRef.removeSelf();
            } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT){
                if(_.size(selfRef.tab.panelList) == 3){
                    if(selfRef.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT]) {
                        selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.TOP, 'panel-top', 'panel-top-right');
                    } else if(selfRef.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT]) {
                        selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.LEFT, 'panel-left', 'panel-bottom-left');
                    }
                } else {
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.TOP, 'panel-top', 'panel-top-right');
                }
                selfRef.removeSelf();       
            } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT){  
                if(_.size(selfRef.tab.panelList) == 3){
                    if(selfRef.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT]){
                        selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 'panel-right', 'panel-bottom-right');
                    } else if(selfRef.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT]) {
                        selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.TOP, 'panel-top', 'panel-top-left');
                    }    
                } else {
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.TOP, 'panel-top', 'panel-top-left');
                }
                selfRef.removeSelf();       
            } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT){
                if(_.size(selfRef.tab.panelList) == 3){
                    if(selfRef.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT]){
                        selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 'panel-bottom', 'panel-bottom-right');
                    } else if(selfRef.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT]) {
                        selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, sewi.constants.TAB_PANEL_POSITIONS.LEFT, 'panel-left', 'panel-top-left');
                    }
                } else {
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 'panel-bottom', 'panel-bottom-right');
                }
                selfRef.removeSelf();       
            } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT){
                if(_.size(selfRef.tab.panelList) == 3){
                    if(selfRef.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT]){
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 'panel-bottom', 'panel-bottom-left');
                    } else if(selfRef.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT]) {
                        selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 'panel-right', 'panel-top-right');
                    }
                } else {
                    selfRef.removePanel(sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 'panel-bottom', 'panel-bottom-left');
                }
                selfRef.removeSelf();
            }
        });

        
        this.panel.on(whichTransitionEvent(), function(event){
            if(event.currentTarget === event.Target){
                var propertyName = event.originalEvent.propertyName;
                if(propertyName == "width" || propertyName == "height"){
                    selfRef.tab.resize();
                }
            }
        });
        
        $(DOMObject).on('FullscreenToggled', function(){
            var requestFullscreen = this.requestFullscreen || 
                                    this.mozRequestFullScreen || 
                                    this.webkitRequestFullscreen || 
                                    this.msRequestFullscreen;
            requestFullscreen.call(this);
        });
    }

    function whichTransitionEvent(){
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

    sewi.TabPanel.prototype.removeSelf = function(){
        var selfRef = this;
        var len = selfRef.indicators.length;
        for(var i = 0; i < len; i++){
            selfRef.indicators[i].remove(); 
        }
        delete selfRef.tab.panelList[selfRef.state];
        selfRef.panel.remove();     
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
            over: function(event, ui){
                event.preventDefault();
                if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.FULL){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                        selfRef.panel.addClass('panel-left').removeClass('panel-full');
                        indicatorDropArea.addClass('panel-indicator-right');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                        selfRef.panel.addClass('panel-right').removeClass('panel-full');
                        indicatorDropArea.addClass('panel-indicator-left');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                        selfRef.panel.addClass('panel-bottom').removeClass('panel-full');
                        indicatorDropArea.addClass('panel-indicator-top');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                        selfRef.panel.addClass('panel-top').removeClass('panel-full');
                        indicatorDropArea.addClass('panel-indicator-bottom');
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.LEFT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                        selfRef.panel.addClass('panel-bottom-left').removeClass('panel-left');
                        indicatorDropArea.addClass('panel-indicator-top-left');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                        selfRef.panel.addClass('panel-top-left').removeClass('panel-left');
                        indicatorDropArea.addClass('panel-indicator-bottom-left');  
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.RIGHT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                        selfRef.panel.addClass('panel-bottom-right').removeClass('panel-right');
                        indicatorDropArea.addClass('panel-indicator-top-right');    
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                        selfRef.panel.addClass('panel-top-right').removeClass('panel-right');
                        indicatorDropArea.addClass('panel-indicator-bottom-right');     
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                        selfRef.panel.addClass('panel-bottom-right').removeClass('panel-bottom');
                        indicatorDropArea.addClass('panel-indicator-left-bottom');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                        selfRef.panel.addClass('panel-bottom-left').removeClass('panel-bottom');
                        indicatorDropArea.addClass('panel-indicator-right-bottom'); 
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.TOP){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){   
                        selfRef.panel.addClass('panel-top-right').removeClass('panel-top');
                        indicatorDropArea.addClass('panel-indicator-left-top');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){   
                        selfRef.panel.addClass('panel-top-left').removeClass('panel-top');
                        indicatorDropArea.addClass('panel-indicator-right-top');
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP && 
                        selfRef.tab.tabPanel.has('.panel-bottom').length){
                        selfRef.tab.tabPanel.children('.panel-bottom').addClass('panel-bottom-right').removeClass('panel-bottom');
                        selfRef.panel.addClass('panel-bottom-left').removeClass('panel-top-left');
                        indicatorDropArea.addClass('panel-indicator-top-left');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT &&
                        selfRef.tab.tabPanel.has('.panel-right').length){
                        selfRef.tab.tabPanel.children('.panel-right').addClass('panel-bottom-right').removeClass('panel-right');
                        selfRef.panel.addClass('panel-top-right').removeClass('panel-top-left');
                        indicatorDropArea.addClass('panel-indicator-left-top');
                        selfRef.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.LEFT;
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP && 
                        selfRef.tab.tabPanel.has('.panel-bottom').length){
                        selfRef.tab.tabPanel.children('.panel-bottom').addClass('panel-bottom-left').removeClass('panel-bottom');
                        selfRef.panel.addClass('panel-bottom-right').removeClass('panel-top-right');
                        indicatorDropArea.addClass('panel-indicator-top-right');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT &&
                        selfRef.tab.tabPanel.has('.panel-left').length){
                        selfRef.tab.tabPanel.children('.panel-left').addClass('panel-bottom-left').removeClass('panel-left');
                        selfRef.panel.addClass('panel-top-left').removeClass('panel-top-right');
                        indicatorDropArea.addClass('panel-indicator-right-top');
                        selfRef.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.RIGHT;
                    }           
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM && 
                        selfRef.tab.tabPanel.has('.panel-top').length){
                        selfRef.tab.tabPanel.children('.panel-top').addClass('panel-top-right').removeClass('panel-top');
                        selfRef.panel.addClass('panel-top-left').removeClass('panel-bottom-left');
                        indicatorDropArea.addClass('panel-indicator-bottom-left');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT &&
                        selfRef.tab.tabPanel.has('.panel-right').length){
                        selfRef.tab.tabPanel.children('.panel-right').addClass('panel-top-right').removeClass('panel-right');
                        selfRef.panel.addClass('panel-bottom-right').removeClass('panel-bottom-left');
                        indicatorDropArea.addClass('panel-indicator-left-bottom');
                        selfRef.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.LEFT;
                    }

                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM && 
                        selfRef.tab.tabPanel.has('.panel-top').length){
                        selfRef.tab.tabPanel.children('.panel-top').addClass('panel-top-left').removeClass('panel-top');
                        selfRef.panel.addClass('panel-top-right').removeClass('panel-bottom-right');
                        indicatorDropArea.addClass('panel-indicator-bottom-right');

                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT &&
                                selfRef.tab.tabPanel.has('.panel-left').length){
                        selfRef.tab.tabPanel.children('.panel-left').addClass('panel-top-left').removeClass('panel-left');
                        selfRef.panel.addClass('panel-bottom-left').removeClass('panel-bottom-right');
                        indicatorDropArea.addClass('panel-indicator-right-bottom');
                        selfRef.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.RIGHT;
                    }
                }
            },
            out: function(event, ui){
                if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.FULL){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                        selfRef.panel.addClass('panel-full').removeClass('panel-left');
                        indicatorDropArea.removeClass('panel-indicator-right');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                        selfRef.panel.addClass('panel-full').removeClass('panel-right');
                        indicatorDropArea.removeClass('panel-indicator-left');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                        selfRef.panel.addClass('panel-full').removeClass('panel-bottom');
                        indicatorDropArea.removeClass('panel-indicator-top');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                        selfRef.panel.addClass('panel-full').removeClass('panel-top');
                        indicatorDropArea.removeClass('panel-indicator-bottom');
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.LEFT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                        selfRef.panel.addClass('panel-left').removeClass('panel-bottom-left');
                        indicatorDropArea.removeClass('panel-indicator-top-left');  
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){  
                        selfRef.panel.addClass('panel-left').removeClass('panel-top-left');
                        indicatorDropArea.removeClass('panel-indicator-bottom-left');   
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.RIGHT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                        selfRef.panel.addClass('panel-right').removeClass('panel-bottom-right');
                        indicatorDropArea.removeClass('panel-indicator-top-right');     
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                        selfRef.panel.addClass('panel-right').removeClass('panel-top-right');
                        indicatorDropArea.removeClass('panel-indicator-bottom-right');      
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){   
                        selfRef.panel.addClass('panel-bottom').removeClass('panel-bottom-right');
                        indicatorDropArea.removeClass('panel-indicator-left-bottom');       
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){   
                        selfRef.panel.addClass('panel-bottom').removeClass('panel-bottom-left');
                        indicatorDropArea.removeClass('panel-indicator-right-bottom');      
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.TOP){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                        selfRef.panel.addClass('panel-top').removeClass('panel-top-right');
                        indicatorDropArea.removeClass('panel-indicator-left-top');      
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                        selfRef.panel.addClass('panel-top').removeClass('panel-top-left');
                        indicatorDropArea.removeClass('panel-indicator-right-top');         
                    }
                } else if (selfRef.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT){ 
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP &&
                        selfRef.tab.tabPanel.has('.panel-bottom-right').length &&
                        selfRef.tab.tabPanel.has('.panel-top-right').length &&
                        selfRef.prevDropArea !== sewi.constants.TAB_PREVIOUS_DROP_AREA.LEFT && 
                        _.size(selfRef.tab.panelList) == 3){
                        selfRef.panel.addClass('panel-top-left').removeClass('panel-bottom-left');
                        selfRef.tab.tabPanel.children('.panel-bottom-right').addClass('panel-bottom').removeClass('panel-bottom-right');
                        indicatorDropArea.removeClass('panel-indicator-top-left');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT &&
                        selfRef.tab.tabPanel.has('.panel-bottom-right').length &&
                        selfRef.tab.tabPanel.has('.panel-bottom-left').length &&
                        _.size(selfRef.tab.panelList) === 3){
                        
                        selfRef.panel.addClass('panel-top-left').removeClass('panel-top-right');
                        selfRef.tab.tabPanel.children('.panel-bottom-right').addClass('panel-right').removeClass('panel-bottom-right');
                        indicatorDropArea.removeClass('panel-indicator-left-top');
                    }
                    selfRef.preDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
                } else if (selfRef.state === sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT){
                    if (position === sewi.constants.TAB_DROP_AREA_POSITIONS.TOP &&
                        selfRef.tab.tabPanel.has('.panel-bottom-left').length &&
                        selfRef.tab.tabPanel.has('.panel-top-left').length &&
                        selfRef.prevDropArea !== sewi.constants.TAB_PREVIOUS_DROP_AREA.RIGHT &&
                        _.size(selfRef.tab.panelList) === 3){
                        selfRef.panel.addClass('panel-top-right').removeClass('panel-bottom-right');
                        selfRef.tab.tabPanel.children('.panel-bottom-left').addClass('panel-bottom').removeClass('panel-bottom-left');
                        indicatorDropArea.removeClass('panel-indicator-top-right');
                    } else if (position === sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT &&
                        selfRef.tab.tabPanel.has('.panel-bottom-left').length &&
                        selfRef.tab.tabPanel.has('.panel-bottom-right').length &&                   
                        _.size(selfRef.tab.panelList) === 3){
                        selfRef.panel.addClass('panel-top-right').removeClass('panel-top-left');
                        selfRef.tab.tabPanel.children('.panel-bottom-left').addClass('panel-left').removeClass('panel-bottom-left');
                        indicatorDropArea.removeClass('panel-indicator-right-top');
                    }   
                    selfRef.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
                } else if (selfRef.state === sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM &&
                        selfRef.tab.tabPanel.has('.panel-top-right').length &&
                        selfRef.tab.tabPanel.has('.panel-bottom-right').length &&
                        selfRef.prevDropArea !== sewi.constants.TAB_PREVIOUS_DROP_AREA.LEFT &&
                        _.size(selfRef.tab.panelList) === 3){

                        selfRef.panel.addClass('panel-bottom-left').removeClass('panel-top-left');
                        selfRef.tab.tabPanel.children('.panel-top-right').addClass('panel-top').removeClass('panel-top-right');
                        indicatorDropArea.removeClass('panel-indicator-bottom-left');
                    } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT &&
                        selfRef.tab.tabPanel.has('.panel-top-right').length &&
                        selfRef.tab.tabPanel.has('.panel-top-left').length &&
                        _.size(selfRef.tab.panelList) === 3){
                        selfRef.panel.addClass('panel-bottom-left').removeClass('panel-bottom-right');
                        selfRef.tab.tabPanel.children('.panel-top-right').addClass('panel-right').removeClass('panel-top-right');
                        indicatorDropArea.removeClass('panel-indicator-left-bottom');
                    }
                    selfRef.preDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
                } else if (selfRef.state === sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT){
                    if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT && 
                        selfRef.tab.tabPanel.has('.panel-top-left').length &&
                        selfRef.tab.tabPanel.has('.panel-top-right').length &&
                        _.size(selfRef.tab.panelList) === 3){
                        selfRef.panel.addClass('panel-bottom-right').removeClass('panel-bottom-left');
                        selfRef.tab.tabPanel.children('.panel-top-left').addClass('panel-left').removeClass('panel-top-left');
                        indicatorDropArea.removeClass('panel-indicator-right-bottom');
                        
                    } else if (position === sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM &&
                        selfRef.tab.tabPanel.has('.panel-top-left').length &&
                        selfRef.tab.tabPanel.has('.panel-bottom-left').length && 
                        selfRef.prevDropArea !== sewi.constants.TAB_PREVIOUS_DROP_AREA.RIGHT &&
                        _.size(selfRef.tab.panelList) == 3){
                        
                        selfRef.panel.addClass('panel-bottom-right').removeClass('panel-top-right');
                        selfRef.tab.tabPanel.children('.panel-top-left').addClass('panel-top').removeClass('panel-top-left');
                        indicatorDropArea.removeClass('panel-indicator-bottom-right');
                    }
                    selfRef.preDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
                }
            }
        });
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
                console.log(ui.draggable);
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
        console.log("tab panel resize called");
        selfRef.resourceViewer.resize();
    }

    sewi.TabPanel.prototype.getDOM = function(){
        return this.panel;
    }

    // Tab class
    sewi.Tab = function(tabContainer, id, name, hasDropArea){
        var selfRef = this;
        selfRef.tabContainer = tabContainer;
        selfRef.panelList={};
        selfRef.tabButton = $('<li class="tab-button"><a href="#'+id+'" role="tab" data-toggle="tab">'+name+'</a></li>');
        selfRef.tabPanel = $('<div class="tab-pane" id="'+id+'"><div class="panel-content">'+name+'</div></div>');
        
        // constant variables
        selfRef.DROP_AREA_HOVER_STR = 'panel-drop-area-hover';
        selfRef.PANEL_STR = 'panel';
        selfRef.DROP_AREA_STR = '<div class="panel-drop-area panel-drop-area-full"></div>';


        var removeButton={tabRef : selfRef,
                    containerRef : tabContainer,
                        tabButton : selfRef.tabButton,
                        tabPanel : selfRef.tabPanel,
                            DOM : $('<span class="glyphicon glyphicon-remove"></span>')};
        
        selfRef.tabButtonEvent = function(){
            selfRef.tabContainer.setCurrentActiveTab(selfRef);
        }   

        if(hasDropArea){
            selfRef.addDropArea();
        }

        removeButton.DOM.on('click', removeButton, selfRef.removeEvent);
        selfRef.tabButton.children('a').append(removeButton.DOM);
        selfRef.tabButton.on('click', selfRef.tabButtonEvent);
    }

    sewi.Tab.prototype.removeEvent = function(event){
        var removeButton = event.data;
        var selfRef = removeButton.tabRef;
        var containerRef = removeButton.containerRef;
        var tabIndex = containerRef.tabs.indexOf(selfRef);
        
        removeButton.tabPanel.remove();
        removeButton.tabButton.remove();

        containerRef.tabs.splice(tabIndex, 1);

        if (containerRef.currentActiveTab == selfRef){
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
            selfRef.tabContainer.container.trigger("NoTabs");
        }
    }

    sewi.Tab.prototype.append = function(DOMObject, state){
        var selfRef = this;
        var id = DOMObject.data('resId');
        var type = DOMObject.data('resType');
        var obj = null;
        switch(type){
            case 'image':
                obj = new sewi.ImageResourceViewer({id:id});
                break;
            case 'video':
                obj = new sewi.VideoResourceViewer({id:id});
                break;
            case 'audio':
                obj = new sewi.AudioResourceViewer({id:id});
                break;
            case 'chart':
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
        var selfRef = this;
        var dropAreaDOM = $(selfRef.DROP_AREA_STR);
        selfRef.tabPanel.append(dropAreaDOM);
        selfRef.setDroppable(dropAreaDOM);
    }

    sewi.Tab.prototype.removeDropArea = function(dropArea){
        var selfRef = this;
        dropArea.remove();
        selfRef.tabPanel.children('.panel-indicator').remove();
    }

    sewi.Tab.prototype.setDroppable = function(dropArea){
        var selfRef = this;
        dropArea.droppable({
            drop: function(event, ui){
                event.preventDefault();
                selfRef.removeDropArea(dropArea);
                selfRef.append(ui.draggable, sewi.constants.TAB_PANEL_POSITIONS.FULL);
            },
            over: function(event, ui){
                event.preventDefault();
                console.log('over');
                selfRef.tabPanel.append($('<div class="panel-indicator"></div>'));
            
            },
            out: function(event, ui){
                event.preventDefault();
                console.log('out');
                selfRef.tabPanel.children('.panel-indicator').remove();
            },
            activeClass: 'panel-drop-area-visible',
            hoverClass: selfRef.DROP_AREA_HOVER_STR
        });
    }

    sewi.Tab.prototype.resize = function(){
        var selfRef = this;
        var panelList = selfRef.panelList;
        for(var panel in panelList){
            if(panelList.hasOwnProperty(panel)){
                //console.log(panelList[panel]);
                panelList[panel].resize();
            }
        } 
    }

    // tab container class
    sewi.TabContainer = function(){
        var selfRef = this;
        selfRef.counter= 1;
        
        selfRef.currentActiveTab;
        selfRef.tabButtons=[];  
        
        selfRef.tabs = [];

        selfRef.container = $('<div class="tab-container"></div>');
        selfRef.tabButtonGroup = $('<ul id="tab-button-group" class="nav nav-tabs" role="tablist"></ul>');
        selfRef.tabContent = $('<div class="tab-content"></div>');

        var addTabButton = $('<li><a class="add-tab-button"><span class="glyphicon glyphicon-plus"></span></a></li>');
        addTabButton.on('click', function(){
            selfRef.addNewTab("Tab"+selfRef.counter,"",true, true);
            selfRef.counter++;
        });

        selfRef.tabButtons.push(addTabButton);
        selfRef.tabButtonGroup.append(addTabButton);
                
        selfRef.container.append(selfRef.tabButtonGroup);
        selfRef.container.append(selfRef.tabContent);

    }

    sewi.TabContainer.prototype.addNewTab = function(tabName, tabText, active, hasDropArea){
        var selfRef = this;
        if(selfRef.tabs.length < sewi.constants.TAB_MAX_NUM_TABS){
            var newTab = new sewi.Tab(selfRef, tabName, tabText, hasDropArea);
            selfRef.tabs.push(newTab);

            if (active) selfRef.setCurrentActiveTab(newTab);    
    
            var lastIndex = selfRef.tabButtons.length-1;    
            newTab.tabButton.insertBefore(selfRef.tabButtons[lastIndex]);
            selfRef.tabContent.append(newTab.tabPanel);

            if(selfRef.tabs.length == sewi.constants.TAB_MAX_NUM_TABS){
                selfRef.tabButtons[lastIndex].hide();
            }
        } else {
            // TO DO: trigger event to notify configurator to display error message
        }
    }

    sewi.TabContainer.prototype.setCurrentActiveTab = function(tab){
        var selfRef = this; 
        if (selfRef.currentActiveTab){
            selfRef.currentActiveTab.deactivate();
        }
        selfRef.currentActiveTab = tab;
        if (tab){
            selfRef.currentActiveTab.activate();
        }
    }
    
    sewi.TabContainer.prototype.getDOM = function(){
        return this.container;
    }

    sewi.TabContainer.prototype.addObjectToNewTab = function(DOMObject){
        var selfRef = this;
        selfRef.addNewTab("Tab"+selfRef.counter,"", true, false);
        selfRef.currentActiveTab.append(DOMObject, sewi.constants.TAB_PANEL_POSITIONS.FULL);
    }

    sewi.TabContainer.prototype.resize = function(){
        var selfRef = this;
        var tabsArrLength = selfRef.tabs.length; 
        for(var i = 0; i < tabsArrLength; i++){ 
            selfRef.tabs[i].resize();
        }
    }
})();
