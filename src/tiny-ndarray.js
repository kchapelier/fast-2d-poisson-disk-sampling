"use strict";

function tinyNDArrayOfInteger (gridShape) {
    return {
        strideX: gridShape[1],
        data: new Uint32Array(gridShape[0] * gridShape[1])
    };
}

module.exports = tinyNDArrayOfInteger;