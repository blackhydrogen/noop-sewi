// Main program logic goes here.
$(function() {
  var configurator = new sewi.Configurator({
      basicInfoView: '#beiView',
      resViewerView: '#mainView',
      resExplorerView: '#resView',
        
      isResourceViewerHidden: false
  });

  var tempDrag = $('<div id="draggable"></div>');
  tempDrag.css('background-color', 'red');
  tempDrag.css('width', '100px');
  tempDrag.css('height', '100px');
  tempDrag.draggable({revert : 'invalid', helper:'clone'});
  $('#resView').append(tempDrag);
  
  var tempDrag2 = $('<div id="draggable"></div>');
  tempDrag2.css('background-color', 'red');
  tempDrag2.css('width', '100px');
  tempDrag2.css('height', '100px');
  tempDrag2.draggable({revert : 'invalid', helper:'clone'});
  $('#resView').append(tempDrag2);
});
