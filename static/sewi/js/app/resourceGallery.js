
var sewi = sewi || {}; 
sewi.ResourceGallery = function(){
	var selfRef = this;
	
	selfRef.resources = [];
	selfRef.resources.push("Sample Resources/hands.jpg", "Sample Resources/ecg.jpg", "Sample Resources/video.jpg");
	selfRef .resourceHeaders = [];
	selfRef.resourceHeaders.push("X-Ray-Stub", "ECG-Stub", "Video-Stub");

	selfRef.container = $('<div class="resource-explorer-container"></div>');	
	selfRef.loadResources();
}

sewi.ResourceGallery.prototype.loadResources = function(){
		var selfRef = this;
		for(var i=0;i<selfRef.resources.length;i++){
			var path = selfRef.resources[i];
		    var resourceElement = $('<div>')
			.addClass('resource')
			.attr("data-resId" ,i);			
			//.draggable({ helper: 'clone'});
			
			resourceElement.on('dblclick', getResourceDom);

		resourceElement.append(
			$('<img>').attr('src', path)
		).append(
			$('<p>').text(selfRef.resourceHeaders[i])
		);

		    
		    selfRef.container.append(resourceElement);
		}

}

sewi.ResourceGallery.prototype.update = function(){
	var selfRef = this;
}

sewi.ResourceGallery.prototype.getResourceDom = function(){
	return($(this).attr('data-resId'));
	}