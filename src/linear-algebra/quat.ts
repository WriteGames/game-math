import { distance } from '../util/index.js';
import { posEqual, scalePos } from './common.js';
import { Mat4 } from './mat4.js';
import type { QuatLike, V4_T, Vector } from './types';
import { Vec2 } from './vec2.js';
import { Vec3 } from './vec3.js';
import { dotProduct4D } from './vec4.js';

/**
 * Checks if a given argument is an instance of {@link Quat}.
 * @category Linear Algebra
 * @param quat Potential Quat
 * @returns Whether or not the argument is a Quat
 */
export function isQuat(quat: Vector): quat is Quat {
	return quat instanceof Quat;
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
	 * Uninitialized values default to <0, 0, 0, 1>.
	 * @param {number} x X value
	 * @param {number} y Y value
	 * @param {number} z Z value
	 * @param {number} w W value
	 */
	constructor(x = 0, y = 0, z = 0, w = 1) {
		super(x, y, z, w);
	}

	/**
	 * Creates an instance of a Quat at <0, 0, 0, 1>.
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
	 * @param {Quat} v Input quaternion
	 */
	set(v: Quat): void {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = v.w;
	}

	/**
	 * Sets the quaternion to a set of values.
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
	 * Normalizes a quaternion, setting its magnitude to 1.
	 * @memberof Quat
	 * @method
	 * @group Static
	 * @param {Quat} v The quaternion to normalize
	 * @returns {Quat} The input quaternion
	 */
	static normalize(v: Quat): Quat {
		return scalePos(v, 1 / distance(v));
	}

	/**
	 * Normalizes the quaternion, setting its magnitude to 1.
	 * @returns {this} this
	 */
	normalize(): this {
		const v = scalePos(this, 1 / distance(this));
		this.set(v);
		return this;
	}

	/**
	 * Creates a new Quat instance with identical properties.
	 * @returns {Quat} A clone of the quaternion
	 */
	clone(): Quat {
		return new Quat(...this);
	}

	/**
	 * @group Static
	 */
	static equal(a: Quat, b: Quat | V4_T): boolean {
		return posEqual(a, b);
	}

	equal(v: Quat | V4_T): boolean {
		return Quat.equal(this, v);
	}

	/**
	 * Converts a quaternion to a 4D matrix.
	 * @group Static
	 * @param q The quaternion to convert
	 * @returns {Mat4} Equivalanet matrix
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
	 * @returns {Mat4} Equivalanet matrix
	 */
	toMat4(): Mat4 {
		return Quat.toMat4(this);
	}

	/**
	 * Linearly interpolates between two {@link Quat}s, normalized.
	 * @memberof Quat
	 * @method
	 * @group Static
	 * @param {Quat} a Start vector
	 * @param {Quat} b End vector
	 * @param {number} t Percentage between a and b
	 * @returns {Quat}
	 */
	static nlerp(a: Quat, b: Quat, t: number): Quat {
		const result = _mixQ4Q4(a, 1 - t, b, t);
		return result.normalize();
	}

	/**
	 * Spherically linearly interpolates between two {@link Quat}s.
	 * @memberof Quat
	 * @method
	 * @group Static
	 * @param {Quat} a Start vector
	 * @param {Quat} b End vector
	 * @param {number} t Percentage between a and b
	 * @returns {Quat}
	 */
	static slerp(a: Quat, b: Quat, t: number): Quat {
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
		return result.normalize();
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

export function multiplyQ4Q4(a: Quat, b: Quat) {
	const result = new Quat();

	result.x = b[3] * +a[0];
	result.y = b[2] * -a[0];
	result.z = b[1] * +a[0];
	result.w = b[0] * -a[0];

	result.x += b[2] * +a[1];
	result.y += b[3] * +a[1];
	result.z += b[0] * -a[1];
	result.w += b[1] * -a[1];

	result.x += b[1] * -a[2];
	result.y += b[0] * +a[2];
	result.z += b[3] * +a[2];
	result.w += b[2] * -a[2];

	result.x += b[0] * +a[3];
	result.y += b[1] * +a[3];
	result.z += b[2] * +a[3];
	result.w += b[3] * +a[3];

	return result;
}

export function multiplyQ4Scalar(q: Quat, v: number) {
	return scalePos(q, v);
}

export function divideQ4Scalar(q: Quat, v: number) {
	return scalePos(q, 1 / v);
}

function _mixQ4Q4(a: Quat, aT: number, b: Quat, bT: number) {
	const result = new Quat();
	result[X] = a[X] * aT + b[X] * bT;
	result[Y] = a[Y] * aT + b[Y] * bT;
	result[Z] = a[Z] * aT + b[Z] * bT;
	result[W] = a[W] * aT + b[W] * bT;
	return result;
}
