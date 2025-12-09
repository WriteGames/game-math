import type {
	FuncCompare,
	FuncMapVector,
	FuncMapVectorByScalar,
	FuncReduceVector,
	FuncTernaryVector,
} from '../util/index.js';
import { approach, distance, distanceSq, equal } from '../util/index.js';
import { type Mat2 } from './mat2.js';
import { type Mat3 } from './mat3.js';
import { type Mat4 } from './mat4.js';
import { isVec2, Vec2 } from './vec2.js';
import { isVec3, Vec3 } from './vec3.js';
import { isVec4, Vec4 } from './vec4.js';

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
export type Vector = Vector_T | Vec2 | Vec3 | Vec4;

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

export const V2 = Object.defineProperties(
	{},
	{
		zero: {
			value: [0, 0] as V2_T,
			writable: false,
		},
		one: {
			value: [1, 1] as V2_T,
			writable: false,
		},
	},
) as {
	zero: V2_T;
	one: V2_T;
};

export const hashPos = (pos: Vector): string => pos.join(',');

export const approachVec: FuncTernaryVector = (a, b, c) => {
	return a.map((v, i) => approach(v, b[i], c[i])) as typeof a;
};

export const addPos: FuncMapVector = (a, b) => {
	return a.map((v, i) => v + (b[i] ?? 0)) as typeof a;
};

export const addScalar: FuncMapVectorByScalar = (p, s) => {
	const sums = p.map((v) => v + s);
	if (isVec2(p)) return new Vec2(...sums) as typeof p;
	if (isVec3(p)) return new Vec3(...sums) as typeof p;
	if (isVec4(p)) return new Vec4(...sums) as typeof p;
	return sums as typeof p;
};

export const scalePos: FuncMapVectorByScalar = (p, s) => {
	const scaled = p.map((v) => v * s);
	if (isVec2(p)) return new Vec2(...scaled) as typeof p;
	if (isVec3(p)) return new Vec3(...scaled) as typeof p;
	if (isVec4(p)) return new Vec4(...scaled) as typeof p;
	return scaled as typeof p;
};

export const subPos: FuncMapVector = (a, b) => {
	return a.map((v, i) => v - (b[i] ?? 0)) as typeof a;
};

export const posEqual: FuncCompare<Vector | number[]> = (a, b) => {
	const aa = [...a];
	const bb = [...b];
	return aa.length === bb.length && aa.every((v, i) => equal(v, bb[i]));
};

export const lengthSq = (a: Vector): number => {
	return a.map((v) => v ** 2).reduce((a, v) => a + v);
};
export const length = (a: Vector): number => {
	return Math.sqrt(lengthSq(a));
};

export const posDistance: FuncReduceVector = (a, b) =>
	distance(subPos(b, a) as number[]);
export const posDistanceSq: FuncReduceVector = (a, b) =>
	distanceSq(subPos(b, a) as number[]);

/**
 * Checks whether a point lies on a line.
 * @param point The point to test
 * @param a The start of the line
 * @param b The end of the line
 */
export const isPointOnLine = <T extends Vector>(
	point: T,
	a: T,
	b: T,
): boolean =>
	Math.abs(
		posDistance(a, point) + posDistance(point, b) - posDistance(a, b),
	) < Number.EPSILON;

/**
 * Checks whether a point is within bounds. Start is inclusive, end is exclusive.
 * @param p The point to test
 * @param start The upper left of the bounds rect
 * @param end The lower right of the bounds rect
 */
export const isWithinBounds = <T extends Vector>(
	p: T,
	start: T,
	end: T,
): boolean =>
	p.every((x: number, i: number) => x >= start[i] && x < end[i]) as boolean;
