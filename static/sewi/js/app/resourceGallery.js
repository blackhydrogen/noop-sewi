
var sewi = sewi || {}; 
sewi.ResourceGallery = function(){
	var selfRef = this;
	
	selfRef.resources = [];
	selfRef.resources.push("Sample Resources/hands.jpg", "Sample Resources/ecg.jpg", "Sample Resources/video.jpg");
	selfRef .resourceHeaders = [];
	selfRef.resourceHeaders.push("X-Ray-Stub", "ECG-Stub", "Video-Stub");

	selfRef.container = $('<div>').addClass('resource-explorer-container').attr('id' ,"scrollable-div");	
	selfRef.loadResources();

		 $('#scrollable-div').slimScroll({
        color: '#fff',
        width: '72px', 
        size: '4px', 
        height: '350px'
    });
}

sewi.ResourceGallery.prototype.loadResources = function(){
		var selfRef = this;
		for(var i=0;i<selfRef.resources.length;i++){
			var path = selfRef.resources[i];
		    var resourceElement = $('<div>')
			.addClass('resource')
			.attr("data-res-id" ,i)
			.attr("data-res-type", "image");			
			//.draggable({ helper: 'clone'});
			
			resourceElement.on('dblclick', getResourceDom);

		resourceElement.append(
			$('<img>').attr('src', path).addClass('media-thumbnail')
		).append(
			$('<p>').text(selfRef.resourceHeaders[i]).addClass('media-body')
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
