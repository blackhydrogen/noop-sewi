var sewi = sewi || {}; 
sewi.ConfiguratorElement = function() {

	var selfRef = this;

	selfRef.mainDOMElement = $("<div></div>");
}

sewi.ConfiguratorElement.prototype.getDOM = function() {
	return this.mainDOMElement;
}