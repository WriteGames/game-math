import { clamp, distance } from '../util/index.js';
import { Random } from '../util/random.js';
import { addPos, approachVec, posEqual, scalePos, subPos } from './common.js';
import type { QuatLike, Vec2Like, Vec3Like, Vec4Like, Vector } from './types';
import { Vec2 } from './vec2.js';
import { Vec3 } from './vec3.js';

/**
 * Checks if a given argument is an instance of {@link Vec4}.
 * @category Linear Algebra
 * @param vec Potential Vec4
 * @returns Whether or not the argument is a Vec4
 */
export function isVec4(vec: Vector): vec is Vec4 {
	return vec instanceof Vec4;
}

function asVec4Like<T extends Vec4Like>(
	v: T,
	x: number,
	y: number,
	z: number,
	w: number,
): T {
	return (isVec4(v) ? new Vec4(x, y, z, w) : [x, y, z, w]) as T;
}

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
	 * @type Vec4
	 */
	static get zero(): Vec4 {
		return new Vec4(0, 0, 0, 0);
	}

	/**
	 * Creates an instance of a Vec3 at <1, 1, 1, 1>
	 * @group Helper
	 * @type Vec4
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
		return distance(this);
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
	 * @param {Vec4Like} v The vector to normalize
	 * @returns {Vec4Like} The input vector
	 */
	static normalize<T extends Vec4Like>(v: T): T {
		let [x, y, z, w] = v;
		const invMag = 1 / distance(v);
		x *= invMag;
		y *= invMag;
		z *= invMag;
		w *= invMag;
		return asVec4Like(v, x, y, z, w);
	}

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
	 * Adds two 4D vectors and returns a new 4D vector with the sum.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4Like} a Vector a
	 * @param {Vec4Like} b Vector b
	 * @returns {Vec4Like} Sum
	 */
	static add<T extends Vec4Like>(a: T, b: Vec4Like): T {
		const [x, y, z, w] = addPos(a, b);
		return asVec4Like(a, x, y, z, w);
	}

	/**
	 * Adds a vector to itself.
	 * @param v Vector to add
	 * @returns {this} this
	 */
	add(v: Vec4Like): this {
		this.x += v[X];
		this.y += v[Y];
		this.z += v[Z];
		this.w += v[W];
		return this;
	}

	/**
	 * An alias for {@link Vec4.add}.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4Like} a Vector a
	 * @param {Vec4Like} b Vector b
	 * @returns {Vec4Like} Sum
	 */
	static plus<T extends Vec4Like>(a: T, b: Vec4Like): T {
		return Vec4.add(a, b);
	}

	/**
	 * An alias for {@link Vec4#add}.
	 * @param {Vec4Like} v Vector to add
	 * @returns {this} this
	 */
	plus(v: Vec4Like): this {
		return this.add(v);
	}

	/**
	 * Subtracts two 4D vectors and returns a new vector with the difference.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4Like} a Vector a
	 * @param {Vec4Like} b Vector b
	 * @returns {Vec4Like} Vec4
	 */
	static sub<T extends Vec4Like>(a: T, b: Vec4Like): T {
		const [x, y, z, w] = subPos(a, b);
		return asVec4Like(a, x, y, z, w);
	}

	/**
	 * Subtracts a vector from itself.
	 * @param {Vec4Like} v Vector to subtract
	 * @returns {this} this
	 */
	sub(v: Vec4Like): this {
		this.x -= v[X];
		this.y -= v[Y];
		this.z -= v[Z];
		this.w -= v[W];
		return this;
	}

	/**
	 * An alias for {@link Vec4.sub}.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4Like} a Vector a
	 * @param {Vec4Like} b Vector b
	 * @returns {Vec4Like} Vec4
	 */
	static minus<T extends Vec4Like>(a: T, b: Vec4Like): T {
		return Vec4.sub(a, b);
	}

	/**
	 * An alias for {@link Vec4#sub}.
	 * @param {Vec4Like} v Vector to subtract
	 * @returns {this} this
	 */
	minus(v: Vec4Like): this {
		return this.sub(v);
	}

	/**
	 * Scales a vector by a scalar.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4Like} v Vector to scale
	 * @param {number} s Scalar
	 * @returns {Vec4Like} The vector, scaled
	 */
	static scale<T extends Vec4Like>(v: T, s: number): T {
		const [x, y, z, w] = scalePos(v, s);
		return asVec4Like(v, x, y, z, w);
	}

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
	 * @param {Vec4Like} v Vector to scale
	 * @param {number} s Scalar
	 * @returns {Vec4Like} The vector, scaled inversely
	 */
	static invScale<T extends Vec4Like>(v: T, s: number): T {
		const [x, y, z, w] = scalePos(v, 1 / s);
		return asVec4Like(v, x, y, z, w);
	}

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
	static dot(a: Vec4Like, b: Vec4Like): number {
		return dotProduct4D(a, b);
	}

	dot(v: Vec4Like): number {
		return Vec4.dot(this, v);
	}

	/**
	 * Tests whether two 4D vectors are equal, accounting for floating-point
	 * arithmetic error.
	 * @group Static
	 * @param a Vector A
	 * @param b Vector B
	 * @returns Whether the two vectors are equal
	 */
	static equal(a: Vec4Like, b: Vec4Like): boolean {
		return posEqual(a, b);
	}

	/**
	 * Tests whether this vector is equal to another 4D vector.
	 * @param v Other vector
	 * @returns Whether the two vetors are equal
	 */
	equal(v: Vec4Like): boolean {
		return Vec4.equal(this, v);
	}

	/**
	 * Linearly interpolates between two 4D vectors.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {Vec4Like} a Start vector
	 * @param {Vec4Like} b End vector
	 * @param {number} t Percentage between a and b
	 * @returns {Vec4Like}
	 */
	static lerp<T extends Vec4Like>(a: T, b: Vec4Like, t: number): T {
		return Vec4.add(a, Vec4.scale(Vec4.sub(b, a), t));
	}

	/**
	 * Approaches a target 4D vector by an amount without exceeding the target.
	 * @param v Input vector
	 * @param target Target vector
	 * @param amount Amount to approach
	 * @returns
	 */
	static approach<T extends Vec4Like>(
		v: T,
		target: Vec4Like,
		amount: Vec4Like,
	): T {
		const [x, y, z, w] = approachVec(v, target, amount);
		return asVec4Like(v, x, y, z, w);
	}

	/**
	 * Clamps a 4D vector within the bounds of the min and max vectors.
	 * @param val Input vector
	 * @param min Lower bound
	 * @param max Upper bound
	 * @returns Clamped vector
	 */
	static clamp<T extends Vec4Like>(val: T, min: Vec4Like, max: Vec4Like): T {
		const x = clamp(val[X], min[X], max[X]);
		const y = clamp(val[Y], min[Y], max[Y]);
		const z = clamp(val[Z], min[Z], max[Z]);
		const w = clamp(val[W], min[W], max[W]);
		return asVec4Like(val, x, y, z, w);
	}

	/**
	 * Returns a random {@link Vec4}, with a uniform sample distribution.
	 * @memberof Vec4
	 * @method
	 * @group Static
	 * @param {number} scale Magnitude of the vector, defaults to 1
	 * @returns {Vec4} A random vector
	 */
	static random(scale = 1): Vec4 {
		return Random.vec4(scale);
	}

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

export function dotProduct4D(
	a: Vec4Like | QuatLike,
	b: Vec4Like | QuatLike,
): number {
	return a[X] * b[X] + a[Y] * b[Y] + a[Z] * b[Z] + a[W] * b[W];
}
