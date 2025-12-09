# Game Math

A library of useful math classes & functions for game development, involving linear algebra, trigonometry, RNG, and more.

## Installation

```sh
# choose based on your package manager
npm i @writegames.com/game-math
pnpm add @writegames.com/game-math
yarn add @writegames.com/game-math
```

## What's Included

### Linear Algebra

-   [Vec2](vectors/vec2.ts), [Vec3](vectors/vec3.ts), [Vec4](vectors/vec4.ts), [Mat2](vectors/mat2.ts), [Mat3](vectors/mat3.ts), and [Mat4](vectors/mat4.ts) classes
-   Dot products, cross products, vector-matrix multiplication, transformation matrices, and more

### Random Number Generator

-   [Random](util/random.ts) class
    -   Uses `xorShift32` as default random function
    -   `float(n)` - returns a random float between [0, n) (exclusive)
    -   `chance(n, max)` - returns `true` or `false` based off of `n` in `max` chances (ex: `chance(1, 5)` would return true 20% of the time)
    -   `int(n)` - returns a random int between [0, n) (exclusive) (ex: `int(3)` would return `0`, `1`, or `2`)
    -   `range(a, b)` - returns a random float between [a, b) (exclusive)
    -   `bool()` - returns `true` or `false`
    -   `sign()` - returns `-1` or `1`
    -   `angle()` - returns a random angle in degrees [0, 360)
    -   `choose(items)` - returns a random item from the array passed
    -   `shuffle(arr)` - shuffles an array using the Fisher–Yates shuffle algorithm
    -   `vec2(scale)` - returns a random Vec2 of the length of `scale` (defaults to `1`)
    -   `vec3(scale)` - returns a random Vec3 of the length of `scale` (defaults to `1`)

### Directions

-   WIP

### Trigonometry

-   WIP

## Credits

&copy; 2025 WriteGames.com. MIT License
