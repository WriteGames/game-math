import { approach, distance, distanceSq, equal } from '../util/index.js';
import { isQuat, Quat } from './quat.js';
import type { Vector, VectorToTuple } from './types';
import { isVec2, Vec2 } from './vec2.js';
import { isVec3, Vec3 } from './vec3.js';
import { isVec4, Vec4 } from './vec4.js';

/**
 * Adds two vectors together, using the length of vector A for the resulting vector.
 * @param a - Vector A
 * @param b - Vector B
 * @returns Sum of vectors
 */
export function addVec<
	T extends Vector = Vector,
	A extends T = T,
	B extends T = T,
	R = VectorToTuple<A>,
>(a: A, b: B): R {
	return a.map((v, i) => v + (b[i] ?? 0)) as R;
}

/**
 * Adds a scalar to each element of a vector.
 * @param v - Vector
 * @param s - Scalar
 * @returns - Transformed vector
 */
export function addScalar<T extends Vector>(v: T, s: number): T {
	const sums = v.map((v) => v + s);
	if (isVec2(v)) return new Vec2(...sums) as typeof v;
	if (isVec3(v)) return new Vec3(...sums) as typeof v;
	if (isVec4(v)) return new Vec4(...sums) as typeof v;
	if (isQuat(v)) return new Quat(...sums) as typeof v;
	return sums as typeof v;
}

/**
 * Approaches a target vector by an amount without overshooting the target.
 * @param from - Input vector
 * @param to - Targt vector
 * @param amount - Amount to approach
 * @returns
 */
export function approachVec<
	T extends Vector = Vector,
	A extends T = T,
	B extends T = T,
	C extends T = T,
	R = VectorToTuple<A>,
>(from: A, to: B, amount: C): R {
	return from.map((v, i) => approach(v, to[i] ?? 0, amount[i] ?? 0)) as R;
}

/**
 * Hashes a vector using a comma as a separator.
 * Ex: hashVec([1, 2, 3]) =\> '1,2,3'
 * @param vec - Vector to hash
 * @returns Hash of vector
 */
export function hashVec(vec: Vector): string {
	return vec.join(',');
}

/**
 * Checks whether a point lies on a line.
 * @param p - The point to test
 * @param a - The start of the line
 * @param b - The end of the line
 */
export function isPointOnLine<T extends Vector>(p: T, a: T, b: T): boolean {
	const pp = vecDistance(a, p) + vecDistance(p, b) - vecDistance(a, b);
	return Math.abs(pp) < Number.EPSILON;
}

/**
 * Checks whether a point is within bounds. Start is inclusive, end is exclusive.
 * @param p - The point to test
 * @param start - The upper left of the bounds rect
 * @param end - The lower right of the bounds rect
 */
export function isWithinBounds<T extends Vector>(
	p: T,
	start: T,
	end: T,
): boolean {
	return p.every((x: number, i: number) => x >= start[i] && x < end[i]);
}

/**
 * Computes the length of a vector.
 * @param a - Vector
 * @returns The vector's length
 */
export function length(a: Vector): number {
	return Math.sqrt(lengthSq(a));
}

/**
 * Computes the length of a vector.
 * @param a - Vector
 * @returns The vector's length, squared
 */
export function lengthSq(a: Vector): number {
	return a.map((v) => v ** 2).reduce((a, v) => a + v);
}

/**
 * Scales a vector by a scalar.
 * @param p - Vector
 * @param s - Scalar
 * @returns Scaled vector
 */
export function scaleVec<T extends Vector>(p: T, s: number): T {
	const scaled = p.map((v) => v * s);
	if (isVec2(p)) return new Vec2(...scaled) as typeof p;
	if (isVec3(p)) return new Vec3(...scaled) as typeof p;
	if (isVec4(p)) return new Vec4(...scaled) as typeof p;
	if (isQuat(p)) return new Quat(...scaled) as typeof p;
	return scaled as typeof p;
}

/**
 * Subtracts two vectors, using the length of vector A for the resulting vector.
 * @param a - Vector A
 * @param b - Vector B
 * @returns Difference of vectors
 */
export function subVec<
	T extends Vector = Vector,
	A extends T = T,
	B extends T = T,
	R = VectorToTuple<A>,
>(a: A, b: B): R {
	return a.map((v, i) => v - (b[i] ?? 0)) as R;
}

/**
 * Computes the distance between two vectors.
 * @param a - Vector A
 * @param b - Vector B
 * @returns Distance between vectors
 */
export function vecDistance<T extends Vector = Vector>(a: T, b: T): number {
	return distance(subVec(b, a));
}

/**
 * Computes the distance between two vectors, squared.
 * @param a - Vector A
 * @param b - Vector B
 * @returns Distance between vectors, squared
 */
export function vecDistanceSq<T extends Vector = Vector>(a: T, b: T): number {
	return distanceSq(subVec(b, a));
}

/**
 * Checks if two vectors have equal length and elements.
 * @param a - Vector A
 * @param b - Vector B
 * @returns Whether the vectors are exactly equal
 */
export function vecEqual<T extends Vector | number[]>(a: T, b: T): boolean {
	const aa = [...a];
	const bb = [...b];
	return aa.length === bb.length && aa.every((v, i) => equal(v, bb[i]));
}
