import { describe, expect, test } from 'vitest';
import { clamp, lerp } from '..';

describe('clamp()', () => {
	test('should maintain a minimum when number is too low', () => {
		expect(clamp(-1, 0, 10)).toEqual(0);
	});

	test('should maintain a maximum when number is too high', () => {
		expect(clamp(11, 0, 10)).toEqual(10);
	});

	test('should unaffect number when within bounds', () => {
		expect(clamp(5, 0, 10)).toEqual(5);
	});
});

describe('lerp()', () => {
	test('should return the start when t = 0', () => {
		expect(lerp(13, 23, 0)).toEqual(13);
	});

	test('should return the start when t = 1', () => {
		expect(lerp(13, 23, 1)).toEqual(23);
	});

	test('should interpolate the value', () => {
		expect(lerp(13, 23, 0.5)).toEqual(18);
	});
});
