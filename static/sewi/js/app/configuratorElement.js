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

(function() {
	sewi.ResourceViewer = function() {
		sewi.ConfiguratorElement.call(this);

		var selfRef = this;

		setupDOM.call(selfRef);
		addButtons.call(selfRef);
	}
	sewi.inherits(sewi.ResourceViewer, sewi.ConfiguratorElement);

	// ResourceViewer private methods
	function setupDOM() {
		var selfRef = this;

		selfRef.mainDOMElement.addClass(sewi.constants.RESOURCE_VIEWER_CLASS);
	}

	function addButtons() {
		var selfRef = this;

		var closeButton = $(sewi.constants.RESOURCE_VIEWER_CLOSE_BUTTON_DOM);
		var fullscreenButton = $(sewi.constants.RESOURCE_VIEWER_FULLSCREEN_BUTTON_DOM);

		var panel = $(sewi.constants.RESOURCE_VIEWER_PANEL_DOM);

		panel.append(closeButton)
			.append(fullscreenButton);

		selfRef.mainDOMElement.append(panel);

		closeButton.click(closeButtonClicked.bind(selfRef));
		fullscreenButton.click(fullscreenButtonClicked.bind(selfRef));
	}

	function closeButtonClicked() {
		var selfRef = this;

		selfRef.trigger('Closing');
	}

	function fullscreenButtonClicked() {
		var selfRef = this;

		selfRef.trigger('FullscreenToggled');
	}
})();
