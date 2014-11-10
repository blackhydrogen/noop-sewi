var sewi = sewi || {};

(function() {

  /**
   * A gallery that displays thumbnails for all the available resources
   *
   * @class sewi.ResourceGallery
   * @constructor
   * @extends sewi.ConfiguratorElement
   *
   * @param {Object} options Encounter information for the ResourceGallery
   * @param {string} options.encounterId The encounterId of the encounter
   */
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

  function loadSuccessful(data) {
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
        .fail(thumbnailImageError.bind(selfRef.resources[index]));
    });

  }

  function addThumbnail(data) {
    $(this).find('img').attr('src', data);
  }

  function thumbnailImageError() {
    // A default thumbnail image is shown for any resource without a thumbnail
    $(this).find('img').attr('src', sewi.constants.RESOURCE_GALLERY_DEFAULT_THUMBNAIL);
  }


  function retrieveResources(resourceGalleryData) {
    $.each(resourceGalleryData, appendResourceToDOM.bind(this));
    this.addScrollbar();
    this.addTooltips();
    generateThumbnails.call(this, resourceGalleryData);
  }

  function appendResourceToDOM(index, value) {
    var resourceContainer = this.mainDOMElement;

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

    resource.on('dblclick', this, getResourceDOM);
    this.resources.push(resource);
    resourceContainer.append(resource);
  }

  /**
   * Fired when a resource is double clicked
   * @event resourceClick
   * @type {object}
   * @memberof sewi.ResourceGallery
   */
  function getResourceDOM(event) {
    event.data.mainDOMElement.trigger('resourceClick', $(this));
  }

  /**
   * Loads the resource gallery
   */
  sewi.ResourceGallery.prototype.load = function() {

    loadResourceGallery.call(this);
    return this;
  }

  /**
   * Adds a semi-transparent scroll bar to the resource gallery.
   */
  sewi.ResourceGallery.prototype.addScrollbar = function() {
    this.mainDOMElement.slimScroll({
      color: '#000',
      width: '100%',
      size: '4px',
      height: '100%'
    });
  }

  /**
   * Adds tooltips to every resource that displays meta-data about the data.
   */
  sewi.ResourceGallery.prototype.addTooltips = function() {
    this.mainDOMElement.find('.' + sewi.constants.RESOURCE_GALLERY_RESOURCE_CLASS).tooltip({
      container: 'body',
      placement: 'left',
      appendTo: 'body'
    });
  }
})();