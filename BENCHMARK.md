# Benchmark

In this benchmark, the performance of this javascript implementation is tested against the `poisson-disk-sampling` package. `poisson-disk-sampling` supports arbitrary dimensions but previous benchmarks demonstrated it is just as fast as the fastest 2d-only implementation available on NPM.

`poisson-disk-sampling` samples its points at a distance of `r` (minDistance) to `2r` (maxDistance) of the active point (this behavior is overridable but changing it tends to reduce the quality/randomness of the result), while `fast-2d-poisson-disk-sampling` samples its points at a fixed distance of `r`. Two benchmarks will be made for `poisson-disk-sampling`, one with the same `r` as `fast-2d-poisson-disk-sampling` thus generating a much lower point density and one with an adjusted `r` to generate the same point density.


## Fast 2D Poisson Disc Sampling (1.0.0) benchmark

```
[800x800 radius 8 tries 15]: 12.981ms for ~8079 points
[800x800 radius 8 tries 30]: 23.658ms for ~8407 points
[800x800 radius 8 tries 60]: 35.481ms for ~8624 points

[800x800 radius 4 tries 15]: 50.549ms for ~32158 points
[800x800 radius 4 tries 30]: 85.435ms for ~33423 points
[800x800 radius 4 tries 60]: 143.065ms for ~34302 points

[800x800 radius 2 tries 15]: 206.735ms for ~128235 points
[800x800 radius 2 tries 30]: 343.746ms for ~133204 points
[800x800 radius 2 tries 60]: 590.924ms for ~136693 points
```

## Poisson Disc Sampling (2.2.1) benchmark, r adjusted, ~same point density

```
[800x800 minDistance 6.96 maxDistance 13.93 tries 15]: 24.062ms for ~8052 points
[800x800 minDistance 6.96 maxDistance 13.93 tries 30]: 39.890ms for ~8377 points
[800x800 minDistance 6.96 maxDistance 13.93 tries 60]: 73.508ms for ~8715 points

[800x800 minDistance 3.48 maxDistance 6.96 tries 15]: 87.390ms for ~32174 points
[800x800 minDistance 3.48 maxDistance 6.96 tries 30]: 156.458ms for ~33423 points
[800x800 minDistance 3.48 maxDistance 6.96 tries 60]: 292.271ms for ~34634 points

[800x800 minDistance 1.74 maxDistance 3.48 tries 15]: 351.898ms for ~128359 points
[800x800 minDistance 1.74 maxDistance 3.48 tries 30]: 626.503ms for ~133321 points
[800x800 minDistance 1.74 maxDistance 3.48 tries 60]: 1162.315ms for ~138357 points
```

## Poisson Disc Sampling (2.2.1) benchmark, same r, lower point density

```
[800x800 minDistance 8.00 maxDistance 16.00 tries 15]: 18.508ms for ~6110 points
[800x800 minDistance 8.00 maxDistance 16.00 tries 30]: 30.538ms for ~6373 points
[800x800 minDistance 8.00 maxDistance 16.00 tries 60]: 55.596ms for ~6608 points

[800x800 minDistance 4.00 maxDistance 8.00 tries 15]: 66.215ms for ~24381 points
[800x800 minDistance 4.00 maxDistance 8.00 tries 30]: 118.758ms for ~25335 points
[800x800 minDistance 4.00 maxDistance 8.00 tries 60]: 221.161ms for ~26298 points

[800x800 minDistance 2.00 maxDistance 4.00 tries 15]: 267.078ms for ~97268 points
[800x800 minDistance 2.00 maxDistance 4.00 tries 30]: 473.950ms for ~101045 points
[800x800 minDistance 2.00 maxDistance 4.00 tries 60]: 880.385ms for ~104867 points
```