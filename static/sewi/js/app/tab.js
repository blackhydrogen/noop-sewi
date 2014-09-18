var sewi = sewi || {}; 

// Tab class
sewi.Tab = function(tabContainer, id, name){
	var selfRef = this;
	selfRef.DROP_AREA_HOVER = 'panel-drop-area-hover';
	
	var dropAreaDOM = {
			Top : $('<div class="panel-drop-area panel-drop-area-top"></div>'),
			Bottom : $('<div class="panel-drop-area panel-drop-area-bottom"></div>'),
			Left : $('<div class="panel-drop-area panel-drop-area-left"></div>'),
			Right : $('<div class="panel-drop-area panel-drop-area-right"></div>')
		};

	selfRef.tabContainer = tabContainer;
	selfRef.tabButton = $('<li><a href="#'+id+'" role="tab" data-toggle="tab">'+name+'</a></li>');
	selfRef.tabPanel = $('<div class="tab-pane" id="'+id+'"><div class="panel-content">'+name+'</div></div>');
	
	var removeButton={  	tabRef : selfRef,
				containerRef : tabContainer,
				tabButton : selfRef.tabButton,
				tabPanel : selfRef.tabPanel,
				      DOM : $('<span class="glyphicon glyphicon-remove"></span>')};
	
	selfRef.tabButtonEvent = function(){
		selfRef.tabContainer.setCurrentActiveTab(selfRef);
	}	

	selfRef.tabPanel.append(dropAreaDOM.Top);
        selfRef.tabPanel.append(dropAreaDOM.Bottom);
	selfRef.tabPanel.append(dropAreaDOM.Left);
	selfRef.tabPanel.append(dropAreaDOM.Right);
	
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
		console.log("active");
		if(tabIndex == containerRef.tabs.length){
			containerRef.setCurrentActiveTab(containerRef.tabs[tabIndex-1]);
		} else {
			containerRef.setCurrentActiveTab(containerRef.tabs[tabIndex]);
		}
	} 

	if(containerRef.tabs.length == 0){
		selfRef.container.trigger("NoTabs");
	}
}

sewi.Tab.prototype.append = function(DOMObject){
	var selfRef = this;
	if(selfRef.isHover('.panel-drop-area-left')){
		console.log('left is active');
		if(selfRef.isHover('.panel-drop-area-top')){
			console.log('top is active');
		} else if(selfRef.isHover('.panel-drop-area-bottom')){
			console.log('bottom is active');
		}
	}
	
	if(selfRef.isHover('.panel-drop-area-right')){
		console.log('right is active');
		if(selfRef.isHover('.panel-drop-area-top')){
			console.log('top is active');
		} else if(selfRef.isHover('.panel-drop-area-bottom')){
			console.log('bottom is active');
		}
	}
	selfRef.tabPanel.append(DOMObject);
}

sewi.Tab.prototype.setDroppable = function(DOMObject){
	var selfRef = this;
	DOMObject.droppable({
		drop: function(event, ui){
					console.log(ui.draggable);
					selfRef.addResource(ui.draggable);
				},
		over: function(){	
		 },
		activeClass: 'panel-drop-area-visible',
		hoverClass: selfRef.DROP_AREA_HOVER
	});
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
	return selfRef.tabPanel.children(dropArea).hasClass(selfRef.DROP_AREA_HOVER);
}

sewi.Tab.prototype.setDroppable = function(DOMObject){
	var selfRef = this;
	DOMObject.droppable({
		drop: function(event, ui){
			console.log(ui.draggable);
			selfRef.append(ui.draggable);
		},
		over: function(){	
		 },
		activeClass: 'panel-drop-area-visible',
		hoverClass: selfRef.DROP_AREA_HOVER
	});
}

// tab container class
sewi.TabContainer = function(){
	var selfRef = this;
	var counter= 1;
	
	//Static String values
	selfRef.DROP_AREA_HOVER = 'panel-drop-area-hover';

	selfRef.currentActiveTab;
	selfRef.tabButtons=[];	
	selfRef.resourceList=[];

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
