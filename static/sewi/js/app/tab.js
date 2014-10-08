var sewi = sewi || {};

// Tab Panel class
sewi.TabPanel = function(DOMObject, tabObject, state){
	var selfRef = this;
	selfRef.state = state;
	selfRef.tab = tabObject;
	selfRef.panel = selfRef.setPanelDOM(state);
	selfRef.panelDropAreaRight = $('<div class="panel-drop-area panel-drop-area-right"></div>');
	selfRef.panelDropAreaLeft = $('<div class="panel-drop-area panel-drop-area-left"></div>');
	selfRef.panelDropAreaTop = $('<div class="panel-drop-area panel-drop-area-top"></div>');
	selfRef.panelDropAreaBottom = $('<div class="panel-drop-area panel-drop-area-bottom"></div>'); 
	
	selfRef.setDroppable(selfRef.panelDropAreaRight, sewi.constants.DROP_AREA_POSITIONS.RIGHT);
	selfRef.setDroppable(selfRef.panelDropAreaLeft, sewi.constants.DROP_AREA_POSITIONS.LEFT);
	selfRef.setDroppable(selfRef.panelDropAreaTop, sewi.constants.DROP_AREA_POSITIONS.TOP);
	selfRef.setDroppable(selfRef.panelDropAreaBottom, sewi.constants.DROP_AREA_POSITIONS.BOTTOM);
	
	selfRef.panel.append(selfRef.panelDropAreaRight);
	selfRef.panel.append(selfRef.panelDropAreaLeft);
	selfRef.panel.append(selfRef.panelDropAreaTop);
	selfRef.panel.append(selfRef.panelDropAreaBottom);

	selfRef.panel.append(DOMObject);
}

sewi.TabPanel.prototype.setDroppable = function(dropArea, position){
	var selfRef = this;
	var indicatorDropArea = $('<div></div>');
	selfRef.tab.tabPanel.append(indicatorDropArea);
	selfRef.setIndicatorDroppable(indicatorDropArea, position);
	dropArea.droppable({
		over: function(event, ui){
			event.preventDefault();
			if (selfRef.state == 0){
				if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT){
					selfRef.panel.addClass('panel-left').removeClass('panel-full');
					indicatorDropArea.addClass('panel-indicator-right');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT){
					selfRef.panel.addClass('panel-right').removeClass('panel-full');
					indicatorDropArea.addClass('panel-indicator-left');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.TOP){
					selfRef.panel.addClass('panel-bottom').removeClass('panel-full');
					indicatorDropArea.addClass('panel-indicator-top');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM){
					selfRef.panel.addClass('panel-top').removeClass('panel-full');
					indicatorDropArea.addClass('panel-indicator-bottom');
				}
			} else if (selfRef.state == 1){
				if (position == sewi.constants.DROP_AREA_POSITIONS.TOP){
					selfRef.panel.addClass('panel-bottom-left').removeClass('panel-left');
					indicatorDropArea.addClass('panel-indicator-top-left');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM){
					selfRef.panel.addClass('panel-top-left').removeClass('panel-left');
					indicatorDropArea.addClass('panel-indicator-bottom-left');	
				}
			} else if (selfRef.state == 2){
				if (position == sewi.constants.DROP_AREA_POSITIONS.TOP){
					selfRef.panel.addClass('panel-bottom-right').removeClass('panel-right');
					indicatorDropArea.addClass('panel-indicator-top-right');	
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM){
					selfRef.panel.addClass('panel-top-right').removeClass('panel-right');
					indicatorDropArea.addClass('panel-indicator-bottom-right');		
				}
			} else if (selfRef.state == 3){
				if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT){
					selfRef.panel.addClass('panel-bottom-right').removeClass('panel-bottom');
					indicatorDropArea.addClass('panel-indicator-left-bottom');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT){
					selfRef.panel.addClass('panel-bottom-left').removeClass('panel-bottom');
					indicatorDropArea.addClass('panel-indicator-right-bottom');	
				}
			} else if (selfRef.state == 4){
				if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT){	
					selfRef.panel.addClass('panel-top-right').removeClass('panel-top');
					indicatorDropArea.addClass('panel-indicator-left-top');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT){	
					selfRef.panel.addClass('panel-top-left').removeClass('panel-top');
					indicatorDropArea.addClass('panel-indicator-right-top');
				}
			} else if (selfRef.state == 5){
				if (position == sewi.constants.DROP_AREA_POSITIONS.TOP && 
					selfRef.tab.tabPanel.has('.panel-bottom').length){
					selfRef.tab.tabPanel.children('.panel-bottom').addClass('panel-bottom-right').removeClass('panel-bottom');
					selfRef.panel.addClass('panel-bottom-left').removeClass('panel-top-left');
					indicatorDropArea.addClass('panel-indicator-top-left');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT &&
					selfRef.tab.tabPanel.has('.panel-right').length){
					selfRef.tab.tabPanel.children('.panel-right').addClass('panel-bottom-right').removeClass('panel-right');
					selfRef.panel.addClass('panel-top-right').removeClass('panel-top-left');
					indicatorDropArea.addClass('panel-indicator-left-top');
				}
			} else if (selfRef.state == 6){
				if (position == sewi.constants.DROP_AREA_POSITIONS.TOP && 
					selfRef.tab.tabPanel.has('.panel-bottom').length){
					selfRef.tab.tabPanel.children('.panel-bottom').addClass('panel-bottom-left').removeClass('panel-bottom');
					selfRef.panel.addClass('panel-bottom-right').removeClass('panel-top-right');
					indicatorDropArea.addClass('panel-indicator-top-right');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT &&
					selfRef.tab.tabPanel.has('.panel-left').length){
					selfRef.tab.tabPanel.children('.panel-left').addClass('panel-bottom-left').removeClass('panel-left');
					selfRef.panel.addClass('panel-top-left').removeClass('panel-top-right');
					indicatorDropArea.addClass('panel-indicator-right-top');
				}
			
			} else if (selfRef.state == 7){
				if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM && 
					selfRef.tab.tabPanel.has('.panel-top').length){
					selfRef.tab.tabPanel.children('.panel-top').addClass('panel-top-right').removeClass('panel-top');
					selfRef.panel.addClass('panel-top-left').removeClass('panel-bottom-left');
					indicatorDropArea.addClass('panel-indicator-bottom-left');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT &&
					selfRef.tab.tabPanel.has('.panel-right').length){
					selfRef.tab.tabPanel.children('.panel-right').addClass('panel-top-right').removeClass('panel-right');
					selfRef.panel.addClass('panel-bottom-right').removeClass('panel-bottom-left');
					indicatorDropArea.addClass('panel-indicator-left-bottom');
				}

			} else if (selfRef.state == 8){
				if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM && 
					selfRef.tab.tabPanel.has('.panel-top').length){
					selfRef.tab.tabPanel.children('.panel-top').addClass('panel-top-left').removeClass('panel-top');
					selfRef.panel.addClass('panel-top-right').removeClass('panel-bottom-right');
					indicatorDropArea.addClass('panel-indicator-bottom-right');

				} else if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT &&
							selfRef.tab.tabPanel.has('.panel-left').length){
					selfRef.tab.tabPanel.children('.panel-left').addClass('panel-top-left').removeClass('panel-left');
					selfRef.panel.addClass('panel-bottom-left').removeClass('panel-bottom-right');
					indicatorDropArea.addClass('panel-indicator-right-bottom');
				}
			}
		},
		out: function(event, ui){
			if (selfRef.state == 0){
				if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT){
					selfRef.panel.addClass('panel-full').removeClass('panel-left');
					indicatorDropArea.removeClass('panel-indicator-right');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT){
					selfRef.panel.addClass('panel-full').removeClass('panel-right');
					indicatorDropArea.removeClass('panel-indicator-left');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.TOP){
					selfRef.panel.addClass('panel-full').removeClass('panel-bottom');
					indicatorDropArea.removeClass('panel-indicator-top');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM){
					selfRef.panel.addClass('panel-full').removeClass('panel-top');
					indicatorDropArea.removeClass('panel-indicator-bottom');
				}
			} else if (selfRef.state == 1){
				if (position == sewi.constants.DROP_AREA_POSITIONS.TOP){
					selfRef.panel.addClass('panel-left').removeClass('panel-bottom-left');
					indicatorDropArea.removeClass('panel-indicator-top-left');	
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM){	
					selfRef.panel.addClass('panel-left').removeClass('panel-top-left');
					indicatorDropArea.removeClass('panel-indicator-bottom-left');	
				}
			} else if (selfRef.state == 2){
				if (position == sewi.constants.DROP_AREA_POSITIONS.TOP){
					selfRef.panel.addClass('panel-right').removeClass('panel-bottom-right');
					indicatorDropArea.removeClass('panel-indicator-top-right');		
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM){
					selfRef.panel.addClass('panel-right').removeClass('panel-top-right');
					indicatorDropArea.removeClass('panel-indicator-bottom-right');		
				}
			} else if (selfRef.state == 3){
				if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT){	
					selfRef.panel.addClass('panel-bottom').removeClass('panel-bottom-right');
					indicatorDropArea.removeClass('panel-indicator-left-bottom');		
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT){	
					selfRef.panel.addClass('panel-bottom').removeClass('panel-bottom-left');
					indicatorDropArea.removeClass('panel-indicator-right-bottom');		
				}
			} else if (selfRef.state == 4){
				if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT){
					selfRef.panel.addClass('panel-top').removeClass('panel-top-right');
					indicatorDropArea.removeClass('panel-indicator-left-top');		
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT){
					selfRef.panel.addClass('panel-top').removeClass('panel-top-left');
					indicatorDropArea.removeClass('panel-indicator-right-top');			
				}
			} else if (selfRef.state == 5){ 
				if (position == sewi.constants.DROP_AREA_POSITIONS.TOP &&
					selfRef.tab.tabPanel.has('.panel-bottom-right').length &&
					selfRef.tab.panelList.length == 3){
					selfRef.panel.addClass('panel-top-left').removeClass('panel-bottom-left');
					selfRef.tab.tabPanel.children('.panel-bottom-right').addClass('panel-bottom').removeClass('panel-bottom-right');
					indicatorDropArea.removeClass('panel-indicator-top-left');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT &&
							selfRef.tab.tabPanel.has('.panel-bottom-right').length &&
							selfRef.tab.panelList.length == 3){
					selfRef.panel.addClass('panel-top-left').removeClass('panel-top-right');
					selfRef.tab.tabPanel.children('.panel-bottom-right').addClass('panel-right').removeClass('panel-bottom-right');
					indicatorDropArea.removeClass('panel-indicator-left-top');
				}
			} else if (selfRef.state == 6){
				if (position == sewi.constants.DROP_AREA_POSITIONS.TOP &&
					selfRef.tab.tabPanel.has('.panel-bottom-left').length &&
					selfRef.tab.panelList.length == 3){
					selfRef.panel.addClass('panel-top-right').removeClass('panel-bottom-right');
					selfRef.tab.tabPanel.children('.panel-bottom-left').addClass('panel-bottom').removeClass('panel-bottom-left');
					indicatorDropArea.removeClass('panel-indicator-top-right');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT &&
							selfRef.tab.tabPanel.has('.panel-bottom-left').length &&
							selfRef.tab.panelList.length == 3){
					selfRef.panel.addClass('panel-top-right').removeClass('panel-top-left');
					selfRef.tab.tabPanel.children('.panel-bottom-left').addClass('panel-left').removeClass('panel-bottom-left');
					indicatorDropArea.removeClass('panel-indicator-right-top');
				}	
			} else if (selfRef.state == 7){
				if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM &&
					selfRef.tab.tabPanel.has('.panel-top-right').length &&
					selfRef.tab.panelList.length == 3){
					selfRef.panel.addClass('panel-bottom-left').removeClass('panel-top-left');
					selfRef.tab.tabPanel.children('.panel-top-right').addClass('panel-top').removeClass('panel-top-right');
					indicatorDropArea.removeClass('panel-indicator-bottom-left');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT &&
							selfRef.tab.tabPanel.has('.panel-top-right').length &&
							selfRef.tab.panelList.length == 3){
					selfRef.panel.addClass('panel-bottom-left').removeClass('panel-bottom-right');
					selfRef.tab.tabPanel.children('.panel-top-right').addClass('panel-right').removeClass('panel-top-right');
					indicatorDropArea.removeClass('panel-indicator-left-bottom');
				}
			} else if (selfRef.state == 8){
				if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT && 
					selfRef.tab.tabPanel.has('.panel-top-left').length &&
					selfRef.tab.panelList.length == 3){
					selfRef.panel.addClass('panel-bottom-right').removeClass('panel-bottom-left');
					selfRef.tab.tabPanel.children('.panel-top-left').addClass('panel-left').removeClass('panel-top-left');
					indicatorDropArea.removeClass('panel-indicator-right-bottom');
					
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM &&
							selfRef.tab.tabPanel.has('.panel-top-left').length &&
							selfRef.tab.panelList.length == 3){
					selfRef.panel.addClass('panel-bottom-right').removeClass('panel-top-right');
					selfRef.tab.tabPanel.children('.panel-top-left').addClass('panel-top').removeClass('panel-top-left');
					indicatorDropArea.removeClass('panel-indicator-bottom-right');
				}
			}
		}
	});
}

sewi.TabPanel.prototype.setIndicatorDroppable = function(dropArea, position){
	var selfRef = this;
	dropArea.droppable({
		drop: function(event, ui){
			event.preventDefault();
			console.log(ui.draggable);
			if (selfRef.state == 0){
				if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT){
					selfRef.state = 1; //LEFT
					selfRef.tab.append(ui.draggable, 2);
					dropArea.removeClass('panel-indicator-right');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT){
					selfRef.state = 2  //RIGHT
					selfRef.tab.append(ui.draggable, 1);
					dropArea.removeClass('panel-indicator-left');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.TOP){
					selfRef.state = 3; //BOTTOM
					selfRef.tab.append(ui.draggable, 4);
					dropArea.removeClass('panel-indicator-top');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM){
					selfRef.state = 4; //TOP
					selfRef.tab.append(ui.draggable, 3);
					dropArea.removeClass('panel-indicator-bottom');
				}
			} else if (selfRef.state == 1){
				if (position == sewi.constants.DROP_AREA_POSITIONS.TOP){
					selfRef.state = 7;
					selfRef.tab.append(ui.draggable, 5);
					dropArea.removeClass('panel-indicator-top-left');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM){
					selfRef.state = 5;
					selfRef.tab.append(ui.draggable, 7);
					dropArea.removeClass('panel-indicator-bottom-left');
				}
			} else if (selfRef.state == 2){
				if (position == sewi.constants.DROP_AREA_POSITIONS.TOP){
					selfRef.state = 8;
					selfRef.tab.append(ui.draggable, 6);
					dropArea.removeClass('panel-indicator-top-right');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM){
					selfRef.state = 6;
					selfRef.tab.append(ui.draggable, 8);
					dropArea.removeClass('panel-indicator-bottom-right');
				}
			} else if (selfRef.state == 3){
				if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT){
					selfRef.state = 8;
					selfRef.tab.append(ui.draggable, 7);
					dropArea.removeClass('panel-indicator-left-bottom');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT){
					selfRef.state = 7;
					selfRef.tab.append(ui.draggable, 8);
					dropArea.removeClass('panel-indicator-right-bottom');
				}
			} else if (selfRef.state == 4){
				if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT){
					selfRef.state = 6;
					selfRef.tab.append(ui.draggable, 5);
					dropArea.removeClass('panel-indicator-left-top');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT){
					selfRef.state = 5;
					selfRef.tab.append(ui.draggable, 6);
					dropArea.removeClass('panel-indicator-right-top');
				}
			} else if (selfRef.state == 5){
				if (position == sewi.constants.DROP_AREA_POSITIONS.TOP){
					selfRef.state = 7;
					selfRef.tab.append(ui.draggable, 5);
					dropArea.removeClass('panel-indicator-top-left');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT){
					selfRef.state = 6;
					selfRef.tab.append(ui.draggable, 5);
					dropArea.removeClass('panel-indicator-left-top');
				}	
			} else if (selfRef.state == 6){
				if (position == sewi.constants.DROP_AREA_POSITIONS.TOP){
					selfRef.state = 8;
					selfRef.tab.append(ui.draggable, 6);
					dropArea.removeClass('panel-indicator-top-right');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT){
					selfRef.state = 5;
					selfRef.tab.append(ui.draggable, 6);
					dropArea.removeClass('panel-indicator-right-top');
				}
			} else if (selfRef.state == 7){
				if (position == sewi.constants.DROP_AREA_POSITIONS.LEFT){
					selfRef.state = 8;
					selfRef.tab.append(ui.draggable, 7);
					dropArea.removeClass('panel-indicator-left-bottom');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM){
					selfRef.state = 5;
					selfRef.tab.append(ui.draggable, 7);
					dropArea.removeClass('panel-indicator-bottom-left');
				}
			} else if (selfRef.state == 8){
				if (position == sewi.constants.DROP_AREA_POSITIONS.RIGHT){
					selfRef.state = 7;
					selfRef.tab.append(ui.draggable, 8);
					dropArea.removeClass('panel-indicator-right-bottom');
				} else if (position == sewi.constants.DROP_AREA_POSITIONS.BOTTOM){
					selfRef.state = 6;
					selfRef.tab.append(ui.draggable, 8);
					dropArea.removeClass('panel-indicator-bottom-right');
				}
			}
		},
	});
}

sewi.TabPanel.prototype.setPanelDOM = function(state){
	var selfRef = this;
	var DOM = $('<div class="animated panel"></div>');
	switch(state){
		case 0: 
			DOM.addClass('panel-full');
			break;
		case 1:
			DOM.addClass('panel-left');
			break;
		case 2: 
			DOM.addClass('panel-right');
			break;
		case 3:
			DOM.addClass('panel-bottom');
			break;
		case 4:
			DOM.addClass('panel-top');
			break;
		case 5:
			DOM.addClass('panel-top-left');
			break;
		case 6:
			DOM.addClass('panel-top-right');
			break;
		case 7:
			DOM.addClass('panel-bottom-left');
			break;
		case 8:
			DOM.addClass('panel-bottom-right');
			break;
	}
	return DOM;
}

sewi.TabPanel.prototype.getDOM = function(){
	return this.panel;
}

// Tab class
sewi.Tab = function(tabContainer, id, name, hasDropArea){
	var selfRef = this;
	selfRef.tabContainer = tabContainer;
	selfRef.panelList=[];
	selfRef.tabButton = $('<li class="tab-button"><a href="#'+id+'" role="tab" data-toggle="tab">'+name+'</a></li>');
	selfRef.tabPanel = $('<div class="tab-pane" id="'+id+'"><div class="panel-content">'+name+'</div></div>');
	
	// constant variables
	selfRef.DROP_AREA_HOVER_STR = 'panel-drop-area-hover';
	selfRef.PANEL_STR = 'panel';
	selfRef.DROP_AREA_STR = '<div class="panel-drop-area panel-drop-area-full"></div>';


	var removeButton={  	tabRef : selfRef,
				containerRef : tabContainer,
				tabButton : selfRef.tabButton,
				tabPanel : selfRef.tabPanel,
				      DOM : $('<span class="glyphicon glyphicon-remove"></span>')};
	
	selfRef.tabButtonEvent = function(){
		selfRef.tabContainer.setCurrentActiveTab(selfRef);
	}	

	if(hasDropArea){
		var dropAreaDOM = $(selfRef.DROP_AREA_STR);
		selfRef.tabPanel.append(dropAreaDOM);
		selfRef.setDroppable(dropAreaDOM);
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
	var id = DOMObject.attr('data-resId');
	var type = DOMObject.attr('data-resType');
	var obj = $('<div class="dummy-obj"></div>');
	selfRef.setPanel(obj, state);
}

sewi.Tab.prototype.setPanel = function(DOMObject, state){
	var selfRef = this;
	var panel = new sewi.TabPanel(DOMObject, selfRef, state);			
	selfRef.tabPanel.append(panel.getDOM());
	selfRef.panelList.push(panel);
	console.log(selfRef.panelList.length);
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

sewi.Tab.prototype.setDroppable = function(dropArea){
	var selfRef = this;
	dropArea.droppable({
		drop: function(event, ui){
			event.preventDefault();
			dropArea.remove();
			selfRef.append(ui.draggable, 0);
			selfRef.tabPanel.children('.panel-indicator').remove();
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
	if(selfRef.tabs.length < sewi.constants.MAX_NUM_TABS){
		var newTab = new sewi.Tab(selfRef, tabName, tabText, hasDropArea);
		selfRef.tabs.push(newTab);

		if (active) selfRef.setCurrentActiveTab(newTab);	
	
		var lastIndex = selfRef.tabButtons.length-1;	
		newTab.tabButton.insertBefore(selfRef.tabButtons[lastIndex]);
		selfRef.tabContent.append(newTab.tabPanel);

		if(selfRef.tabs.length == sewi.constants.MAX_NUM_TABS){
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

sewi.TabContainer.prototype.addObjectToNewTab = function(id, type, DOMObject){
	var selfRef = this;
	selfRef.addNewTab("Tab"+selfRef.counter,"", true, false);
	selfRef.currentActiveTab.append(DOMObject, 0);
}
