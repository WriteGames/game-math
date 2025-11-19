import { posEqual } from '../../../.';
import type { Matrix } from '../../../.';

export const toEqualMatrix = (actual: Matrix, expected: Matrix) => {
	const pass = posEqual(actual, expected);

	return {
		pass,
		message: () =>
			pass
				? 'Expected matrices not to be equal'
				: `Expected ${actual} to equal ${expected}`,
		actual,
		expected,
	};
};
