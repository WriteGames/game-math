import { approach, distance, distanceSq, equal } from '../util/index.js';
import { isQuat, Quat } from './quat.js';
import type { Vector, VectorToTuple } from './types';
import { isVec2, Vec2 } from './vec2.js';
import { isVec3, Vec3 } from './vec3.js';
import { isVec4, Vec4 } from './vec4.js';

export function addPos<
	T extends Vector = Vector,
	A extends T = T,
	B extends T = T,
	R = VectorToTuple<A>,
>(a: A, b: B): R {
	return a.map((v, i) => v + (b[i] ?? 0)) as R;
}

export function addScalar<T extends Vector>(p: T, s: number): T {
	const sums = p.map((v) => v + s);
	if (isVec2(p)) return new Vec2(...sums) as typeof p;
	if (isVec3(p)) return new Vec3(...sums) as typeof p;
	if (isVec4(p)) return new Vec4(...sums) as typeof p;
	if (isQuat(p)) return new Quat(...sums) as typeof p;
	return sums as typeof p;
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

export function hashPos(pos: Vector): string {
	return pos.join(',');
}

/**
 * Checks whether a point lies on a line.
 * @param p - The point to test
 * @param a - The start of the line
 * @param b - The end of the line
 */
export function isPointOnLine<T extends Vector>(p: T, a: T, b: T): boolean {
	const pp = posDistance(a, p) + posDistance(p, b) - posDistance(a, b);
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

export function lengthSq(a: Vector): number {
	return a.map((v) => v ** 2).reduce((a, v) => a + v);
}

export function length(a: Vector): number {
	return Math.sqrt(lengthSq(a));
}

export function posDistance<T extends Vector = Vector>(a: T, b: T): number {
	return distance(subPos(b, a));
}

export function posDistanceSq<T extends Vector = Vector>(a: T, b: T): number {
	return distanceSq(subPos(b, a));
}

export function posEqual<T extends Vector | number[]>(a: T, b: T): boolean {
	const aa = [...a];
	const bb = [...b];
	return aa.length === bb.length && aa.every((v, i) => equal(v, bb[i]));
}

export function scalePos<T extends Vector>(p: T, s: number): T {
	const scaled = p.map((v) => v * s);
	if (isVec2(p)) return new Vec2(...scaled) as typeof p;
	if (isVec3(p)) return new Vec3(...scaled) as typeof p;
	if (isVec4(p)) return new Vec4(...scaled) as typeof p;
	if (isQuat(p)) return new Quat(...scaled) as typeof p;
	return scaled as typeof p;
}

export function subPos<
	T extends Vector = Vector,
	A extends T = T,
	B extends T = T,
	R = VectorToTuple<A>,
>(a: A, b: B): R {
	return a.map((v, i) => v - (b[i] ?? 0)) as R;
}
