(function() {

	QUnit.module("ImageResource, Custom Filters", {
		setup: function() {
			this.fixture = $('#qunit-fixture');

			this.imageResourceViewer = sewi.ImageResourceViewer({
				id: ""
			});

			// Because we can't fetch the image resource URL, we give a URL manually, but have to manually tie the required events.
			this.imageResourceViewer.imageElement.one(
				"load",
				this.imageResourceViewer.privates.afterImageLoadSetup.bind(this.imageResourceViewer)
			);

			this.imageResourceViewer.loadImageUrlSuccess.call(
				this.imageResourceViewer,
				{
					url: sewi.staticPath + "js/tests/images/testImageOriginal.png"
				}
			);

			this.fixture.append(this.imageResourceViewer.getDOM());

			// difference.jpg
			// flame.jpg
			// flame_autoconstrat_highlights.jpg
			// grayscale_autoconstrast.jpg
			// highlights.jpg
			// invert.jpg
			// midtones.jpg
			// rainbow.jpg
			// rainbow_invert_autocontrast.jpg
			// shadows.jpg
			// spectrum.jpg
			// spectrum_invert_difference_autocontrast_midtones.jpg
		},

		teardown: function() {
		}
	});

	QUnit.test("Difference", function(assert) {
		assert.expect(1);

		assert.equal("0px", "0px", "Top");
	});
})();