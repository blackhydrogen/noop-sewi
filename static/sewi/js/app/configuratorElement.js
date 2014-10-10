var sewi = sewi || {};
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

sewi.ResourceViewer = function() {
	sewi.ConfiguratorElement.call(this);

	var selfRef = this;

	setupDOM();
	addButtons();

	function setupDOM() {
		selfRef.mainDOMElement.addClass(sewi.constants.RESOURCE_VIEWER_CLASS);
	}

	function addButtons() {
		var closeButton = $(sewi.constants.RESOURCE_VIEWER_CLOSE_BUTTON_DOM);
		var fullscreenButton = $(sewi.constants.RESOURCE_VIEWER_FULLSCREEN_BUTTON_DOM);
		var moveButton = $(sewi.constants.RESOURCE_VIEWER_MOVE_BUTTON_DOM);

		var panel = $(sewi.constants.RESOURCE_VIEWER_PANEL_DOM);

		panel.append(closeButton)
			 .append(fullscreenButton)
			 .append(moveButton);

		selfRef.mainDOMElement.append(panel);

		closeButton.click(closeButtonClicked);
		fullscreenButton.click(fullscreenButtonClicked);
		moveButton.click(moveButtonClicked);
	}

	function closeButtonClicked() {
		selfRef.trigger('Closing');
	}

	function fullscreenButtonClicked() {
		selfRef.trigger('FullscreenToggled');
	}

	function moveButtonClicked() {
		// TODO: Trigger an appropriate event
        //selfRef.trigger('')
	}
}
sewi.inherits(sewi.ResourceViewer, sewi.ConfiguratorElement);
