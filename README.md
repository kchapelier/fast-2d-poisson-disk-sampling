# fast-2d-poisson-disk-sampling

[![Build Status](https://travis-ci.org/kchapelier/fast-2d-poisson-disk-sampling.svg)](https://travis-ci.org/kchapelier/fast-2d-poisson-disk-sampling) [![NPM version](https://badge.fury.io/js/fast-2d-poisson-disk-sampling.svg)](http://badge.fury.io/js/fast-2d-poisson-disk-sampling)

Fast 2D Poisson Disk Sampling based on a modified Bridson algorithm.

## Installing

With [npm](https://www.npmjs.com/) do:

```
npm install fast-2d-poisson-disk-sampling
```

With [yarn](https://yarnpkg.com/) do:

```
yarn add fast-2d-poisson-disk-sampling
```

A compiled version for web browsers is also available on a CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/kchapelier/fast-2d-poisson-disk-sampling@1.0.3/build/fast-poisson-disk-sampling.min.js"></script>
```

## Features

- Can be used with a custom RNG function.
- Allow the configuration of the max number of tries.
- Same general API as [poisson-disk-sampling](https://github.com/kchapelier/poisson-disk-sampling) and [jittered-hexagonal-grid-sampling](https://github.com/kchapelier/jittered-hexagonal-grid-sampling).
- Speed, see [benchmark results](https://github.com/kchapelier/fast-2d-poisson-disk-sampling/blob/master/BENCHMARK.md).

## Basic example

```js
var p = new FastPoissonDiskSampling({
    shape: [500, 200],
    radius: 6,
    tries: 20
});
var points = p.fill();

console.log(points); // array of sample points, themselves represented as simple arrays
```

### Result as an image

<img src="https://github.com/kchapelier/fast-2d-poisson-disk-sampling/raw/master/img/example1.png" style="image-rendering:pixelated; width:500px;"></img>

## Public API

### Constructor

**new FastPoissonDiskSampling(options[, rng])**

- *options :*
  - *shape :* Size/dimensions of the grid to generate points in, required.
  - *radius :* Minimum distance between each points, required.
  - *tries :* Maximum number of tries per point, defaults to 30.
- *rng :* A function to use as random number generator, defaults to Math.random.

Note: "minDistance" can be used instead of "radius", ensuring API compatibility with [poisson-disk-sampling](https://github.com/kchapelier/poisson-disk-sampling).

The following code will allow the generation of points where both coordinates will range from *0 up to 50* (including 0, but not including 50, **0 <= c < 50**).

```js
var pds = new FastPoissonDiskSampling({
    shape: [50, 50],
    radius: 4,
    tries: 10
});
```

### Method

**pds.fill()**

Fill the grid with random points following the distance constraint.

Returns the entirety of the points in the grid as an array of coordinate arrays. The points are sorted in their generation order.

```js
var points = pds.fill();

console.log(points[0]);
// prints something like [30, 16]
```

**pds.getAllPoints()**

Get all the points present in the grid without trying to generate any new points.

Returns the entirety of the points in the grid as an array of coordinate arrays. The points are sorted in their generation order.

```js
var points = pds.getAllPoints();

console.log(points[0]);
// prints something like [30, 16]
```

**pds.addRandomPoint()**

Add a completely random point to the grid. There won't be any check on the distance constraint with the other points already present in the grid.

Returns the point as a coordinate array.

**pds.addPoint(point)**

- *point :* Point represented as a coordinate array.

Add an arbitrary point to the grid. There won't be any check on the distance constraint with the other points already present in the grid.

Returns the point added to the grid.

If the given coordinate array does not have a length of 2 or doesn't fit in the grid size, null will be returned.

```js
pds.addPoint([20, 30]);
```

**pds.next()**

Try to generate a new point in the grid following the distance constraint.

Returns a coordinate array when a point is generated, null otherwise.

```js
var point;

while(point = pds.next()) {
    console.log(point); // [x, y]
}
```

**pds.reset()**

Reinitialize the grid as well as the internal state.

When doing multiple samplings in the same grid, it is preferable to reuse the same instance of PoissonDiskSampling instead of creating a new one for each sampling.

## History

### [1.0.3](https://github.com/kchapelier/fast-2d-poisson-disk-sampling/tree/1.0.3) (2022-05-28) :

- Fix potential floating point issue when working with shape's bounds > 512
- Performance tweaks (~10% faster)

### [1.0.2](https://github.com/kchapelier/fast-2d-poisson-disk-sampling/tree/1.0.2) (2022-05-21) :

- Update dev dependencies, add a test to the test suite

### [1.0.1](https://github.com/kchapelier/fast-2d-poisson-disk-sampling/tree/1.0.1) (2020-05-24) :

- Tweaks to improve the result (higher point density)

### [1.0.0](https://github.com/kchapelier/fast-2d-poisson-disk-sampling/tree/1.0.0) (2020-05-24) :

- First release

## Roadmap

Write a proper description of the algorithm.

## How to contribute ?

For new features and other enhancements, please make sure to contact me beforehand, either on [Twitter](https://twitter.com/kchplr) or through an issue on Github.

## License

MIT