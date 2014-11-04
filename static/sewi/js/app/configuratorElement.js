var sewi = sewi || {};

(function() {
	sewi.ConfiguratorElement = function() {
		this.mainDOMElement = $("<div></div>");
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

	// Unimplemented methods, must be overridden by subclasses

	/**
	 * Loads all remaining resources (including those that fire off events)
	 */
	sewi.ConfiguratorElement.prototype.load = _.noop;

	/**
	 * Inform the ConfiguratorElement that it has been resized.
	 */
	sewi.ConfiguratorElement.prototype.resize = _.noop;
})();

(function(){
    sewi.ErrorScreen = function(){
        if(!(this instanceof sewi.ErrorScreen))
            return new sewi.ErrorScreen();

		sewi.ConfiguratorElement.call(this);

		initDOM.call(this);
    }
	sewi.inherits(sewi.ErrorScreen, sewi.ConfiguratorElement);

	function initDOM() {
		this.textElement = $(sewi.constants.ERROR_SCREEN_TEXT_DOM);
		this.mainDOMElement.append(this.textElement)
						   .addClass(sewi.constants.ERROR_SCREEN_CLASS);
	}

    sewi.ErrorScreen.prototype.setText = function(string){
        this.textElement.text(string);
    }

})();

(function(){
    // Progress Bar
    sewi.ProgressBar = function (animated) {
        if(!(this instanceof sewi.ProgressBar))
            return new sewi.ProgressBar(animated);

		sewi.ConfiguratorElement.call(this);

        initDOM.call(this, animated);
	}
	sewi.inherits(sewi.ProgressBar, sewi.ConfiguratorElement);

	function initDOM(animated) {
		if (_.isUndefined(animated)) animated = true;

		this.progressBarElement = $(sewi.constants.PROGRESS_BAR_DOM);
        this.progressBarAmountElement = $(sewi.constants.PROGRESS_BAR_AMOUNT_DOM);
        this.textElement = $(sewi.constants.PROGRESS_BAR_TEXT_DOM);

        if (animated) {
            this.progressBarAmountElement.addClass(sewi.constants.PROGRESS_BAR_ANIMATED_CLASS)
        }

        this.progressBarElement.append(this.progressBarAmountElement)
							   .append(this.textElement);

		this.mainDOMElement.append(this.progressBarElement)
						   .addClass(sewi.constants.PROGRESS_BAR_BACKDROP_CLASS)
    }

    sewi.ProgressBar.prototype.update = function(percent){
        var methodName = 'sewi.ProgressBar.prototype.update';
        if(_.isNumber(percent) == false){
            console.error(methodName + ': parameter is not a number');
        } else if(percent > 100 || percent < 0){
            console.error(methodName + ': parameter is out of range');
        } else {
            this.progressBarAmountElement.css('width', percent+'%');
        }
    }

    sewi.ProgressBar.prototype.setText = function(progressText) {
        this.textElement.text(progressText);
    }

})();

(function() {
	sewi.ResourceViewer = function() {
		sewi.ConfiguratorElement.call(this);

		setupDOM.call(this);
		addButtons.call(this);
		addErrorScreen.call(this);
		addProgressBar.call(this);
	}
	sewi.inherits(sewi.ResourceViewer, sewi.ConfiguratorElement);

	// ResourceViewer private methods
	function setupDOM() {
		this.mainDOMOuterContainer = $(sewi.constants.RESOURCE_VIEWER_BASIC_DOM);
        this.mainDOMOuterContainer.addClass(sewi.constants.RESOURCE_VIEWER_CLASS)
                                  .append(this.mainDOMElement);
	}

	function addButtons() {
		var closeButton = $(sewi.constants.RESOURCE_VIEWER_CLOSE_BUTTON_DOM);
		var fullscreenButton = $(sewi.constants.RESOURCE_VIEWER_FULLSCREEN_BUTTON_DOM);
		var tooltipsButton = $(sewi.constants.RESOURCE_VIEWER_TOOLTIPS_BUTTON_DOM);
		var tooltipsButtonTracker = $(sewi.constants.RESOURCE_VIEWER_TOOLTIPS_BUTTON_TRACKER_DOM);

		this.buttonGroup = $(sewi.constants.RESOURCE_VIEWER_BUTTON_GROUP_DOM);
		this.panel = $(sewi.constants.RESOURCE_VIEWER_PANEL_DOM);

		this.buttonGroup.append(tooltipsButton)
						.append(fullscreenButton)
						.append(closeButton);

		tooltipsButton.prepend(tooltipsButtonTracker);
		this.panel.append(this.buttonGroup);

		this.mainDOMOuterContainer.append(this.panel);

		closeButton.click(closeButtonClicked.bind(this));
		fullscreenButton.click(fullscreenButtonClicked.bind(this));
		tooltipsButtonTracker.change(tooltipsButtonClicked.bind(this));
	}

	function addErrorScreen() {
		this.errorScreen = new sewi.ErrorScreen();
	}

	function addProgressBar() {
		this.progressBar = new sewi.ProgressBar();
	}

	function closeButtonClicked() {
		this.trigger('Closing');
	}

	function fullscreenButtonClicked() {
		this.trigger('FullscreenToggled');
	}

	function tooltipsButtonClicked(event) {
		var tooltipsButtonTracker = $(event.target);
		var isActive = tooltipsButtonTracker.is(':checked');
		if (isActive) {
			this.showTooltips();
			tooltipsButtonTracker.parent().addClass('btn-primary');
		} else {
			this.hideTooltips();
			tooltipsButtonTracker.parent().removeClass('btn-primary');
		}
	}

	// Overrides getDOM of ConfiguratorElement
	sewi.ResourceViewer.prototype.getDOM = function() {
	    return this.mainDOMOuterContainer;
	}

	sewi.ResourceViewer.prototype.addDownloadButton = function(urlOrFunction) {
		if (!_.isString(urlOrFunction) && !_.isFunction(urlOrFunction)) {
			throw new ValueError('URL must be a string or function');
		}

		if (this.panel.has(sewi.constants.RESOURCE_VIEWER_DOWNLOAD_BUTTON_CLASS).length) {
			return;
		}

		var downloadButton = $(sewi.constants.RESOURCE_VIEWER_DOWNLOAD_BUTTON_DOM);

		downloadButton.addClass(sewi.constants.RESOURCE_VIEWER_DOWNLOAD_BUTTON_CLASS)
			.on('click', function() {
				if(_.isString(urlOrFunction))
					downloadButton.attr('href', urlOrFunction);
				else
					downloadButton.attr('href', urlOrFunction());
			});

		this.buttonGroup.prepend(downloadButton);
	}

	sewi.ResourceViewer.prototype.showError = function(errorText) {
		var errorScreenElement = this.errorScreen.getDOM();

		this.errorScreen.setText(errorText);

		errorScreenElement.insertBefore(this.panel);
	}

	sewi.ResourceViewer.prototype.hideError = function() {
		var errorScreenElement = this.errorScreen.getDOM();
		errorScreenElement.detach();
	}

	sewi.ResourceViewer.prototype.showProgressBar = function(progressText) {
		var progressBarElement = this.progressBar.getDOM();
		progressText = progressText || sewi.constants.RESOURCE_VIEWER_DEFAULT_LOADING_MESSAGE;

		this.progressBar.setText(progressText);
		this.progressBar.update(0);

		progressBarElement.insertBefore(this.panel);
	}

	sewi.ResourceViewer.prototype.updateProgressBar = function(percent, progressText) {
		var progressBarElement = this.progressBar.getDOM();

		if (progressText) {
			this.progressBar.setText(progressText);
		}
		this.progressBar.update(percent);
	}

	sewi.ResourceViewer.prototype.hideProgressBar = function() {
		var progressBarElement = this.progressBar.getDOM();

		progressBarElement.detach();
	}

	// Unimplemented methods; these should be overridden by implemented ResourceViewers

	sewi.ResourceViewer.prototype.showTooltips = _.noop;
	sewi.ResourceViewer.prototype.hideTooltips = _.noop;
	sewi.ResourceViewer.prototype.cleanup = _.noop;
})();
