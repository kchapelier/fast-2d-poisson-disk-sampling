# fast-2d-poisson-disk-sampling

//TODO badges

2D Poisson Disk Sampling based on a modified Bridson algorithm.

## Installing

//TODO

## Features

- Can be used with a custom RNG function.
- Allow the configuration of the max number of tries.
- Same general API as [poisson-disk-sampling](https://github.com/kchapelier/poisson-disk-sampling).
- Speed.

## Basic example

```js
var p = new PoissonDiskSampling({
    shape: [600, 300],
    radius: 20,
    tries: 20
});
var points = p.fill();

console.log(points); // array of sample points, themselves represented as simple arrays
```

### Result as an image

//TODO

## Public API

### Constructor

**new PoissonDiskSampling(options[, rng])**

- *options :*
  - *shape :* Size/dimensions of the grid to generate points in, required.
  - *radius :* Minimum distance between each points, required.
  - *tries :* Maximum number of tries per point, defaults to 30.
- *rng :* A function to use as random number generator, defaults to Math.random.

```js
var pds = new PoissonDiskSampling({
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

## Implementation notes

//TODO

## History

//TODO

## Roadmap

//TODO

## How to contribute ?

For new features and other enhancements, please make sure to contact me beforehand, either on [Twitter](https://twitter.com/kchplr) or through an issue on Github.

## License

MIT