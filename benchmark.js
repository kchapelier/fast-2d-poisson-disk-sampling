"use strict";

function toMs (time) {
    return (time[0] * 1000 + time[1] / 1000000);
}

var Poisson = require('./'),
    time, p, i, s;

// warmup
s = 0;
for (i = 0; i < 10; i++) {
    p = new Poisson({
        shape: [800, 400],
        radius: 10,
        tries: 10
    });
    s+= p.fill().length;
}

function benchmark (size, radius, tries, testIterations) {
    var time = process.hrtime();
    var s = 0;

    for (var i = 0; i < testIterations; i++) {
        p = new Poisson({
            shape: [size, size],
            radius: radius,
            tries: tries
        });
        p.addPoint([size / 2, size / 2]);
        s+= p.fill().length;
    }
    
    time = process.hrtime(time);

    console.log('[' + size + 'x' + size + ' radius ' + radius + ' tries ' + tries + ']: ' + (toMs(time) / testIterations).toFixed(3) + 'ms for ~' + (s/testIterations|0)+' points');
}

console.log();

console.log('Fast 2D Poisson Disc Sampling benchmark');

console.log();

benchmark(1024, 8, 4, 10);
benchmark(1024, 8, 15, 10);
benchmark(1024, 8, 30, 10);
benchmark(1024, 8, 60, 10);

console.log();

benchmark(1024, 4, 4, 10);
benchmark(1024, 4, 15, 8);
benchmark(1024, 4, 30, 8);
benchmark(1024, 4, 60, 8);

console.log();

benchmark(1024, 2, 4, 10);
benchmark(1024, 2, 15, 6);
benchmark(1024, 2, 30, 6);
benchmark(1024, 2, 60, 6);

console.log();