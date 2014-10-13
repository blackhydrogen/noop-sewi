// Main program logic goes here.
$(function() {
  var configurator = new sewi.Configurator({
      basicInfoView: '#beiView',
      resViewerView: '#mainView',
      resGalleryView: '#resView',
      titleView: '#titleView'
  });

  var tempDrag = $('<div id="draggable" data-resId="123" data-resType="Image">Some words</div>');
  tempDrag.css('background-color', 'red');
  tempDrag.css('width', '100px');
  tempDrag.css('height', '100px');
  tempDrag.draggable({revert : 'invalid', helper:'clone'});
  $('#resView').append(tempDrag);

  var tempDrag2 = $('<div id="draggable" data-resId="124">Some more words</div>');
  tempDrag2.css('background-color', 'green');
  tempDrag2.css('width', '100px');
  tempDrag2.css('height', '100px');
  tempDrag2.draggable({revert : 'invalid', helper:'clone'});
  $('#resView').append(tempDrag2);
  
  var tempDrag3 = $('<div id="draggable" data-resId="125">Some more more words</div>');
  tempDrag3.css('background-color', 'blue');
  tempDrag3.css('width', '100px');
  tempDrag3.css('height', '200px');
  tempDrag3.draggable({revert : 'invalid', helper:'clone'});
  $('#resView').append(tempDrag3);
  
  var tempDrag4 = $('<div id="draggable" data-resId="126" data-resType="Image">Some more more words</div>');
  tempDrag4.css('background-color', 'yellow');
  tempDrag4.css('width', '200px');
  tempDrag4.css('height', '200px');
  tempDrag4.draggable({revert : 'invalid', helper:'clone'});
  $('#resView').append(tempDrag4);

  var audioPlayer = new sewi.AudioResourceViewer();
//  $('#resView').append(audioPlayer.getDOM());
});
