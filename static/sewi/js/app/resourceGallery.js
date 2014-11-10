var sewi = sewi || {};

(function() {


  sewi.ResourceGallery = function(options) {

    sewi.ConfiguratorElement.call(this);
    initDOM.call(this);
    this.encounterID = options['encounterId'];
    this.resources = [];

  }

  sewi.inherits(sewi.ResourceGallery, sewi.ConfiguratorElement);


  function initDOM() {
    this.mainDOMElement
      .addClass(sewi.constants.RESOURCE_GALLERY_DOM_CLASS);

  }

  function loadResourceGallery() {
    var resourceGalleryURL = sewi.constants.ENCOUNTER_BASE_URL + this.encounterID + sewi.constants.RESOURCE_GALLERY_URL_SUFFIX;

    $.ajax({
        dataType: 'json',
        type: 'GET',
        async: true,
        url: resourceGalleryURL
      }).done(loadSuccessful.bind(this))
      .fail(loadFailed.bind(this));
  }

  function loadSuccessful(data){
    retrieveResources.call(this, data);

  }

  function loadFailed() {
    this.mainDOMElement.trigger('Error');
  }

  function generateThumbnails(resourceGalleryData) {
    var selfRef = this;
    $.each(resourceGalleryData, function(index, value) {
      var thumbnailURL = sewi.constants.RESOURCE_GALLERY_THUMBNAIL_URL_BASE + value['type'] + '/' + value['id'] + sewi.constants.RESOURCE_GALLERY_THUMBNAIL_URL_SUFFIX;
      $.ajax({
          dataType: '',
          type: 'GET',
          url: thumbnailURL

        }).done(addThumbnail.bind(selfRef.resources[index]))
        .fail(thumbnailError.bind(selfRef.resources[index]));
    });

  }

  function addThumbnail(data) {
    $(this).find('img').attr('src', data);
  }

  function thumbnailError() {
    $(this).find('img').attr('src', sewi.constants.RESOURCE_GALLERY_DEFAULT_THUMBNAIL);
  }


  function retrieveResources(resourceGalleryData) {
    var selfRef = this;
    $.each(resourceGalleryData, function(index, value) {

      var resourceContainer = selfRef.mainDOMElement;

      var resource = $(sewi.constants.RESOURCE_GALLERY_RESOURCE_DOM)
        .attr(sewi.constants.RESOURCE_INFO_RESOURCE_ID, value['id'])
        .attr(sewi.constants.RESOURCE_INFO_RESOURCE_TYPE, value['type'])
        .attr('title', sewi.constants.RESOURCE_GALLERY_TOOLTIP_HEADER + value['date'])
        .draggable({
          helper: 'clone',
          revert: 'invalid',
          appendTo: 'body',
          start: function(e, ui) {
            ui.helper.addClass('resource-dragged');
        }
        }).append($(sewi.constants.RESOURCE_GALLERY_RESOURCE_THUMBNAIL_DOM))
        .append($(sewi.constants.RESOURCE_GALLERY_RESOURCE_HEADER_DOM).text(value['name']));

      resource.on('dblclick', selfRef, selfRef.getResourceDOM);
      selfRef.resources.push(resource);
      resourceContainer.append(resource);

    });
    selfRef.addScrollbar();
    selfRef.addTooltips();
    generateThumbnails.call(selfRef, resourceGalleryData);
  }

  sewi.ResourceGallery.prototype.load = function() {

    loadResourceGallery.call(this);
    return this;
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
    selfRef.mainDOMElement.find('.' + sewi.constants.RESOURCE_GALLERY_RESOURCE_CLASS).tooltip({
      container: 'body',
      placement: 'left',
      appendTo: 'body'
    });
  }

  sewi.ResourceGallery.prototype.getResourceDOM = function(event) {
    event.data.mainDOMElement.trigger('resourceClick', jQuery(this));
  }
})();