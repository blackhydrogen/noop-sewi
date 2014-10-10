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
