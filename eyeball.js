"use strict";

var Poisson = require('./');
var PNG = require('pngjs-nozlib').PNG;

function outputPng (sampling, drawFunc) {
  var png = new PNG({
    width: sampling.width,
    height: sampling.height,
    colortype: 6,
    inputHasAlpha: true,
    filterType: 4
  });

  var pngData = new Uint8Array(png.data);

  drawFunc(sampling, pngData);

  // set all alpha values
  for (var i = 3; i < pngData.length; i+=4) {
    pngData[i] = 255;
  }

  png.data = pngData;

  png.pack().pipe(process.stdout);
}

var sampling = new Poisson({
  shape: [500, 200],
  radius: 6,
  tries: 20
});

sampling.fill();

require('fs').writeFileSync('./test.log', JSON.stringify(sampling.getAllPoints().sort((a, b) => a[0] - b[0]), null, 2), { flag: 'w+' });

outputPng(sampling, function (sampling, pngData) {
  sampling.getAllPoints().forEach(function (point) {
    var pixelIndex = (Math.floor(point[0]) + Math.floor(point[1]) * sampling.width) * 4;
    pngData[pixelIndex] = pngData[pixelIndex + 1] = pngData[pixelIndex + 2] = 255;
  });
});








