import { equal } from '.';

/** Tau, approx equivalent to 6.283185. Equals two times Pi */
export const TAU = Math.PI * 2;

/** Ratio to multiply to convert radians to degrees */
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Converts angle in radians to degrees.
 * @param rad Radian to convert
 * @returns Angle in degrees
 */
export function radToDeg(rad: number): number {
	return rad * RAD_TO_DEG;
}

/** Ratio to multiply to convert degrees to radians */
export const DEG_TO_RAD = Math.PI / 180;

/** 45 degrees expressed as radians */
export const RAD_45 = 45 * DEG_TO_RAD;
/** 90 degrees expressed as radians */
export const RAD_90 = 90 * DEG_TO_RAD;
/** 180 degrees expressed as radians */
export const RAD_180 = 180 * DEG_TO_RAD;
/** 270 degrees expressed as radians */
export const RAD_270 = 270 * DEG_TO_RAD;
/** 360 degrees expressed as radians */
export const RAD_360 = 360 * DEG_TO_RAD;
/** 540 degrees expressed as radians */
export const RAD_540 = 540 * DEG_TO_RAD;
/** 720 degrees expressed as radians */
export const RAD_720 = 720 * DEG_TO_RAD;

/**
 * Converts angle in degrees to radians.
 * @param deg Degree to convert
 * @returns Angle in radians
 */
export function degToRad(deg: number): number {
	return deg * DEG_TO_RAD;
}

/**
 * Calculates the angle between two given angles.
 * @param a Angle a
 * @param b Angle b
 * @returns The angle (in radians) between the two angles
 */
export function angleDifference(a: number, b: number): number {
	return ((((b - a) % RAD_360) + RAD_540) % RAD_360) - RAD_180;
}

/**
 * Calculates the angle between two given angles.
 * @param a Angle a
 * @param b Angle b
 * @returns The angle (in degrees) between the two angles
 */
export function angleDifferenceDeg(a: number, b: number): number {
	return ((((b - a) % 360) + 540) % 360) - 180;
}

/**
 * Calculates the angle between two given angles.
 * @param a Angle a
 * @param b Angle b
 * @returns The angle (in radians) between the two angles
 */
export function angleDifferenceSign(a: number, b: number): number {
	if (equal(a, b)) return 0;
	return Math.sign(angleDifference(a, b));
}

/**
 * Calculates the angle between two given angles.
 * @param a Angle a
 * @param b Angle b
 * @returns The angle (in degrees) between the two angles
 */
export function angleDifferenceSignDeg(a: number, b: number): number {
	if (equal(a, b)) return 0;
	return Math.sign(angleDifferenceDeg(a, b));
}

/**
 * Approaches a target angle by an amount without exceeding the target.
 * @param from Input angle (radians)
 * @param to Target angle (radians)
 * @param rad Amount (radians) to approach
 * @returns
 */
export function approachAngle(from: number, to: number, rad: number): number {
	const diff = angleDifference(from, to);
	const sign = Math.sign(diff);
	const moveBy = Math.min(diff * sign, rad);
	return from + moveBy * sign;
}

/**
 * Approaches a target angle by an amount without exceeding the target.
 * @param from Input angle (degrees)
 * @param to Target angle (degrees)
 * @param deg Amount (degrees) to approach
 * @returns
 */
export function approachAngleDeg(
	from: number,
	to: number,
	deg: number,
): number {
	const diff = angleDifferenceDeg(from, to);
	const sign = Math.sign(diff);
	const moveBy = Math.min(diff * sign, deg);
	return from + moveBy * sign;
}

/**
 * Returns the cosine of a number using degrees.
 * @param x A numeric expression that contains an angle measured in degrees.
 */
export function cosDeg(x: number): number {
	return Math.cos(x * DEG_TO_RAD);
}

/**
 * Returns the sine of a number using degrees.
 * @param x A numeric expression that contains an angle measured in degree.
 */
export function sinDeg(x: number): number {
	return Math.sin(x * DEG_TO_RAD);
}

/**
 * Returns the tangent of a number using degrees.
 * @param x A numeric expression that contains an angle measured in degrees.
 */
export function tanDeg(x: number): number {
	return Math.tan(x * DEG_TO_RAD);
}

/**
 * Returns the arc cosine (or inverse cosine) of a number using degrees.
 * @param x A numeric expression.
 */
export function acosDeg(x: number): number {
	return Math.acos(x) * RAD_TO_DEG;
}

/**
 * Returns the arcsine of a number using degrees.
 * @param x A numeric expression.
 */

export function asinDeg(x: number): number {
	return Math.asin(x) * RAD_TO_DEG;
}

/**
 * Returns the arctangent of a number using degrees.
 * @param x A numeric expression for which the arctangent is needed.
 */
export function atanDeg(x: number): number {
	return Math.atan(x) * RAD_TO_DEG;
}

/**
 * Returns the angle (in degrees) between the X axis and the line going through both the origin and the given point.
 * @param y A numeric expression representing the cartesian y-coordinate.
 * @param x A numeric expression representing the cartesian x-coordinate.
 */
export function atan2Deg(y: number, x: number): number {
	return Math.atan2(y, x) * RAD_TO_DEG;
}

export function wrapAngle(degree: number): number {
	return ((degree % RAD_360) + RAD_360) % RAD_360;
}

export function wrapAngleDeg(degree: number): number {
	return ((degree % 360) + 360) % 360;
}
