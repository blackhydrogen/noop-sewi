var sewi = sewi || {}; 
sewi.TabContainer = function(){
	var selfRef = this;
	var currentActiveTab;
	var currentActiveTabButton;
	var counter= 1;
	selfRef.container = $('<div class="tab-container"></div>');
	selfRef.tabButtonGroup = $('<ul id="tab-button-group" class="nav nav-tabs" role="tablist"></ul>');
	selfRef.tabContent = $('<div class="tab-content"></div>');
	
	selfRef.tabButtons=[];
	selfRef.tabContentPanels=[];	
	
	var addTabButton = $('<li><a class="add-tab-button"><span class="glyphicon glyphicon-plus"></span></a></li>');
	addTabButton.on('click', function(){
		selfRef.addNewTab("Tab"+counter,"Tab "+counter,true);
		counter++;
	});

	selfRef.tabButtons.push(addTabButton);
	selfRef.tabButtonGroup.append(addTabButton);
	
	selfRef.addNewTab("tab"+counter, "Tab "+counter, true);
	counter++;
	
	// Set the first panel as the current active panel
	//selfRef.currentActiveTab = selfRef.tabContentPanels[0];
	
	selfRef.container.append(selfRef.tabButtonGroup);
	selfRef.container.append(selfRef.tabContent);
}

sewi.TabContainer.prototype.addNewTab = function(tabName, tabText, active){
	var selfRef = this;
	var buttonDom=$('<li><a href="#'+tabName+'" role="tab" data-toggle="tab">'+tabText+'<span class="glyphicon glyphicon-remove"></span></a></li>');
	var panelDom=$('<div class="tab-pane" id="'+tabName+'">'+tabText+'</div>');
	
	if(active){
		selfRef.setCurrentActiveTab(panelDom); 
		selfRef.setCurrentActiveTabButton(buttonDom);
	}

	buttonDom.on('click', function(){
		selfRef.setCurrentActiveTab(panelDom);
		selfRef.setCurrentActiveTabButton(buttonDom);
	});
	
	var lastIndex = selfRef.tabButtons.length-1;
	buttonDom.insertBefore(selfRef.tabButtons[lastIndex]);
	selfRef.tabButtons.splice(lastIndex, 0, buttonDom);
	selfRef.tabContentPanels.push(panelDom);
	selfRef.tabContent.append(panelDom);
}

sewi.TabContainer.prototype.setCurrentActiveTab = function(DomObject){
	var selfRef = this;
	if(selfRef.currentActiveTab){
		selfRef.currentActiveTab.removeClass('active');
	}
	selfRef.currentActiveTab = DomObject;
	selfRef.currentActiveTab.addClass('active');
}

sewi.TabContainer.prototype.setCurrentActiveTabButton = function(DomObject){
	var selfRef = this;
	if(selfRef.currentActiveTabButton){
		selfRef.currentActiveTabButton.removeClass('active');
		//console.log("remove active from button");
	}
	selfRef.currentActiveTabButton = DomObject;
	selfRef.currentActiveTabButton.addClass('active');
}

sewi.TabContainer.prototype.update = function(){
	var selfRef = this;
}

sewi.TabContainer.prototype.getDom = function(){
	return this.container;
}
