var initializeDashboard = function(nb_cols, nb_rows, cube_ip, cube_port) {
  var doc = $(document);
  doc.data('cube_addr', cube_ip + ':' + (cube_port?cube_port:'80'));
  var dims = {
    width: (screen.width / nb_cols) - (nb_cols * 3),
    height: (screen.height / nb_rows) - (nb_rows * 3)
  };
  var span = Math.ceil(12 / nb_cols);
  var container = $('#dashboard');
  var rowsIds = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (var i = 0; i < nb_rows; i++) {
    var rowId = rowsIds.charAt(i);
    var row = $('<div/>').addClass('row-fluid').attr('id', rowId);
    row.css('height', dims.height);
    for (var j = 0; j < nb_cols; j++) {
      var cell = $('<div/>').addClass('span'+span).addClass('graph').attr('id', rowId + j);
      cell.css('width', dims.width).css('height', dims.height);
      cell.attr('dims', dims.width + 'x' + dims.height);
      row.append(cell);
    }
    container.append(row);
  }
}
