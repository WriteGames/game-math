import { describe, expect, test } from 'vitest';
import { type V2_T, Vec2, type M2_T } from '../index.js';
import {
	determinantM2,
	Mat2,
	multiplyM2V2,
	transpose2D,
} from '../vectors/mat2.js';

const M2_00 = 0;
const M2_10 = 1;
const M2_01 = 2;
const M2_11 = 3;

describe('Matrix operations', () => {
	const mat2DeterminantValues = [12, 2, 1, 5] as M2_T;
	const mat2DeterminantResult = 58;

	describe('class Mat2', () => {
		describe('constructor', () => {
			test('should set matrix to 2x2 identity matrix if no arguments are given', () => {
				const mat2 = new Mat2();
				expect(mat2).toEqual(Mat2.identity);
			});

			test('should set internal values to column-major', () => {
				const mat2 = new Mat2(1, 2, 3, 4);
				expect(mat2).toEqual([1, 3, 2, 4]);
			});
		});

		describe('getters', () => {
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
		});

		describe('setters', () => {
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

		describe('iterator', () => {
			test('should return an ArrayIterator consisting of four numbers', () => {
				expect([...new Mat2(1, 2, 3, 4)]).toEqual([1, 3, 2, 4]);
			});
		});

		describe('static properties', () => {
			test(`.identity should return the 2x2 identity matrix`, () => {
				expect(Mat2.identity).toEqual([1, 0, 0, 1]);
			});

			test(`.${Mat2.rotate.name}() should return a 2x2 rotation matrix`, () => {
				const a = Mat2.rotate(0);
				expect(a).toEqualMat2([1, 0, -0, 1]);

				const b = Mat2.rotate(Math.PI / 2);
				expect(b).toEqualMat2([0, 1, -1, 0]);

				const c = Mat2.rotate(Math.PI);
				expect(c).toEqualMat2([-1, 0, 0, -1]);

				const d = Mat2.rotate((3 * Math.PI) / 2);
				expect(d).toEqualMat2([0, -1, 1, 0]);
			});

			describe(`.${Mat2.scale.name}`, () => {
				test(`should return a 2x2 scale matrix (one arg)`, () => {
					const a = Mat2.scale(0);
					expect(a).toEqualMat2([0, 0, 0, 0]);

					const b = Mat2.scale(1);
					expect(b).toEqualMat2([1, 0, 0, 1]);

					const c = Mat2.scale(7.7);
					expect(c).toEqualMat2([7.7, 0, 0, 7.7]);
				});

				test(`should return a 2x2 scale matrix (two args)`, () => {
					const a = Mat2.scale(0, 0);
					expect(a).toEqualMat2([0, 0, 0, 0]);

					const b = Mat2.scale(1, 1);
					expect(b).toEqualMat2([1, 0, 0, 1]);

					const c = Mat2.scale(6.7, 8.9);
					expect(c).toEqualMat2([6.7, 0, 0, 8.9]);
				});
			});
		});

		describe('.prototype', () => {
			test(`.${Mat2.prototype.clone.name}() should return an identical 2z2 matrix`, () => {
				const a = new Mat2(1, 2, 3, 4);
				const b = a.clone();
				expect(a).not.toBe(b);
				expect(a).toEqual(b);
			});

			test(`.${Mat2.prototype.equal.name}() should match identical matricies`, () => {
				const a = new Mat2(1, 2, 3, 4);
				const b = new Mat2(1, 2, 3, 4);
				const c = new Mat2(0, 0, 0, 0);

				expect(a.equal(b)).toBeTruthy();
				expect(a.equal(c)).toBeFalsy();
			});

			test(`.${Mat2.prototype.transpose.name}() should transpose the matrix in-place`, () => {
				const a = new Mat2(1, 2, 3, 4);
				// TODO(bret): make an expect(a).toChain((v) => v.transpose()) matcher?
				expect(a).toChain((v) => v.transpose());
				expect(a).toEqual(new Mat2(1, 3, 2, 4));
			});

			test(`.${Mat2.prototype.setIdentity.name}() should set the matrix to the 2x2 identity matrix`, () => {
				const a = new Mat2(5, 5, 5, 5);
				expect(a.setIdentity()).toBe(a);
				expect(a).toEqual(Mat2.identity);
			});

			test(`.${Mat2.prototype.determinant.name}() should return the determinant`, () => {
				const a = new Mat2(...mat2DeterminantValues);
				expect(a.determinant()).toEqual(mat2DeterminantResult);
			});

			test(`.${Mat2.prototype.invert.name}() should invert the matrix in-place`, () => {
				const a = new Mat2(...mat2DeterminantValues);
				const b = a.clone();
				expect(b).toChain((m) => m.invert());
				a.multiply(b);
				expect(a).toEqual(Mat2.identity);
			});

			test(`.${Mat2.prototype.multiply.name}() should pre-multiply the matrix by the passed matrix`, () => {
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

			const multiplyRTLFuncs = ['multiplyRTL', 'postMultiply'] as const;
			multiplyRTLFuncs.forEach((funcName) => {
				test(`.${Mat2.prototype[funcName].name}() should post-multiply the matrix by the passed matrix`, () => {
					const a = new Mat2(1, 2, 3, 4);
					const b = new Mat2(5, 6, 7, 8);
					expect(b).toChain((v) => v[funcName](a));
					expect(b).toEqual(new Mat2(19, 22, 43, 50));

					{
						const a = new Mat2(5, 6, 7, 8);
						const b = new Mat2(1, 2, 3, 4);
						expect(b[funcName](a)).toEqual(
							new Mat2(23, 34, 31, 46),
						);
					}

					{
						const a = new Mat2(-2, 3, -1, 4);
						const b = new Mat2(6, 4, 3, -1);
						expect(b[funcName](a)).toEqual(
							new Mat2(-3, -11, 6, -8),
						);
					}

					{
						const a = new Mat2(2, -5, 0, -3);
						const b = new Mat2(1, -1, 3, 2);
						expect(b[funcName](a)).toEqual(
							new Mat2(-13, -12, -9, -6),
						);
					}
				});
			});
		});
	});

	describe('Mat2 helper functions', () => {
		describe('functions', () => {
			describe(`${transpose2D.name}()`, () => {
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

			describe(`${determinantM2.name}()`, () => {
				test('should return the determinant a Mat2', () => {
					const a = new Mat2(...mat2DeterminantValues);
					expect(determinantM2(a)).toEqual(mat2DeterminantResult);
				});

				test('should return the determinant of an array of length 4', () => {
					const a = [...mat2DeterminantValues] as M2_T;
					expect(determinantM2(a)).toEqual(mat2DeterminantResult);
				});

				test('arrays of invalid length should throw error', () => {
					expect(() => {
						determinantM2([0] as unknown as M2_T);
					}).toThrowError();

					expect(() => {
						determinantM2([0, 1, 2] as unknown as M2_T);
					}).toThrowError();

					expect(() => {
						determinantM2([0, 1, 2, 3, 4] as unknown as M2_T);
					}).toThrowError();
				});
			});

			describe(`${multiplyM2V2.name}()`, () => {
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

				test('arguments should throw error if they are not the correct lengths', () => {
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
