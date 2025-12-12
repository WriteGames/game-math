# @writegames.com/game-math

A library of useful math classes & functions for game development, involving linear algebra, trigonometry, RNG, and more.

[![npm version](https://badge.fury.io/js/@writegames.com%2Fgame-math.svg)](https://badge.fury.io/js/@writegames.com%2Fgame-math)

## Installation

```sh
# choose based on your package manager
npm i @writegames.com/game-math
pnpm add @writegames.com/game-math
yarn add @writegames.com/game-math
```

## What's Included

### Linear Algebra

-   [Vec2](src/linear-algebra/vec2.ts), [Vec3](src/linear-algebra/vec3.ts), [Vec4](src/linear-algebra/vec4.ts), [Mat2](src/linear-algebra/mat2.ts), [Mat3](src/linear-algebra/mat3.ts), and [Mat4](src/linear-algebra/mat4.ts) classes
-   Dot products, cross products, vector-matrix multiplication, transformation matrices, and more

### Random Number Generator

-   [Random](src/util/random.ts) class
    -   Uses `xorShift32` as default random function
    -   `float(n)` - returns a random float between [0, n) (exclusive)
    -   `chance(n, max)` - returns `true` or `false` based off of `n` in `max` chances (ex: `chance(1, 5)` would return true 20% of the time)
    -   `int(n)` - returns a random int between [0, n) (exclusive) (ex: `int(3)` would return `0`, `1`, or `2`)
    -   `range(a, b)` - returns a random float between [a, b) (exclusive)
    -   `bool()` - returns `true` or `false`
    -   `sign()` - returns `-1` or `1`
    -   `angle()` - returns a random angle in degrees [0, 360)
    -   `choose(...items)` - returns a random item from the items passed (ex: `choose(1, 2, 3)` would return `1`, `2`, or `3`)
    -   `shuffle(arr)` - shuffles an array using the Fisher–Yates shuffle algorithm
    -   `vec2(scale)` - returns a random Vec2 of the length of `scale` (defaults to `1`)
    -   `vec3(scale)` - returns a random Vec3 of the length of `scale` (defaults to `1`)

### Directions

-   WIP

### Trigonometry

-   WIP

### Notes

While this is pre-1.0, [GameMaker](https://gamemaker.io) compatibility may be incomplete and/or broken.

## Credits

&copy; 2025 WriteGames.com. MIT License
