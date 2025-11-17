import { describe, expect, test } from 'vitest';
import { type V2_T, Vec2, type M2_T } from '../index.js';
import {
	determinant2D,
	Mat2,
	multiplyM2V2,
	transpose2D,
} from '../vectors/mat2.js';

const M2_00 = 0;
const M2_10 = 1;
const M2_01 = 2;
const M2_11 = 3;

describe('Matrix operations', () => {
	describe('Mat2', () => {
		describe('constructor', () => {
			test('should set matrix to identity matrix if no arguments are given', () => {
				const mat2 = new Mat2();
				expect(mat2).toEqual(Mat2.identity);
			});

			test('should set internal values to column-major', () => {
				const mat2 = new Mat2(1, 2, 3, 4);
				expect(mat2).toEqual([1, 3, 2, 4]);
			});
		});

		describe('getter/setters work as intended', () => {
			test('get mXX/[x]', () => {
				const M00 = 1;
				const M01 = 2;
				const M11 = 2;
				const M10 = 2;
				const a = new Mat2(M00, M01, M10, M11);

				expect(a.m00).toEqual(M00);
				expect(a[M2_00]).toEqual(M00);

				expect(a.m10).toEqual(M01);
				expect(a[M2_01]).toEqual(M01);

				expect(a.m01).toEqual(M10);
				expect(a[M2_10]).toEqual(M10);

				expect(a.m11).toEqual(M11);
				expect(a[M2_11]).toEqual(M11);
			});

			test('set mXX/[x]', () => {
				const M00 = 1;
				const M01 = 2;
				const M11 = 2;
				const M10 = 2;
				const a = new Mat2();

				a.m00 = M00;
				expect(a.m00).toEqual(M00);
				a[M2_00] = M00;
				expect(a.m00).toEqual(M00);

				a.m10 = M01;
				expect(a.m10).toEqual(M01);
				a[M2_01] = M01;
				expect(a.m10).toEqual(M01);

				a.m01 = M10;
				expect(a.m01).toEqual(M10);
				a[M2_10] = M10;
				expect(a.m01).toEqual(M10);

				a.m11 = M11;
				expect(a.m11).toEqual(M11);
				a[M2_11] = M11;
				expect(a.m11).toEqual(M11);
			});
		});

		test('test iterator', () => {
			expect([...new Mat2(1, 2, 3, 4)]).toEqual([1, 3, 2, 4]);
		});

		describe('static Mat2 getters', () => {
			test('Vec2.identity should return the 2x2 identity matrix', () => {
				expect(Mat2.identity).toEqual([1, 0, 0, 1]);
			});
		});

		test('clone() should return an identical matrix', () => {
			const a = new Mat2(1, 2, 3, 4);
			const b = a.clone();
			expect(a).not.toBe(b);
			expect(a).toEqual(b);
		});

		test('equal() should match identical matricies', () => {
			const a = new Mat2(1, 2, 3, 4);
			const b = new Mat2(1, 2, 3, 4);
			const c = new Mat2(0, 0, 0, 0);

			expect(a.equal(b)).toBeTruthy();
			expect(a.equal(c)).toBeFalsy();
		});

		test('transpose() should transpose the matrix in-place', () => {
			const a = new Mat2(1, 2, 3, 4);
			// TODO(bret): make an expect(a).toChain((v) => v.transpose()) matcher?
			expect(a.transpose()).toBe(a);
			expect(a).toEqual(new Mat2(1, 3, 2, 4));
		});

		test('setIdentity() should set the matrix to the 2x2 identity matrix', () => {
			const a = new Mat2(5, 5, 5, 5);
			expect(a.setIdentity()).toBe(a);
			expect(a).toEqual(Mat2.identity);
		});

		const determinantValues = [12, 2, 1, 5] as M2_T;
		const determinantResult = 58;

		test('determinant() should return the determinant', () => {
			const a = new Mat2(...determinantValues);
			expect(a.determinant()).toEqual(determinantResult);
		});

		test('invert() should invert the matrix in-place', () => {
			const a = new Mat2(...determinantValues);
			const b = a.clone();
			expect(b).toChain((m) => m.invert());
			a.multiply(b);
			expect(a).toEqual(Mat2.identity);
		});

		test('multiply() should pre-multiply the matrix by the passed matrix', () => {
			const a = new Mat2(1, 2, 3, 4);
			const b = new Mat2(5, 6, 7, 8);
			expect(a).toChain((v) => v.multiply(b));
			expect(a).toEqual(new Mat2(19, 22, 43, 50));

			{
				const a = new Mat2(5, 6, 7, 8);
				const b = new Mat2(1, 2, 3, 4);
				expect(a.multiply(b)).toEqual(new Mat2(23, 34, 31, 46));
			}

			{
				const a = new Mat2(-2, 3, -1, 4);
				const b = new Mat2(6, 4, 3, -1);
				expect(a.multiply(b)).toEqual(new Mat2(-3, -11, 6, -8));
			}

			{
				const a = new Mat2(2, -5, 0, -3);
				const b = new Mat2(1, -1, 3, 2);
				expect(a.multiply(b)).toEqual(new Mat2(-13, -12, -9, -6));
			}
		});

		describe('functions', () => {
			describe('transpose2D()', () => {
				test('should transpose a Mat2', () => {
					expect(transpose2D(new Mat2(1, 2, 3, 4))).toEqual(
						new Mat2(1, 3, 2, 4),
					);
				});

				test('should transpose an array of length 4', () => {
					expect(transpose2D([1, 3, 2, 4])).toEqual([1, 2, 3, 4]);
				});

				test('arrays of invalid length should throw error', () => {
					expect(() => {
						transpose2D([0] as unknown as M2_T);
					}).toThrowError();

					expect(() => {
						transpose2D([0, 1, 2] as unknown as M2_T);
					}).toThrowError();

					expect(() => {
						transpose2D([0, 1, 2, 3, 4] as unknown as M2_T);
					}).toThrowError();
				});
			});

			describe('determinant2D()', () => {
				test('should return the determinant a Mat2', () => {
					const a = new Mat2(...determinantValues);
					expect(determinant2D(a)).toEqual(determinantResult);
				});

				test('should return the determinant of an array of length 4', () => {
					const a = [...determinantValues] as M2_T;
					expect(determinant2D(a)).toEqual(determinantResult);
				});

				test('arrays of invalid length should throw error', () => {
					expect(() => {
						determinant2D([0] as unknown as M2_T);
					}).toThrowError();

					expect(() => {
						determinant2D([0, 1, 2] as unknown as M2_T);
					}).toThrowError();

					expect(() => {
						determinant2D([0, 1, 2, 3, 4] as unknown as M2_T);
					}).toThrowError();
				});
			});

			describe('multiplyM2V2()', () => {
				test('should return the determinant a Mat2', () => {
					const a = new Mat2(1, 2, 3, 4);
					const b = new Vec2(5, 7);
					expect(multiplyM2V2(a, b)).toEqual([19, 43]);
				});

				test('should return the determinant of an array of length 4', () => {
					const a = [1, 3, 2, 4] as M2_T;
					const b = [5, 7] as V2_T;
					expect(multiplyM2V2(a, b)).toEqual([19, 43]);
				});

				test.skip('arguments should throw error if they are not the correct lengths', () => {
					expect(() => {
						multiplyM2V2([0] as unknown as M2_T, [7, 8]);
					}).toThrowError();

					expect(() => {
						multiplyM2V2([0, 1, 2] as unknown as M2_T, [7, 8]);
					}).toThrowError();

					expect(() => {
						multiplyM2V2(
							[0, 1, 2, 3, 4] as unknown as M2_T,
							[7, 8],
						);
					}).toThrowError();

					expect(() => {
						multiplyM2V2([1, 2, 3, 4], [7] as unknown as V2_T);
					}).toThrowError();

					expect(() => {
						multiplyM2V2([1, 2, 3, 4], [
							7, 8, 9,
						] as unknown as V2_T);
					}).toThrowError();
				});
			});
		});
	});
});
