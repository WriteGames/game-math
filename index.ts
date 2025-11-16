import type { Vec2 } from './vectors';

export * from './vectors/index.js';

export const EPSILON = 0.000001;

export function clamp(val: number, min: number, max: number) {
	if (val < min) return min;
	if (val > max) return max;
	return val;
}

export function lerp(a: number, b: number, t: number) {
	return t * (b - a) + a;
}

export type Line2D = [Vec2, Vec2];
