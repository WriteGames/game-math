import { clamp, distance } from '../util/index.js';
import { Random } from '../util/random.js';
import { addVec, approachVec, vecEqual, scaleVec, subVec } from './common.js';
import type { Vec2Like, Vector } from './types';

/**
 * Checks if a given argument is an instance of {@link Vec2}.
 * @category Linear Algebra
 * @param vec - Potential Vec2
 * @returns Whether or not the vector is a Vec2
 */
export function isVec2(vec: Vector): vec is Vec2 {
	return vec instanceof Vec2;
}

function asVec2Like<T extends Vec2Like>(v: T, x: number, y: number): T {
	return (isVec2(v) ? new Vec2(x, y) : [x, y]) as T;
}

const error = 'Vec2';

const X = 0;
const Y = 1;

/**
 * A 2d vector.
 * @category Linear Algebra
 */
export class Vec2 extends Array<number> {
	// length: 2 = 2 as const;

	/**
	 * Uninitialized values default to \<0, 0\>.
	 * @param x - X value
	 * @param y - Y value
	 */
	constructor(x = 0, y = 0) {
		super(x, y);
	}

	/**
	 * Creates an instance of a Vec2 at \<0, 0\>.
	 * @group Helper
	 * @type Vec2
	 */
	static get zero(): Vec2 {
		return new Vec2(0, 0);
	}

	/**
	 * Creates an instance of a Vec2 at \<1, 1\>.
	 * @group Helper
	 * @type Vec2
	 */
	static get one(): Vec2 {
		return new Vec2(1, 1);
	}

	/**
	 * Creates an instance of a Vec2 at \<-1, 0\>.
	 * @group Helper
	 * @type Vec2
	 */
	static get left(): Vec2 {
		return new Vec2(-1, 0);
	}

	/**
	 * Creates an instance of a Vec2 at \<1, 0\>.
	 * @group Helper
	 * @type Vec2
	 */
	static get right(): Vec2 {
		return new Vec2(1, 0);
	}

	/**
	 * Creates an instance of a Vec2 at \<0, -1\>.
	 * @group Helper
	 * @type Vec2
	 */
	static get up(): Vec2 {
		return new Vec2(0, -1);
	}

	/**
	 * Creates an instance of a Vec2 at \<0, 1\>.
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
		return distance(this);
	}

	/**
	 * Sets x/y to another Vec2's properties.
	 * @param v - Input vector
	 */
	set(v: Vec2): void {
		this.x = v.x;
		this.y = v.y;
	}

	/**
	 * Sets the vector to a given x/y pair.
	 * @param x - New x position
	 * @param y - New y position
	 */
	setXY(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	/**
	 * Normalizes a 2D vector, setting its magnitude to 1.
	 * @group Static
	 * @param v - The vector to normalize
	 * @returns The input vector
	 */
	static normalize<T extends Vec2Like>(v: T): T {
		let [x, y] = v;
		const invMag = 1 / distance(v);
		x *= invMag;
		y *= invMag;
		return asVec2Like(v, x, y);
	}

	/**
	 * Normalizes the vector, setting its magnitude to 1.
	 * @returns this
	 */
	normalize(): this {
		return this.invScale(this.magnitude);
	}

	/**
	 * Creates a new Vec2 instance with identical properties.
	 * @returns A clone of the vector
	 */
	clone(): Vec2 {
		return new Vec2(...this);
	}

	/**
	 * Adds two 2D Vectors and returns a new 2D Vector with the sum.
	 * @group Static
	 * @param a - Vector a
	 * @param b - Vector b
	 * @returns Sum
	 */
	static add<T extends Vec2Like>(a: T, b: Vec2Like): T {
		const [x, y] = addVec(a, b);
		return asVec2Like(a, x, y);
	}

	/**
	 * Adds a vector to itself.
	 * @param v - Vector to add
	 * @returns this
	 */
	add(v: Vec2Like): this {
		this.x += v[X];
		this.y += v[Y];
		return this;
	}

	/**
	 * An alias for {@link Vec2.add}.
	 * @group Static
	 * @param a - Vector a
	 * @param b - Vector b
	 * @returns Sum
	 */
	static plus<T extends Vec2Like>(a: T, b: Vec2Like): T {
		return Vec2.add(a, b);
	}

	/**
	 * An alias for {@link Vec2#add}.
	 * @param v - Vector to add
	 * @returns this
	 */
	plus(v: Vec2Like): this {
		return this.add(v);
	}

	/**
	 * Subtracts two 2D Vectors and returns a new 2D Vector with the difference.
	 * @group Static
	 * @param a - Vector a
	 * @param b - Vector b
	 * @returns Vec2
	 */
	static sub<T extends Vec2Like>(a: T, b: Vec2Like): T {
		const [x, y] = subVec(a, b);
		return asVec2Like(a, x, y);
	}

	/**
	 * Subtracts a vector from itself.
	 * @param v - Vector to subtract
	 * @returns this
	 */
	sub(v: Vec2Like): this {
		this.x -= v[X];
		this.y -= v[Y];
		return this;
	}

	/**
	 * An alias for {@link Vec2.sub}.
	 * @group Static
	 * @param a - Vector a
	 * @param b - Vector b
	 * @returns Vec2
	 */
	static minus<T extends Vec2Like>(a: T, b: Vec2Like): T {
		return Vec2.sub(a, b);
	}

	/**
	 * An alias for {@link Vec2#sub}.
	 * @param v - Vector to subtract
	 * @returns this
	 */
	minus(v: Vec2Like): this {
		return this.sub(v);
	}

	/**
	 * Scales a vector by a scalar.
	 * @group Static
	 * @param v - Vector to scale
	 * @param s - Scalar
	 * @returns The vector, scaled
	 */
	static scale<T extends Vec2Like>(v: T, s: number): T {
		const [x, y] = scaleVec(v, s);
		return asVec2Like(v, x, y);
	}

	/**
	 * Scales the vector by a scalar.
	 * @param s - Scalar
	 * @returns
	 */
	scale(s: number): this {
		this.x *= s;
		this.y *= s;
		return this;
	}

	/**
	 * Scales a vector by the inverse of a scalar.
	 * @group Static
	 * @param v - Vector to scale
	 * @param s - Scalar
	 * @returns The vector, scaled inversely
	 */
	static invScale<T extends Vec2Like>(v: T, s: number): T {
		const [x, y] = scaleVec(v, 1 / s);
		return asVec2Like(v, x, y);
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
		return this;
	}

	/**
	 * @group Static
	 */
	static cross(a: Vec2Like, b: Vec2Like): number {
		return crossProduct2D(a, b);
	}

	cross(v: Vec2Like): number {
		return Vec2.cross(this, v);
	}

	/**
	 * @group Static
	 */
	static dot(a: Vec2Like, b: Vec2Like): number {
		return dotProduct2D(a, b);
	}

	dot(v: Vec2Like): number {
		return Vec2.dot(this, v);
	}

	/**
	 * @group Static
	 */
	static rotate<T extends Vec2Like>(v: T, angle: number): T {
		return rotate2D(v, angle);
	}

	rotate(angle: number): this {
		const v = Vec2.rotate(this, angle);
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	/**
	 * Tests whether two 2D vectors are equal, accounting for floating-point
	 * arithmetic error.
	 * @group Static
	 * @param a - Vector A
	 * @param b - Vector B
	 * @returns Whether the two vectors are equal
	 */
	static equal(a: Vec2Like, b: Vec2Like): boolean {
		return vecEqual(a, b);
	}

	/**
	 * Tests whether this vector is equal to another 2D vector.
	 * @param v - Other vector
	 * @returns Whether the two vetors are equal
	 */
	equal(v: Vec2Like): boolean {
		return Vec2.equal(this, v);
	}

	/**
	 * Linearly interpolates between two 2D vectors.
	 * @group Static
	 * @param a - Start vector
	 * @param b - End vector
	 * @param t - Percentage between a and b
	 * @returns
	 */
	static lerp<T extends Vec2Like>(a: T, b: Vec2Like, t: number): T {
		const [x, y] = Vec2.add(a, Vec2.scale(Vec2.sub(b, a), t));
		return asVec2Like(a, x, y);
	}

	/**
	 * Approaches a target 2D Vector by an amount without exceeding the target.
	 * @param v - Input vector
	 * @param target - Target vector
	 * @param amount - Amount to approach
	 * @returns
	 */
	static approach<T extends Vec2Like>(
		v: T,
		target: Vec2Like,
		amount: Vec2Like,
	): T {
		const [x, y] = approachVec(v, target, amount);
		return asVec2Like(v, x, y);
	}

	/**
	 * Clamps a 2D vector within the bounds of the min and max vectors.
	 * @param val - Input vector
	 * @param min - Lower bound
	 * @param max - Upper bound
	 * @returns Clamped vector
	 */
	static clamp<T extends Vec2Like>(val: T, min: Vec2Like, max: Vec2Like): T {
		const x = clamp(val[X], min[X], max[X]);
		const y = clamp(val[Y], min[Y], max[Y]);
		return asVec2Like(val, x, y);
	}

	/**
	 * Returns a random {@link Vec2}, with a uniform sample distribution.
	 * @group Static
	 * @param scale - Magnitude of the vector, defaults to 1
	 * @returns A random vector
	 */
	static random(scale = 1): Vec2 {
		return Random.vec2(scale);
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

export function indexToPos(index: number, stride: number): Vec2 {
	return new Vec2(index % stride, Math.floor(index / stride));
}

export function posToIndex([x, y]: Vec2Like, stride: number): number {
	return y * stride + x;
}

export function rotate2D<T extends Vec2Like>(v: T, angle: number): T {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	const x = v[X] * cos - v[Y] * sin;
	const y = v[X] * sin + v[Y] * cos;
	return asVec2Like(v, x, y);
}

export function crossProduct2D(a: Vec2Like, b: Vec2Like): number {
	return a[X] * b[Y] - a[Y] * b[X];
}

export function dotProduct2D(a: Vec2Like, b: Vec2Like): number {
	return a[X] * b[X] + a[Y] * b[Y];
}
