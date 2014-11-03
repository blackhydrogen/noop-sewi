var sewi = sewi || {};

sewi.ResourceGallery = function() {
  var selfRef = this;
  sewi.ConfiguratorElement.call(this);

  selfRef.resources = [];
  selfRef.resources.push('/static/sewi/js/app/Sample Resources/hands.jpg', '/static/sewi/js/app/Sample Resources/ecg.jpg', '/static/sewi/js/app/Sample Resources/video.jpg', '/static/sewi/js/app/Sample Resources/video.jpg');

  selfRef.resourceHeaders = [];
  selfRef.resourceHeaders.push('X-Ray-Stub', 'ECG-Stub', 'Video-Stub', 'Audio-Stub');

  selfRef.resourceTypes = [];
  selfRef.resourceTypes.push('image', 'chart', 'video', 'audio');

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
      .attr('data-container', 'body')
      .draggable({
        helper: 'clone',
        revert: 'invalid',
        appendTo: 'body',
        start: function(e, ui) {
          ui.helper.addClass(sewi.constants.RESOURCE_GALLERY_DRAGGED_THUMBNAIL_CLASS)
            .removeClass(sewi.constants.RESOURCE_GALLERY_THUMBNAIL_CLASS);
        }
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
  selfRef.mainDOMElement.slimScroll({
    color: '#000',
    width: '100%',
    size: '4px',
    height: '100%'
  });
}

sewi.ResourceGallery.prototype.addTooltips = function() {
  var selfRef = this;
  selfRef.mainDOMElement.find('.' + sewi.constants.RESOURCE_GALLERY_THUMBNAIL_CLASS).tooltip({
    container: 'body',
    title: ('Recorded on:' + selfRef.metaData[0]),
    placement: 'left'
  });
}

sewi.ResourceGallery.prototype.getResourceDOM = function(event) {
  event.data.mainDOMElement.trigger('resourceClick', jQuery(this));
}