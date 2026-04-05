import { approach, distance, distanceSq, equal } from '../util/index.js';
import { isQuat, Quat } from './quat.js';
import type { Vector } from './types';
import { isVec2, Vec2 } from './vec2.js';
import { isVec3, Vec3 } from './vec3.js';
import { isVec4, Vec4 } from './vec4.js';

/**
 * Adds two vectors together, using the length of vector A for the resulting vector.
 * @param a - Vector A
 * @param b - Vector B
 * @returns Sum of vectors
 */
export function addVec<T extends Vector>(a: T, b: Vector): T;
export function addVec(a: Vector, b: Vector): Vector {
	const sum = a.map((v, i) => v + (b[i] ?? 0)) as Vector;
	if (isVec2(a)) return new Vec2(...sum);
	if (isVec3(a)) return new Vec3(...sum);
	if (isVec4(a)) return new Vec4(...sum);
	if (isQuat(a)) return new Quat(...sum);
	return sum;
}

/**
 * Adds a scalar to each element of a vector.
 * @param v - Vector
 * @param s - Scalar
 * @returns - Transformed vector
 */
export function addScalar<T extends Vector>(v: T, s: number): T;
export function addScalar(v: Vector, s: number): Vector {
	const sums = v.map((v) => v + s) as Vector;
	if (isVec2(v)) return new Vec2(...sums);
	if (isVec3(v)) return new Vec3(...sums);
	if (isVec4(v)) return new Vec4(...sums);
	if (isQuat(v)) return new Quat(...sums);
	return sums;
}

/**
 * Approaches a target vector by an amount without overshooting the target.
 * @param from - Input vector
 * @param to - Targt vector
 * @param amount - Amount to approach
 * @returns
 */
export function approachVec<T extends Vector>(
	from: T,
	to: Vector,
	amount: Vector,
): T;
export function approachVec(from: Vector, to: Vector, amount: Vector): Vector {
	const result = from.map((v, i) =>
		approach(v, to[i] ?? 0, amount[i] ?? 0),
	) as Vector;

	return result;
}

/**
 * Returns true when the elapsed `time` is between the given `interval`.
 * Ex: an `interval` of `0.1` will be `false` for 0.1 seconds, then `true` for 0.1 seconds, and then repeat.
 * @param time - Elapsed time
 * @param interval - INterval to check whether we're between
 * @param offset - Offset to the interval (so we can, in effect, start partyway through an interval)
 * Credit: Maddy Thorson (https://bsky.app/profile/maddymakesgames.com/post/3maozzg422227)
 */
export function betweenInterval(
	time: number,
	interval: number,
	offset = 0,
): boolean {
	return (time - offset) % (interval * 2) >= interval;
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
 * Returns true every time the elapsed `time` passes a given `interval`.
 * Ex: with an `interval` of `0.1`, this will be true for one frame every 0.1 seconds
 * @param time - Elapsed time
 * @param delta - TIme since last frame
 * @param interval - Interval to check whether we've crossed
 * @param offset - Offset to the interval (so we can, in effect,start partway through an interval)
 * Credit: Maddy Thorson (https://bsky.app/profile/maddymakesgames.com/post/3maozzg422227)
 */
export function onInterval(
	time: number,
	delta: number,
	interval: number,
	offset = 0,
): boolean {
	return (
		Math.floor((time - offset - delta) / interval) <
		Math.floor((time - offset) / interval)
	);
}

/**
 * Scales a vector by a scalar.
 * @param v - Vector
 * @param s - Scalar
 * @returns Scaled vector
 */
export function scaleVec<T extends Vector>(v: T, s: number): T;
export function scaleVec(v: Vector, s: number): Vector {
	const scaled = v.map((v) => v * s) as Vector;
	if (isVec2(v)) return new Vec2(...scaled);
	if (isVec3(v)) return new Vec3(...scaled);
	if (isVec4(v)) return new Vec4(...scaled);
	if (isQuat(v)) return new Quat(...scaled);
	return scaled;
}

/**
 * Subtracts two vectors, using the length of vector A for the resulting vector.
 * @param a - Vector A
 * @param b - Vector B
 * @returns Difference of vectors
 */
export function subVec<T extends Vector>(a: T, b: Vector): T;
export function subVec(a: Vector, b: Vector): Vector {
	const diff = a.map((v, i) => v - (b[i] ?? 0)) as Vector;
	if (isVec2(a)) return new Vec2(...diff);
	if (isVec3(a)) return new Vec3(...diff);
	if (isVec4(a)) return new Vec4(...diff);
	if (isQuat(a)) return new Quat(...diff);
	return diff;
}

/**
 * Computes the distance between two vectors.
 * @param a - Vector A
 * @param b - Vector B
 * @returns Distance between vectors
 */
export function vecDistance<T extends Vector>(a: T, b: T): number {
	return distance(subVec(b, a));
}

/**
 * Computes the distance between two vectors, squared.
 * @param a - Vector A
 * @param b - Vector B
 * @returns Distance between vectors, squared
 */
export function vecDistanceSq<T extends Vector>(a: T, b: T): number {
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
