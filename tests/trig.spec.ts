import { describe, expect, test } from 'vitest';
import {
	angleDifference,
	angleDifferenceDeg,
	angleDifferenceSign,
	angleDifferenceSignDeg,
	approachAngle,
	approachAngleDeg,
	DEG_TO_RAD,
	wrapAngleDeg,
} from '../util/trig';
import { RAD_360, wrapAngle } from '../bin';

describe(`${angleDifference.name}() / ${angleDifferenceDeg.name}()`, () => {
	test('should return correct delta between angles', () => {
		expect(angleDifferenceDeg(-45, -45)).toEqual(0);
		expect(angleDifferenceDeg(90, 90)).toEqual(0);
		expect(angleDifferenceDeg(777, 777)).toEqual(0);

		for (let i = -720; i <= 720; i += 30) {
			let dest = i;
			while (dest < -180) dest += 360;
			while (dest >= 180) dest -= 360;
			const a = -45;
			const b = a + i;
			expect(angleDifferenceDeg(a, b)).toEqual(dest);
			expect(angleDifference(a * DEG_TO_RAD, b * DEG_TO_RAD)).toBeCloseTo(
				dest * DEG_TO_RAD,
			);
		}
	});
});

describe(`${angleDifferenceSign.name}() / ${angleDifferenceSignDeg.name}()`, () => {
	test('should return correct sign between angles', () => {
		expect(angleDifferenceSignDeg(-45, -45)).toEqual(0);
		expect(angleDifferenceSignDeg(90, 90)).toEqual(0);
		expect(angleDifferenceSignDeg(777, 777)).toEqual(0);

		for (let i = -720; i <= 720; i += 30) {
			let dest = i;
			while (dest < -180) dest += 360;
			while (dest >= 180) dest -= 360;
			const a = -45;
			const b = a + i;
			const sign = Math.sign(dest);
			expect(angleDifferenceSignDeg(a, b)).toEqual(sign);
			expect(angleDifferenceSign(a * DEG_TO_RAD, b * DEG_TO_RAD)).toEqual(
				sign,
			);
		}
	});
});

describe(`${approachAngle.name}()/${approachAngleDeg.name}()`, () => {
	describe('equal', () => {
		test('should return initial value if value and target are equivalent', () => {
			expect(approachAngle(0, 0, 1)).toEqual(0);
			expect(approachAngle(Math.PI, Math.PI, 1)).toEqual(Math.PI);
			expect(approachAngle(0, Math.PI * 2, 1)).toEqual(0);

			expect(approachAngleDeg(0, 0, 45)).toEqual(0);
			expect(approachAngleDeg(225, 225, 45)).toEqual(225);
			expect(approachAngleDeg(0, 360, 50)).toEqual(0);
		});
	});

	describe('asc', () => {
		const PI_4 = Math.PI / 4;
		const PI_2 = Math.PI / 2;

		test('should approach the target', () => {
			expect(approachAngle(PI_4, Math.PI, PI_4)).toEqual(PI_2);
			expect(approachAngle(PI_2, Math.PI, PI_4)).toEqual(3 * PI_4);

			expect(approachAngleDeg(45, 180, 45)).toEqual(90);
			expect(approachAngleDeg(90, 180, 45)).toEqual(135);
		});

		test('should reach the target', () => {
			expect(approachAngle(PI_4, Math.PI, 3 * PI_4)).toBeCloseTo(Math.PI);

			expect(approachAngleDeg(45, 180, 135)).toEqual(180);
		});

		test('should not exceed the target', () => {
			expect(approachAngle(PI_4, Math.PI, 5 * PI_4)).toBeCloseTo(Math.PI);

			expect(approachAngleDeg(45, 180, 360)).toEqual(180);
		});

		test('should handle an amount of 0', () => {
			expect(approachAngle(PI_4, Math.PI, 0)).toEqual(PI_4);

			expect(approachAngleDeg(45, 180, 0)).toEqual(45);
		});

		test('should handle a negative value', () => {
			expect(approachAngle(PI_4, Math.PI, -PI_4)).toEqual(0);

			expect(approachAngleDeg(45, 180, -45)).toEqual(0);
		});
	});

	describe('desc', () => {
		const PI_4 = Math.PI / 4;

		test('should approach the target', () => {
			expect(approachAngle(Math.PI, PI_4, PI_4)).toEqual(3 * PI_4);

			expect(approachAngleDeg(180, 45, 45)).toEqual(135);
		});

		test('should reach the target', () => {
			expect(approachAngle(Math.PI, PI_4, 3 * PI_4)).toEqual(PI_4);

			expect(approachAngleDeg(180, 45, 135)).toEqual(45);
		});

		test('should not exceed the target', () => {
			expect(approachAngle(Math.PI, PI_4, 5 * PI_4)).toBeCloseTo(PI_4);

			expect(approachAngleDeg(180, 45, 360)).toEqual(45);
		});

		test('should handle an amount of 0', () => {
			expect(approachAngle(Math.PI, PI_4, 0)).toEqual(Math.PI);

			expect(approachAngleDeg(180, 45, 0)).toEqual(180);
		});

		test('should handle a negative value', () => {
			expect(approachAngle(Math.PI, PI_4, -PI_4)).toEqual(Math.PI + PI_4);

			expect(approachAngleDeg(180, 45, -45)).toEqual(225);
		});
	});
});

describe(`${wrapAngle.name}()/${wrapAngleDeg.name}()`, () => {
	test('should wrap an angle to [0, 360)', () => {
		const start = -360 * 3;
		for (let i = 0; i < 360 * 5; ++i) {
			const expected = i % 360;
			let result = wrapAngleDeg(start + i);
			if (result === -0) result = 0;
			expect(result).toEqual(expected);

			const result2 = wrapAngle((start + i) * DEG_TO_RAD);
			expect(result2).toBeCloseTo(expected * DEG_TO_RAD);
		}

		for (let i = -360; i <= 360; ++i) {
			const result = wrapAngleDeg(i);
			expect(result).toBeGreaterThanOrEqual(0);
			expect(result).toBeLessThan(360);
		}
	});
});
