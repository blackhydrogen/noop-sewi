(function() {
  var constants = {
    TEST_INVALID_ENCOUNTER_ID: 121,
    TEST_VALID_ENCOUNTER_ID: '77d09b28-abed-4a6a-b48b-6b368bd2fdb3',
    RESOURCE_CLASS: 'resource',
    DOUBLE_CLICK_INSTRUCTION_CLASS: 'double-click-instruction',
    DOUBLE_CLICK_INSTRUCTION_DOM: '<div class="double-click-instruction"> Double click to open a resource</div>',
    TEST_IMAGE_RESOURCE_1_DOM: '<div class="resource" data-res-id="b102a5e7-c845-4099-9449-3bfa246a83be" data-res-type="image" title=""><div class="resource-thumbnail-container"><img class="resource-thumbnail" src="images/default_thumbnail.png"></div><p class="resource-title">SX SITE IMAGE</p></div>',
    TEST_IMAGE_RESOURCE_2_DOM: '<div class="resource" data-res-id="8f26c97d-50eb-478a-ba3c-a86bdb794493" data-res-type="image" title=""><div class="resource-thumbnail-container"><img class="resource-thumbnail" src="data:image/jpeg;base64,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"></div><p class="resource-title">IMAGE OBSERVATION</p></div>',
    TEST_CHART_RESOURCE_DOM: '<div class="resource" data-res-id="fd28bb9f-b9b4-4449-a914-0525237df1ce" data-res-type="chart" title=""><div class="resource-thumbnail-container"><img class="resource-thumbnail" src="data:image/jpeg;base64,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"></div><p class="resource-title">GRAPH OBSERVATION</p></div>',
    TEST_VIDEO_RESOURCE_DOM: '<div class="resource" data-res-id="c1dee25d-fe89-49c3-b837-0e328adb7cb5" data-res-type="video" title=""><div class="resource-thumbnail-container"><img class="resource-thumbnail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAFCElEQVR4nO2dPW9cRRSGH3AkIjspUkBDpEhUUQCFX4DEXwAEpiAJDZ8tQqIECYECpIjCH6BJGZQUGPHRQJ1I+ZBLRAMkEkgkjgLYJhTXqwRj7507c2bP7D3vI53Oc2b2zLP37l7PzIIQQgghhBBCCCGi8IBhriXgLeAl4BBwwDB3i1zfip+AFeAc8IvriBw5CFwB7gaOTeBb4OnCWs4dS8A1/CegpVgBjpQUdZ54G/+Ctxi3gOWCus4NF/EvdsvxXn5p54Pb+Be59TiVXd05wLu48xLv5xa4dbwLO0/xaWaNm6bvRc87fa/vS+CfhL+bxOg+E0QXAOAow56DjEoCCdCxCHyX8Pejux1IgHsMleCT+sOvjwT4L+EkkAD/J5QEEmBnFun+OTR6CSTA7oSQQAJMZ6gEH9sOvz4SoJ9RSyAB0hitBBIgnVFKIAGGMVSCk2XDr48EGM6oJJAAeSwC3yTkb14CCZDPfuCHhD4m8W5hf1WQAGUMvRIcN+jTFAlQzn7g+4S+7gI3gcNG/ZogAWwYciX42rDfYiSAHYt0k5siwTPGfWcjAWzZR9rt4KsKfWchAezZR/+Gmw3gkUr9D0IC1OFxug2n0/p+tWL/yUiAeqz09H2utIM9pQmEq+SPlSZ40GIUwo1DpQksTgjpewdYnkLiwRrdGQitUlRfXQH6WfUeQE0kQD9nvQfQOmP/FrAXuETa0zmPcKf5ARrQ8iFY7jQ/QCOWgHforgZ/4j/xJvXVt4D2qVpffQgMjgQIjgQIjgQIjgQIjgQIjgQITosCPAWcoXvydoP6D1JuAJe3+jw6g9e3DPxI99sCL86gv+pYPanaQzcJfcugasYmcJp6C2Ve2fb6fk1o0/yTVosBLgAXEnLNKs5vjcmSE+wsdx8hBDiZkGfW8dHgSuzOCXa/svUxegGOAOsJeWYd69hswTrO9NtaH6MX4LOEHF5xOqMe9/Mm/QdJ9zF6AVYTcnjF1Yx6TDhG2gfaPkYvwFpCDq+4lVEPSHvnS4DE9t4xlJfptm1Z5ZcAzjGENxj24xESIKG9d6SSM/kSIKG9d6SQO/kSIKG9d/RRMvkSIKG9d0zjdcomXwIktPeO3bCYfAmQ0N47dsJq8iVAQnvv2M5r2E2+uwAtbAxpwuIpbB//Brb/Ki6tjzaGzBjrdQKuSIDgSIDgSIDgSIDhbHoPwBIJMJwX6JaLiS2iPQcAeBb4u2L+IfVxJ6IAYCdBaX3ciSoA2EhQWh93IgsA8BxlEpTWx53oAkCZBKX1cUcCdORKUFofdyTAPXIk6EMCOMdQnmfYVrc+Ri/AGDeGHCN9b0Afoxeg5a1h1zLqMWEutoa18Ch4xXsAUygZ2+d0J4BsGI2lWUoN1fbw6Yz+FgA6IGIaIQRYoDuWxXvSJ/EFOiImGasBLgAf4ns7WAc+oN66v+2HRF1PaBNGgAlP0p0WdhW4k5C/NO7QHUl3BngiY7xDWQZ+Bn4j7Zi4qgK0sCxcTKdqfVv4GigckQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBqfXzaPfTxKoVsTO6AgTHQoDbBjlEHmulCSwEWDXIIfIo2bkE2Ahw1iCHyKOJ2u8FLuG3lDtqXAQeSpifmXCQbmm1d1GixGXg0aSZ6cFqA8RNus2QfwAPAweYzVfMSPxF9yY7RXdk/e++wxFCCCGEEEIIIcS88S9BMfEthNx8BwAAAABJRU5ErkJggg=="></div><p class="resource-title">VIDEO OBSERVATION</p></div>',
    TEST_AUDIO_RESOURCE_DOM: '<div class="resource" data-res-id="23e8e15f-a155-4f8c-b587-2f4855187279" data-res-type="audio" title=""><div class="resource-thumbnail-container"><img class="resource-thumbnail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAGeElEQVR4nO2dW6gVVRjHf5qlHjVUsCIlLexCgQVd3jJ6qpfudUzSThHVQ0ZBKgS95GOlUE/1Vr34FEYEGd0vEIQcSRGlh9KozNAjeanM0h5GOWfvs/d8a2atNbP2zP8H62nt/X3/9e3/nr1nZq01IIQQQgghhBBCiLYwJWCsWcBTwEpgMTAvYOwUOXCm7QO2AluA/bUqqpFFwE7gdIvbf8AnwHLPWg4cs4Bd1P8BpNS2Alf7FHWQWEv9BU+xHQUe9KjrwDBK/cVOub1YvrSDwXHqL3LqbVPp6g4AdRd3UNqGsgVOnboLO0htY8kaJ4016EHHGt8HwCmH151tjftP0HYDAFxLsesgjTKBDJAxBHzq8PrG/RzIAOMUNcEr8eXHRwbopHUmkAEm0yoTyAC9GSK7OdR4E8gA/WmFCWSAfIqa4OWw8uMjA9g02gQygBuNNYEM4E4jTSADFKOoCV7ykx8fGaA4jTKBDFCOIeBjh/jJm0AGKM8c4GuHHGfb8575oiAD+FH0SDASIGdQZAB/5gBfOeQ6DRwBrgqUNwgyQBiKHAk+CpjXGxkgHENkH66LCW4NnLs0MkBYZuP2c/BhhNylkAHCMxt7wc2/wAWR8hdCBojDNWQLTvNyPxExvzMyQDy2Grm3+CaY5htA1Gryy3wDTA2hQtTGYt8AIXYIsb4BIXchqYNjZHsgpIpXfXUEsNldt4CYyAA2m+sWkDpNPwuYAWzH7epcHa12khcYgJQ3waqd5AUGYhawnuxo8Df1f/BB6quzgPSJWl/9CWw5MkDLkQFajgzQcmSAliMDtBwZwI/pwHXAElp8utuWC0HdPA0cZnyc24EbI+RJvr7JC4zAs/Qe62FgaeBcydc3eYGBmQYcpP94t5H9NIQi+fomLzAwS7HH/FrAfMnXN0WB04FzIsVeiD3mU8AtgfKlWN8OUhO4imz93BiwIlKOb7DHvYcwPwWp1XcSKQkcoXMu/W+R8iwD/sIe+wsBcqVU356kInA1vRdSxOLxHrm622FgrmeeVOrblxQEPkS2VKrq/O/0yTmx+T4pJIX65lK3wJX0//Bd8w+T/a6PATuAdcB5Du9bSPZ/wzoK+Ewrr7u+JnUKXEH+h++Sf32f972P28qpdUb+08BjrgPqgQzQh2HgpGf+C8mf3/e6g46ZwC+Ghm/dhzUJGaAH9+P24Vv573N4/7CDnmcc4lzuOrguZIAu7gX+ccjrkn/Y4f2HgAVGnLnYz098zn2IHcgAE7ibYh++lf9ix3hvOGh704jxhdMIJyMDnOFO4IRDvqL5NzjEOAlcasS5w4hxgnJXBhtvgHuAHx3ilG0WU8me/WfFedWIM5NsJXFejJsc9HTTeAPsd4gR0wAA84GfjDi/Y58WfmbEWOOoZyJRDZDClLCL6hZAdgHIumK3ALjZeI11unels6KKSMEAqfAW2VEgj+VG/w6jf4mzmoqQAcY5CbxrvOYGo3+f0b/EWU1FyACdWJsvWpsyWUeQ+QW0VIIM0Mn3Rr/1f+Wo0T9UQEslyACdWBNIZhv9x4z+5DabkgHCMnCLQ2SATqxDvPUNtw7xxwtoqQQZoJMrjH7rJ+J8o//PAloqQQbo5Daj/wej/xKjf6yAlkqQAcY5l+xuYx7bjP7FRv9eZzUVIQOMM4L9Df7S6F9m9O91VjNA+N6s+NUhhm4GNfhu4F3ENYGFbgd7UpXAVdgzgMvk14QQT6oUWMYEeWhKWACqFriaYibIw2VS6EE0KTSXOgQWMUEeLtPCrVND0LTwWgQ+jP1ULSu/tTBko4MOLQwxWkxcTGDRb2nXe7htMqGlYUaLzQj5JnDhduBzsnP9UWAtbusCtTiUNAQ+Qn8TxETLw0lH4AP0Xi8YizU9cnW3Q9h3CC1SqW9fUhL4KJ1HggOR8miLmAmkJnAF2XX9Q2iTqEpIXmBgtE1cF8kLDIw2iuwieYGB0VaxXSQvMAJP0nusY2iz6PQERmKYzpXN3wHXR8gTtb56bqAfU8j+FAL8HClH1PrKAOkTtb6aFNpyZICWIwO0HBmg5cgALUcGaDkus158afLFoIFHR4CWE8IAyW160CKsDStMQhhgd4AYohy7fAOEMMDmADFEOZKo/QyyBydbd63UwrZRws478GIRsJP6i9KWtoPxu5BehHq86hHgbeAPsoWU86jmFLNNnCD7km0im5CS3H5DQgghhBBCCCGESJv/AWgZ/SpAqcQtAAAAAElFTkSuQmCC"></div><p class="resource-title">AUDIO OBSERVATION</p></div>',


  };

  QUnit.module('Resource Gallery', {
    setup: function() {
      this.fixture = $('#qunit-fixture');
    },

    teardown: function() {}
  });

  QUnit.test('RG1: Initialization', function(assert) {

    assert.throws(function() {
      var resourceGallery = new sewi.ResourceGallery();
    }, Error, 'Throws Error when no id is passed on initialization');

    var options = {
      encounterId: constants.TEST_INVALID_ENCOUNTER_ID
    };
    assert.throws(function() {
      var resourceGallery = new sewi.ResourceGallery(options);
    }, Error, 'Throws Error when invalid id is passed on initialization');

    options.encounterId = constants.TEST_VALID_ENCOUNTER_ID;
    assert.ok(new sewi.ResourceGallery(options), 'Resource Gallery initialized successfully');
    assert.ok(sewi.ResourceGallery(options), 'Resource Gallery initialized successfully even if called without new keyword');
  });

  QUnit.asyncTest('RG2: Loading resources into DOM', function(assert) {

    var options = {
      encounterId: constants.TEST_VALID_ENCOUNTER_ID
    };
    var resourceGallery = new sewi.ResourceGallery(options);
    resourceGallery.load();

    setTimeout(function() {
      var galleryDOM = resourceGallery.getDOM();
      var resources = galleryDOM.find('.' + constants.RESOURCE_CLASS);
      $.each(resources, function(index, value){
        $(value).removeAttr('data-original-title');
      });
      var instruction = galleryDOM.find('.' + constants.DOUBLE_CLICK_INSTRUCTION_CLASS);
      assert.equal(galleryDOM.children().length, 6, 'All resources present in DOM');
      assert.equal(instruction[0].outerHTML, constants.DOUBLE_CLICK_INSTRUCTION_DOM, 'Double click instruction present');
      assert.equal(resources[0].outerHTML, constants.TEST_IMAGE_RESOURCE_1_DOM, 'Image resource 1 loaded');
      assert.equal(resources[1].outerHTML, constants.TEST_VIDEO_RESOURCE_DOM, 'Video resource 1 loaded');
      assert.equal(resources[2].outerHTML, constants.TEST_AUDIO_RESOURCE_DOM, 'Audio resource 1 loaded');
      assert.equal(resources[3].outerHTML, constants.TEST_IMAGE_RESOURCE_2_DOM, 'Image resource 2 loaded');
      assert.equal(resources[4].outerHTML, constants.TEST_CHART_RESOURCE_DOM, 'Chart resource loaded');
      QUnit.start();
    }, 3500);

  });

  QUnit.asyncTest('RG3: Triggering event when resource is double clicked', function(assert) {
    QUnit.stop(1);
    var options = {
      encounterId: constants.TEST_VALID_ENCOUNTER_ID
    };
    var resourceGallery = new sewi.ResourceGallery(options);
    resourceGallery.load();

    setTimeout(function() {
      var galleryDOM = resourceGallery.getDOM();
      var resources = galleryDOM.find('.' + constants.RESOURCE_CLASS);

      galleryDOM.on('resourceClick', function(event, resourceDOM) {
        assert.equal(resourceDOM, resources[0], 'Double click event triggered successsfully');
        QUnit.start();
      });
      $(resources[0]).trigger('dblclick');
      QUnit.start();
    }, 3000);

  });

  QUnit.asyncTest('RG4: Attaching/Detaching draggable properties to resources when gallery is minimized/maximized', function(assert) {
    var options = {
      encounterId: constants.TEST_VALID_ENCOUNTER_ID
    };
    var resourceGallery = new sewi.ResourceGallery(options);
    resourceGallery.load();

    setTimeout(function() {
      var galleryDOM = resourceGallery.getDOM();
      var resources = galleryDOM.find('.' + constants.RESOURCE_CLASS);
      resourceGallery.resize(true); // minimize resource gallery
      assert.ok(!_.isUndefined($(resources[0]).draggable('instance')), 'Draggable property attached to resource on minimizing');
      resourceGallery.resize(false); // maximize resource gallery 
      assert.ok(_.isUndefined($(resources[0]).draggable('instance')), 'Draggable property detached from resource on maximizing');
      QUnit.start();
    }, 3000);

  });

})();