import { describe, expect, test } from 'vitest';
import { angleDifference, angleDifferenceDeg, DEG_TO_RAD } from '../util/trig';

describe('angleDifference() / angleDifferenceDeg()', () => {
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
