import { describe, expect, test } from 'vitest';
import { Vec2 } from '../index.js';
import type { V2_T, V3_T, M2_T, M3_T } from '../index.js';
import { determinantM2, multiplyM2V2, transpose2D } from '../vectors/mat2.js';
import { Mat3 } from '../vectors/mat3.js';

const M2_00 = 0;
const M2_10 = 1;
const M2_20 = 2;

const M2_01 = 3;
const M2_11 = 4;
const M2_21 = 5;

const M2_02 = 6;
const M2_12 = 7;
const M2_22 = 8;

describe('Matrix operations', () => {
	// prettier-ignore
	const mat3DeterminantValues = [
		7, -4, 2,
		3, 1, -5,
		2, 2, -5,
	] as M3_T;
	const mat3DeterminantResult = 23;

	describe('class Mat3', () => {
		describe('constructor', () => {
			test('should set matrix to 3x3 identity matrix if no arguments are given', () => {
				const mat3 = new Mat3();
				expect(mat3).toEqual(Mat3.identity);
			});

			test('should set internal values to column-major', () => {
				// prettier-ignore
				const mat3 = new Mat3(
					1, 2, 3,
					4, 5, 6,
					7, 8, 9,
				);
				// prettier-ignore
				expect(mat3).toEqual([
					1, 4, 7,
					2, 5, 8,
					3, 6, 9,
				]);
			});
		});

		describe('getters', () => {
			test('get mXX/[x]', () => {
				const [M00, M01, M02] = [1, 2, 3];
				const [M10, M11, M12] = [4, 5, 6];
				const [M20, M21, M22] = [7, 8, 9];

				// prettier-ignore
				const a = new Mat3(
					M00, M01, M02,
					M10, M11, M12,
					M20, M21, M22,
				);

				expect(a.m00).toEqual(M00);
				expect(a[M2_00]).toEqual(M00);

				expect(a.m10).toEqual(M01);
				expect(a[M2_01]).toEqual(M01);

				expect(a.m20).toEqual(M02);
				expect(a[M2_02]).toEqual(M02);

				expect(a.m01).toEqual(M10);
				expect(a[M2_10]).toEqual(M10);

				expect(a.m11).toEqual(M11);
				expect(a[M2_11]).toEqual(M11);

				expect(a.m21).toEqual(M12);
				expect(a[M2_12]).toEqual(M12);

				expect(a.m02).toEqual(M20);
				expect(a[M2_20]).toEqual(M20);

				expect(a.m12).toEqual(M21);
				expect(a[M2_21]).toEqual(M21);

				expect(a.m22).toEqual(M22);
				expect(a[M2_22]).toEqual(M22);
			});
		});

		describe('setters', () => {
			test('set mXX/[x]', () => {
				const [M00, M01, M02] = [1, 2, 3];
				const [M10, M11, M12] = [4, 5, 6];
				const [M20, M21, M22] = [7, 8, 9];
				const a = new Mat3();

				a.m00 = M00;
				expect(a.m00).toEqual(M00);
				a[M2_00] = -M00;
				expect(a.m00).toEqual(-M00);

				a.m10 = M01;
				expect(a.m10).toEqual(M01);
				a[M2_01] = -M01;
				expect(a.m10).toEqual(-M01);

				a.m20 = M02;
				expect(a.m20).toEqual(M02);
				a[M2_02] = -M02;
				expect(a.m20).toEqual(-M02);

				a.m01 = M10;
				expect(a.m01).toEqual(M10);
				a[M2_10] = -M10;
				expect(a.m01).toEqual(-M10);

				a.m11 = M11;
				expect(a.m11).toEqual(M11);
				a[M2_11] = -M11;
				expect(a.m11).toEqual(-M11);

				a.m21 = M12;
				expect(a.m21).toEqual(M12);
				a[M2_12] = -M12;
				expect(a.m21).toEqual(-M12);

				a.m02 = M20;
				expect(a.m02).toEqual(M20);
				a[M2_20] = -M20;
				expect(a.m02).toEqual(-M20);

				a.m12 = M21;
				expect(a.m12).toEqual(M21);
				a[M2_21] = -M21;
				expect(a.m12).toEqual(-M21);

				a.m22 = M22;
				expect(a.m22).toEqual(M22);
				a[M2_22] = -M22;
				expect(a.m22).toEqual(-M22);
			});
		});

		describe('iterator', () => {
			test('should return an ArrayIterator consisting of four numbers', () => {
				// prettier-ignore
				expect([...new Mat3(
					1, 2, 3,
					4, 5, 6,
					7, 8, 9,
				)]).toEqual([
					1, 4, 7,
					2, 5, 8,
					3, 6, 9,
				]);
			});
		});

		describe('static properties', () => {
			test(`.identity should return the 3x3 identity matrix`, () => {
				// prettier-ignore
				expect(Mat3.identity).toEqual([
					1, 0, 0,
					0, 1, 0,
					0, 0, 1,
				]);
			});

			test.todo(
				`.${Mat3.rotate.name}() should return a 3x3 rotation matrix around an arbitrary axis`,
				() => {
					const a = Mat3.rotate(0);
					// prettier-ignore
					expect(a).toEqualMat3([
						+1, +0, +0,
						-0, +1, +0,
						+0, +0, +0,
					]);

					const b = Mat3.rotate(Math.PI / 2);
					// prettier-ignore
					expect(b).toEqualMat3([
						+0, +1, +0,
						-1, +0, +0,
						+0, +0, +0,
					]);

					const c = Mat3.rotate(Math.PI);
					// prettier-ignore
					expect(c).toEqualMat3([
						-1, +0, +0,
						+0, -1, +0,
						+0, +0, +0,
					]);

					const d = Mat3.rotate((3 * Math.PI) / 2);
					// prettier-ignore
					expect(d).toEqualMat3([
						+0, -1, +0,
						+1, +0, +0,
						+0, +0, +0,
					]);
				},
			);

			test(`.${Mat3.rotateX.name}() should return a 3x3 rotation matrix rotated around the x-axis`, () => {
				const a = Mat3.rotateX(0);
				// prettier-ignore
				expect(a).toEqualMat3([
					+1, +0, +0,
					-0, +1, +0,
					+0, +0, +1,
				]);

				const b = Mat3.rotateX(Math.PI / 2);
				// prettier-ignore
				expect(b).toEqualMat3([
					+1, +0, +0,
					+0, +0, +1,
					+0, -1, +0,
				]);

				const c = Mat3.rotateX(Math.PI);
				// prettier-ignore
				expect(c).toEqualMat3([
					+1, +0, +0,
					+0, -1, +0,
					+0, -0, -1,
				]);

				const d = Mat3.rotateX((3 * Math.PI) / 2);
				// prettier-ignore
				expect(d).toEqualMat3([
					+1, +0, +0,
					+0, +0, -1,
					+0, +1, +0,
				]);
			});

			test(`.${Mat3.rotateY.name}() should return a 3x3 rotation matrix`, () => {
				const a = Mat3.rotateY(0);
				// prettier-ignore
				expect(a).toEqualMat3([
					+1, +0, +0,
					+0, +1, +0,
					+0, +0, +1,
				]);

				const b = Mat3.rotateY(Math.PI / 2);
				// prettier-ignore
				expect(b).toEqualMat3([
					+0, +0, -1,
					+0, +1, +0,
					+1, +0, +0,
				]);

				const c = Mat3.rotateY(Math.PI);
				// prettier-ignore
				expect(c).toEqualMat3([
					-1, +0, -0,
					+0, +1, +0,
					+0, +0, -1,
				]);

				const d = Mat3.rotateY((3 * Math.PI) / 2);
				// prettier-ignore
				expect(d).toEqualMat3([
					-0, +0, +1,
					+0, +1, +0,
					-1, +0, -0,
				]);
			});

			test(`.${Mat3.rotateZ.name}() should return a 3x3 rotation matrix`, () => {
				const a = Mat3.rotateZ(0);
				// prettier-ignore
				expect(a).toEqualMat3([
					+1, +0, +0,
					-0, +1, +0,
					+0, +0, +1,
				]);

				const b = Mat3.rotateZ(Math.PI / 2);
				// prettier-ignore
				expect(b).toEqualMat3([
					+0, +1, +0,
					-1, +0, +0,
					+0, +0, +1,
				]);

				const c = Mat3.rotateZ(Math.PI);
				// prettier-ignore
				expect(c).toEqualMat3([
					-1, +0, +0,
					+0, -1, +0,
					+0, +0, +1,
				]);

				const d = Mat3.rotateZ((3 * Math.PI) / 2);
				// prettier-ignore
				expect(d).toEqualMat3([
					+0, -1, +0,
					+1, +0, +0,
					+0, +0, +1,
				]);
			});

			describe(`.${Mat3.scale.name}`, () => {
				test(`should return a 3x3 scale matrix (one arg)`, () => {
					const a = Mat3.scale(0);
					// prettier-ignore
					expect(a).toEqualMat3([
						0, 0, 0,
						0, 0, 0,
						0, 0, 0,
					]);

					const b = Mat3.scale(1);
					// prettier-ignore
					expect(b).toEqualMat3([
						1, 0, 0,
						0, 1, 0,
						0, 0, 1,
					]);

					const c = Mat3.scale(7.7);
					// prettier-ignore
					expect(c).toEqualMat3([
						7.7, 0.0, 0.0,
						0.0, 7.7, 0.0,
						0.0, 0.0, 7.7,
					]);
				});

				test(`should return a 3x3 scale matrix (three args)`, () => {
					const a = Mat3.scale(0, 0, 0);
					// prettier-ignore
					expect(a).toEqualMat3([
						0, 0, 0,
						0, 0, 0,
						0, 0, 0,
					]);

					const b = Mat3.scale(1, 1, 1);
					// prettier-ignore
					expect(b).toEqualMat3([
						1, 0, 0,
						0, 1, 0,
						0, 0, 1,
					]);

					const c = Mat3.scale(4.5, 6.7, 8.9);
					// prettier-ignore
					expect(c).toEqualMat3([
						4.5, 0.0, 0.0,
						0.0, 6.7, 0.0,
						0.0, 0.0, 8.9,
					]);
				});
			});
		});

		describe('.prototype', () => {
			test(`.${Mat3.prototype.clone.name}() should return an identical 3x3 matrix`, () => {
				const a = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
				const b = a.clone();
				expect(a).not.toBe(b);
				expect(a).toEqual(b);
			});

			test(`.${Mat3.prototype.equal.name}() should match identical matricies`, () => {
				const a = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
				const b = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
				const c = new Mat3(0, 0, 0, 0, 0, 0, 0, 0, 0);

				expect(a.equal(b)).toBeTruthy();
				expect(a.equal(c)).toBeFalsy();
			});

			test(`.${Mat3.prototype.transpose.name}() should transpose the matrix in-place`, () => {
				// prettier-ignore
				const a = new Mat3(
					1, 2, 3,
					4, 5, 6,
					7, 8, 9,
				);
				// prettier-ignore
				const expected = new Mat3(
					1, 4, 7,
					2, 5, 8,
					3, 6, 9,
				);

				expect(a).toChain((v) => v.transpose());
				expect(a).toEqual(expected);
			});

			test(`.${Mat3.prototype.setIdentity.name}() should set the matrix to the 3x3 identity matrix`, () => {
				const a = new Mat3(5, 5, 5, 5, 5, 5, 5, 5, 5);
				expect(a.setIdentity()).toBe(a);
				expect(a).toEqual(Mat3.identity);
			});

			test(`.${Mat3.prototype.determinant.name}() should return the determinant`, () => {
				const a = new Mat3(...mat3DeterminantValues);
				expect(a.determinant()).toEqual(mat3DeterminantResult);
			});

			test.todo(
				`.${Mat3.prototype.invert.name}() should invert the matrix in-place`,
				() => {
					const a = new Mat3(...mat3DeterminantValues);
					const b = a.clone();
					expect(b).toChain((m) => m.invert());
					a.multiply(b);
					expect(a).toEqual(Mat3.identity);
				},
			);

			test.todo(
				`.${Mat3.prototype.multiply.name}() should pre-multiply the matrix by the passed matrix`,
				() => {
					const a = new Mat3(1, 2, 3, 4);
					const b = new Mat3(5, 6, 7, 8);
					expect(a).toChain((v) => v.multiply(b));
					expect(a).toEqual(new Mat3(19, 22, 43, 50));

					{
						const a = new Mat3(5, 6, 7, 8);
						const b = new Mat3(1, 2, 3, 4);
						expect(a.multiply(b)).toEqual(new Mat3(23, 34, 31, 46));
					}

					{
						const a = new Mat3(-2, 3, -1, 4);
						const b = new Mat3(6, 4, 3, -1);
						expect(a.multiply(b)).toEqual(new Mat3(-3, -11, 6, -8));
					}

					{
						const a = new Mat3(2, -5, 0, -3);
						const b = new Mat3(1, -1, 3, 2);
						expect(a.multiply(b)).toEqual(
							new Mat3(-13, -12, -9, -6),
						);
					}
				},
			);

			const multiplyRTLFuncs = ['multiplyRTL', 'postMultiply'] as const;
			multiplyRTLFuncs.forEach((funcName) => {
				test.todo(
					`.${Mat3.prototype[funcName].name}() should post-multiply the matrix by the passed matrix`,
					() => {
						const a = new Mat3(1, 2, 3, 4);
						const b = new Mat3(5, 6, 7, 8);
						expect(b).toChain((v) => v[funcName](a));
						expect(b).toEqual(new Mat3(19, 22, 43, 50));

						{
							const a = new Mat3(5, 6, 7, 8);
							const b = new Mat3(1, 2, 3, 4);
							expect(b[funcName](a)).toEqual(
								new Mat3(23, 34, 31, 46),
							);
						}

						{
							const a = new Mat3(-2, 3, -1, 4);
							const b = new Mat3(6, 4, 3, -1);
							expect(b[funcName](a)).toEqual(
								new Mat3(-3, -11, 6, -8),
							);
						}

						{
							const a = new Mat3(2, -5, 0, -3);
							const b = new Mat3(1, -1, 3, 2);
							expect(b[funcName](a)).toEqual(
								new Mat3(-13, -12, -9, -6),
							);
						}
					},
				);
			});
		});
	});

	// TODO(bret): helper functions
});
