export const EPSILON = 0.000001;

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
