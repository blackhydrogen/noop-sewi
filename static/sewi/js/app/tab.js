var sewi = sewi || {};
// Tab Panel class
(function(){
    /**
     * This defines a Tab Panel object which is used in a tab.
     * It wraps around the resource viewer object that is displaying within, 
     * giving the resource viewer a droppable ability
     * Note: Multiple Tab Panels can exist in a single tab(Max: 4).
     *
     * @class  sewi.TabPanel
     * @constructor
     * 
     * @param {sewi.ResourceViewer} resourceViewer The resource viewer that is residing in the tab panel. 
     * @param {sewi.Tab} tabObject  The reference to the Tab that the panel is residing in.
     * @param {int} state This int value indicates the position of the panel in the tab panel. 
     *                    Refer to sewi.constants in common.js for the complete list of states available.
     */
    sewi.TabPanel = function(resourceViewer, tabObject, state){
        var DOMObject = resourceViewer.getDOM();
        
        initVariables.call(this, resourceViewer, tabObject, state);
        createDropAreas.call(this);

        this.panel.append(DOMObject);
    
        this.panel.on(getTransitionEvent(), onPanelTransitionEnd.bind(this));
        
        $(DOMObject).on('Closing', onResourceViewerClose.bind(this));
        $(DOMObject).on('FullscreenToggled', toggleFullScreen);
    }
    
    function initVariables(resourceViewer, tabObject, state){
        this.resourceViewer = resourceViewer;
        this.state = state;
        this.tab = tabObject;
        this.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
        this.indicators = [];
        this.panel = setPanelDOM(state);

        //Initilize the dom for drop areas    
        this.panelDropAreaRight = $(sewi.constants.TAB_PANEL_DROP_AREA_RIGHT_DOM);
        this.panelDropAreaLeft = $(sewi.constants.TAB_PANEL_DROP_AREA_LEFT_DOM);
        this.panelDropAreaTop = $(sewi.constants.TAB_PANEL_DROP_AREA_TOP_DOM);
        this.panelDropAreaBottom = $(sewi.constants.TAB_PANEL_DROP_AREA_BOTTOM_DOM); 
    }

    function createDropAreas(){
        //Setup the drop areas 
        setDroppable.call(this, this.panelDropAreaRight, sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT);
        setDroppable.call(this, this.panelDropAreaLeft, sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT);
        setDroppable.call(this, this.panelDropAreaTop, sewi.constants.TAB_DROP_AREA_POSITIONS.TOP);
        setDroppable.call(this, this.panelDropAreaBottom, sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM);

        //Append them to the panel
        this.panel.append(this.panelDropAreaRight);
        this.panel.append(this.panelDropAreaLeft);
        this.panel.append(this.panelDropAreaTop);
        this.panel.append(this.panelDropAreaBottom);
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

    function updatePanel(oldPosition, newPosition, addCSSClass, removeCSSClass){
        this.tab.panelList[oldPosition].getDOM().addClass(addCSSClass).removeClass(removeCSSClass);
        this.tab.panelList[oldPosition].state = newPosition;
        this.tab.panelList[newPosition] = this.tab.panelList[oldPosition];
        
        delete this.tab.panelList[oldPosition];
    }

    function setDroppable(dropArea, position){
        var indicatorDropArea = $(sewi.constants.TAB_PANEL_INDICATOR_DROP_AREA_DOM);
        this.indicators.push(indicatorDropArea);
        this.tab.tabPanel.append(indicatorDropArea);
        setIndicatorDroppable.call(this, indicatorDropArea, position);
        dropArea.droppable({
                over: onIndicatorDropAreaOverEvent.bind(this, position, indicatorDropArea),
                out: onIndicatorDropAreaOutEvent.bind(this, position, indicatorDropArea)
            });
    }

    function onResourceViewerClose(){          
        if (this.state == sewi.constants.TAB_PANEL_POSITIONS.FULL){
            this.tab.addDropArea();
            removeSelf.call(this);
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.LEFT){
            if(_.size(this.tab.panelList) === 3){ 
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
                
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
            } else {
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.FULL, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT);
            }
            removeSelf.call(this);       
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.RIGHT){
            if(_.size(this.tab.panelList) === 3){ 
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
                
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
            } else {
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.FULL, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT);
            }
            removeSelf.call(this);       
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM){ 
            if(_.size(this.tab.panelList) === 3){ 
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
                
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.LEFT, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
            } else {
                
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP, 
                                sewi.constants.TAB_PANEL_POSITIONS.FULL, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP);
            }
            removeSelf.call(this);
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP){    
            if(_.size(this.tab.panelList) === 3){ 
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
                
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.LEFT, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
            } else {
                
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 
                                sewi.constants.TAB_PANEL_POSITIONS.FULL, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM);
            }
            removeSelf.call(this);
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT){
            if(_.size(this.tab.panelList) === 3){
                if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT]) {
                    
                    updatePanel.call(this,
                                    sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                    sewi.constants.TAB_PANEL_POSITIONS.TOP, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
                
                } else if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT]) {
                    
                    updatePanel.call(this,
                                    sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                    sewi.constants.TAB_PANEL_POSITIONS.LEFT, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
                }
            } else {
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
            }
            removeSelf.call(this);       
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT){  
            if(_.size(this.tab.panelList) === 3){
                if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT]){
                    
                    updatePanel.call(this,
                                    sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                    sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
                
                } else if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT]) {
                    
                    updatePanel.call(this,
                                    sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                    sewi.constants.TAB_PANEL_POSITIONS.TOP, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
                }    
            } else {
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
            }
            removeSelf.call(this);       
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT){
            if(_.size(this.tab.panelList) === 3){
                if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT]){
                    
                    updatePanel.call(this,
                                    sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                    sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);

                } else if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT]) {
                    updatePanel.call(this,
                                    sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                    sewi.constants.TAB_PANEL_POSITIONS.LEFT, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
                }
            } else {
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
            }
            removeSelf.call(this);       
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT){
            if(_.size(this.tab.panelList) === 3){
                if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT]){
                    updatePanel.call(this,
                                    sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                    sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);

                } else if(this.tab.panelList[sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT]) {
                    updatePanel.call(this,
                                    sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                    sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT, 
                                    sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
                }
            } else {
                updatePanel.call(this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM, 
                                sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
            }
            removeSelf.call(this);
        }
    }
    
    // Helper functions for the onIndicatorDropAreaOverEvent
    function onIndicatorDropAreaOverEventFull(position, indicatorDropArea){
        if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT);
        
        } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT);
        
        } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP);
        
        } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM);
        
        } 
    }

    // Helper functions for the onIndicatorDropAreaOverEvent
    function onIndicatorDropAreaOverEventLeft(position, indicatorDropArea){
        if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP_LEFT);
        
        } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM_LEFT);  
        
        } 
    }
    
    // Helper functions for the onIndicatorDropAreaOverEvent
    function onIndicatorDropAreaOverEventRight(position, indicatorDropArea){
        if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP_RIGHT);    
        
        } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM_RIGHT);     
        
        } 
    }

    // Helper functions for the onIndicatorDropAreaOverEvent
    function onIndicatorDropAreaOverEventBottom(position, indicatorDropArea){
        if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT_BOTTOM);
        
        } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT_BOTTOM); 
        
        } 
    }

    // Helper functions for the onIndicatorDropAreaOverEvent
    function onIndicatorDropAreaOverEventTop(position, indicatorDropArea){
        if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){   
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT_TOP);
        
        } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){   
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT_TOP);
        
        } 
    }

    // Helper functions for the onIndicatorDropAreaOverEvent
    function onIndicatorDropAreaOverEventTopLeft(position, indicatorDropArea){
        if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP && 
            this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM).length){
            
            this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM)
                            .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM);
            
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP_LEFT);
        } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT &&
            this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT).length){
            
            this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT)
                            .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT);
            
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT_TOP);
            
            //This is to prevent an issue with how events are ordered in javascript.
            this.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.LEFT;
        }
    }

    // Helper functions for the onIndicatorDropAreaOverEvent
    function onIndicatorDropAreaOverEventTopRight(position, indicatorDropArea){
        if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP && 
            this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM).length){
            
            this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM)
                            .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM);
            
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP_RIGHT);
        } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT &&
            this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT).length){
            this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT)
                            .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT);
            
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT)
                    .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT_TOP);
            
            //This is to prevent an issue with how events are ordered in javascript.
            this.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.RIGHT;
        }           
    }

    // Helper functions for the onIndicatorDropAreaOverEvent
    function onIndicatorDropAreaOverEventBottomLeft(position, indicatorDropArea){
        if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM && 
            this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP).length){
            
            this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP)
                            .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP);
            
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM_LEFT);
        } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT &&
            this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT).length){
            
            this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT)
                            .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT);
            
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT_BOTTOM);
            
            //This is to prevent an issue with how events are ordered in javascript.
            this.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.LEFT;
        }
    }

    // Helper functions for the onIndicatorDropAreaOverEvent
    function onIndicatorDropAreaOverEventBottomRight(position, indicatorDropArea){
        if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM && 
            this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP).length){
            
            this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP)
                            .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP);
            
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM_RIGHT);

        } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT &&
                    this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT).length){
            
            this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT)
                            .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT);
            
            this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
            
            indicatorDropArea.addClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT_BOTTOM);
            
            //This is to prevent an issue with how events are ordered in javascript.
            this.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.RIGHT;
        }
    }


    function onIndicatorDropAreaOverEvent(position, indicatorDropArea, event, ui){
        event.preventDefault();
        if(this.state == sewi.constants.TAB_PANEL_POSITIONS.FULL){
            onIndicatorDropAreaOverEventFull.call(  this, 
                                                    position, 
                                                    indicatorDropArea);
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.LEFT){
            onIndicatorDropAreaOverEventLeft.call(  this, 
                                                    position, 
                                                    indicatorDropArea);
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.RIGHT){
            onIndicatorDropAreaOverEventRight.call( this, 
                                                    position, 
                                                    indicatorDropArea);
        
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM){
            onIndicatorDropAreaOverEventBottom.call(this, 
                                                    position, 
                                                    indicatorDropArea);
        
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP){
            onIndicatorDropAreaOverEventTop.call(   this,
                                                    position,
                                                    indicatorDropArea);
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT){
            onIndicatorDropAreaOverEventTopLeft.call(   this,
                                                        position,
                                                        indicatorDropArea);
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT){
            onIndicatorDropAreaOverEventTopRight.call(  this,
                                                        position,
                                                        indicatorDropArea);
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT){
            onIndicatorDropAreaOverEventBottomLeft.call(    this,
                                                            position,
                                                            indicatorDropArea);
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT){
            onIndicatorDropAreaOverEventBottomRight.call(   this,
                                                            position,
                                                            indicatorDropArea);
        }
    }

    function onIndicatorDropAreaOutEvent(position, indicatorDropArea, event, ui){
        if (this.state == sewi.constants.TAB_PANEL_POSITIONS.FULL){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT);
            
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT);
            
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP);
            
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM);
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.LEFT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT)
                        .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP_LEFT);  
            
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){  
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM_LEFT);   
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.RIGHT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP_RIGHT);     
            
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM_RIGHT);      
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){   
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT_BOTTOM);       
            
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){   
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT_BOTTOM);      
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT_TOP);      
            
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT_TOP);         
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT){ 
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT).length &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT).length &&
                this.prevDropArea !== sewi.constants.TAB_PREVIOUS_DROP_AREA.LEFT && 
                _.size(this.tab.panelList) == 3){
                
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
                
                this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT)
                                    .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM)
                                    .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP_LEFT);
            
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT).length &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT).length &&
                _.size(this.tab.panelList) === 3){
                
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
                
                this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT)
                            .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT_TOP);
            }
            this.preDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
        } else if (this.state === sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT){
            
            if (position === sewi.constants.TAB_DROP_AREA_POSITIONS.TOP &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT).length &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT).length &&
                this.prevDropArea !== sewi.constants.TAB_PREVIOUS_DROP_AREA.RIGHT &&
                _.size(this.tab.panelList) === 3){
                
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
                
                this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT)
                                    .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM)
                                    .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP_RIGHT);
            
            } else if (position === sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT).length &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT).length &&                   
                _.size(this.tab.panelList) === 3){
                
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
                
                this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT)
                                    .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT)
                                    .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT_TOP);
            }   
            
            this.prevDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
        
        } else if (this.state === sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT).length &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT).length &&
                this.prevDropArea !== sewi.constants.TAB_PREVIOUS_DROP_AREA.LEFT &&
                _.size(this.tab.panelList) === 3){

                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
                
                this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT)
                                    .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP)
                                    .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM_LEFT);
            
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT).length &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT).length &&
                _.size(this.tab.panelList) === 3){
                
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
                
                this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT)
                                    .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT)
                                    .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT_BOTTOM);
            }
            this.preDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
        } else if (this.state === sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT && 
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT).length &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT).length &&
                _.size(this.tab.panelList) === 3){
                
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
                
                this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT)
                                    .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT)
                                    .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT_BOTTOM);
                
            } else if (position === sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT).length &&
                this.tab.tabPanel.has('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT).length && 
                this.prevDropArea !== sewi.constants.TAB_PREVIOUS_DROP_AREA.RIGHT &&
                _.size(this.tab.panelList) == 3){
                
                this.panel.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT)
                            .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
                
                this.tab.tabPanel.children('.'+sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT)
                                    .addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP)
                                    .removeClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
                
                indicatorDropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM_RIGHT);
            }
            this.preDropArea = sewi.constants.TAB_PREVIOUS_DROP_AREA.NONE;
        }
    }

    function indicatorOnDrop(dropArea, position, event, ui){
        event.preventDefault();
        if (this.state == sewi.constants.TAB_PANEL_POSITIONS.FULL){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT);
            
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.LEFT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT);
            
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP);
            
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM);
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.LEFT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP_LEFT);
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM_LEFT);
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.RIGHT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP_RIGHT);
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM_RIGHT);
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT_BOTTOM);
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT_BOTTOM);
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT_TOP);
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT_TOP);
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                updateState.call(   this,
                                    sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 
                                    sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT);
                
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP_LEFT);
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                updateState.call(   this,
                                    sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 
                                    sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT);                 
                
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT_TOP);
            }   
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.TOP){
                updateState.call(   this,
                                    sewi.constants.TAB_PANEL_POSITIONS.BOTTOM, 
                                    sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT);
                
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.TOP_RIGHT);
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                updateState.call(   this,
                                    sewi.constants.TAB_PANEL_POSITIONS.LEFT, 
                                    sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT);
                
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT_TOP);
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.LEFT){
                updateState.call(   this,
                                    sewi.constants.TAB_PANEL_POSITIONS.RIGHT, 
                                    sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT);
                
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.LEFT_BOTTOM);
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                updateState.call(   this,
                                    sewi.constants.TAB_PANEL_POSITIONS.TOP, 
                                    sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT);
                
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM_LEFT);
            }
        } else if (this.state == sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT){
            if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.RIGHT){
                updateState.call(   this,
                                    sewi.constants.TAB_PANEL_POSITIONS.LEFT, 
                                    sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT);
                
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                ui.draggable);
                
                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.RIGHT_BOTTOM);
            } else if (position == sewi.constants.TAB_DROP_AREA_POSITIONS.BOTTOM){
                updateState.call(   this,
                                    sewi.constants.TAB_PANEL_POSITIONS.TOP, 
                                    sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT);
                
                addPanel.call(  this,
                                sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT, 
                                sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT, 
                                ui.draggable);

                dropArea.removeClass(sewi.constants.TAB_PANEL_INDICATOR_POSITION_CSS_CLASS.BOTTOM_RIGHT);
            }
        }
    }

    function addPanel(selfPanelPosition, newPanelPosition, DOMObject){
        delete this.tab.panelList[this.state];
        this.state = selfPanelPosition;
        this.tab.panelList[this.state] = this;
        this.tab.append(DOMObject, newPanelPosition);
    }

    function setIndicatorDroppable(dropArea, position){
        dropArea.droppable({ drop: indicatorOnDrop.bind(this, dropArea, position)});
    }

    function updateState(oldState, newState){
        this.tab.panelList[newState] = this.tab.panelList[oldState];
        this.tab.panelList[newState].state = newState;
        delete this.tab.panelList[oldState];
    }

    //Set the panel position based on the state.
    function setPanelDOM(state){
        var DOM = $(sewi.constants.TAB_PANEL_DOM);
        switch(state){
            case sewi.constants.TAB_PANEL_POSITIONS.FULL: 
                DOM.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.FULL);
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.LEFT: 
                DOM.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.LEFT);
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.RIGHT: 
                DOM.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.RIGHT);
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.BOTTOM: 
                DOM.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM);
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.TOP: 
                DOM.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP);
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.TOP_LEFT: 
                DOM.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_LEFT);
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.TOP_RIGHT: 
                DOM.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.TOP_RIGHT);
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_LEFT: 
                DOM.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_LEFT);
                break;
            case sewi.constants.TAB_PANEL_POSITIONS.BOTTOM_RIGHT: 
                DOM.addClass(sewi.constants.TAB_PANEL_STATE_CSS_CLASS.BOTTOM_RIGHT);
                break;
        }
        return DOM;
    }

    /**
     * This function calls the resize function of the resource viewer to recalculate the dimension for display.
     */
    sewi.TabPanel.prototype.resize = function(){
        this.resourceViewer.resize();
    }

    /**
     * This function returns a dom that represent the tab panel
     * @return {jQuery} The dom object associated with the class.
     */
    sewi.TabPanel.prototype.getDOM = function(){
        return this.panel;
    }
})();

// Tab class
(function(){
    /**
     * This is the contructor function of the Tab class which initializes a tab in the tab container.
     *
     * @class  Tab
     * @constructor
     *
     * @param {sewi.TabContainer}  tabContainer It holds a reference to the tab container object that this tab is residing in.
     * @param {String}  id    This is the id of the tab for selector purpose.
     * @param {Boolean} hasDropArea This variable tells the tab to create an initial dropArea or not.
     */
    sewi.Tab = function(tabContainer, id, hasDropArea){
        this.tabContainer = tabContainer;
        this.panelList={};
        this.tabButton = $(sewi.constants.TAB_TAB_BUTTON_DOM);
        this.tabButton.children('a').attr({'href': '#'+id});
        this.tabPanel = $(sewi.constants.TAB_TAB_PANEL_DOM);
        this.tabPanel.attr({'id' : id});

        var removeButton={
                            containerRef : tabContainer,
                            tabButton : this.tabButton,
                            tabPanel : this.tabPanel,
                            DOM : $(sewi.constants.TAB_REMOVE_BUTTON_DOM)
                        };
        
        if(hasDropArea){
            this.addDropArea();
        }

        removeButton.DOM.on(sewi.constants.TAB_CLICK_EVENT_STR, removeButton, removeEvent.bind(this));
        this.tabButton.children('a').append(removeButton.DOM);
        this.tabButton.on(sewi.constants.TAB_CLICK_EVENT_STR, tabButtonEvent.bind(this));
    }

    function tabButtonEvent(){
        this.tabContainer.setCurrentActiveTab(this);
    }

    function removeEvent(event){
        event.preventDefault();
        var removeButton = event.data;
        var containerRef = removeButton.containerRef;
        var tabIndex = containerRef.tabs.indexOf(this);

        //Get the resource viewers to clean up its object references.
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

        if (containerRef.tabs.length === 0){
            this.tabContainer.container.trigger(sewi.constants.TAB_NO_TAB_EVENT);
        }
    }

    function dropAreaDropEvent(dropArea, event, ui){
        event.preventDefault();
        this.removeDropArea(dropArea);
        this.append(ui.draggable, sewi.constants.TAB_PANEL_POSITIONS.FULL); 
    }

    function dropAreaOverEvent(event, ui){
        event.preventDefault();
        this.tabPanel.append($(sewi.constants.TAB_PANEL_INDICATOR_DOM)); 
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
    
    function setDroppable(dropArea){
        dropArea.droppable({
            drop: dropAreaDropEvent.bind(this, dropArea),
            over: dropAreaOverEvent.bind(this),
            out: dropAreaOutEvent.bind(this),
            activeClass: sewi.constants.TAB_DROP_AREA_VISIBLE_STR,
            hoverClass: sewi.constants.TAB_DROP_AREA_HOVER_STR
        });
    }

    /**
     * This function will create the appropriate resource viewer object based on the values 
     * of "data-res-id" and "data-res-type" defined in the html tag. Then the resource viewer is added to the tab panel. 
     * @param  {jQuery} DOMObject This is a reference to the jQuery object that has been clicked/dropped.
     * @param  {int} state This int value indicates the position of the panel in the tab panel. 
     *                    Refer to sewi.constants in common.js for the complete list of states available.
     */
    sewi.Tab.prototype.append = function(DOMObject, state){
        var id = DOMObject.data(sewi.constants.DATA_ATTR.ID);
        var type = DOMObject.data(sewi.constants.DATA_ATTR.TYPE);
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
            this.setPanel(obj, state);
        }
    }

    /**
     * This function sets a new panel and place the resource viewer within for display.
     * @param {ResourceViewer} ResourceViewer It holds the reference to a ResourceViewer object.
     * @param {int} state This int value indicates the position of the panel in the tab panel. 
     *                    Refer to sewi.constants in common.js for the complete list of states available.
     */
    sewi.Tab.prototype.setPanel = function(ResourceViewer, state){
        var panel = new sewi.TabPanel(ResourceViewer, this, state);          
        this.tabPanel.append(panel.getDOM());
        this.panelList[state] = panel;
    }

    /**
     * This function activates the tab by appending the css class "active"
     */
    sewi.Tab.prototype.activate = function(){
        this.tabButton.addClass(sewi.constants.TAB_ACTIVE_CSS);
        this.tabPanel.addClass(sewi.constants.TAB_ACTIVE_CSS);
    }

    /**
     * This function deactivates the tab by removing the css class "active"
     */
    sewi.Tab.prototype.deactivate = function(){
        this.tabButton.removeClass(sewi.constants.TAB_ACTIVE_CSS);
        this.tabPanel.removeClass(sewi.constants.TAB_ACTIVE_CSS);
    }

    /**
     * Appends a new drop area into the tab.
     */
    sewi.Tab.prototype.addDropArea = function(){
        var dropAreaDOM = $(sewi.constants.TAB_DROP_AREA_DOM);
        this.tabPanel.append(dropAreaDOM);
        setDroppable.call(this, dropAreaDOM);
    }

    /**
     * Removes the target drop area.
     * @param  {jQuery} dropArea It holds a reference to the jQuery object that represents the drop area.
     */
    sewi.Tab.prototype.removeDropArea = function(dropArea){
        dropArea.remove();
        this.tabPanel.children(sewi.constants.TAB_CSS_CLASS_STR_PANEL_INDICATOR).remove();
    }

    /**
     * Calls the resize function of all the panels in the tab.
     */
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
        var active = true;
        var hasDropArea = true;

        var result = addNewTab.call(this, tabName, active, hasDropArea);
        if(result){
            this.noOfTabs++;
        }
    }

    function addNewTab(tabName, active, hasDropArea){
        var hasNewTabAdded = false;
        if(this.tabs.length < sewi.constants.TAB_MAX_NUM_TABS){
            var newTab = new sewi.Tab(this, tabName, hasDropArea);
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
            this.currentActiveTab.resize();
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
        var active = true;
        var hasDropArea = false;
        
        var result = addNewTab.call(this, tabName, active, hasDropArea); 
        if(result){
            this.currentActiveTab.append(DOMObject, sewi.constants.TAB_PANEL_POSITIONS.FULL);
            this.noOfTabs++;
        }
    }

    /**
     * This function calls all the resize function of the active tab.
     */
    sewi.TabContainer.prototype.resize = function(){
        this.currentActiveTab.resize();
    }
})();