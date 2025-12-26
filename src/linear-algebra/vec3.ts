import { clamp, distance } from '../util/index.js';
import { Random } from '../util/random.js';
import { addVec, approachVec, vecEqual, scaleVec, subVec } from './common.js';
import type { Vec2Like, Vec3Like, Vector } from './types';
import { Vec2 } from './vec2.js';

/**
 * Checks if a given argument is an instance of {@link Vec3}.
 * @category Linear Algebra
 * @param vec - Potential Vec3
 * @returns Whether or not the argument is a Vec3
 */
export function isVec3(vec: Vector): vec is Vec3 {
	return vec instanceof Vec3;
}

function asVec3Like<T extends Vec3Like>(
	v: T,
	x: number,
	y: number,
	z: number,
): T {
	return (isVec3(v) ? new Vec3(x, y, z) : [x, y, z]) as T;
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
	 * Uninitialized values default to \<0, 0, 0\>.
	 * @param x - X value
	 * @param y - Y value
	 * @param z - Z value
	 */
	constructor(x = 0, y = 0, z = 0) {
		super(x, y, z);
	}

	/**
	 * Creates an instance of a Vec3 at \<0, 0, 0\>.
	 * @group Helper
	 * @type Vec3
	 */
	static get zero(): Vec3 {
		return new Vec3(0, 0, 0);
	}

	/**
	 * Creates an instance of a Vec3 at \<1, 1, 1\>.
	 * @group Helper
	 * @type Vec3
	 */
	static get one(): Vec3 {
		return new Vec3(1, 1, 1);
	}

	/**
	 * Creates an instance of a Vec3 at \<-1, 0, 0\>.
	 * @group Helper
	 * @type Vec3
	 */
	static get left(): Vec3 {
		return new Vec3(-1, 0, 0);
	}

	/**
	 * Creates an instance of a Vec3 at \<1, 0, 0\>.
	 * @group Helper
	 * @type Vec3
	 */
	static get right(): Vec3 {
		return new Vec3(1, 0, 0);
	}

	/**
	 * Creates an instance of a Vec3 at \<0, -1, 0\>.
	 * @group Helper
	 * @type Vec3
	 */
	static get down(): Vec3 {
		return new Vec3(0, -1, 0);
	}

	/**
	 * Creates an instance of a Vec3 at \<0, 1, 0\>.
	 * @group Helper
	 * @type Vec3
	 */
	static get up(): Vec3 {
		return new Vec3(0, 1, 0);
	}

	/**
	 * Creates an instance of a Vec3 at \<0, 0, -1\>.
	 * @group Helper
	 * @type Vec3
	 */
	static get back(): Vec3 {
		return new Vec3(0, 0, -1);
	}

	/**
	 * Creates an instance of a Vec3 at \<0, 0, 1\>.
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
		return distance(this);
	}

	/**
	 * Sets x/y to another Vec3's properties.
	 * @param v - Input vector
	 */
	set(v: Vec3): void {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	}

	/**
	 * Sets the vector to a given x/y/z triplet.
	 * @param x - New x position
	 * @param y - New y position
	 * @param z - New z position
	 */
	setXYZ(x: number, y: number, z: number): void {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * Normalizes a vector, setting its magnitude to 1.
	 * @group Static
	 * @param v - The vector to normalize
	 * @returns The input vector
	 */
	static normalize<T extends Vec3Like>(v: T): T {
		let [x, y, z] = v;
		const invMag = 1 / distance(v);
		x *= invMag;
		y *= invMag;
		z *= invMag;
		return asVec3Like(v, x, y, z);
	}

	/**
	 * Normalizes the vector, setting its magnitude to 1.
	 * @returns this
	 */
	normalize(): this {
		return this.invScale(this.magnitude);
	}

	/**
	 * Creates a new Vec3 instance with identical properties.
	 * @returns A clone of the vector
	 */
	clone(): Vec3 {
		return new Vec3(...this);
	}

	/**
	 * Adds two 3D vectors and returns a new 3D vector with the sum.
	 * @group Static
	 * @param a - Vector a
	 * @param b - Vector b
	 * @returns Sum
	 */
	static add<T extends Vec3Like>(a: T, b: Vec3Like): T {
		const [x, y, z] = addVec(a, b);
		return asVec3Like(a, x, y, z);
	}

	/**
	 * Adds a vector to itself.
	 * @param v - Vector to add
	 * @returns this
	 */
	add(v: Vec3Like): this {
		this.x += v[X];
		this.y += v[Y];
		this.z += v[Z];
		return this;
	}

	/**
	 * An alias for {@link Vec3.add}.
	 * @group Static
	 * @param a - Vector a
	 * @param b - Vector b
	 * @returns Sum
	 */
	static plus<T extends Vec3Like>(a: T, b: Vec3Like): T {
		return Vec3.add(a, b);
	}

	/**
	 * An alias for {@link Vec3#add}.
	 * @param v - Vector to add
	 * @returns this
	 */
	plus(v: Vec3Like): this {
		return this.add(v);
	}

	/**
	 * Subtracts two 3D vectors and returns a new 3D vector with the difference.
	 * @group Static
	 * @param a - Vector a
	 * @param b - Vector b
	 * @returns Difference
	 */
	static sub<T extends Vec3Like>(a: T, b: Vec3Like): T {
		return subVec(a, b);
	}

	/**
	 * Subtracts a vector from itself.
	 * @param v - Vector to subtract
	 * @returns this
	 */
	sub(v: Vec3Like): this {
		this.x -= v[X];
		this.y -= v[Y];
		this.z -= v[Z];
		return this;
	}

	/**
	 * An alias for {@link Vec3.sub}.
	 * @group Static
	 * @param a - Vector a
	 * @param b - Vector b
	 * @returns Vec3
	 */
	static minus<T extends Vec3Like>(a: T, b: Vec3Like): T {
		return Vec3.sub(a, b);
	}

	/**
	 * An alias for {@link Vec3#sub}.
	 * @param v - Vector to subtract
	 * @returns this
	 */
	minus(v: Vec3Like): this {
		return this.sub(v);
	}

	/**
	 * Scales a vector by a scalar.
	 * @group Static
	 * @param v - Vector to scale
	 * @param s - Scalar
	 * @returns The vector, scaled
	 */
	static scale<T extends Vec3Like>(v: T, s: number): T {
		const [x, y, z] = scaleVec(v, s);
		return asVec3Like(v, x, y, z);
	}

	/**
	 * Scales the vector by a scalar.
	 * @param s - Scalar
	 * @returns
	 */
	scale(s: number): this {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	}

	/**
	 * Scales a vector by the inverse of a scalar.
	 * @group Static
	 * @param v - Vector to scale
	 * @param s - Scalar
	 * @returns The vector, scaled inversely
	 */
	static invScale<T extends Vec3Like>(v: T, s: number): T {
		const [x, y, z] = scaleVec(v, 1 / s);
		return asVec3Like(v, x, y, z);
	}

	/**
	 * Scales the vector by the inverse of a scalar.
	 * @param s - Scalar
	 * @returns
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
	static cross<T extends Vec3Like>(a: T, b: Vec3Like): T {
		return crossProduct3D(a, b);
	}

	cross(v: Vec3): Vec3 {
		return Vec3.cross(this as Vec3, v);
	}

	/**
	 * @group Static
	 */
	static dot(a: Vec3Like, b: Vec3Like): number {
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
	 * @param a - Vector A
	 * @param b - Vector B
	 * @returns Whether the two vectors are equal
	 */
	static equal(a: Vec3Like, b: Vec3Like): boolean {
		return vecEqual(a, b);
	}

	/**
	 * Tests whether this vector is equal to another 3D vector.
	 * @param v - Other vector
	 * @returns Whether the two vetors are equal
	 */
	equal(v: Vec3Like): boolean {
		return Vec3.equal(this, v);
	}

	/**
	 * Linearly interpolates between two 3D vectors.
	 * @group Static
	 * @param a - Start vector
	 * @param b - End vector
	 * @param t - Percentage between a and b
	 * @returns
	 */
	static lerp<T extends Vec3Like>(a: T, b: Vec3Like, t: number): T {
		return Vec3.add(a, Vec3.scale(Vec3.sub(b, a), t));
	}

	/**
	 * Approaches a target 3D vector by an amount without exceeding the target.
	 * @param v - Input vector
	 * @param target - Target vector
	 * @param amount - Amount to approach
	 * @returns
	 */
	static approach<T extends Vec3Like>(
		v: T,
		target: Vec3Like,
		amount: Vec3Like,
	): T {
		const [x, y, z] = approachVec(v, target, amount);
		return asVec3Like(v, x, y, z);
	}

	/**
	 * Clamps a 3D vector within the bounds of the min and max vectors.
	 * @param val - Input vector
	 * @param min - Lower bound
	 * @param max - Upper bound
	 * @returns Clamped vector
	 */
	static clamp<T extends Vec3Like>(val: T, min: Vec3Like, max: Vec3Like): T {
		const x = clamp(val[X], min[X], max[X]);
		const y = clamp(val[Y], min[Y], max[Y]);
		const z = clamp(val[Z], min[Z], max[Z]);
		return asVec3Like(val, x, y, z);
	}

	/**
	 * Returns a random {@link Vec3}, with a uniform sample distribution.
	 * @group Static
	 * @param scale - Magnitude of the vector, defaults to 1
	 * @returns A random vector
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

export function crossProduct3D<T extends Vec3Like>(a: T, b: Vec3Like): T {
	const c1 = a[Y] * b[Z] - a[Z] * b[Y];
	const c2 = a[Z] * b[X] - a[X] * b[Z];
	const c3 = a[X] * b[Y] - a[Y] * b[X];
	return asVec3Like(a, c1, c2, c3);
}

export function dotProduct3D(a: Vec3Like, b: Vec3Like): number {
	return a[X] * b[X] + a[Y] * b[Y] + a[Z] * b[Z];
}
