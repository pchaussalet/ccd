var palette = new Rickshaw.Color.Palette();
var addGraphs = function(expressions, row, column, options) {
  var cell_id = row + column;
  var cell = $('#' + cell_id);
  
  var container = {
    width: cell.attr('dims').split('x')[0],
    height: cell.attr('dims').split('x')[1]-5
  }

  var start = options['start'] ? options['start']:new Date(new Date().setHours(new Date().getHours()-1)).toISOString();
  var stop = options['stop'] ? options['stop']:new Date().toISOString();

  var cube_addr = $(document).data('cube_addr');

  var dataSeries = [];
  for (var i = 0; i < expressions.length; i++) {
    dataSeries.push({
      data: [{x:new Date().getTime()/1000, y:0}],
      color: palette.color(),
      name: expressions[i]
    });
  }

  var graph = new Rickshaw.Graph({
    element: cell[0],
    series: dataSeries,
    width: container.width,
    height: container.height,
    renderer: options.renderer?options.renderer:'line',
  });

  var updateGraph = function(graph, start, stop) {
    graph.render();
    if (!start) {
      start = new Date(new Date().setSeconds(new Date().getSeconds()-10)).toISOString();
    }
    if (!stop) {
      stop = new Date().toISOString();
    }

    for (var i = 0; i < expressions.length; i++) {
      var url = 'http://' + cube_addr + '/1.0/metric?step=60000&expression=' + expressions[i] + '&start=' + start + '&stop=' + stop
      var callback = getCallback(graph, i);
      $.getJSON(url, callback);
    }
    setTimeout(function() { updateGraph(graph); }, 10000);
  }

  var getEntry = function(time, value) {
    return {x: new Date(time).getTime()/1000, y: value};
  }

  var getCallback = function(graph, idx) {
    return  function(d) {
              graph.series[idx].data.pop();
              for (var j = 0; j < d.length; j++) {
                var value = 0;
                if (d[j].value) {
                  value = d[j].value;
                }
                graph.series[idx].data.push(getEntry(d[j].time, value));
              }
            }
  }

  new Rickshaw.Graph.HoverDetail({ graph: graph });
  new Rickshaw.Graph.Axis.Time({
    graph: graph,
    element: document.getElementById(cell_id)
  }).render();
  new Rickshaw.Graph.Axis.Y({
    graph: graph,
    tickFormat: Rickshaw.Fixtures.Number.formatKMBT
  }).render();

  updateGraph(graph, start, stop);
  setTimeout(function() { graph.render() }, 1000);
}

var addTrafficLight = function(expression, row, column, colorsMapping) {
  var cell_id = row + column;
  var cell = $('#' + cell_id);

  var container = {
    width: cell.attr('dims').split('x')[0],
    height: cell.attr('dims').split('x')[1]-5
  }

  cell.append('&nbsp;');
  
  var cube_addr = $(document).data('cube_addr');

  var socket = new WebSocket("ws://" + cube_addr + "/1.0/event/get");

  var start = new Date(new Date().setHours(new Date().getHours()-1)).toISOString();

  socket.onopen = function() {
    socket.send(JSON.stringify({
        "expression": expression,
        "start": start
    }));
  };
        
  socket.onmessage = function(message) {
    var payload = JSON.parse(message.data);
    cell.css('background-color', '#' + colorsMapping[payload.data.value]);
  };
}

var addText = function(expression, row, column) {
  var cell_id = row + column;
  var cell = $('#' + cell_id);

  cell.css('height', '250px').css('width', '100%');
  
  var container = $('<div/>').appendTo(cell);

  var socket = new WebSocket("ws://localhost:1081/1.0/event/get");

  socket.onopen = function() {
    socket.send(JSON.stringify({
        "expression": expression,
        "start": "2013-01-01"
    }));
  };
        
  socket.onmessage = function(message) {
    var payload = JSON.parse(message.data);
    container.empty();
    container.append(payload.data.color);
    container .css('height', '100%')
              .css('text-align', 'center')
              .css('position', 'relative')
              .css('top', '125px');
    container.css('font-size', container.height()-10);
  };
}
