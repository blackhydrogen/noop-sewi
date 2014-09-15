var sewi = sewi || {}; 
sewi.TabContainer = function(){
	var selfRef = this;
	var counter= 1;
	
	selfRef.currentActiveTab;
	selfRef.currentActiveTabButton;
	selfRef.tabButtons=[];
	selfRef.tabContentPanels=[];	
	selfRef.resourceList=[];

	selfRef.container = $('<div class="tab-container"></div>');
	selfRef.tabButtonGroup = $('<ul id="tab-button-group" class="nav nav-tabs" role="tablist"></ul>');
	selfRef.tabContent = $('<div class="tab-content"></div>');
	
	selfRef.removeEvent = function(event){
		var removeButton = event.data;
		console.log(event.data);
		var buttonIndex = selfRef.tabButtons.indexOf(removeButton.tabButton);
		var panelIndex = selfRef.tabContentPanels.indexOf(removeButton.tabPanel);
		
		removeButton.tabPanel.remove();
		removeButton.tabButton.remove();
		
		selfRef.tabButtons.splice(buttonIndex, 1);
		selfRef.tabContentPanels.splice(panelIndex, 1);
	
		if(selfRef.currentActiveTabButton == removeButton.tabButton){
			if(buttonIndex==selfRef.tabButtons.length-1){
				selfRef.setCurrentActiveTab(selfRef.tabContentPanels[panelIndex-1]);
				selfRef.setCurrentActiveTabButton(selfRef.tabButtons[buttonIndex-1]);
			} else {
				selfRef.setCurrentActiveTab(selfRef.tabContentPanels[panelIndex]);
				selfRef.setCurrentActiveTabButton(selfRef.tabButtons[buttonIndex]);
			}
		} 

		if(selfRef.tabButtons.length == 1){
			selfRef.container.trigger("NoTabs");
		}
	}

	selfRef.tabButtonEvent = function(event){
		selfRef.setCurrentActiveTab(event.data.panelDOM);
		selfRef.setCurrentActiveTabButton(event.data.buttonDOM);
	}

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
	var buttonDOM=$('<li><a href="#'+tabName+'" role="tab" data-toggle="tab">'+tabText+'</a></li>');
	var dropAreaDOM = $('<div class="panel-drop-area"></div>');
	var panelDOM=$('<div class="tab-pane" id="'+tabName+'"><div class="panel-content">'+tabText+'</div></div>');
	var removeButton={ tabButton : buttonDOM,
			tabPanel : panelDOM,
				DOM : $('<span class="glyphicon glyphicon-remove"></span>')};
	
	
	panelDOM.prepend(dropAreaDOM);

	if(active){
		selfRef.setCurrentActiveTab(panelDOM); 
		selfRef.setCurrentActiveTabButton(buttonDOM);
	}
	
	dropAreaDOM.droppable({
			drop : function(event, ui){
				// TO DO: initialize the component based on the type and id.
				console.log(ui.draggable);
			},
			over : function(){
				console.log("HOVER!!!");
			},
			activeClass : 'panel-drop-area-visible'
	});

	buttonDOM.children('a').append(removeButton.DOM);	
	removeButton.DOM.on('click', removeButton, selfRef.removeEvent);
	buttonDOM.on('click',{ buttonDOM : buttonDOM, panelDOM : panelDOM }, selfRef.tabButtonEvents);

	var lastIndex = selfRef.tabButtons.length-1;
	buttonDOM.insertBefore(selfRef.tabButtons[lastIndex]);
	selfRef.tabButtons.splice(lastIndex, 0, buttonDOM);
	selfRef.tabContentPanels.push(panelDOM);
	selfRef.tabContent.append(panelDOM);
}

sewi.TabContainer.prototype.setCurrentActiveTab = function(DOMObject){
	var selfRef = this;
	if(selfRef.currentActiveTab){
		selfRef.currentActiveTab.removeClass('active');
	}
	selfRef.currentActiveTab = DOMObject;
	if(DOMObject){
		selfRef.currentActiveTab.addClass('active');
	}
}

sewi.TabContainer.prototype.setCurrentActiveTabButton = function(DOMObject){
	var selfRef = this;
	if(selfRef.currentActiveTabButton){
		selfRef.currentActiveTabButton.removeClass('active');
	}
	selfRef.currentActiveTabButton = DOMObject;
	if(DOMObject){
		selfRef.currentActiveTabButton.addClass('active');
	}
}

sewi.TabContainer.prototype.addResource = function(DOMObject){
	var selfRef = this;
	selfRef.currentActiveTab.append(DOMObject);
}

sewi.TabContainer.prototype.update = function(){
	var selfRef = this;
}

sewi.TabContainer.prototype.getDOM = function(){
	return this.container;
}
