var sewi = sewi || {};

(function() {
	/**
     * Displays the basic encounter information (i.e. encounter information &
     * non-complex Observations of the encounter)
     *
     * @class sewi.BasicEncounterInfoViewer
     * @constructor
     * @extends sewi.ConfiguratorElement
     *
     * @param {Object} options Configuration options for BasicEncounterInfoViewer.
     * @param {String} options.encounterId The ID of the current encounter.
     */
    sewi.BasicEncounterInfoViewer = function(options) {
        if(!(this instanceof sewi.BasicEncounterInfoViewer)){
            return new sewi.BasicEncounterInfoViewer();
        }
        sewi.ConfiguratorElement.call(this);

        this.encounterId = options.encounterId;

        this.mainDOMElement.addClass(sewi.constants.BEI_MAIN_DOM_CLASS);
        
        loadInfo.call(this);
    };

    sewi.inherits(sewi.BasicEncounterInfoViewer, sewi.ConfiguratorElement);

    /**
     * Called when the BEI component is resized. The options allow BEI to decide if
     * it needs to re-set its width again.
     * @param {Object} [options] An object holding the patient's name and details.
     * @param {String} [options.id] The patient's ID.
     * @param {String} [options.name] The patient's name, in the format of
     * "LastName, FirstName".
     */
    sewi.BasicEncounterInfoViewer.prototype.resize = function(options) {
        if(options.isWindowResizeEvent)
            fixMainDomElementWidth.call(this, options.elementIsMinimized);
    };

    // Fetch the encounter data from the server.
    function loadInfo() {
        $.ajax({
            dataType: 'json',
            type: 'GET',
            async: true,
            url: sewi.constants.ENCOUNTER_BASE_URL + this.encounterId + sewi.constants.BEI_BASIC_INFO_URL_SUFFIX,
        }).done(processInfo.bind(this));
    };

    // We process the information obtained from the AJAX call and render it on screen.
    // The encounterData is structured as such:
    // [
    //     [ // One element of the top-most array is a section
    //         ["header", "HEADER TITLE"], // The first element of each section is always the header, with "header" as the key.
    //         ["ENTRY_KEY1", "ENTRY_VALUE1"],
    //         ["ENTRY_KEY2", "ENTRY_VALUE2"],
    //         ["ENTRY_KEY3", "ENTRY_VALUE3"]
    //     ],
    //     [ // Another section
    //         ["header", "HEADER TITLE"],
    //         ["ENTRY_KEY1", "ENTRY_VALUE1"],
    //         ["ENTRY_KEY2", "ENTRY_VALUE2"]
    //     ]
    // ]
    function processInfo(encounterData) {
    	// Inform configurator of the patient's name and ID. Note that the location
    	// of this information in encounterData returned by the server is always the same.
        this.trigger(sewi.constants.BEI_BEI_LOADED_EVENT, {
            id: encounterData[1][1][1],
            name: encounterData[1][2][1] + ", " + encounterData[1][3][1]
        });

        // Render the information.
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

        // Give it a scrollbar, for y-overflows.
        this.mainDOMElement.slimScroll({
            color: '#000',
            size: '4px',
            width: "100%",
            height: "100%"
        });

        fixMainDomElementWidth(false);
    };

    // Fixes the width (in pixels) the width of the BEI's main DOM element
    // The element width should be 100% of its un-minimized state.
    function fixMainDomElementWidth(elementIsMinimized) {
        // We set the element's width to 100% of its parent's width, or 300% if it's minimized
        // (The minimized state occupies 1/3 of the space of the un-minimized)
        if(elementIsMinimized)
            this.mainDOMElement.width("300%");
        else
            this.mainDOMElement.width("100%");

        // Now we get the width back, but in pixels
        var widthInPixels = this.mainDOMElement.width();

        // Finally, we fix the width to pixel, instead of percentage,
        // so the element is paritially hidden, it won't resize
        this.mainDOMElement.width(widthInPixels + "px");
    };
})();