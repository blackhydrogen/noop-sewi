var sewi = sewi || {};

sewi.ResourceGallery = function() {
  var selfRef = this;
  sewi.ConfiguratorElement.call(this);

  selfRef.resources = [];
  selfRef.resources.push('/static/sewi/js/app/Sample Resources/hands.jpg', '/static/sewi/js/app/Sample Resources/ecg.jpg', '/static/sewi/js/app/Sample Resources/video.jpg');

  selfRef.resourceHeaders = [];
  selfRef.resourceHeaders.push('X-Ray-Stub', 'ECG-Stub', 'Video-Stub');

  selfRef.resourceTypes = [];
  selfRef.resourceTypes.push('image', 'image', 'video');

  selfRef.metaData = [];
  selfRef.metaData.push('24/11/2013');
  selfRef.mainDOMElement
    .addClass(sewi.constants.RESOURCE_GALLERY_DOM_CLASS);
}

sewi.inherits(sewi.ResourceGallery, sewi.ConfiguratorElement);

sewi.ResourceGallery.prototype.load = function() {
  var selfRef = this;
  var resourceContainer = selfRef.mainDOMElement;
  for (var i = 0; i < selfRef.resources.length; i++) {
    var path = selfRef.resources[i];
    var resourceElement = $('<div>')
      .addClass(sewi.constants.RESOURCE_GALLERY_THUMBNAIL_CLASS)
      .attr('id', 'draggable')
      .attr('data-res-id', i)
      .attr('data-res-type', selfRef.resourceTypes[i])
      .attr('rel', 'tooltip')
      .attr('data-placement', 'bottom')
      .attr('title', 'Recorded on:' + selfRef.metaData[0])
      .draggable({
        helper: 'clone',
        revert: 'invalid',
        appendTo: "body"
      });

    resourceElement.append(
      $('<img>').attr('src', path).addClass(sewi.constants.RESOURCE_GALLERY_THUMBNAIL_IMAGE_CLASS)
    ).append(
      $('<p>').text(selfRef.resourceHeaders[i]).addClass(sewi.constants.RESOURCE_GALLERY_THUMBNAIL_HEADER_CLASS)
    );

    resourceElement.on('dblclick', selfRef, selfRef.getResourceDOM);
    resourceContainer.append(resourceElement);
  }

  selfRef.addScrollbar();
  selfRef.addTooltips();

}

sewi.ResourceGallery.prototype.addScrollbar = function() {
  var selfRef = this;
  selfRef.mainDOMElement.find('.'+ sewi.constants.RESOURCE_GALLERY_DOM_CLASS).slimScroll({
    color: '#000',
    width: '100%',
    size: '4px',
    height: '100%'
  });
}

sewi.ResourceGallery.prototype.addTooltips = function() {
  var selfRef = this;
  selfRef.mainDOMElement.find('.' + sewi.constants.RESOURCE_GALLERY_THUMBNAIL_CLASS).tooltip({
    html: true,
    trigger: 'hover'
  });
}

sewi.ResourceGallery.prototype.getResourceDOM = function(event) {
  event.data.mainDOMElement.trigger('resourceClick', jQuery(this));
}