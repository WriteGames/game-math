import { posEqual } from '../../../.';
import type { Vector } from '../../../.';

export const toEqualVector = (actual: Vector, expected: Vector) => {
	const pass = posEqual(actual, expected);

	return {
		pass,
		message: () =>
			pass
				? 'Expected vectors not to be equal'
				: `Expected ${actual} to equal ${expected}`,
		actual,
		expected,
	};
};
