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
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.ResourceGallery))
      return new sewi.ResourceGallery(options);

    sewi.ConfiguratorElement.call(this);
   
    var defaults = {};
    options = options || {};
    _.defaults(options, defaults);
    _.assign(this, _.pick(options, [
      'encounterId',
    ]));

    validateArguments.call(this);
    initDOM.call(this);
    this.resources = [];

  }

  sewi.inherits(sewi.ResourceGallery, sewi.ConfiguratorElement);

  function validateArguments() {
    if (!_.isString(this.encounterId)) {
      throw new Error('options: Valid encounter id must be provided.');
    }
  }

  function initDOM() {
    this.mainDOMElement
      .addClass(sewi.constants.RESOURCE_GALLERY_DOM_CLASS);

  }

  function loadResourceGallery() {
    var resourceGalleryURL = sewi.constants.ENCOUNTER_BASE_URL + this.encounterId + sewi.constants.RESOURCE_GALLERY_URL_SUFFIX;

    $.ajax({
        dataType: 'json',
        type: 'GET',
        async: true,
        url: resourceGalleryURL
      }).done(loadSuccessful.bind(this));
  }

  function loadSuccessful(data) {
    retrieveResources.call(this, data);

  }

  function retrieveResources(resourceGalleryData) {
    if(resourceGalleryData.length > 0){
      var resourceContainer = this.mainDOMElement;
      resourceContainer.append(sewi.constants.RESOURCE_GALLERY_DOUBLE_CLICK_INSTRUCTION_DOM);
    }
    $.each(resourceGalleryData, appendResourceToDOM.bind(this));
    generateThumbnails.call(this, resourceGalleryData);
    this.isResourceDraggable = false;
    this.addScrollbar();
    this.addTooltips();
    
  }

  function appendResourceToDOM(index, value) {
    var resourceContainer = this.mainDOMElement;
    var thumbnailContainer = $(sewi.constants.RESOURCE_GALLERY_RESOURCE_THUMBNAIL_DOM);
    var loadingImagePath = sewi.staticPath + sewi.constants.RESOURCE_GALLERY_LOADING_THUMBNAIL;
    thumbnailContainer.children('.' + sewi.constants.RESOURCE_GALLERY_THUMBNAIL_CLASS)
      .attr('src', loadingImagePath);
    var resource = $(sewi.constants.RESOURCE_GALLERY_RESOURCE_DOM)
      .attr(sewi.constants.RESOURCE_INFO_RESOURCE_ID, value['id'])
      .attr(sewi.constants.RESOURCE_INFO_RESOURCE_TYPE, value['type'])
      .attr('title', sewi.constants.RESOURCE_GALLERY_TOOLTIP_HEADER + value['date'])
      .append(thumbnailContainer)
      .append($(sewi.constants.RESOURCE_GALLERY_RESOURCE_HEADER_DOM).text(value['name']));

    resource.on('dblclick', this, getResourceDOM);
    this.resources.push(resource);
    resourceContainer.append(resource);
  }

  function generateThumbnails(resourceGalleryData) {
    var selfRef = this;
    $.each(resourceGalleryData, addThumbnailImageToResource.bind(this));
  }

  function addThumbnailImageToResource(index, value){
      var thumbnailURL = sewi.constants.RESOURCE_GALLERY_THUMBNAIL_URL_BASE + value['type'] + '/' + value['id'] + sewi.constants.RESOURCE_GALLERY_THUMBNAIL_URL_SUFFIX;
      $.ajax({
          dataType: '',
          type: 'GET',
          url: thumbnailURL

        }).done(addThumbnail.bind(this.resources[index]))
        .fail(thumbnailImageError.bind(this.resources[index]));    
  }

  function addThumbnail(data) {
    $(this).find('img').attr('src', data);
  }

  function thumbnailImageError() {
    // A default thumbnail image is shown for any resource without a thumbnail
    $(this).find('img').attr('src', sewi.staticPath + sewi.constants.RESOURCE_GALLERY_DEFAULT_THUMBNAIL);
  }
 
  function addDraggblePropertyToResource(index, value){

    value.draggable({
        helper: 'clone',
        revert: 'invalid',
        appendTo: 'body',
        start: function(e, ui) {
          ui.helper.addClass(sewi.constants.RESOURCE_GALLERY_RESOURCE_DRAGGED_CLASS);
          ui.helper.find('.' + sewi.constants.RESOURCE_GALLERY_THUMBNAIL_CONTAINER_CLASS)
          .addClass(sewi.constants.RESOURCE_GALLERY_THUMBNAIL_CONTAINER_DRAGGED_CLASS);
           ui.helper.find('.' + sewi.constants.RESOURCE_GALLERY_RESOURCE_HEADER_CLASS)
          .addClass(sewi.constants.RESOURCE_GALLERY_RESOURCE_HEADER_DRAGGED_CLASS);

        }
      });
  }

  function showDoubleClickInstruction(){
    this.mainDOMElement.find('.' + sewi.constants.RESOURCE_GALLERY_DOUBLE_CLICK_INSTRUCTION_CLASS).show();
  }

  function hideDoubleClickInstruction(){
    this.mainDOMElement.find('.' + sewi.constants.RESOURCE_GALLERY_DOUBLE_CLICK_INSTRUCTION_CLASS).hide();
  }

  function removeDraggblePropertyFromResource(index, value){
    value.draggable('destroy');
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

  // Resource gallery public methods
  /**
   * Loads the resource gallery
   */
  sewi.ResourceGallery.prototype.load = function() {

    loadResourceGallery.call(this);
    return this;
  }

  /**
   * Called when the resource gallery is maximized or minimized.
   * @param {boolean} isMinimized Tells whether the resource gallery is in the minimized or maximized state
   */
  sewi.ResourceGallery.prototype.resize = function(isMinimized){
    if(isMinimized){
      if(!this.isResourceDraggable){
        $.each(this.resources, addDraggblePropertyToResource);
        this.isResourceDraggable = true;
      }
      hideDoubleClickInstruction.call(this);

    }
    else{
      if(this.isResourceDraggable){
         $.each(this.resources, removeDraggblePropertyFromResource);
         this.isResourceDraggable = false;
      }
      showDoubleClickInstruction.call(this);
    }
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