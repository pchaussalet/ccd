var cube2rickshaw = function(data) {
  var palette = new Rickshaw.Color.Palette();
  var series = {};
  for (var i=0; i<data.length; i++) {
    var serie = series[data[i].data.service];
    if (serie == undefined) {
      series[data[i].data.service] = {name: data[i].data.service, 
                                      data: [], 
                                      color: palette.color()};
      serie = series[data[i].data.service];
    }
    serie.data.push({x: Math.floor(new Date(data[i].time).getTime() / 1000), y: data[i].data.duration});
  }
  var rickseries = [];
  var series_names = Object.keys(series);
  for (var i=0; i<series_names.length; i++) {
    rickseries.push(series[series_names[i]]);
  }
  Rickshaw.Series.zeroFill(rickseries)
  return rickseries;
}

