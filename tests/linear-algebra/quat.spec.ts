import { describe, expect, test } from 'vitest';
import { inverseQ4, multiplyQ4Q4, Quat } from '../../src/linear-algebra/quat';

describe('Quat', () => {
	describe('constructor', () => {
		test('should return the identity quaternion when no arguments are passed', () => {});
	});

	describe('getter/setters work as intended', () => {
		test('get x/y/z/w/[0]/[1]/[2]/[3]', () => {
			const X = 2;
			const Y = 5;
			const Z = 7;
			const W = 11;
			const a = new Quat(X, Y, Z, W);

			expect(a.x).toEqual(X);
			expect(a[0]).toEqual(X);

			expect(a.y).toEqual(Y);
			expect(a[1]).toEqual(Y);

			expect(a.z).toEqual(Z);
			expect(a[2]).toEqual(Z);

			expect(a.w).toEqual(W);
			expect(a[3]).toEqual(W);
		});

		test('set x/y/z/[0]/[1]/[2]', () => {
			const X = 13;
			const Y = 27;
			const Z = 42;
			const W = 68;
			const a = new Quat();

			a.x = X;
			expect(a.x).toEqual(X);
			a[0] = -X;
			expect(a.x).toEqual(-X);

			a.y = Y;
			expect(a.y).toEqual(Y);
			a[1] = -Y;
			expect(a.y).toEqual(-Y);

			a.z = Z;
			expect(a.z).toEqual(Z);
			a[2] = -Z;
			expect(a.z).toEqual(-Z);

			a.w = W;
			expect(a.w).toEqual(W);
			a[3] = -W;
			expect(a.w).toEqual(-W);
		});
	});

	test('test iterator', () => {
		const X = 5;
		const Y = 7;
		const Z = 9;
		const W = 11;
		expect([...new Quat(X, Y, Z, W)]).toEqual([X, Y, Z, W]);
	});

	describe('static Quat getters', () => {
		test('Quat.identity should return a quaternion set to <0, 0, 0, 1>', () => {
			expect(Quat.identity).toEqualQuat([0, 0, 0, 1]);
		});
	});

	test('clone', () => {
		const a = new Quat(5, 7, 9, 11);
		const b = a.clone();
		expect(a === b).toEqual(false);
		expect(a).toEqualQuat(b);
	});
});

describe('Quaternion operations', () => {
	describe('inverse', () => {
		const q = new Quat(1, 2, 3, 4);
		const inverse = inverseQ4(q);

		test('inverse should produce correct value', () => {
			const expected = [-0.1 / 3, -0.2 / 3, -0.1, 4 / 3 / 10];

			expect(inverse).toEqual(expected);
		});

		test('quaternion times its inverse should return the identity quaternion', () => {
			const result = multiplyQ4Q4(q, inverse);
			expect(result).toEqualQuat(Quat.identity);
		});
	});
});
