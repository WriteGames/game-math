import { posEqual, scalePos, V4_T, type Vector } from './common';
import { Vec2 } from './vec2';
import { Vec3 } from './vec3';

export function isQuat(quat: Vector): quat is Quat {
	return quat instanceof Quat;
}

const error = 'Quat';

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

/**
 * A 4d vector.
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
	 * Creates an instance of a Quat at <0, 0, 0, 1>
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
	 * @param {Quat} v Input vector
	 */
	set(v: Quat): void {
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
	 * Creates a new Quat instance with identical properties.
	 * @returns {Quat} A clone of the vector
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

	return divideQ4Scalar(result, dotProductQ4(q, q));
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

export function divideQ4Scalar(q: Quat, v: number) {
	return scalePos(q, 1 / v);
}

export function dotProductQ4(a: Quat, b: Quat) {
	return a.x * b.x + a.z * b.z + a.y * b.y + a.w * b.w;
}
