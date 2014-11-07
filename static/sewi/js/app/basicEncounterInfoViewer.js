var sewi = sewi || {};

(function() {
	sewi.BasicEncounterInfoViewer = function(options) {
		if(!(this instanceof sewi.BasicEncounterInfoViewer)){
			return new sewi.BasicEncounterInfoViewer();
		}
		sewi.ConfiguratorElement.call(this);

		this.encounterId = options.encounterId;

		this.mainDOMElement.addClass(sewi.constants.BEI_MAIN_DOM_CLASS);
		
		this.loadInfo();
	};

	sewi.inherits(sewi.BasicEncounterInfoViewer, sewi.ConfiguratorElement);

	sewi.BasicEncounterInfoViewer.prototype.loadInfo = function() {
		$.ajax({
			dataType: 'json',
			type: 'GET',
			async: true,
			url: sewi.constants.ENCOUNTER_BASE_URL + this.encounterId + sewi.constants.BEI_BASIC_INFO_URL_SUFFIX,
		}).done(this.processInfo.bind(this));
	};

	sewi.BasicEncounterInfoViewer.prototype.processInfo = function(encounterData) {
		this.trigger("BEILoaded", {
			id: encounterData[1][1][1],
			name: encounterData[1][2][1] + ", " + encounterData[1][3][1]
		});

		for(var i = 0; i < encounterData.length; i++) {
			$(sewi.constants.BEI_HEADER_DOM)
				.html(encounterData[i][0][1])
				.appendTo(this.mainDOMElement);

			for(var j = 1; j < encounterData[i].length; j++) {
				$(sewi.constants.BEI_ENTRY_DOM)
					.append(
						$(sewi.constants.BEI_ENTRY_KEY_DOM).html(encounterData[i][j][0])
					)
					.append(
						$("<br>")
					)
					.append(
						$(sewi.constants.BEI_ENTRY_VALUE_DOM).html(encounterData[i][j][1])
					)
					.appendTo(this.mainDOMElement);
			}
		}

		this.mainDOMElement.slimScroll({
			color: '#000',
			size: '4px',
			width: "100%",
			height: "100%"
		});

		this.fixMainDomElementWidth(false);
	};

	sewi.BasicEncounterInfoViewer.prototype.fixMainDomElementWidth = function(elementIsMinimized) {
		// We set the element's width to 100% of its parent's width, or 300% if it's minimized
		if(elementIsMinimized)
			this.mainDOMElement.width("300%");
		else
			this.mainDOMElement.width("100%");

		// Now we get the width back, but in pixels
		var widthInPixels = this.mainDOMElement.width();

		// Finally, we fix the width to pixel, so the element is paritially hidden, it won't resize
		this.mainDOMElement.width(widthInPixels + "px");
	};

	sewi.BasicEncounterInfoViewer.prototype.resize = function(options) {
		if(options.isWindowResizeEvent)
			this.fixMainDomElementWidth(options.elementIsMinimized);
	};
})();