var sewi = sewi || {};
sewi.ResourceGallery = function() {
    var selfRef = this;

    selfRef.resources = [];
    selfRef.resources.push('Sample Resources/hands.jpg', 'Sample Resources/ecg.jpg', 'Sample Resources/video.jpg');
    
    selfRef.resourceHeaders = [];
    selfRef.resourceHeaders.push('X-Ray-Stub', 'ECG-Stub', 'Video-Stub');

    selfRef.metaData = [];
    selfRef.metaData.push('24/11/2013');
    
    selfRef.container = $('<div>').addClass('resource-explorer-container').attr('id', 'scrollable-div');
    selfRef.loadResources();

    $('#scrollable-div').slimScroll({
        color: '#fff',
        width: '72px',
        size: '4px',
        height: '350px'
    });

    $("[rel='tooltip']").tooltip({
        html: true
    });
}

sewi.ResourceGallery.prototype.loadResources = function() {
    var selfRef = this;
    for (var i = 0; i < selfRef.resources.length; i++) {
        var path = selfRef.resources[i];
        var resourceElement = $('<div>')
            .addClass('resource')
            .attr('data-resId', i)
            .attr('data-resId', i)
            .attr('rel', 'tooltip')
            .attr('data-placement', 'left')
            .attr('title', 'Recorded on:' + selfRef.metaData[0])
        .draggable({
            helper: 'clone'
        });

        resourceElement.on('dblclick', getResourceDom);

        resourceElement.append(
            $('<img>').attr('src', path).addClass('media-thumbnail')
        ).append(
            $('<p>').text(selfRef.resourceHeaders[i]).addClass('media-body')
        );


        selfRef.container.append(resourceElement);
    }

}

sewi.ResourceGallery.prototype.update = function() {
    var selfRef = this;
}

sewi.ResourceGallery.prototype.getResourceDom = function() {
    return ($(this).attr('data-resId'));
}