var sewi = sewi || {}; 
sewi.TabContainer = function(){
	var selfRef = this;
	var currentActiveTab;
	selfRef.container = $('<div class="tab-container"></div>');
	selfRef.tabButtonGroup = $('<ul id="tab-button-group" class="nav nav-tabs" role="tablist"></ul>');
	selfRef.tabContent = $('<div class="tab-content"></div>');
	
	selfRef.tabButtons=[];
	selfRef.tabContentPanels=[];	
	
	var addTabButton = $('<li><a role="tab" data-toggle="tab"><span class="glyphicon glyphicon-plus"></span></a></li>');
	addTabButton.on('click', function(){
		selfRef.addNewTab("Test","Test",false);	
	});
	selfRef.tabButtons.push(addTabButton);
	selfRef.tabButtonGroup.append(addTabButton);
	
	selfRef.addNewTab("tab1", "Tab 1", true);
	selfRef.addNewTab("tab2", "Tab 2", false);
	selfRef.addNewTab("tab3", "Tab 3", false);
	
	// Set the first panel as the current active panel
	selfRef.currentActiveTab = selfRef.tabContentPanels[0];
	
	selfRef.container.append(selfRef.tabButtonGroup);
	selfRef.container.append(selfRef.tabContent);
}

sewi.TabContainer.prototype.addNewTab = function(tabName, tabText, active){
	var selfRef = this;
	var buttonDom=$('<li><a href="#'+tabName+'" role="tab" data-toggle="tab">'+tabText+'<span class="glyphicon glyphicon-remove"></span></a></li>');
	var panelDom=$('<div class="tab-pane" id="'+tabName+'">'+tabText+'</div>');
	
	if(active){
		panelDom.addClass("active"); 
		buttonDom.addClass("active");
	}

	buttonDom.on('click', function(){
		selfRef.currentActiveTab.removeClass('active');
		selfRef.currentActiveTab = panelDom;
		selfRef.currentActiveTab.addClass('active');
	});
	
	var lastIndex = selfRef.tabButtons.length-1;
	buttonDom.insertBefore(selfRef.tabButtons[lastIndex]);
	selfRef.tabButtons.splice(lastIndex, 0, buttonDom);
	selfRef.tabContentPanels.push(panelDom);
	selfRef.tabContent.append(panelDom);
}

sewi.TabContainer.prototype.update = function(){
	var selfRef = this;
}

sewi.TabContainer.prototype.display = function(){
	return this.container;
}
