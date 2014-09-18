var sewi = sewi || {};
sewi.ImageResourceViewer = function(options) {

	// TODO Inherit from ConfiguratorElement once the changes have been merged.

	var selfRef = this;

	// TODO $.getJSON("json/image.json", function( imageURL ) {

	selfRef.mainContainer = $("<div class='image-resource-container'><div class='image-resource-image-container'><img src='sf.jpg' class='image-resource-image'></div><div class='image-resource-control-panel animated'><div class='image-resource-control'>Brightness<br><input type='range' class='image-resource-brightness' min='0' max='2' step='0.1'></div><div class='image-resource-control'>Contrast<br><input type='range' class='image-resource-contrast' min='0' max='2' step='0.1'></div><div class='image-resource-control'><label><input type='checkbox' class='image-resource-invert'>Invert</label></div><div class='image-resource-control'><input type='button' value='Reset' class='image-resource-reset-button'></div></div><input type='button' value='Hide' class='image-resource-show-hide-button'></div>");

	$(".image-resource-brightness").on("input", adjustImageFilters);
	$(".image-resource-contrast").on("input", adjustImageFilters);
	$(".image-resource-invert").on("change", adjustImageFilters);

	$(".image-resource-reset-button").on("click", function() {
		$(".image-resource-brightness").val(1);
		$(".image-resource-contrast").val(1);
		$(".image-resource-invert").prop("checked", false);
		adjustImageFilters();
	})

	$(".image-resource-show-hide-button").on("click", function() {
		if($(this).val() == "Hide") {
			$(".image-resource-control-panel").addClass("image-resource-control-panel-hidden");
			$(this).val("Show");
		}
		else {
			$(".image-resource-control-panel").removeClass("image-resource-control-panel-hidden");
			$(this).val("Hide");	
		}
	});

	function adjustImageFilters() {
	$(".image-resource-image").css("-webkit-filter",
			"brightness(" + $(".image-resource-brightness").val() + ")"
			+ "contrast(" + $(".image-resource-contrast").val() + ")"
			+ "invert(" + ($(".image-resource-invert").prop("checked") ? 1 : 0) + ")");
	}
}

// TODO Should be inherited from ConfiguratorElement
sewi.ImageResourceViewer.prototype.getDOM = function() {
	return this.mainContainer;
}