import type { FuncReduceVector } from '../util/functional.js';
import { Random } from '../util/random.js';
import {
	addPos,
	approachVec,
	posEqual,
	scalePos,
	subPos,
	Vec2Like,
	type V2_T,
	type Vector,
} from './common.js';

export const isVec2 = (vec: Vector): vec is Vec2 => {
	return vec instanceof Vec2;
};

const X = 0;
const Y = 1;

/**
 * A 2d vector.
 * @category Linear Algebra
 */
export class Vec2 extends Array<number> {
	// length: 2 = 2 as const;

	/**
	 * Uninitialized values default to <0, 0>
	 * @param {number} x X position
	 * @param {number} y Y position
	 */
	constructor(x = 0, y = 0) {
		super(x, y);
	}

	/**
	 * Creates an instance of a Vec2 at <0, 0>
	 * @group Helper
	 * @type Vec2
	 */
	static get zero(): Vec2 {
		return new Vec2(0, 0);
	}

	/**
	 * Creates an instance of a Vec2 at <1, 1>
	 * @group Helper
	 * @type Vec2
	 */
	static get one(): Vec2 {
		return new Vec2(1, 1);
	}

	/**
	 * Creates an instance of a Vec2 at <-1, 0>
	 * @group Helper
	 * @type Vec2
	 */
	static get left(): Vec2 {
		return new Vec2(-1, 0);
	}

	/**
	 * Creates an instance of a Vec2 at <1, 0>
	 * @group Helper
	 * @type Vec2
	 */
	static get right(): Vec2 {
		return new Vec2(1, 0);
	}

	/**
	 * Creates an instance of a Vec2 at <0, -1>
	 * @group Helper
	 * @type Vec2
	 */
	static get up(): Vec2 {
		return new Vec2(0, -1);
	}

	/**
	 * Creates an instance of a Vec2 at <0, 1>
	 * @group Helper
	 * @type Vec2
	 */
	static get down(): Vec2 {
		return new Vec2(0, 1);
	}

	/**
	 * The x position of the vector. Equivalent to [0].
	 * @type number
	 */
	get x(): number {
		return this[X];
	}
	set x(value: number) {
		this[X] = value;
	}

	/**
	 * The y position of the vector. Equivalent to [1].
	 * @type number
	 */
	get y(): number {
		return this[Y];
	}
	set y(value: number) {
		this[Y] = value;
	}

	/**
	 * The magnitude (length) of the vector.
	 * @type number
	 */
	get magnitude(): number {
		return magnitude2D(this);
	}

	/**
	 * Sets x/y to another Vec2's properties.
	 * @param {Vec2} v Input vector
	 */
	set(v: Vec2): void {
		this.x = v.x;
		this.y = v.y;
	}

	/**
	 * Sets the vector to a given x/y pair.
	 * @param {number} x New x position
	 * @param {number} y New y position
	 */
	setXY(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	/**
	 * Normalizes a vector, setting its magnitude to 1.
	 * @memberof Vec2
	 * @method
	 * @group Static
	 * @param {Vec2} v The vector to normalize
	 * @returns {Vec2} The input vector
	 */
	static normalize = (v: Vec2): Vec2 => {
		return v.clone().invScale(v.magnitude);
	};
	/**
	 * Normalizes the vector, setting its magnitude to 1.
	 * @returns {this} this
	 */
	normalize(): this {
		return this.invScale(this.magnitude);
	}

	/**
	 * Creates a new Vec2 instance with identical properties.
	 * @returns {Vec2} A clone of the vector
	 */
	clone(): Vec2 {
		return new Vec2(...this);
	}

	/**
	 * Adds two {@link Vec2}s and returns a new {@link Vec2} with the sum.
	 * @memberof Vec2
	 * @method
	 * @group Static
	 * @param {Vec2} a Vector a
	 * @param {Vec2} b Vector b
	 * @returns {Vec2} Vec2
	 */
	static add = (a: Vec2, b: Vector): Vec2 => addPos(a, b);

	/**
	 * Adds a vector to itself.
	 * @param v Vector to add
	 * @returns {this} this
	 */
	add(v: Vector): this {
		this.x += v[X];
		this.y += v[Y];
		return this;
	}

	/**
	 * An alias for {@link Vec2.add}.
	 * @memberof Vec2
	 * @method
	 * @group Static
	 * @param {Vec2} a Vector a
	 * @param {Vec2} b Vector b
	 * @returns {Vec2} Vec2
	 */
	static plus = (a: Vec2, b: Vector): Vec2 => Vec2.add(a, b);

	/**
	 * An alias for {@link Vec2#add}.
	 * @param {Vec2} v Vector to add
	 * @returns {this} his
	 */
	plus(v: Vector): this {
		return this.add(v);
	}

	/**
	 * Subtracts two {@link Vec2}s and returns a new {@link Vec2} with the difference.
	 * @memberof Vec2
	 * @method
	 * @group Static
	 * @param {Vec2} a Vector a
	 * @param {Vec2} b Vector b
	 * @returns {Vec2} Vec2
	 */
	static sub = (a: Vec2, b: Vector): Vec2 => subPos(a, b);

	/**
	 * Subtracts a vector from itself.
	 * @param {Vec2} v Vector to subtract
	 * @returns {this} this
	 */
	sub(v: Vector): this {
		this.x -= v[X];
		this.y -= v[Y];
		return this;
	}

	/**
	 * An alias for {@link Vec2.sub}.
	 * @memberof Vec2
	 * @method
	 * @group Static
	 * @param {Vec2} a Vector a
	 * @param {Vec2} b Vector b
	 * @returns {Vec2} Vec2
	 */
	static minus = (a: Vec2, b: Vector): Vec2 => Vec2.sub(a, b);

	/**
	 * An alias for {@link Vec2#sub}.
	 * @param {Vec2} v Vector to subtract
	 * @returns {this} this
	 */
	minus(v: Vector): this {
		return this.sub(v);
	}

	/**
	 * Scales a vector by a scalar.
	 * @memberof Vec2
	 * @method
	 * @group Static
	 * @param {Vec2} v Vector to scale
	 * @param {number} s Scalar
	 * @returns {Vec2} The vector, scaled
	 */
	static scale = (v: Vec2, s: number): Vec2 => scalePos(v, s);

	/**
	 * Scales the vector by a scalar.
	 * @param s Scalar
	 * @returns {this}
	 */
	scale(s: number): this {
		this.x *= s;
		this.y *= s;
		return this;
	}

	/**
	 * Scales a vector by the inverse of a scalar.
	 * @memberof Vec2
	 * @method
	 * @group Static
	 * @param {Vec2} v Vector to scale
	 * @param {number} s Scalar
	 * @returns {Vec2} The vector, scaled inversely
	 */
	static invScale = (v: Vec2, s: number): Vec2 => scalePos(v, 1 / s);

	/**
	 * Scales the vector by the inverse of a scalar.
	 * @param s Scalar
	 * @returns {this}
	 */
	invScale(s: number): this {
		const iS = s !== 0 ? 1 / s : 0;
		this.x *= iS;
		this.y *= iS;
		return this;
	}

	/**
	 * @group Static
	 */
	static cross = (a: Vec2, b: Vec2 | V2_T): number => crossProduct2D(a, b);
	cross(v: Vec2 | V2_T): number {
		return Vec2.cross(this, v);
	}

	/**
	 * @group Static
	 */
	static dot = (a: Vec2, b: Vec2 | V2_T): number => dotProduct2D(a, b);
	dot(v: Vec2 | V2_T): number {
		return Vec2.dot(this, v);
	}

	/**
	 * @group Static
	 */
	static rotate = (v: Vec2, angle: number): Vec2 => rotate2D(v, angle);
	rotate(angle: number): this {
		const v = Vec2.rotate(this, angle);
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	/**
	 * @group Static
	 */
	static equal = (a: Vec2, b: Vec2 | V2_T): boolean => posEqual(a, b);
	equal(v: Vec2 | V2_T): boolean {
		return Vec2.equal(this, v);
	}

	/**
	 * Linearly interpolates between two {@link Vec2}s.
	 * @memberof Vec2
	 * @method
	 * @group Static
	 * @param {Vec2} a Start vector
	 * @param {Vec2} b End vector
	 * @param {number} t Percentage between a and b
	 * @returns {Vec2}
	 */
	static lerp = (a: Vec2, b: Vec2, t: number): Vec2 => {
		return Vec2.sub(b, a).scale(t).add(a);
	};

	static approach = (
		v: Vec2Like,
		target: Vec2Like,
		amount: Vec2Like,
	): Vec2Like => approachVec(v, target, amount);

	/**
	 * Returns a random {@link Vec2}, with a uniform sample distribution.
	 * @memberof Vec2
	 * @method
	 * @group Static
	 * @param {number} scale Magnitude of the vector, defaults to 1
	 * @returns {Vec2} A random vector
	 */
	static random = (scale = 1): Vec2 => {
		return Random.vec2(scale);
	};
}

export const indexToPos = (index: number, stride: number): Vec2 =>
	new Vec2(index % stride, Math.floor(index / stride));
export const posToIndex = ([x, y]: Vec2, stride: number): number =>
	y * stride + x;

export const rotate2D = (v: Vec2, angle: number): Vec2 => {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return new Vec2(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
};

export const crossProduct2D: FuncReduceVector<Vec2 | V2_T> = (a, b) =>
	a[0] * b[1] - a[1] * b[0];
export const dotProduct2D: FuncReduceVector<Vec2 | V2_T> = (a, b) =>
	a[0] * b[0] + a[1] * b[1];
export const magnitude2D = (v: Vec2): number =>
	Math.sqrt(v[X] ** 2 + v[Y] ** 2);
