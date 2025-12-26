import { type Mat2 } from './mat2.js';
import { type Mat3 } from './mat3.js';
import { type Mat4 } from './mat4.js';
import { Quat } from './quat.js';
import { Vec2 } from './vec2.js';
import { Vec3 } from './vec3.js';
import { Vec4 } from './vec4.js';

// TYPE(bret): Find a home for these
/**
 * @category Linear Algebra
 */
export type V2_T = [x: number, y: number];
/**
 * @category Linear Algebra
 */
export type V3_T = [x: number, y: number, z: number];
/**
 * @category Linear Algebra
 */
export type V4_T = [x: number, y: number, z: number, w: number];

/**
 * @category Linear Algebra
 */
export type Vector_T =
	| V2_T
	| Readonly<V2_T>
	| V3_T
	| Readonly<V3_T>
	| V4_T
	| Readonly<V4_T>;

/**
 * @category Linear Algebra
 */
export type Vector = Vector_T | Vec2 | Vec3 | Vec4 | Quat;

export type VectorToTuple<T extends Vector> = T extends Vec2
	? V2_T
	: T extends Vec3
	? V3_T
	: T extends Vec4
	? V4_T
	: T extends Quat
	? V4_T
	: T;

// DECIDE(bret): Internally, Mat2 uses column-major; however, its constructor
// takes row-major. This makes the array-based version and the Mat2 version
// have different interfaces. Will need to think about this

/**
 * @category Linear Algebra
 */
// prettier-ignore
export type M2_T = [
	m00: number, m10: number,
	m01: number, m11: number,
];
/**
 * @category Linear Algebra
 */
// prettier-ignore
export type M3_T = [
	m00: number, m10: number, m20: number,
	m01: number, m11: number, m21: number,
	m02: number, m12: number, m22: number,
];
/**
 * @category Linear Algebra
 */
// prettier-ignore
export type M4_T = [
	m00: number, m10: number, m20: number, m30: number,
	m01: number, m11: number, m21: number, m31: number,
	m02: number, m12: number, m22: number, m32: number,
	m03: number, m13: number, m23: number, m33: number,
];

/**
 * @category Linear Algebra
 */
export type Matrix_T = M2_T | M3_T | M4_T;
/**
 * @category Linear Algebra
 */
export type Matrix = Matrix_T | Mat2 | Mat3 | Mat4;

/**
 * @category Linear Algebra
 */
export type Mat2Like = Mat2 | M2_T;
/**
 * @category Linear Algebra
 */
export type Vec2Like = Vec2 | V2_T;

/**
 * @category Linear Algebra
 */
export type Mat3Like = Mat3 | M3_T;
/**
 * @category Linear Algebra
 */
export type Vec3Like = Vec3 | V3_T;

/**
 * @category Linear Algebra
 */
export type Mat4Like = Mat4 | M4_T;
/**
 * @category Linear Algebra
 */
export type Vec4Like = Vec4 | V4_T;
/**
 * @category Linear Algebra
 */
export type QuatLike = Quat | V4_T;
