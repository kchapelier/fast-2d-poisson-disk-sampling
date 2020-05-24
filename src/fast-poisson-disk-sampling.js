"use strict";

var tinyNDArray = require('./tiny-ndarray');

var epsilon = 2e-14;
var piDiv3 = Math.PI / 3;

var neighbourhood = [
    [ 0, 0 ],   [ 0, -1 ],  [ -1, 0 ],
    [ 1, 0 ],   [ 0, 1 ],   [ -1, -1 ],
    [ 1, -1 ],  [ -1, 1 ],  [ 1, 1 ],
    [ 0, -2 ],  [ -2, 0 ],  [ 2, 0 ],
    [ 0, 2 ],   [ -1, -2 ], [ 1, -2 ],
    [ -2, -1 ], [ 2, -1 ],  [ -2, 1 ],
    [ 2, 1 ],   [ -1, 2 ],  [ 1, 2 ]
];

var neighbourhoodLength = neighbourhood.length;

/**
 * FastPoissonDiskSampling constructor
 * @param {object} options Options
 * @param {Array} options.shape Shape of the space
 * @param {float} options.radius Minimum distance between each points
 * @param {int} [options.tries] Number of times the algorithm will try to place a point in the neighbourhood of another points, defaults to 30
 * @param {function|null} [rng] RNG function, defaults to Math.random
 * @constructor
 */
function FastPoissonDiskSampling (options, rng) {
    this.width = options.shape[0];
    this.height = options.shape[1];
    this.radius = options.radius || options.minDistance;
    this.maxTries = Math.max(3, Math.ceil(options.tries || 30));

    this.rng = rng || Math.random;

    this.squaredRadius = this.radius * this.radius;
    this.radiusPlusEpsilon = this.radius + epsilon;
    this.cellSize = this.radius * Math.SQRT1_2;

    this.angleIncrement = Math.PI * 2 / this.maxTries;
    this.angleIncrementOnSuccess = piDiv3 + epsilon;
    this.triesIncrementOnSuccess = Math.ceil(this.angleIncrementOnSuccess / this.angleIncrement);

    this.processList = [];
    this.samplePoints = [];

    // cache grid

    this.gridShape = [
        Math.ceil(this.width / this.cellSize),
        Math.ceil(this.height / this.cellSize)
    ];

    this.grid = tinyNDArray(this.gridShape); //will store references to samplePoints
}

FastPoissonDiskSampling.prototype.width = null;
FastPoissonDiskSampling.prototype.height = null;
FastPoissonDiskSampling.prototype.radius = null;
FastPoissonDiskSampling.prototype.radiusPlusEpsilon = null;
FastPoissonDiskSampling.prototype.squaredRadius = null;
FastPoissonDiskSampling.prototype.cellSize = null;

FastPoissonDiskSampling.prototype.angleIncrement = null;
FastPoissonDiskSampling.prototype.angleIncrementOnSuccess = null;
FastPoissonDiskSampling.prototype.triesIncrementOnSuccess = null;

FastPoissonDiskSampling.prototype.maxTries = null;
FastPoissonDiskSampling.prototype.rng = null;

FastPoissonDiskSampling.prototype.processList = null;
FastPoissonDiskSampling.prototype.samplePoints = null;
FastPoissonDiskSampling.prototype.gridShape = null;
FastPoissonDiskSampling.prototype.grid = null;

/**
 * Add a totally random point in the grid
 * @returns {Array} The point added to the grid
 */
FastPoissonDiskSampling.prototype.addRandomPoint = function () {
    return this.directAddPoint([
        this.rng() * this.width,
        this.rng() * this.height,
        this.rng() * Math.PI * 2,
        0
    ]);
};

/**
 * Add a given point to the grid
 * @param {Array} point Point
 * @returns {Array|null} The point added to the grid, null if the point is out of the bound or not of the correct dimension
 */
FastPoissonDiskSampling.prototype.addPoint = function (point) {
    var valid = point.length === 2 && point[0] >= 0 && point[0] < this.width && point[1] >= 0 && point[1] < this.height;

    return valid ? this.directAddPoint([
        point[0],
        point[1],
        this.rng() * Math.PI * 2,
        0
    ]) : null;
};

/**
 * Add a given point to the grid, without any check
 * @param {Array} point Point
 * @returns {Array} The point added to the grid
 * @protected
 */
FastPoissonDiskSampling.prototype.directAddPoint = function (point) {
    var coordsOnly = [point[0], point[1]];
    this.processList.push(point);
    this.samplePoints.push(coordsOnly);

    var internalArrayIndex = ((point[0] / this.cellSize) | 0) * this.grid.stride[0] + ((point[1] / this.cellSize) | 0);

    this.grid.data[internalArrayIndex] = this.samplePoints.length; // store the point reference

    return coordsOnly;
};

/**
 * Check whether a given point is in the neighbourhood of existing points
 * @param {Array} point Point
 * @returns {boolean} Whether the point is in the neighbourhood of another point
 * @protected
 */
FastPoissonDiskSampling.prototype.inNeighbourhood = function (point) {
    var dimensionNumber = 2,
        stride = this.grid.stride,
        neighbourIndex,
        internalArrayIndex,
        dimension,
        currentDimensionValue,
        existingPoint;

    for (neighbourIndex = 0; neighbourIndex < neighbourhoodLength; neighbourIndex++) {
        internalArrayIndex = 0;

        for (dimension = 0; dimension < dimensionNumber; dimension++) {
            currentDimensionValue = ((point[dimension] / this.cellSize) | 0) + neighbourhood[neighbourIndex][dimension];

            if (currentDimensionValue < 0 || currentDimensionValue >= this.gridShape[dimension]) {
                internalArrayIndex = -1;
                break;
            }

            internalArrayIndex += currentDimensionValue * stride[dimension];
        }

        if (internalArrayIndex !== -1 && this.grid.data[internalArrayIndex] !== 0) {
            existingPoint = this.samplePoints[this.grid.data[internalArrayIndex] - 1];

            if (Math.pow(point[0] - existingPoint[0], 2) + Math.pow(point[1] - existingPoint[1], 2) < this.squaredRadius) {
                return true;
            }
        }
    }

    return false;
};

/**
 * Try to generate a new point in the grid, returns null if it wasn't possible
 * @returns {Array|null} The added point or null
 */
FastPoissonDiskSampling.prototype.next = function () {
    var tries,
        currentPoint,
        currentAngle,
        newPoint;

    while (this.processList.length > 0) {
        var index = this.processList.length * this.rng() | 0;

        currentPoint = this.processList[index];
        currentAngle = currentPoint[2];
        tries = currentPoint[3];

        if (tries === 0) {
            currentAngle = currentAngle + (this.rng() - 0.5) * piDiv3 * 4;
        }

        for (; tries < this.maxTries; tries++) {
            newPoint = [
                currentPoint[0] + Math.cos(currentAngle) * this.radiusPlusEpsilon,
                currentPoint[1] + Math.sin(currentAngle) * this.radiusPlusEpsilon,
                currentAngle,
                0
            ];

            if (
                (newPoint[0] >= 0 && newPoint[0] < this.width) &&
                (newPoint[1] >= 0 && newPoint[1] < this.height) &&
                !this.inNeighbourhood(newPoint)
            ) {
                currentPoint[2] = currentAngle + this.angleIncrementOnSuccess + this.rng() * this.angleIncrement;
                currentPoint[3] = tries + this.triesIncrementOnSuccess;
                return this.directAddPoint(newPoint);
            }

            currentAngle = currentAngle + this.angleIncrement;
        }

        if (tries >= this.maxTries) {
            const r = this.processList.pop();
            if (index < this.processList.length) {
                this.processList[index] = r;
            }
        }
    }

    return null;
};

/**
 * Automatically fill the grid, adding a random point to start the process if needed.
 * Will block the thread, probably best to use it in a web worker or child process.
 * @returns {Array[]} Sample points
 */
FastPoissonDiskSampling.prototype.fill = function () {
    if (this.samplePoints.length === 0) {
        this.addRandomPoint();
    }

    while(this.next()) {}

    return this.samplePoints;
};

/**
 * Get all the points in the grid.
 * @returns {Array[]} Sample points
 */
FastPoissonDiskSampling.prototype.getAllPoints = function () {
    return this.samplePoints;
};

/**
 * Reinitialize the grid as well as the internal state
 */
FastPoissonDiskSampling.prototype.reset = function () {
    var gridData = this.grid.data,
        i;

    // reset the cache grid
    for (i = 0; i < gridData.length; i++) {
        gridData[i] = 0;
    }

    // new array for the samplePoints as it is passed by reference to the outside
    this.samplePoints = [];

    // reset the internal state
    this.processList.length = 0;
};

module.exports = FastPoissonDiskSampling;
