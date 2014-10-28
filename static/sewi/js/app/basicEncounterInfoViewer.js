var sewi = sewi || {};
sewi.BasicEncounterInfoViewer = function(options) {
	// TODO Inherit from ConfiguratorElement once the changes have been merged.

	var selfRef = this;

	selfRef.mainContainer = $("<div class='basic-encounter-info-container'><div class='basic-encounter-info-contents'></div></div>");
	
	// TODO $.getJSON("json/encounter.json", function( encounterData ) {
		
	var encounterData = {
		"id": 234,
		"data": 
		[
			[
				["header", "Personal Details"],
				["Name", "John Doe"],
				["Age", "30"],
				["Birthdate", "6th June 1984"],
				["Gender", "Male"]
			],
			[
				["header", "Encounter Details"],
				["Date of Encounter", "7th July 2014"],
				["Attending Physician", "Dr Geller"],
				["Location", "XYZ Hospital"],
				["Location Coordinates", "123.231 24.3423"]
			],
			[
				["header", "Diagnostic Details"],
				["Primary Condition", "Severe cough"],
				["Secondary Condition", "Sore throat"],
				["Description", "Patient is suffering from flu and cough as a result of sitting inside an airconditioned location for too long (32 days). Patient has been advised to avoid staying inside a building for such prolong periods, and has been prescribed a dose of fresh air."]
			]
		]
	}

	selfRef.mainContainer.trigger("BEILoaded", {"id": encounterData.id, "name": encounterData.data[0][1][1]});

	for(var i = 0; i < encounterData.data.length; i++) {
		
		$("<div class='basic-counter-info-header'>" + encounterData.data[i][0][1] + "</div>")
			.appendTo($(".basic-encounter-info-contents"));

		for(var j = 1; j < encounterData.data[i].length; j++) {
			$("<div class='basic-counter-info-value'><strong>" + encounterData.data[i][j][0] + "</strong>: " + encounterData.data[i][j][1] + "</div>")
				.appendTo($(".basic-encounter-info-contents"));
		}
	}
}

// TODO Should be inherited from ConfiguratorElement
sewi.BasicEncounterInfoViewer.prototype.getDOM = function() {
	return this.mainContainer;
}