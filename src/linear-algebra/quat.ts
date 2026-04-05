import { distance } from '../util/index.js';
import { scaleVec, vecEqual } from './common.js';
import { Mat4 } from './mat4.js';
import type { QuatLike, Vector } from './types';
import { Vec2 } from './vec2.js';
import { Vec3 } from './vec3.js';
import { dotProduct4D } from './vec4.js';

/**
 * Checks if a given argument is an instance of {@link Quat}.
 * @category Linear Algebra
 * @param quat - Potential Quat
 * @returns Whether or not the argument is a Quat
 */
export function isQuat(quat: Vector): quat is Quat {
	return quat instanceof Quat;
}

function asQuatLike<T extends QuatLike>(
	v: T,
	x: number,
	y: number,
	z: number,
	w: number,
): T;
function asQuatLike(
	v: QuatLike,
	x: number,
	y: number,
	z: number,
	w: number,
): QuatLike {
	return isQuat(v) ? new Quat(x, y, z, w) : [x, y, z, w];
}

const error = 'Quat';

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

/**
 * A quaternion.
 * @category Linear Algebra
 */
export class Quat extends Array<number> {
	// length: 4 = 4 as const;

	/**
	 * Uninitialized values default to \<0, 0, 0, 1\>.
	 * @param x - X value
	 * @param y - Y value
	 * @param z - Z value
	 * @param w - W value
	 */
	constructor(x = 0, y = 0, z = 0, w = 1) {
		super(x, y, z, w);
	}

	/**
	 * Creates an instance of a Quat at \<0, 0, 0, 1\>.
	 * @group Helper
	 * @type Quat
	 */
	static get identity(): Quat {
		return new Quat(0, 0, 0, 1);
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
	 * The xy position of the vector, as a {@link Quat}.
	 * @type Vec2
	 */
	get xy(): Vec2 {
		return new Vec2(this.x, this.y);
	}
	set xy(v: Vec2) {
		this.x = v[X];
		this.y = v[Y];
	}

	/**
	 * The xy position of the vector, as a {@link Quat}.
	 * @type Vec3
	 */
	get xyz(): Vec3 {
		return new Vec3(this.x, this.y, this.z);
	}
	set xyz(v: Vec3) {
		this.x = v[X];
		this.y = v[Y];
		this.z = v[Z];
	}

	/**
	 * Sets x/y to another Quat's properties.
	 * @param v - Input quaternion
	 */
	set(v: Quat): void {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = v.w;
	}

	/**
	 * Sets the quaternion to a set of values.
	 * @param x - New x position
	 * @param y - New y position
	 * @param z - New z position
	 * @param w - New w position
	 */
	setXYZW(x: number, y: number, z: number, w: number): void {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	/**
	 * Normalizes a quaternion, setting its magnitude to 1.
	 * @group Static
	 * @param v - The quaternion to normalize
	 * @returns The input quaternion
	 */
	static normalize<T extends QuatLike>(v: T): T;
	static normalize(v: QuatLike): QuatLike {
		return scaleVec(v, 1 / distance(v));
	}

	/**
	 * Normalizes the quaternion, setting its magnitude to 1.
	 * @returns this
	 */
	normalize(): this {
		const v = scaleVec(this, 1 / distance(this));
		this.set(v);
		return this;
	}

	/**
	 * Creates a new Quat instance with identical properties.
	 * @returns A clone of the quaternion
	 */
	clone(): Quat {
		return new Quat(...this);
	}

	/**
	 * @group Static
	 */
	static equal(a: QuatLike, b: QuatLike): boolean {
		return vecEqual(a, b);
	}

	equal(v: QuatLike): boolean {
		return Quat.equal(this, v);
	}

	/**
	 * Converts a quaternion to a 4D matrix.
	 * @group Static
	 * @param q - The quaternion to convert
	 * @returns Equivalanet matrix
	 */
	static toMat4(q: QuatLike): Mat4 {
		const result = new Mat4();
		const _q = q instanceof Quat ? q : new Quat(...q);
		const normalized = _q.clone().normalize();

		const XX = normalized[X] * normalized[X];
		const YY = normalized[Y] * normalized[Y];
		const ZZ = normalized[Z] * normalized[Z];
		const XY = normalized[X] * normalized[Y];
		const XZ = normalized[X] * normalized[Z];
		const YZ = normalized[Y] * normalized[Z];
		const WX = normalized[X] * normalized[W];
		const WY = normalized[Y] * normalized[W];
		const WZ = normalized[Z] * normalized[W];

		result.m00 = 1.0 - 2.0 * (YY + ZZ);
		result.m01 = 2.0 * (XY + WZ);
		result.m02 = 2.0 * (XZ - WY);
		result.m03 = 0.0;

		result.m10 = 2.0 * (XY - WZ);
		result.m11 = 1.0 - 2.0 * (XX + ZZ);
		result.m12 = 2.0 * (YZ + WX);
		result.m13 = 0.0;

		result.m20 = 2.0 * (XZ + WY);
		result.m21 = 2.0 * (YZ - WX);
		result.m22 = 1.0 - 2.0 * (XX + YY);
		result.m23 = 0.0;

		result.m30 = 0.0;
		result.m31 = 0.0;
		result.m32 = 0.0;
		result.m33 = 1.0;

		return result;
	}

	/**
	 * Converts the quaternion to a 4D matrix.
	 * @returns Equivalanet matrix
	 */
	toMat4(): Mat4 {
		return Quat.toMat4(this);
	}

	/**
	 * Linearly interpolates between two {@link Quat}s, normalized.
	 * @group Static
	 * @param a - Start vector
	 * @param b - End vector
	 * @param t - Percentage between a and b
	 * @returns
	 */
	static nlerp<T extends QuatLike>(a: T, b: Quat, t: number): T;
	static nlerp(a: QuatLike, b: Quat, t: number): QuatLike {
		const result = _mixQ4Q4(a, 1 - t, b, t);
		return isQuat(result) ? result.normalize() : Quat.normalize(result);
	}

	/**
	 * Spherically linearly interpolates between two {@link Quat}s.
	 * @group Static
	 * @param a - Start vector
	 * @param b - End vector
	 * @param t - Percentage between a and b
	 * @returns
	 */
	static slerp<T extends QuatLike>(a: T, b: Quat, t: number): T;
	static slerp(a: QuatLike, b: Quat, t: number): QuatLike {
		let theta = dotProduct4D(a, b);
		if (theta < 0) {
			theta = -theta;
			b.x = -b.x;
			b.y = -b.y;
			b.z = -b.z;
			b.w = -b.w;
		}

		const angle = Math.acos(theta);
		const aT = Math.sin((1 - t) * angle);
		const bT = Math.sin(t * angle);

		const result = _mixQ4Q4(a, aT, b, bT);
		return isQuat(result) ? result.normalize() : Quat.normalize(result);
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

export function inverseQ4(q: Quat): Quat {
	const result = new Quat(-q.x, -q.y, -q.z, q.w);

	return divideQ4Scalar(result, dotProduct4D(q, q));
}

export function multiplyQ4Q4<T extends QuatLike>(a: T, b: QuatLike): T;
export function multiplyQ4Q4(a: QuatLike, b: QuatLike): QuatLike {
	let x = b[3] * +a[0];
	let y = b[2] * -a[0];
	let z = b[1] * +a[0];
	let w = b[0] * -a[0];

	x += b[2] * +a[1];
	y += b[3] * +a[1];
	z += b[0] * -a[1];
	w += b[1] * -a[1];

	x += b[1] * -a[2];
	y += b[0] * +a[2];
	z += b[3] * +a[2];
	w += b[2] * -a[2];

	x += b[0] * +a[3];
	y += b[1] * +a[3];
	z += b[2] * +a[3];
	w += b[3] * +a[3];

	return asQuatLike(a, x, y, z, w);
}

export function multiplyQ4Scalar<T extends QuatLike>(q: T, v: number): T;
export function multiplyQ4Scalar(q: QuatLike, v: number): QuatLike {
	return scaleVec(q, v);
}

export function divideQ4Scalar<T extends QuatLike>(q: T, v: number): T;
export function divideQ4Scalar(q: QuatLike, v: number): QuatLike {
	return scaleVec(q, 1 / v);
}

function _mixQ4Q4<T extends QuatLike>(
	a: T,
	aT: number,
	b: QuatLike,
	bT: number,
): T;
function _mixQ4Q4(a: QuatLike, aT: number, b: QuatLike, bT: number): QuatLike {
	const x = a[X] * aT + b[X] * bT;
	const y = a[Y] * aT + b[Y] * bT;
	const z = a[Z] * aT + b[Z] * bT;
	const w = a[W] * aT + b[W] * bT;
	return asQuatLike(a, x, y, z, w);
}
