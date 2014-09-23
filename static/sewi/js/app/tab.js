var sewi = sewi || {}; 

// Tab class
sewi.Tab = function(tabContainer, id, name){
	var selfRef = this;
	selfRef.tabContainer = tabContainer;
	selfRef.panelList=[];
	selfRef.tabButton = $('<li><a href="#'+id+'" role="tab" data-toggle="tab">'+name+'</a></li>');
	selfRef.tabPanel = $('<div class="tab-pane" id="'+id+'"><div class="panel-content">'+name+'</div></div>');
	
	// constant variables
	selfRef.DROP_AREA_HOVER_STR = 'panel-drop-area-hover';
	selfRef.DROP_AREA_TOP_STR = '<div class="panel-drop-area panel-drop-area-top"></div>';
	selfRef.DROP_AREA_BOTTOM_STR = '<div class="panel-drop-area panel-drop-area-bottom"></div>';
	selfRef.DROP_AREA_LEFT_STR = '<div class="panel-drop-area panel-drop-area-left"></div>';
	selfRef.DROP_AREA_RIGHT_STR = '<div class="panel-drop-area panel-drop-area-right"></div>'
	selfRef.PANEL_STR = 'panel';
	selfRef.PANEL_TOP_STR = 'panel-top';
	selfRef.PANEL_BOTTOM_STR = 'panel-bottom';
	selfRef.PANEL_LEFT_STR = 'panel-left';
	selfRef.PANEL_RIGHT_STR = 'panel-right';
	selfRef.PANEL_TOP_RIGHT_STR = 'panel-top-right';
	selfRef.PANEL_TOP_LEFT_STR = 'panel-top-left';
	selfRef.PANEL_BOTTOM_RIGHT_STR = 'panel-bottom-right';
	selfRef.PANEL_BOTTOM_LEFT_STR = 'panel-bottom-left';
	
	var dropAreaDOM = {
			Top : $(selfRef.DROP_AREA_TOP_STR),
			Bottom : $(selfRef.DROP_AREA_BOTTOM_STR),
			Left : $(selfRef.DROP_AREA_LEFT_STR),
			Right : $(selfRef.DROP_AREA_RIGHT_STR)
		};

	
	var removeButton={  	tabRef : selfRef,
				containerRef : tabContainer,
				tabButton : selfRef.tabButton,
				tabPanel : selfRef.tabPanel,
				      DOM : $('<span class="glyphicon glyphicon-remove"></span>')};
	
	selfRef.tabButtonEvent = function(){
		selfRef.tabContainer.setCurrentActiveTab(selfRef);
	}	

	selfRef.tabPanel.append(dropAreaDOM.Left);
	selfRef.tabPanel.append(dropAreaDOM.Right);
	selfRef.tabPanel.append(dropAreaDOM.Top);
        selfRef.tabPanel.append(dropAreaDOM.Bottom);
	
	
	selfRef.setDroppable(dropAreaDOM.Top);
	selfRef.setDroppable(dropAreaDOM.Bottom);
	selfRef.setDroppable(dropAreaDOM.Left);
	selfRef.setDroppable(dropAreaDOM.Right);	

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

sewi.Tab.prototype.append = function(DOMObject, dropArea){
	var selfRef = this;
	console.log(dropArea);
	if(dropArea.hasClass('panel-drop-area-left')){
		console.log('dropped at left');
		if(selfRef.panelList.length == 0){
			selfRef.setPanels([], [], selfRef.PANEL_STR, DOMObject);
		} else if (selfRef.panelList.length == 1){
			selfRef.setPanels([selfRef.PANEL_STR],[selfRef.PANEL_RIGHT_STR], selfRef.PANEL_LEFT_STR, DOMObject);	

		}  else if (selfRef.panelList.length == 2){
			if(selfRef.tabPanel.children('.panel-top').length > 0){
				selfRef.setPanels([selfRef.PANEL_TOP_STR, selfRef.PANEL_BOTTOM_STR],
						[selfRef.PANEL_TOP_RIGHT_STR, selfRef.PANEL_BOTTOM_RIGHT_STR], 
						selfRef.PANEL_LEFT_STR, 
						DOMObject);
			} else {
				selfRef.setPanels([selfRef.PANEL_RIGHT_STR,selfRef.PANEL_LEFT_STR],
						[selfRef.PANEL_TOP_RIGHT_STR, selfRef.PANEL_BOTTOM_LEFT_STR],
						selfRef.PANEL_LEFT_STR,
						 DOMObject);
			}			

		}  else if (selfRef.panelList.length == 3){
			if(selfRef.tabPanel.children('.panel-top').length > 0){
				selfRef.setPanels([selfRef.PANEL_TOP_STR],
						[selfRef.PANEL_TOP_RIGHT_STR],
						selfRef.PANEL_TOP_LEFT_STR, 
							DOMObject);
			} else if(selfRef.tabPanel.children('.panel-bottom').length > 0){
				selfRef.setPanels([selfRef.PANEL_BOTTOM_STR],
						[selfRef.PANEL_BOTTOM_RIGHT_STR],
						selfRef.PANEL_BOTTOM_LEFT_STR, 
							DOMObject);
			} else if(selfRef.tabPanel.children('.panel-right').length > 0){
				selfRef.setPanels([selfRef.PANEL_TOP_LEFT_STR, selfRef.PANEL_RIGHT_STR],
						[selfRef.PANEL_TOP_RIGHT_STR, selfRef.PANEL_BOTTOM_RIGHT_STR],
						selfRef.PANEL_TOP_LEFT_STR, 
							DOMObject);
			} else {
				selfRef.setPanels([selfRef.PANEL_LEFT_STR],
						[selfRef.PANEL_BOTTOM_LEFT_STR],
						selfRef.PANEL_TOP_LEFT_STR, 
							DOMObject);		
			}
		
		} else {
			selfRef.tabContainer.container.trigger("TabFull");		
		}
	} else if(dropArea.hasClass('panel-drop-area-top')){
		console.log('dropped at top');
		if(selfRef.panelList.length == 0){
			selfRef.setPanels([], [], selfRef.PANEL_STR, DOMObject);
		} else if (selfRef.panelList.length == 1){
			selfRef.setPanels([selfRef.PANEL_STR], [selfRef.PANEL_BOTTOM_STR], selfRef.PANEL_TOP_STR, DOMObject);

		}  else if (selfRef.panelList.length == 2){
			
			if(selfRef.tabPanel.children('.panel-top').length > 0){
				selfRef.setPanels([selfRef.PANEL_TOP_STR, selfRef.PANEL_BOTTOM_STR],
						[selfRef.PANEL_BOTTOM_LEFT_STR, selfRef.PANEL_BOTTOM_RIGHT_STR], 
						selfRef.PANEL_TOP_STR, 
						DOMObject);
			} else {
				selfRef.setPanels([selfRef.PANEL_RIGHT_STR,selfRef.PANEL_LEFT_STR],
						[selfRef.PANEL_BOTTOM_RIGHT_STR, selfRef.PANEL_BOTTOM_LEFT_STR],
						selfRef.PANEL_TOP_STR,
						 DOMObject);
			}	
		}  else if (selfRef.panelList.length == 3){
			if(selfRef.tabPanel.children('.panel-top').length > 0){
				selfRef.setPanels([selfRef.PANEL_TOP_STR],
						[selfRef.PANEL_TOP_RIGHT_STR],
						selfRef.PANEL_TOP_LEFT_STR, 
						DOMObject);
			} else if(selfRef.tabPanel.children('.panel-bottom').length > 0){
				selfRef.setPanels([selfRef.PANEL_BOTTOM_STR, selfRef.PANEL_TOP_LEFT_STR],
						[selfRef.PANEL_BOTTOM_RIGHT_STR, selfRef.PANEL_BOTTOM_LEFT_STR],
						selfRef.PANEL_TOP_LEFT_STR, 
						 DOMObject);
			} else if(selfRef.tabPanel.children('.panel-right').length > 0){
				selfRef.setPanels([selfRef.PANEL_RIGHT_STR], 
						[selfRef.PANEL_BOTTOM_RIGHT_STR], 
						selfRef.PANEL_TOP_RIGHT_STR, 
						DOMObject);
			} else {
				selfRef.setPanels([selfRef.PANEL_LEFT_STR],
						[selfRef.PANEL_BOTTOM_LEFT_STR],
						selfRef.PANEL_TOP_LEFT_STR,
						DOMObject);
			}
		} else {
			selfRef.tabContainer.container.trigger("TabFull");		
		}
	} else if(dropArea.hasClass('panel-drop-area-bottom')){
		console.log('dropped at bottom');
		if(selfRef.panelList.length == 0){
			selfRef.setPanels([], [], selfRef.PANEL_STR, DOMObject);
		} else if (selfRef.panelList.length == 1){
			selfRef.setPanels([selfRef.PANEL_STR], [selfRef.PANEL_TOP_STR], selfRef.PANEL_BOTTOM_STR, DOMObject);

		}  else if (selfRef.panelList.length == 2){
			if(selfRef.tabPanel.children('.panel-top').length > 0){
				selfRef.setPanels([selfRef.PANEL_TOP_STR, selfRef.PANEL_BOTTOM_STR],
						[selfRef.PANEL_TOP_LEFT_STR, selfRef.PANEL_TOP_RIGHT_STR], 
						selfRef.PANEL_BOTTOM_STR, 
						DOMObject);
			} else {
				selfRef.setPanels([selfRef.PANEL_RIGHT_STR,selfRef.PANEL_LEFT_STR],
						[selfRef.PANEL_TOP_RIGHT_STR, selfRef.PANEL_TOP_LEFT_STR],
						selfRef.PANEL_BOTTOM_STR,
						 DOMObject);
			}	
		
		}  else if (selfRef.panelList.length == 3){
			if(selfRef.tabPanel.children('.panel-top').length > 0){
				selfRef.setPanels([selfRef.PANEL_TOP_STR, selfRef.PANEL_BOTTOM_RIGHT_STR],
						[selfRef.PANEL_TOP_LEFT_STR, selfRef.PANEL_TOP_RIGHT_STR],
						selfRef.PANEL_BOTTOM_RIGHT_STR, 
						DOMObject);
			} else if(selfRef.tabPanel.children('.panel-bottom').length > 0){
				selfRef.setPanels([selfRef.PANEL_BOTTOM_STR],
						[selfRef.PANEL_BOTTOM_LEFT_STR],
						selfRef.PANEL_BOTTOM_RIGHT_STR,
						DOMObject);
			} else if(selfRef.tabPanel.children('.panel-right').length > 0){
				selfRef.setPanels([selfRef.PANEL_RIGHT_STR],
						[selfRef.PANEL_TOP_RIGHT_STR],
						selfRef.PANEL_BOTTOM_RIGHT_STR,
						DOMObject);
			} else {
				selfRef.setPanels([selfRef.PANEL_LEFT_STR],
						[selfRef.PANEL_TOP_LEFT_STR],
						selfRef.PANEL_BOTTOM_LEFT_STR,
						DOMObject);							
			}
		} else {
			selfRef.tabContainer.container.trigger("TabFull");		
		}	
	} else if(dropArea.hasClass('panel-drop-area-right')){
		console.log('dropped at right');
		if(selfRef.panelList.length == 0){
			selfRef.setPanels([], [], selfRef.PANEL_STR, DOMObject);
		} else if (selfRef.panelList.length == 1){
			selfRef.setPanels([selfRef.PANEL_STR], [selfRef.PANEL_LEFT_STR], selfRef.PANEL_RIGHT_STR, DOMObject);

		}  else if (selfRef.panelList.length == 2){
			if(selfRef.tabPanel.children('.panel-top').length > 0){
				selfRef.setPanels([selfRef.PANEL_TOP_STR, selfRef.PANEL_BOTTOM_STR],
						[selfRef.PANEL_TOP_LEFT_STR, selfRef.PANEL_BOTTOM_LEFT_STR], 
						selfRef.PANEL_RIGHT_STR, 
						DOMObject);
			} else {
				selfRef.setPanels([selfRef.PANEL_RIGHT_STR,selfRef.PANEL_LEFT_STR],
						[selfRef.PANEL_BOTTOM_LEFT_STR, selfRef.PANEL_TOP_LEFT_STR],
						selfRef.PANEL_RIGHT_STR,
						 DOMObject);
			}	
		}  else if (selfRef.panelList.length == 3){
			if(selfRef.tabPanel.children('.panel-top').length > 0){
				selfRef.setPanels([selfRef.PANEL_TOP_STR],
						[selfRef.PANEL_TOP_LEFT_STR],
						selfRef.PANEL_TOP_RIGHT_STR,
						DOMObject);
			} else if(selfRef.tabPanel.children('.panel-bottom').length > 0){
				selfRef.setPanels([selfRef.PANEL_BOTTOM_STR],
						[selfRef.PANEL_BOTTOM_LEFT_STR],
						selfRef.PANEL_BOTTOM_RIGHT_STR,
						DOMObject);
			} else if(selfRef.tabPanel.children('.panel-right').length > 0){
				selfRef.setPanels([selfRef.PANEL_RIGHT_STR],
						  [selfRef.PANEL_TOP_RIGHT_STR], 
						selfRef.PANEL_BOTTOM_RIGHT_STR,
						DOMObject);
			} else {
				selfRef.setPanels([selfRef.PANEL_LEFT_STR, selfRef.PANEL_BOTTOM_RIGHT_STR], 
						  [selfRef.PANEL_TOP_LEFT_STR, selfRef.PANEL_BOTTOM_LEFT_STR],
						selfRef.PANEL_BOTTOM_RIGHT_STR,
						DOMObject);
			}
						
		} else {
			selfRef.tabContainer.container.trigger("TabFull");		
		}
	}
}

sewi.Tab.prototype.setPanels = function(originalStrArr, replaceStrArr, newPanelStr, DOMObject){
	var selfRef = this;
	for(var i=0; i < originalStrArr.length; i++){
		selfRef.tabPanel.children('.'+originalStrArr[i]).attr('class', replaceStrArr[i]);
	}
	var panel = $('<div class="'+newPanelStr+'"></div>');
	panel.append(DOMObject);			
	selfRef.tabPanel.append(panel);
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

sewi.Tab.prototype.setDroppable = function(DOMObject){
	var selfRef = this;
	DOMObject.droppable({
		drop: function(event, ui){
			event.preventDefault();
			selfRef.append(ui.draggable, DOMObject);
		},
		activeClass: 'panel-drop-area-visible',
		hoverClass: selfRef.DROP_AREA_HOVER_STR
	});
}

// tab container class
sewi.TabContainer = function(){
	var selfRef = this;
	var counter= 1;
	
	selfRef.currentActiveTab;
	selfRef.tabButtons=[];	
	
	selfRef.tabs = [];

	selfRef.container = $('<div class="tab-container"></div>');
	selfRef.tabButtonGroup = $('<ul id="tab-button-group" class="nav nav-tabs" role="tablist"></ul>');
	selfRef.tabContent = $('<div class="tab-content"></div>');

	var addTabButton = $('<li><a class="add-tab-button"><span class="glyphicon glyphicon-plus"></span></a></li>');
	addTabButton.on('click', function(){
		selfRef.addNewTab("Tab"+counter,"Tab "+counter,true);
		counter++;
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
