import { describe, expect, test } from 'vitest';
import { clamp, lerp, lerpClamp, remap, remapClamp, type V4_T } from '..';

interface Test<T extends any[], E extends any> {
	name: string;
	args: T;
	expected: E;
}

const createTest = <const T extends any[], E extends any>(
	name: string,
	args: T,
	expected: E,
): Test<T, E> => ({ name, args, expected });

function runTests<T extends any[], E extends any>(
	tests: Test<T, E>[],
	callback: (...args: T) => E,
) {
	tests.forEach(({ args, expected, name }) => {
		test(name, () => {
			const actual = callback(...args);
			expect(actual).toEqual(expected);
		});
	});
}

describe('clamp()', () => {
	const min = 0;
	const max = 10;
	const tests = [
		createTest(
			'should maintain a minimum when number is too low',
			[min - 5],
			min,
		),
		createTest(
			'should maintain a maximum when number is too high',
			[max + 5],
			max,
		),
		createTest(
			'should unaffect number when within bounds',
			[(max + min) / 2],
			5,
		),
	];

	runTests(tests, (...args): number => {
		return clamp(...args, min, max);
	});
});

describe('lerp()', () => {
	const from = 13;
	const to = 23;

	const tests = [
		//
		createTest('should interpolate the value', [0.5], 18),
		createTest(
			'should not clamp and return a value before the start when t < 0',
			[-1],
			3,
		),
		createTest('should return the start when t = 0', [0], from),
		createTest('should return the end when t = 1', [1], to),
		createTest(
			'should not clamp and return a value after the end when t > 1',
			[1.5],
			28,
		),
	];

	runTests(tests, (...args: [number]): number => {
		return lerp(from, to, ...args);
	});
});

describe('lerpClamp()', () => {
	const from = 13;
	const to = 23;

	const tests = [
		createTest('should interpolate the value', [0.5], 18),
		createTest('should clamp and return the start when t < 0', [-1], from),
		createTest('should return the start when t = 0', [0], from),
		createTest('should return the end when t = 1', [1], to),
		createTest('should clamp and return the end when t > 1', [1.5], to),
	];

	runTests(tests, (...args: [number]): number => {
		return lerpClamp(from, to, ...args);
	});
});

describe('remap()', () => {
	const ascFrom = [5, 10] as const;
	const ascTo = [20, 50] as const;
	const descFrom = [10, 5] as const;
	const descTo = [50, 20] as const;
	interface Context {
		name: string;
		scaleArgs: V4_T;
		below: number;
		between: number;
		above: number;
	}
	const contexts: Context[] = [
		{
			name: 'asc -> asc',
			scaleArgs: [...ascFrom, ...ascTo],
			below: -10,
			between: 27.5,
			above: 80,
		},
		{
			name: 'asc -> desc',
			scaleArgs: [...ascFrom, ...descTo],
			below: 80,
			between: 42.5,
			above: -10,
		},
		{
			name: 'desc -> desc',
			scaleArgs: [...descFrom, ...descTo],
			below: -10,
			between: 42.5,
			above: 80,
		},
		{
			name: 'desc -> asc',
			scaleArgs: [...descFrom, ...ascTo],
			below: 80,
			between: 27.5,
			above: -10,
		},
	];
	contexts.forEach(({ name, scaleArgs, below, between, above }) => {
		describe(name, () => {
			const [fromMin, fromMax, toMin, toMax] = scaleArgs;
			const fromLower = Math.min(fromMin, fromMax);
			const fromUpper = Math.max(fromMin, fromMax);
			const fourth = (fromMin + (fromMax + fromMin) / 2) / 2;
			const tests = [
				createTest(
					'should remap when value is below range',
					[fromLower - 5],
					below,
				),
				createTest(
					'should remap when value is fromMin',
					[fromMin],
					toMin,
				),
				createTest(
					'should remap when value is between fromMin and fromMax',
					[fourth],
					between,
				),
				createTest(
					'should remap when value is fromMax',
					[fromMax],
					toMax,
				),
				createTest(
					'should remap when value is above range',
					[fromUpper + 5],
					above,
				),
			];

			runTests(tests, (...args: [number]): number => {
				return remap(...args, ...scaleArgs);
			});
		});
	});
});

describe('remapClamp()', () => {
	const ascFrom = [5, 10] as const;
	const ascTo = [20, 50] as const;
	const descFrom = [10, 5] as const;
	const descTo = [50, 20] as const;
	interface Context {
		name: string;
		scaleArgs: V4_T;
		between: number;
	}
	const contexts: Context[] = [
		{
			name: 'asc -> asc',
			scaleArgs: [...ascFrom, ...ascTo],
			between: 27.5,
		},
		{
			name: 'asc -> desc',
			scaleArgs: [...ascFrom, ...descTo],
			between: 42.5,
		},
		{
			name: 'desc -> desc',
			scaleArgs: [...descFrom, ...descTo],
			between: 42.5,
		},
		{
			name: 'desc -> asc',
			scaleArgs: [...descFrom, ...ascTo],
			between: 27.5,
		},
	];
	contexts.forEach(({ name, scaleArgs, between }) => {
		describe(name, () => {
			const [fromMin, fromMax, toMin, toMax] = scaleArgs;
			const fromLower = Math.min(fromMin, fromMax);
			const fromUpper = Math.max(fromMin, fromMax);
			const toLower = fromLower === fromMin ? toMin : toMax;
			const toUpper = fromUpper === fromMin ? toMin : toMax;
			const fourth = (fromMin + (fromMax + fromMin) / 2) / 2;
			const tests = [
				createTest(
					'should clamp and remap when value is below range',
					[fromLower - 5],
					toLower,
				),
				createTest(
					'should remap when value is fromMin',
					[fromMin],
					toMin,
				),
				createTest(
					'should remap when value is between fromMin and fromMax',
					[fourth],
					between,
				),
				createTest(
					'should remap when value is fromMax',
					[fromMax],
					toMax,
				),
				createTest(
					'should clamp and remap when value is above range',
					[fromUpper + 5],
					toUpper,
				),
			];

			runTests(tests, (...args: [number]): number => {
				return remapClamp(...args, ...scaleArgs);
			});
		});
	});
});
