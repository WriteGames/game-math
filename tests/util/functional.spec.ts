import { describe, expect, test } from 'vitest';

import { reduceProduct, reduceSum } from '../../bin';

describe(`${reduceProduct.name}()`, () => {
	test('should reduce a set of numbers into their product', () => {
		expect([1, 2, 3, 4].reduce(reduceProduct)).toEqual(24);
	});
});

describe(`${reduceSum.name}()`, () => {
	test('should reduce a set of numbers into their sum', () => {
		expect([1, 2, 3, 4].reduce(reduceSum)).toEqual(10);
	});
});
