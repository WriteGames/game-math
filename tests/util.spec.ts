import { describe, expect, test } from 'vitest';
import {
	approach,
	clamp,
	distance,
	distanceSq,
	equal,
	lerp,
	lerpAngle,
	lerpAngleDeg,
	lerpClamp,
	remap,
	remapClamp,
	snapToGrid,
	type V4_T,
} from '..';
import { DEG_TO_RAD } from '../src/util/trig';

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

describe(`${approach.name}()`, () => {
	describe('asc', () => {
		const val = 5;
		const target = 13;

		const tests = [
			createTest(
				'should approach the target',
				[val, target, 1 as number],
				6,
			),
			createTest('should reach the target', [val, target, 8], target),
			createTest(
				'should not exceed the target',
				[val, target, 9],
				target,
			),
			createTest('should handle an amount of 0', [val, target, 0], val),
			createTest('should handle a negative value', [val, target, -1], 4),
		];

		runTests(tests, (...args): number => {
			return approach(...args);
		});
	});

	describe('desc', () => {
		const val = 13;
		const target = 5;

		const tests = [
			createTest(
				'should approach the target',
				[val, target, 1 as number],
				12,
			),
			createTest('should reach the target', [val, target, 8], target),
			createTest(
				'should not exceed the target',
				[val, target, 9],
				target,
			),
			createTest('should handle an amount of 0', [val, target, 0], val),
			createTest('should handle a negative value', [val, target, -1], 14),
		];

		runTests(tests, (...args): number => {
			return approach(...args);
		});
	});
});

describe(`${clamp.name}()`, () => {
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

describe(`${distanceSq.name}()`, () => {
	test('should return squared distance of vector', () => {
		expect(distanceSq([10])).toEqual(100);
		expect(distanceSq([-10])).toEqual(100);

		expect(distanceSq([3, 4])).toEqual(25);
		expect(distanceSq([-3, 4])).toEqual(25);
		expect(distanceSq([-3, -4])).toEqual(25);
		expect(distanceSq([3, -4])).toEqual(25);

		expect(distanceSq([3, 4, 5])).toEqual(50);
		expect(distanceSq([-3, 4, -5])).toEqual(50);
		expect(distanceSq([-3, -4, -5])).toEqual(50);
		expect(distanceSq([3, -4, 5])).toEqual(50);
	});
});

describe(`${distanceSq.name}()`, () => {
	test('should return distance of vector', () => {
		expect(distance([10])).toEqual(10);
		expect(distance([-10])).toEqual(10);

		expect(distance([3, 4])).toEqual(5);
		expect(distance([-3, 4])).toEqual(5);
		expect(distance([-3, -4])).toEqual(5);
		expect(distance([3, -4])).toEqual(5);

		const sqrt50 = Math.sqrt(50);
		expect(distance([3, 4, 5])).toEqual(sqrt50);
		expect(distance([-3, 4, -5])).toEqual(sqrt50);
		expect(distance([-3, -4, -5])).toEqual(sqrt50);
		expect(distance([3, -4, 5])).toEqual(sqrt50);
	});
});

describe(`${equal.name}()`, () => {
	test('should identify equal values as equal', () => {
		expect(equal(-1, -1)).toBeTruthy();
		expect(equal(3, 3)).toBeTruthy();
		expect(equal(123.4567, 123.4567)).toBeTruthy();
	});

	test('should identify nearly equal values as equal', () => {
		expect(equal(1 / 3, 0.333333)).toBeTruthy();
		expect(equal(-0, 0)).toBeTruthy();
	});

	test('should identify non-equal values as not equal', () => {
		expect(equal(-1, 1)).toBeFalsy();
		expect(equal(0.1, 0.2)).toBeFalsy();
		expect(equal(0.00001, 0.00002)).toBeFalsy();
	});
});

describe(`${lerp.name}()`, () => {
	const from = 13;
	const to = 23;

	const tests = [
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

describe(`${lerpAngle.name}()`, () => {
	test('should correctly interpolate between the two angles', () => {
		expect(lerpAngle(0, DEG_TO_RAD * 10, 0)).toEqual(DEG_TO_RAD * 0);
		expect(lerpAngle(0, DEG_TO_RAD * 10, 0.5)).toBeCloseTo(DEG_TO_RAD * 5);
		expect(lerpAngle(0, DEG_TO_RAD * 10, 1)).toBeCloseTo(DEG_TO_RAD * 10);

		expect(lerpAngle(0, DEG_TO_RAD * 370, 0)).toEqual(DEG_TO_RAD * 0);
		expect(lerpAngle(0, DEG_TO_RAD * 370, 0.5)).toBeCloseTo(DEG_TO_RAD * 5);
		expect(lerpAngle(0, DEG_TO_RAD * 370, 1)).toBeCloseTo(DEG_TO_RAD * 10);

		expect(lerpAngle(0, DEG_TO_RAD * 730, 0)).toEqual(DEG_TO_RAD * 0);
		expect(lerpAngle(0, DEG_TO_RAD * 730, 0.5)).toBeCloseTo(DEG_TO_RAD * 5);
		expect(lerpAngle(0, DEG_TO_RAD * 730, 1)).toBeCloseTo(DEG_TO_RAD * 10);

		expect(lerpAngle(0, DEG_TO_RAD * -350, 0)).toEqual(DEG_TO_RAD * 0);
		expect(lerpAngle(0, DEG_TO_RAD * -350, 0.5)).toBeCloseTo(
			DEG_TO_RAD * 5,
		);
		expect(lerpAngle(0, DEG_TO_RAD * -350, 1)).toBeCloseTo(DEG_TO_RAD * 10);

		expect(lerpAngle(0, DEG_TO_RAD * -710, 0)).toEqual(DEG_TO_RAD * 0);
		expect(lerpAngle(0, DEG_TO_RAD * -710, 0.5)).toBeCloseTo(
			DEG_TO_RAD * 5,
		);
		expect(lerpAngle(0, DEG_TO_RAD * -710, 1)).toBeCloseTo(DEG_TO_RAD * 10);
	});
});

describe(`${lerpAngleDeg.name}()`, () => {
	test('should correctly interpolate between the two angles', () => {
		expect(lerpAngleDeg(0, 10, 0)).toEqual(0);
		expect(lerpAngleDeg(0, 10, 0.5)).toEqual(5);
		expect(lerpAngleDeg(0, 10, 1)).toEqual(10);

		expect(lerpAngleDeg(0, 370, 0)).toEqual(0);
		expect(lerpAngleDeg(0, 370, 0.5)).toEqual(5);
		expect(lerpAngleDeg(0, 370, 1)).toEqual(10);

		expect(lerpAngleDeg(0, 730, 0)).toEqual(0);
		expect(lerpAngleDeg(0, 730, 0.5)).toEqual(5);
		expect(lerpAngleDeg(0, 730, 1)).toEqual(10);

		expect(lerpAngleDeg(0, -350, 0)).toEqual(0);
		expect(lerpAngleDeg(0, -350, 0.5)).toEqual(5);
		expect(lerpAngleDeg(0, -350, 1)).toEqual(10);

		expect(lerpAngleDeg(0, -710, 0)).toEqual(0);
		expect(lerpAngleDeg(0, -710, 0.5)).toEqual(5);
		expect(lerpAngleDeg(0, -710, 1)).toEqual(10);
	});
});

describe(`${lerpClamp.name}()`, () => {
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

describe(`${remap.name}()`, () => {
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

describe(`${remapClamp.name}()`, () => {
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

describe(`${snapToGrid.name}()`, () => {
	test('should snap value to a grid', () => {
		for (let i = 0; i < 32; ++i) {
			expect(snapToGrid(i, 32)).toBe(0);
		}
		for (let i = 0; i < 32; ++i) {
			expect(snapToGrid(32 + i, 32)).toBe(32);
		}
		for (let i = 0; i < 32; ++i) {
			expect(snapToGrid(64 + i, 32)).toBe(64);
		}
	});

	test('should snap value to a grid and apply an offset', () => {
		for (let i = 0; i < 32; ++i) {
			expect(snapToGrid(i, 32, 48)).toBe(48);
		}

		for (let i = 0; i < 10; ++i) {
			expect(snapToGrid(12, 32, i)).toBe(i);
		}

		expect(snapToGrid(32, 32, -48)).toBe(-16);
	});
});
