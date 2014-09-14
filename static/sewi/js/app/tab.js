var sewi = sewi || {}; 
sewi.TabContainer = function(){
	var selfRef = this;
	var counter= 1;
	
	selfRef.currentActiveTab;
	selfRef.currentActiveTabButton;
	selfRef.tabButtons=[];
	selfRef.tabContentPanels=[];	
	
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
	
	selfRef.addNewTab("tab"+counter, "Tab "+counter, true);
	counter++;
		
	selfRef.container.append(selfRef.tabButtonGroup);
	selfRef.container.append(selfRef.tabContent);
}

sewi.TabContainer.prototype.addNewTab = function(tabName, tabText, active){
	var selfRef = this;
	var buttonDOM=$('<li><a href="#'+tabName+'" role="tab" data-toggle="tab">'+tabText+'</a></li>');
	var panelDOM=$('<div class="tab-pane" id="'+tabName+'">'+tabText+'</div>');
	var removeButton={ tabButton : buttonDOM,
						tabPanel : panelDOM,
						  	 DOM : $('<span class="glyphicon glyphicon-remove"></span>')};
	if(active){
		selfRef.setCurrentActiveTab(panelDOM); 
		selfRef.setCurrentActiveTabButton(buttonDOM);
	}
	
	buttonDOM.children('a').append(removeButton.DOM);
	
	removeButton.DOM.on('click', function(){
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
	});

	buttonDOM.on('click', function(){
		selfRef.setCurrentActiveTab(panelDOM);
		selfRef.setCurrentActiveTabButton(buttonDOM);
	});
	
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
