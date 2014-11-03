var sewi = sewi || {};

(function() {
	sewi.BasicEncounterInfoViewer = function(options) {
		sewi.ConfiguratorElement.call(this);

		this.mainDOMElement
			.addClass("basic-encounter-info-container")
			.append("<div class='basic-encounter-info-contents'></div>")
		
		console.log(this.mainDOMElement.children(".basic-encounter-info-contents"));
		this.mainDOMElement.children(".basic-encounter-info-contents")
		.slimScroll({
			color: '#000',
			size: '4px',
			width: "100%",
			height: "100%"
		});

		this.loadInfo();
	}

	sewi.inherits(sewi.BasicEncounterInfoViewer, sewi.ConfiguratorElement);

	sewi.BasicEncounterInfoViewer.prototype.loadInfo = function() {
		$.ajax({
			dataType: 'json',
			type: 'GET',
			async: true,
			url: location.href + "basicInfo",
		}).done(this.processInfo.bind(this));
	}

	sewi.BasicEncounterInfoViewer.prototype.processInfo = function(encounterData) {
		this.trigger("BEILoaded", {
			"id": encounterData[1][1][1],
			"name": encounterData[1][2][1] + ", " + encounterData[1][3][1]
		});

		for(var i = 0; i < encounterData.length; i++) {
			$("<div class='basic-counter-info-header'>" + encounterData[i][0][1] + "</div>")
				.appendTo(this.mainDOMElement.find(".basic-encounter-info-contents"));

			for(var j = 1; j < encounterData[i].length; j++) {
				$("<div class='basic-counter-info-value'><strong>" + encounterData[i][j][0] + "</strong>: " + encounterData[i][j][1] + "</div>")
					.appendTo(this.mainDOMElement.find(".basic-encounter-info-contents"));
			}
		}

		this.fixMainDomElementWidth();
	}

	sewi.BasicEncounterInfoViewer.prototype.fixMainDomElementWidth = function() {
		// We set the element's width to 100% (of its parent's width)
		this.mainDOMElement.width("100%");

		// Now we get the width back, but in pixels
		var widthInPixels = this.mainDOMElement.width();

		// Finally, we fix the width to pixel, so the element is paritially hidden, it won't resize
		this.mainDOMElement.width(widthInPixels + "px");
	}

	sewi.BasicEncounterInfoViewer.prototype.resize = function() {
		if(!configurator.isBasicInfoMinimized)
			this.fixMainDomElementWidth();
	}
})();