(function() {
	QUnit.module("BasicEncounterInfoViewer", {
		setup: function() {
			this.fixture = $('#qunit-fixture');

			this.basicEncounterInfoViewer = new sewi.BasicEncounterInfoViewer({
				id: ""
			});

			this.fixture.append(
				this.basicEncounterInfoViewer.getDOM()
			);
		},

		teardown: function() {
		}
	});

	QUnit.test("Process Info", function(assert) {
		expect(1);

		var sampleEncounterData = [
	        [
	            ["header", "HEADER TITLE1"], // The first element of each section is always the header, with "header" as the key.
	            ["ENTRY_KEY1", "ENTRY_VALUE1"],
	            ["ENTRY_KEY2", "ENTRY_VALUE2"],
	            ["ENTRY_KEY3", "ENTRY_VALUE3"]
	        ],
	        [
	            ["header", "HEADER TITLE2"],
	            ["ENTRY_KEY4", "ENTRY_VALUE4"],
	            ["ENTRY_KEY5", "ENTRY_VALUE5"],
	            ["ENTRY_KEY6", "ENTRY_VALUE6"],
	            ["ENTRY_KEY7", "ENTRY_VALUE7"],
	        ]
	    ];

	    var expectedOuterHTML = '<div class="basic-encounter-info-container" style="overflow: hidden; height: 100%; width: 1000px;"><div class="basic-encounter-info-header">HEADER TITLE1</div><div class="basic-encounter-info-entry"><span class="basic-encounter-info-entry-key">ENTRY_KEY1</span><br><span class="basic-encounter-info-entry-value">ENTRY_VALUE1</span></div><div class="basic-encounter-info-entry"><span class="basic-encounter-info-entry-key">ENTRY_KEY2</span><br><span class="basic-encounter-info-entry-value">ENTRY_VALUE2</span></div><div class="basic-encounter-info-entry"><span class="basic-encounter-info-entry-key">ENTRY_KEY3</span><br><span class="basic-encounter-info-entry-value">ENTRY_VALUE3</span></div><div class="basic-encounter-info-header">HEADER TITLE2</div><div class="basic-encounter-info-entry"><span class="basic-encounter-info-entry-key">ENTRY_KEY4</span><br><span class="basic-encounter-info-entry-value">ENTRY_VALUE4</span></div><div class="basic-encounter-info-entry"><span class="basic-encounter-info-entry-key">ENTRY_KEY5</span><br><span class="basic-encounter-info-entry-value">ENTRY_VALUE5</span></div><div class="basic-encounter-info-entry"><span class="basic-encounter-info-entry-key">ENTRY_KEY6</span><br><span class="basic-encounter-info-entry-value">ENTRY_VALUE6</span></div><div class="basic-encounter-info-entry"><span class="basic-encounter-info-entry-key">ENTRY_KEY7</span><br><span class="basic-encounter-info-entry-value">ENTRY_VALUE7</span></div></div>';

		this.basicEncounterInfoViewer.privates.processInfo.call(this.basicEncounterInfoViewer, sampleEncounterData);

		assert.equal(this.basicEncounterInfoViewer.getDOM()[0].outerHTML, expectedOuterHTML, "Main DOM Element isSame")
	});
})();