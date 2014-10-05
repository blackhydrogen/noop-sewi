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
	
	selfRef.position = {TOP: 0, BOTTOM: 1, LEFT: 2, RIGHT: 3}; 
	
	selfRef.setDroppable(selfRef.panelDropAreaRight, selfRef.position.RIGHT);
	selfRef.setDroppable(selfRef.panelDropAreaLeft, selfRef.position.LEFT);
	selfRef.setDroppable(selfRef.panelDropAreaTop, selfRef.position.TOP);
	selfRef.setDroppable(selfRef.panelDropAreaBottom, selfRef.position.BOTTOM);
	
	selfRef.panel.append(selfRef.panelDropAreaRight);
	selfRef.panel.append(selfRef.panelDropAreaLeft);
	selfRef.panel.append(selfRef.panelDropAreaTop);
	selfRef.panel.append(selfRef.panelDropAreaBottom);

	selfRef.panel.append(DOMObject);
}

sewi.TabPanel.prototype.setDroppable = function(dropArea, position){
	var selfRef = this;
	dropArea.droppable({
		drop: function(event, ui){
			event.preventDefault();
			console.log(ui.draggable);
			if(selfRef.state == 0){
				if(position == selfRef.position.RIGHT){
					console.log("dropped");
					selfRef.tab.append(ui.draggable, 2);
					selfRef.tab.tabPanel.children('.panel-indicator-right').remove();
				} else if (position == selfRef.position.LEFT){
					selfRef.tab.append(ui.draggable, 1);
					selfRef.tab.tabPanel.children('.panel-indicator-left').remove();
				} else if (position == selfRef.position.TOP){
					selfRef.tab.append(ui.draggable, 3);
					selfRef.tab.tabPanel.children('.panel-indicator-top').remove();
				} else if (position == selfRef.position.BOTTOM){
					selfRef.tab.append(ui.draggable, 4);
					selfRef.tab.tabPanel.children('.panel-indicator-bottom').remove();
				}
			}
		},
		over: function(event, ui){
			event.preventDefault();
			if(selfRef.state == 0){
				if(position == selfRef.position.RIGHT){
					selfRef.panel.addClass('panel-left').removeClass('panel-full');
					selfRef.tab.tabPanel.append($('<div class="panel-indicator-right"></div>'));
				} else if (position == selfRef.position.LEFT){
					selfRef.panel.addClass('panel-right').removeClass('panel-full');
					selfRef.tab.tabPanel.append($('<div class="panel-indicator-left"></div>'));
				} else if (position == selfRef.position.TOP){
					selfRef.panel.addClass('panel-bottom').removeClass('panel-full');
					selfRef.tab.tabPanel.append($('<div class="panel-indicator-top"></div>'));
				} else if (position == selfRef.position.BOTTOM){
					selfRef.panel.addClass('panel-top').removeClass('panel-full');
					selfRef.tab.tabPanel.append($('<div class="panel-indicator-bottom"></div>'));	
				}
			}
		},
		out: function(event, ui){
			if(selfRef.state == 0){
				if(position == selfRef.position.RIGHT){
					selfRef.panel.addClass('panel-full').removeClass('panel-left');
					selfRef.tab.tabPanel.children('.panel-indicator-right').remove();
				} else if (position == selfRef.position.LEFT){
					selfRef.panel.addClass('panel-full').removeClass('panel-right');
					selfRef.tab.tabPanel.children('.panel-indicator-left').remove();
				} else if (position == selfRef.position.TOP){
					selfRef.panel.addClass('panel-full').removeClass('panel-bottom');
					selfRef.tab.tabPanel.children('.panel-indicator-top').remove();
				} else if (position == selfRef.position.BOTTOM){
					selfRef.panel.addClass('panel-full').removeClass('panel-top');
					selfRef.tab.tabPanel.children('.panel-indicator-bottom').remove();
				}
			}
		}
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
			DOM.addClass('panel-top');
			break;
		case 4:
			DOM.addClass('panel-bottom');
			break;
	}
	return DOM;
}

sewi.TabPanel.prototype.getDOM = function(){
	return this.panel;
}

// Tab class
sewi.Tab = function(tabContainer, id, name){
	var selfRef = this;
	selfRef.tabContainer = tabContainer;
	selfRef.panelList=[];
	selfRef.tabButton = $('<li><a href="#'+id+'" role="tab" data-toggle="tab">'+name+'</a></li>');
	selfRef.tabPanel = $('<div class="tab-pane" id="'+id+'"><div class="panel-content">'+name+'</div></div>');
	
	// constant variables
	selfRef.DROP_AREA_HOVER_STR = 'panel-drop-area-hover';
	selfRef.PANEL_STR = 'panel';
	selfRef.DROP_AREA_STR = '<div class="panel-drop-area panel-drop-area-full"></div>';

	var dropAreaDOM = $(selfRef.DROP_AREA_STR);

	var removeButton={  	tabRef : selfRef,
				containerRef : tabContainer,
				tabButton : selfRef.tabButton,
				tabPanel : selfRef.tabPanel,
				      DOM : $('<span class="glyphicon glyphicon-remove"></span>')};
	
	selfRef.tabButtonEvent = function(){
		selfRef.tabContainer.setCurrentActiveTab(selfRef);
	}	

	selfRef.tabPanel.append(dropAreaDOM);
	selfRef.setDroppable(dropAreaDOM);

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

	if(containerRef.currentActiveTab == selfRef){
		if(tabIndex == containerRef.tabs.length){
			containerRef.setCurrentActiveTab(containerRef.tabs[tabIndex-1]);
		} else {
			containerRef.setCurrentActiveTab(containerRef.tabs[tabIndex]);
		}
	} 

	if(containerRef.tabs.length == 0){
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
		selfRef.addNewTab("Tab"+selfRef.counter,"",true);
		selfRef.counter++;
	});

	selfRef.tabButtons.push(addTabButton);
	selfRef.tabButtonGroup.append(addTabButton);
			
	selfRef.container.append(selfRef.tabButtonGroup);
	selfRef.container.append(selfRef.tabContent);

}

sewi.TabContainer.prototype.addNewTab = function(tabName, tabText, active){
	var selfRef = this;
	var newTab = new sewi.Tab(selfRef, tabName, tabText);
	selfRef.tabs.push(newTab);

	if(active) selfRef.setCurrentActiveTab(newTab);	
	
	var lastIndex = selfRef.tabButtons.length-1;	
	newTab.tabButton.insertBefore(selfRef.tabButtons[lastIndex]);
	selfRef.tabContent.append(newTab.tabPanel);
}

sewi.TabContainer.prototype.setCurrentActiveTab = function(tab){
	var selfRef = this;	
	if(selfRef.currentActiveTab){
		selfRef.currentActiveTab.deactivate();
	}
	selfRef.currentActiveTab = tab;
	if(tab){
		selfRef.currentActiveTab.activate();
	}
}

sewi.TabContainer.prototype.getDOM = function(){
	return this.container;
}

sewi.TabContainer.prototype.addObjectToNewTab = function(id, type, DOMObject){
	var selfRef = this;
	selfRef.addNewTab("Tab"+selfRef.counter,"", true);
	selfRef.currentActiveTab.append(DOMObject, 0);
}
