import { clamp } from '../util/index.js';
import { Random } from '../util/random.js';
import {
	addPos,
	approachVec,
	posEqual,
	scalePos,
	subPos,
	type Vec2Like,
	type Vec3Like,
	type Vector,
} from './common.js';
import { Vec2 } from './vec2.js';

/**
 * Checks if a given argument is an instance of {@link Vec3}.
 * @category Linear Algebra
 * @param vec Potential Vec3
 * @returns Whether or not the argument is a Vec3
 */
export function isVec3(vec: Vector): vec is Vec3 {
	return vec instanceof Vec3;
}

const error = 'Vec3';

const X = 0;
const Y = 1;
const Z = 2;

/**
 * A 3d vector.
 * @category Linear Algebra
 */
export class Vec3 extends Array<number> {
	// length: 3 = 3 as const;

	/**
	 * Uninitialized values default to <0, 0, 0>.
	 * @param {number} x X value
	 * @param {number} y Y value
	 * @param {number} z Z value
	 */
	constructor(x = 0, y = 0, z = 0) {
		super(x, y, z);
	}

	/**
	 * Creates an instance of a Vec3 at <0, 0, 0>
	 * @group Helper
	 * @type Vec3
	 */
	static get zero(): Vec3 {
		return new Vec3(0, 0, 0);
	}

	/**
	 * Creates an instance of a Vec3 at <1, 1, 1>
	 * @group Helper
	 * @type Vec3
	 */
	static get one(): Vec3 {
		return new Vec3(1, 1, 1);
	}

	/**
	 * Creates an instance of a Vec3 at <-1, 0, 0>
	 * @group Helper
	 * @type Vec3
	 */
	static get left(): Vec3 {
		return new Vec3(-1, 0, 0);
	}

	/**
	 * Creates an instance of a Vec3 at <1, 0, 0>
	 * @group Helper
	 * @type Vec3
	 */
	static get right(): Vec3 {
		return new Vec3(1, 0, 0);
	}

	/**
	 * Creates an instance of a Vec3 at <0, -1, 0>
	 * @group Helper
	 * @type Vec3
	 */
	static get down(): Vec3 {
		return new Vec3(0, -1, 0);
	}

	/**
	 * Creates an instance of a Vec3 at <0, 1, 0>
	 * @group Helper
	 * @type Vec3
	 */
	static get up(): Vec3 {
		return new Vec3(0, 1, 0);
	}

	/**
	 * Creates an instance of a Vec3 at <0, 0, -1>
	 * @group Helper
	 * @type Vec3
	 */
	static get back(): Vec3 {
		return new Vec3(0, 0, -1);
	}

	/**
	 * Creates an instance of a Vec3 at <0, 0, 1>
	 * @group Helper
	 * @type Vec3
	 */
	static get forward(): Vec3 {
		// DECIDE(bret): which way is forward?
		return new Vec3(0, 0, 1);
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
	 * The magnitude (length) of the vector.
	 * @type number
	 */
	get magnitude(): number {
		return magnitude3D(this);
	}

	/**
	 * Sets x/y to another Vec3's properties.
	 * @param {Vec3} v Input vector
	 */
	set(v: Vec3): void {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	}

	/**
	 * Sets the vector to a given x/y/z triplet.
	 * @param {number} x New x position
	 * @param {number} y New y position
	 * @param {number} z New z position
	 */
	setXYZ(x: number, y: number, z: number): void {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * Normalizes a vector, setting its magnitude to 1.
	 * @memberof Vec3
	 * @method
	 * @group Static
	 * @param {Vec3} v The vector to normalize
	 * @returns {Vec3} The input vector
	 */
	static normalize(v: Vec3): Vec3 {
		return v.clone().invScale(v.magnitude);
	}

	/**
	 * Normalizes the vector, setting its magnitude to 1.
	 * @returns {this} this
	 */
	normalize(): this {
		return this.invScale(this.magnitude);
	}

	/**
	 * Creates a new Vec3 instance with identical properties.
	 * @returns {Vec3} A clone of the vector
	 */
	clone(): Vec3 {
		return new Vec3(...this);
	}

	/**
	 * Adds two {@link Vec3}s and returns a new {@link Vec3} with the sum.
	 * @memberof Vec3
	 * @method
	 * @group Static
	 * @param {Vec3} a Vector a
	 * @param {Vec3} b Vector b
	 * @returns {Vec3} Sum
	 */
	static add(a: Vec3, b: Vector): Vec3 {
		return addPos(a, b);
	}

	/**
	 * Adds a vector to itself.
	 * @param v Vector to add
	 * @returns {this} this
	 */
	add(v: Vector): this {
		this.x += v[X];
		this.y += v[Y];
		this.z += v[Z] ?? 0;
		return this;
	}

	/**
	 * An alias for {@link Vec3.add}.
	 * @memberof Vec3
	 * @method
	 * @group Static
	 * @param {Vec3} a Vector a
	 * @param {Vec3} b Vector b
	 * @returns {Vec3} Sum
	 */
	static plus(a: Vec3, b: Vector): Vec3 {
		return Vec3.add(a, b);
	}

	/**
	 * An alias for {@link Vec3#add}.
	 * @param {Vec3} v Vector to add
	 * @returns {this} this
	 */
	plus(v: Vector): this {
		return this.add(v);
	}

	/**
	 * Subtracts two {@link Vec3}s and returns a new {@link Vec3} with the difference.
	 * @memberof Vec3
	 * @method
	 * @group Static
	 * @param {Vec3} a Vector a
	 * @param {Vec3} b Vector b
	 * @returns {Vec3} Difference
	 */
	static sub(a: Vec3, b: Vector): Vec3 {
		return subPos(a, b);
	}

	/**
	 * Subtracts a vector from itself.
	 * @param {Vec3} v Vector to subtract
	 * @returns {this} this
	 */
	sub(v: Vector): this {
		this.x -= v[X];
		this.y -= v[Y];
		this.z -= v[Z] ?? 0;
		return this;
	}

	/**
	 * An alias for {@link Vec3.sub}.
	 * @memberof Vec3
	 * @method
	 * @group Static
	 * @param {Vec3} a Vector a
	 * @param {Vec3} b Vector b
	 * @returns {Vec3} Vec3
	 */
	static minus(a: Vec3, b: Vector): Vec3 {
		return Vec3.sub(a, b);
	}

	/**
	 * An alias for {@link Vec3#sub}.
	 * @param {Vec3} v Vector to subtract
	 * @returns {this} this
	 */
	minus(v: Vector): this {
		return this.sub(v);
	}

	/**
	 * Scales a vector by a scalar.
	 * @memberof Vec3
	 * @method
	 * @group Static
	 * @param {Vec3} v Vector to scale
	 * @param {number} s Scalar
	 * @returns {Vec3} The vector, scaled
	 */
	static scale(v: Vec3, s: number): Vec3 {
		return scalePos(v, s);
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
		return this;
	}

	/**
	 * Scales a vector by the inverse of a scalar.
	 * @memberof Vec3
	 * @method
	 * @group Static
	 * @param {Vec3} v Vector to scale
	 * @param {number} s Scalar
	 * @returns {Vec3} The vector, scaled inversely
	 */
	static invScale(v: Vec3, s: number): Vec3 {
		return scalePos(v, 1 / s);
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
		return this;
	}

	/**
	 * @group Static
	 */
	static cross(a: Vec3, b: Vec3Like): Vec3 {
		return crossProduct3D(a, b);
	}

	cross(v: Vec3Like): Vec3 {
		return Vec3.cross(this, v);
	}

	/**
	 * @group Static
	 */
	static dot(a: Vec3, b: Vec3Like): number {
		return dotProduct3D(a, b);
	}

	dot(v: Vec3Like): number {
		return Vec3.dot(this, v);
	}

	// TODO(bret): rotation

	/**
	 * Tests whether two 3D vectorss are equal, accounting for floating-point
	 * arithmetic error.
	 * @group Static
	 * @param a Vector A
	 * @param b Vector B
	 * @returns Whether the two vectors are equal
	 */
	static equal(a: Vec3, b: Vec3Like): boolean {
		return posEqual(a, b);
	}

	/**
	 * Tests whether this vector is equal to another 3D vector.
	 * @param v Other vector
	 * @returns Whether the two vetors are equal
	 */
	equal(v: Vec3Like): boolean {
		return Vec3.equal(this, v);
	}

	/**
	 * Linearly interpolates between two {@link Vec3}s.
	 * @memberof Vec3
	 * @method
	 * @group Static
	 * @param {Vec3} a Start vector
	 * @param {Vec3} b End vector
	 * @param {number} t Percentage between a and b
	 * @returns {Vec3}
	 */
	static lerp(a: Vec3, b: Vec3, t: number): Vec3 {
		return Vec3.sub(b, a).scale(t).add(a);
	}

	/**
	 * Approaches a target {@link Vec3} by an amount without exceeding the target.
	 * @param v Input vector
	 * @param target Target vector
	 * @param amount Amount to approach
	 * @returns
	 */
	static approach(v: Vec3Like, target: Vec3Like, amount: Vec3Like): Vec3Like {
		return approachVec(v, target, amount);
	}

	/**
	 * Clamps a 3D vector within the bounds of the min and max vectors.
	 * @param val Input vector
	 * @param min Lower bound
	 * @param max Upper bound
	 * @returns Clamped vector
	 */
	static clamp(val: Vec3Like, min: Vec3Like, max: Vec3Like): Vec3 {
		return new Vec3(
			clamp(val[0], min[0], max[0]),
			clamp(val[1], min[1], max[1]),
			clamp(val[2], min[2], max[2]),
		);
	}

	/**
	 * Returns a random {@link Vec3}, with a uniform sample distribution.
	 * @memberof Vec3
	 * @method
	 * @group Static
	 * @param {number} scale Magnitude of the vector, defaults to 1
	 * @returns {Vec3} A random vector
	 */
	static random(scale = 1): Vec3 {
		return Random.vec3(scale);
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

export function crossProduct3D(a: Vec3Like, b: Vec3Like): Vec3 {
	const c1 = a[Y] * b[Z] - a[Z] * b[Y];
	const c2 = a[Z] * b[X] - a[X] * b[Z];
	const c3 = a[X] * b[Y] - a[Y] * b[X];
	return new Vec3(c1, c2, c3);
}

export function dotProduct3D(a: Vec3Like, b: Vec3Like): number {
	return a[X] * b[X] + a[Y] * b[Y] + a[Z] * b[Z];
}

export function magnitude3D(v: Vec3Like): number {
	return Math.sqrt(v[X] ** 2 + v[Y] ** 2 + v[Z] ** 2);
}
