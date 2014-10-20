var sewi = sewi || {};

(function() {
	sewi.ConfiguratorElement = function() {

		var selfRef = this;

		selfRef.mainDOMElement = $("<div></div>");
	}

	/**
	 * Retrieves the DOM element owned by this object.
	 * @return {jQuery} The DOM element container.
	 */
	sewi.ConfiguratorElement.prototype.getDOM = function() {
		return this.mainDOMElement;
	}

	/**
	 * Helper function for triggering an event on the main DOM element.
	 * Arguments are exactly like jQuery.fn.trigger()
	 */
	sewi.ConfiguratorElement.prototype.trigger = function() {
		this.mainDOMElement.trigger.apply(this.mainDOMElement, arguments);
	}

	/**
	* Helper function for triggering an event on the main DOM element.
	* Arguments are exactly like jQuery.fn.on()
	*/
	sewi.ConfiguratorElement.prototype.on = function() {
		this.mainDOMElement.on.apply(this.mainDOMElement, arguments);
	}
})();

(function(){
    sewi.ErrorScreen = function(){
        if(!(this instanceof sewi.ErrorScreen))
            return new sewi.ErrorScreen();

		sewi.ConfiguratorElement.call(this);

        var selfRef = this;

		initDOM.call(selfRef);

    }
	sewi.inherits(sewi.ErrorScreen, sewi.ConfiguratorElement);

	function initDOM() {
		var selfRef = this;

		selfRef.textElement = $(sewi.constants.ERROR_SCREEN_TEXT_DOM);
		selfRef.mainDOMElement.append(selfRef.textElement)
							  .addClass(sewi.constants.ERROR_SCREEN_CLASS);
	}

    sewi.ErrorScreen.prototype.setText = function(string){
        var selfRef = this;

		selfRef.textElement.text(string);
    }

})();

(function() {
	sewi.ResourceViewer = function() {
		sewi.ConfiguratorElement.call(this);

		var selfRef = this;

		setupDOM.call(selfRef);
		addButtons.call(selfRef);
		addErrorScreen.call(selfRef);
	}
	sewi.inherits(sewi.ResourceViewer, sewi.ConfiguratorElement);

	// ResourceViewer private methods
	function setupDOM() {
		var selfRef = this;

		selfRef.mainDOMOuterContainer = $("<div></div>");
        selfRef.mainDOMOuterContainer.addClass(sewi.constants.RESOURCE_VIEWER_CLASS)
                                     .append(selfRef.mainDOMElement);
	}

	function addButtons() {
		var selfRef = this;

		var closeButton = $(sewi.constants.RESOURCE_VIEWER_CLOSE_BUTTON_DOM);
		var fullscreenButton = $(sewi.constants.RESOURCE_VIEWER_FULLSCREEN_BUTTON_DOM);

		selfRef.buttonGroup = $(sewi.constants.RESOURCE_VIEWER_BUTTON_GROUP_DOM);
		selfRef.panel = $(sewi.constants.RESOURCE_VIEWER_PANEL_DOM);

		selfRef.buttonGroup.append(fullscreenButton)
			   .append(closeButton);

		selfRef.panel.append(selfRef.buttonGroup);

		selfRef.mainDOMOuterContainer.append(selfRef.panel);

		closeButton.click(closeButtonClicked.bind(selfRef));
		fullscreenButton.click(fullscreenButtonClicked.bind(selfRef));
	}

	function addErrorScreen() {
		var selfRef = this;

		selfRef.errorScreen = new sewi.ErrorScreen();
	}

	function closeButtonClicked() {
		var selfRef = this;

		selfRef.trigger('Closing');
	}

	function fullscreenButtonClicked() {
		var selfRef = this;

		selfRef.trigger('FullscreenToggled');
	}

	// Overrides getDOM of ConfiguratorElement
	sewi.ResourceViewer.prototype.getDOM = function() {
	    return this.mainDOMOuterContainer;
	}

	sewi.ResourceViewer.prototype.addDownloadButton = function(url) {
		var selfRef = this;

		if (!_.isString(url)) {
			throw new ValueError('URL must be a string');
		}

		if (selfRef.panel.has(sewi.constants.RESOURCE_VIEWER_DOWNLOAD_BUTTON_CLASS).length) {
			return;
		}

		var downloadButton = $(sewi.constants.RESOURCE_VIEWER_DOWNLOAD_BUTTON_DOM);
		downloadButton.addClass(sewi.constants.RESOURCE_VIEWER_DOWNLOAD_BUTTON_CLASS)
					  .attr('href', url);

		selfRef.buttonGroup.prepend(downloadButton);
	}

	sewi.ResourceViewer.prototype.showError = function(errorText) {
		var selfRef = this;
		var errorScreenElement = selfRef.errorScreen.getDOM();

		selfRef.errorScreen.setText(errorText);
		selfRef.mainDOMOuterContainer.append(errorScreenElement);
	}

	sewi.ResourceViewer.prototype.hideError = function() {
		var selfRef = this;
		var errorScreenElement = selfRef.errorScreen.getDOM();
		errorScreenElement.detach();
	}

	// Unimplemented methods, must be overridden by subclasses

	sewi.ResourceViewer.prototype.load = _.noop;
	sewi.ResourceViewer.prototype.resize = _.noop;
})();
