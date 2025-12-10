import type { FuncReduceVector } from '../util/functional.js';
import { Random } from '../util/random.js';
import {
	addPos,
	approachVec,
	posEqual,
	scalePos,
	subPos,
	Vec4Like,
	type V4_T,
	type Vec2Like,
	type Vec3Like,
	type Vector,
} from './common.js';
import { Vec2 } from './vec2.js';
import { Vec3 } from './vec3.js';

export const isVec4 = (vec: Vector): vec is Vec4 => {
	return vec instanceof Vec4;
};

const error = 'Vec4';

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

/**
 * A 4d vector.
 * @category Linear Algebra
 */
export class Vec4 extends Array<number> {
	// length: 4 = 4 as const;

	/**
	 * Uninitialized values default to <0, 0, 0, 0>.
	 * @param {number} x X value
	 * @param {number} y Y value
	 * @param {number} z Z value
	 * @param {number} w W value
	 */
	constructor(x = 0, y = 0, z = 0, w = 0) {
		super(x, y, z, w);
	}

	/**
	 * Creates an instance of a Vec3 at <0, 0, 0, 0>
	 * @group Helper
	 * @type Vec2
	 */
	static get zero(): Vec4 {
		return new Vec4(0, 0, 0, 0);
	}

	/**
	 * Creates an instance of a Vec3 at <1, 1, 1, 1>
	 * @group Helper
	 * @type Vec2
	 */
	static get one(): Vec4 {
		return new Vec4(1, 1, 1, 1);
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
	 * The z position of the vector. Equivalent to [2].
	 * @type number
	 */
	get z(): number {
		return this[Z];
	}
	set z(value: number) {
		this[Z] = value;
	}

	/**
	 * The w position of the vector. Equivalent to [3].
	 * @type number
	 */
	get w(): number {
		return this[W];
	}
	set w(value: number) {
		this[W] = value;
	}

	/**
	 * The xy position of the vector, as a {@link Vec2}.
	 * @type Vec2
	 */
	get xy(): Vec2 {
		return new Vec2(this.x, this.y);
	}
	set xy(v: Vec2Like) {
		this.x = v[X];
		this.y = v[Y];
	}

	/**
	 * The xy position of the vector, as a {@link Vec3}.
	 * @type Vec3
	 */
	get xyz(): Vec3 {
		return new Vec3(this.x, this.y, this.z);
	}
	set xyz(v: Vec3Like) {
		this.x = v[X];
		this.y = v[Y];
		this.z = v[Z];
	}

	/**
	 * The magnitude (length) of the vector.
	 * @type number
	 */
	get magnitude(): number {
		return magnitude4D(this);
	}

	/**
	 * Sets x/y to another Vec4's properties.
	 * @param {Vec4} v Input vector
	 */
	set(v: Vec4): void {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = v.w;
	}

	/**
	 * Sets the vector to a set of values.
	 * @param {number} x New x position
	 * @param {number} y New y position
	 * @param {number} z New z position
	 * @param {number} w New w position
	 */
	setXYZW(x: number, y: number, z: number, w: number): void {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	/**
	 * Normalizes a vector, setting its magnitude to 1.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4} v The vector to normalize
	 * @returns {Vec4} The input vector
	 */
	static normalize = (v: Vec4): Vec4 => {
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
	 * Creates a new Vec4 instance with identical properties.
	 * @returns {Vec4} A clone of the vector
	 */
	clone(): Vec4 {
		return new Vec4(...this);
	}

	/**
	 * Adds two {@link Vec4}s and returns a new {@link Vec4} with the sum.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4} a Vector a
	 * @param {Vec4} b Vector b
	 * @returns {Vec4} Sum
	 */
	static add = (a: Vec4, b: Vec4 | Vector): Vec4 => addPos(a, b);

	/**
	 * Adds a vector to itself.
	 * @param v Vector to add
	 * @returns {this} this
	 */
	add(v: Vec4 | Vector): this {
		this.x += v[X];
		this.y += v[Y];
		this.z += v[Z] ?? 0;
		this.w += v[W] ?? 0;
		return this;
	}

	/**
	 * An alias for {@link Vec4.add}.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4} a Vector a
	 * @param {Vec4} b Vector b
	 * @returns {Vec4} Sum
	 */
	static plus = (a: Vec4, b: Vec4 | Vector): Vec4 => Vec4.add(a, b);

	/**
	 * An alias for {@link Vec4#add}.
	 * @param {Vec4} v Vector to add
	 * @returns {this} this
	 */
	plus(v: Vec4 | Vector): this {
		return this.add(v);
	}

	/**
	 * Subtracts two {@link Vec4}s and returns a new {@link Vec4} with the difference.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4} a Vector a
	 * @param {Vec4} b Vector b
	 * @returns {Vec4} Vec2
	 */
	static sub = (a: Vec4, b: Vec4 | Vector): Vec4 => subPos(a, b);

	/**
	 * Subtracts a vector from itself.
	 * @param {Vec4} v Vector to subtract
	 * @returns {this} this
	 */
	sub(v: Vec4 | Vector): this {
		this.x -= v[X];
		this.y -= v[Y];
		this.z -= v[Z] ?? 0;
		this.w -= v[W] ?? 0;
		return this;
	}

	/**
	 * An alias for {@link Vec4.sub}.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4} a Vector a
	 * @param {Vec4} b Vector b
	 * @returns {Vec4} Vec2
	 */
	static minus = (a: Vec4, b: Vec4 | Vector): Vec4 => Vec4.sub(a, b);

	/**
	 * An alias for {@link Vec4#sub}.
	 * @param {Vec4} v Vector to subtract
	 * @returns {this} this
	 */
	minus(v: Vec4 | Vector): this {
		return this.sub(v);
	}

	/**
	 * Scales a vector by a scalar.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4} v Vector to scale
	 * @param {number} s Scalar
	 * @returns {Vec4} The vector, scaled
	 */
	static scale = (v: Vec4, s: number): Vec4 => scalePos(v, s);

	/**
	 * Scales the vector by a scalar.
	 * @param s Scalar
	 * @returns {this}
	 */
	scale(s: number): this {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		this.w *= s;
		return this;
	}

	/**
	 * Scales a vector by the inverse of a scalar.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4} v Vector to scale
	 * @param {number} s Scalar
	 * @returns {Vec4} The vector, scaled inversely
	 */
	static invScale = (v: Vec4, s: number): Vec4 => scalePos(v, 1 / s);

	/**
	 * Scales the vector by the inverse of a scalar.
	 * @param s Scalar
	 * @returns {this}
	 */
	invScale(s: number): this {
		const iS = s !== 0 ? 1 / s : 0;
		this.x *= iS;
		this.y *= iS;
		this.z *= iS;
		this.w *= iS;
		return this;
	}

	/**
	 * @group Static
	 */
	static dot = (a: Vec4, b: Vec4 | V4_T): number => dotProduct4D(a, b);
	dot(v: Vec4 | V4_T): number {
		return Vec4.dot(this, v);
	}

	/**
	 * @group Static
	 */
	static equal = (a: Vec4, b: Vec4 | V4_T): boolean => posEqual(a, b);
	equal(v: Vec4): boolean {
		return Vec4.equal(this, v);
	}

	/**
	 * Linearly interpolates between two {@link Vec4}s.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4} a Start vector
	 * @param {Vec4} b End vector
	 * @param {number} t Percentage between a and b
	 * @returns {Vec4}
	 */
	static lerp = (a: Vec4, b: Vec4, t: number): Vec4 => {
		return Vec4.sub(b, a).scale(t).add(a);
	};

	/**
	 * Approaches a target {@link Vec3} by an amount without exceeding the target.
	 * @param from Input vector
	 * @param to Target vector
	 * @param amount Amount to approach
	 * @returns
	 */
	static approach = (
		v: Vec4Like,
		target: Vec4Like,
		amount: Vec4Like,
	): Vec4Like => approachVec(v, target, amount);

	/**
	 * Returns a random {@link Vec4}, with a uniform sample distribution.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {number} scale Magnitude of the vector, defaults to 1
	 * @returns {Vec4} A random vector
	 */
	static random = (scale = 1): Vec4 => {
		return Random.vec4(scale);
	};

	// #region overrides

	/** @private */
	pop(): number | undefined {
		throw new Error(`[${error}] Cannot pop`);
	}

	/** @private */
	push(..._items: number[]): number {
		throw new Error(`[${error}] Cannot push`);
	}

	/** @private */
	concat(..._items: unknown[]): number[] {
		throw new Error(`[${error}] Cannot concat`);
	}

	/** @private */
	shift(): number | undefined {
		throw new Error(`[${error}] Cannot shift`);
	}

	/** @private */
	splice(
		_start: unknown,
		_deleteCount?: unknown,
		..._rest: unknown[]
	): number[] {
		throw new Error(`[${error}] Cannot splice`);
	}

	/** @private */
	unshift(..._items: number[]): number {
		throw new Error(`[${error}] Cannot shift`);
	}

	/** @private */
	copyWithin(_target: number, _start: number, _end?: number): this {
		throw new Error(`[${error}] Cannot copyWithin`);
	}

	// #endregion
}

export const dotProduct4D: FuncReduceVector<Vec4 | V4_T> = (a, b) =>
	a[X] * b[X] + a[Y] * b[Y] + a[Z] * b[Z] + a[W] * b[W];
export const magnitude4D = (v: Vec4): number =>
	Math.sqrt(v[X] ** 2 + v[Y] ** 2 + v[Z] ** 2 + v[W] ** 2);
