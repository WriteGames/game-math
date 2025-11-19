import { FuncCompare, reduceSum } from './functional.js';
import { angleDifference, angleDifferenceDeg } from './trig.js';

export * from './directions.js';
export * from './functional.js';
export * from './trig.js';

/** A more permissive epsilon than Number.EPSILON */
export const EPSILON = 0.000001 as const;

/**
 * Clamps a value within a range.
 * @param val Input value
 * @param min Lower bound
 * @param max Upper bound
 * @returns Clamped value
 */
export function clamp(val: number, min: number, max: number): number {
	if (val < min) return min;
	if (val > max) return max;
	return val;
}

/**
 * Calculates the distance of a given vector, squared
 * @param dimensions A vector of any length of dimensions
 * @returns The squared distance of the vector
 */
export function distanceSq(dimensions: number[]): number {
	return Math.abs(dimensions.map((d) => d ** 2).reduce(reduceSum, 0));
}

/**
 * Calculates the distance of a given vector
 * @param dimensions A vector of any length of dimensions
 * @returns The distance of the vector
 */
export function distance(dimensions: number[]): number {
	return Math.sqrt(distanceSq(dimensions));
}

/**
 * Checks if two values are approximately equal, using an epsilon to account for floating point errors.
 * @param a Value a
 * @param b Value b
 * @returns Whether or not they're about equal
 */
export const equal: FuncCompare<number> = (a, b) => {
	return Math.abs(a - b) < EPSILON;
};

/**
 * Linear interpolation between two values.
 * @param a Start value
 * @param b End value
 * @param t Fractional value to interpolate between a and b
 * @returns Interpolated value
 */
export function lerp(a: number, b: number, t: number): number {
	return t * (b - a) + a;
}

/**
 * Linear interpolation between two angles (in radians), ensuring the shortest path is taken.
 * @param a Start angle
 * @param b End angle
 * @param t Fractional value to interpolate between and b
 * @returns Interpolated angle
 */
export function lerpAngle(a: number, b: number, t: number): number {
	const diff = angleDifference(a, b);
	return t * diff + a;
}

/**
 * Linear interpolation between two angles (in degrees), ensuring the shortest path is taken.
 * @param a Start angle
 * @param b End angle
 * @param t Fractional value to interpolate between and b
 * @returns Interpolated angle
 */
export function lerpAngleDeg(a: number, b: number, t: number): number {
	const diff = angleDifferenceDeg(a, b);
	return t * diff + a;
}

/**
 * Linear interpolation between two values, clamping t between 0 and 1.
 * @param a Start value
 * @param b End value
 * @param t Fractional value to interpolate between a and b
 * @returns Interpolated value
 */
export function lerpClamp(a: number, b: number, t: number): number {
	return lerp(a, b, clamp(t, 0, 1));
}

/**
 * Remaps a number from one range to another.
 * @param value Input value
 * @param fromMin Source range start
 * @param fromMax Source range end
 * @param toMin Destination range start
 * @param toMax Destination range end
 * @returns New value remapped from source range to destination range
 */
export function remap(
	value: number,
	fromMin: number,
	fromMax: number,
	toMin: number,
	toMax: number,
): number {
	return toMin + ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin);
}

/**
 * Remaps a number from one range to another, clamping the new value within the destination range.
 * @param value Input value
 * @param fromMin Source range start
 * @param fromMax Source range end
 * @param toMin Destination range start
 * @param toMax Destination range end
 * @returns New value remapped from source range to destination range, clamped to the destination range
 */
export function remapClamp(
	value: number,
	fromMin: number,
	fromMax: number,
	toMin: number,
	toMax: number,
): number {
	const raw = remap(value, fromMin, fromMax, toMin, toMax);
	return clamp(raw, Math.min(toMin, toMax), Math.max(toMin, toMax));
}
