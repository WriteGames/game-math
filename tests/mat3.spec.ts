import { describe, expect, test } from 'vitest';
import { Vec3 } from '../index.js';
import type { M3_T, V3_T } from '../index.js';
import {
	determinantM3,
	Mat3,
	multiplyM3M3,
	multiplyM3V3,
	transpose3D,
} from '../vectors/mat3.js';

// prettier-ignore
const INDICES = [
	0, 3, 6,
	1, 4, 7,
	2, 5, 8,
] as const satisfies M3_T;

const M3_00 = INDICES[0];
const M3_10 = INDICES[1];
const M3_20 = INDICES[2];

const M3_01 = INDICES[3];
const M3_11 = INDICES[4];
const M3_21 = INDICES[5];

const M3_02 = INDICES[6];
const M3_12 = INDICES[7];
const M3_22 = INDICES[8];

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
				expect(mat3).toEqualMat3(Mat3.identity);
			});

			test('should set internal values to column-major', () => {
				// prettier-ignore
				const mat3 = new Mat3(
					1, 2, 3,
					4, 5, 6,
					7, 8, 9,
				);
				// prettier-ignore
				expect(mat3).toEqualMat3([
					1, 4, 7,
					2, 5, 8,
					3, 6, 9,
				]);
			});
		});

		describe('getters', () => {
			const [M00, M10, M20] = [1, 2, 3];
			const [M01, M11, M21] = [4, 5, 6];
			const [M02, M12, M22] = [7, 8, 9];

			// prettier-ignore
			const a = new Mat3(
				M00, M10, M20,
				M01, M11, M21,
				M02, M12, M22,
			);

			const row0: V3_T = [M00, M10, M20];
			const row1: V3_T = [M01, M11, M21];
			const row2: V3_T = [M02, M12, M22];

			const col0: V3_T = [M00, M01, M02];
			const col1: V3_T = [M10, M11, M12];
			const col2: V3_T = [M20, M21, M22];

			test('get mXX/[x]', () => {
				expect(a.m00).toEqual(M00);
				expect(a[M3_00]).toEqual(M00);

				expect(a.m01).toEqual(M01);
				expect(a[M3_01]).toEqual(M01);

				expect(a.m02).toEqual(M02);
				expect(a[M3_02]).toEqual(M02);

				expect(a.m10).toEqual(M10);
				expect(a[M3_10]).toEqual(M10);

				expect(a.m11).toEqual(M11);
				expect(a[M3_11]).toEqual(M11);

				expect(a.m12).toEqual(M12);
				expect(a[M3_12]).toEqual(M12);

				expect(a.m20).toEqual(M20);
				expect(a[M3_20]).toEqual(M20);

				expect(a.m21).toEqual(M21);
				expect(a[M3_21]).toEqual(M21);

				expect(a.m22).toEqual(M22);
				expect(a[M3_22]).toEqual(M22);
			});

			test('get rows', () => {
				expect(a.row0).toEqualVec3(row0);
				expect(a.row1).toEqualVec3(row1);
				expect(a.row2).toEqualVec3(row2);
				expect(a.rows).toEqual([row0, row1, row2]);

				expect(a.row0).not.toEqualVec3(a.slice(0, 3) as V3_T);
				expect(a.row1).not.toEqualVec3(a.slice(3, 6) as V3_T);
				expect(a.row2).not.toEqualVec3(a.slice(6, 9) as V3_T);
			});

			test('get columns', () => {
				expect(a.column0).toEqualVec3(col0);
				expect(a.column1).toEqualVec3(col1);
				expect(a.column2).toEqualVec3(col2);
				expect(a.columns).toEqual([col0, col1, col2]);

				expect(a.col0).toEqualVec3(col0);
				expect(a.col1).toEqualVec3(col1);
				expect(a.col2).toEqualVec3(col2);
				expect(a.cols).toEqual([col0, col1, col2]);

				expect(a.column0).toEqualVec3(a.slice(0, 3) as V3_T);
				expect(a.column1).toEqualVec3(a.slice(3, 6) as V3_T);
				expect(a.column2).toEqualVec3(a.slice(6, 9) as V3_T);
			});
		});

		describe('setters', () => {
			const row0 = [1, 2, 3] as V3_T;
			const row1 = [4, 5, 6] as V3_T;
			const row2 = [7, 8, 9] as V3_T;

			const [M00, M01, M02] = row0;
			const [M10, M11, M12] = row1;
			const [M20, M21, M22] = row2;

			const col0 = [M00, M10, M20] as V3_T;
			const col1 = [M01, M11, M21] as V3_T;
			const col2 = [M02, M12, M22] as V3_T;

			test('set mXX/[x]', () => {
				const a = new Mat3();

				a.m00 = M00;
				expect(a.m00).toEqual(M00);
				a[M3_00] = -M00;
				expect(a.m00).toEqual(-M00);

				a.m01 = M01;
				expect(a.m01).toEqual(M01);
				a[M3_01] = -M01;
				expect(a.m01).toEqual(-M01);

				a.m02 = M02;
				expect(a.m02).toEqual(M02);
				a[M3_02] = -M02;
				expect(a.m02).toEqual(-M02);

				a.m10 = M10;
				expect(a.m10).toEqual(M10);
				a[M3_10] = -M10;
				expect(a.m10).toEqual(-M10);

				a.m11 = M11;
				expect(a.m11).toEqual(M11);
				a[M3_11] = -M11;
				expect(a.m11).toEqual(-M11);

				a.m12 = M12;
				expect(a.m12).toEqual(M12);
				a[M3_12] = -M12;
				expect(a.m12).toEqual(-M12);

				a.m20 = M20;
				expect(a.m20).toEqual(M20);
				a[M3_20] = -M20;
				expect(a.m20).toEqual(-M20);

				a.m21 = M21;
				expect(a.m21).toEqual(M21);
				a[M3_21] = -M21;
				expect(a.m21).toEqual(-M21);

				a.m22 = M22;
				expect(a.m22).toEqual(M22);
				a[M3_22] = -M22;
				expect(a.m22).toEqual(-M22);
			});

			test('set rows', () => {
				const a = new Mat3();
				a.row0 = row0;
				expect(a.row0).toEqual(row0);
				a.row1 = row1;
				expect(a.row1).toEqual(row1);
				a.row2 = row2;
				expect(a.row2).toEqual(row2);

				const b = new Mat3();
				b.rows = [row0, row1, row2];
				expect(b.row0).toEqual(row0);
				expect(b.row1).toEqual(row1);
				expect(b.row2).toEqual(row2);
			});

			test('set columns', () => {
				const a = new Mat3();
				a.column0 = col0;
				expect(a.column0).toEqual(col0);
				a.column1 = col1;
				expect(a.column1).toEqual(col1);
				a.column2 = col2;
				expect(a.column2).toEqual(col2);

				const b = new Mat3();
				b.columns = [col0, col1, col2];
				expect(b.column0).toEqual(col0);
				expect(b.column1).toEqual(col1);
				expect(b.column2).toEqual(col2);

				const c = new Mat3();
				c.col0 = col0;
				expect(c.col0).toEqual(col0);
				c.col1 = col1;
				expect(c.col1).toEqual(col1);
				c.col2 = col2;
				expect(c.col2).toEqual(col2);

				const d = new Mat3();
				d.cols = [col0, col1, col2];
				expect(d.col0).toEqual(col0);
				expect(d.col1).toEqual(col1);
				expect(d.col2).toEqual(col2);
			});
		});

		describe('iterator', () => {
			test('should return an ArrayIterator consisting of nine numbers', () => {
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
				expect(Mat3.identity).toEqualMat3([
					1, 0, 0,
					0, 1, 0,
					0, 0, 1,
				]);
			});

			test(`.${Mat3.rotate.name}() should return a 3x3 rotation matrix around an arbitrary axis`, () => {
				const a = Mat3.rotate([1, 0, 0], Math.PI / 2);
				// prettier-ignore
				expect(a).toEqualMat3([
					+1, +0, +0,
					+0, +0, +1,
					+0, -1, +0,
				]);

				const b = Mat3.rotate([0, 2, 0], Math.PI / 2);
				// prettier-ignore
				expect(b).toEqualMat3([
					+0, +0, -1,
					+0, +1, +0,
					+1, +0, +0,
				]);

				const c = Mat3.rotate([0, 0, 1], Math.PI / 2);
				// prettier-ignore
				expect(c).toEqualMat3([
					+0, +1, +0,
					-1, +0, +0,
					+0, +0, +1,
				]);

				const d = Mat3.rotate([1, 0, 0], Math.PI / 4);
				const s = Math.sqrt(2) / 2;
				// prettier-ignore
				expect(d).toEqualMat3([
					+1, +0, +0,
					+0, +s, +s,
					+0, -s, +s,
				]);
			});

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
				expect(a).toEqualMat3(b);
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
				expect(a).toEqualMat3(expected);
			});

			test(`.${Mat3.prototype.setIdentity.name}() should set the matrix to the 3x3 identity matrix`, () => {
				const a = new Mat3(5, 5, 5, 5, 5, 5, 5, 5, 5);
				expect(a.setIdentity()).toBe(a);
				expect(a).toEqualMat3(Mat3.identity);
			});

			test(`.${Mat3.prototype.determinant.name}() should return the determinant`, () => {
				const a = new Mat3(...mat3DeterminantValues);
				expect(a.determinant()).toEqual(mat3DeterminantResult);
			});

			test(`.${Mat3.prototype.invert.name}() should invert the matrix in-place`, () => {
				const a = new Mat3(...mat3DeterminantValues);
				const b = a.clone();
				expect(b).toChain((m) => m.invert());
				a.multiply(b);
				expect(a).toEqualMat3(Mat3.identity);
			});

			test(`.${Mat3.prototype.multiply.name}() should pre-multiply the matrix by the passed matrix`, () => {
				const a = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
				const b = new Mat3(9, 8, 7, 6, 5, 4, 3, 2, 1);
				expect(a).toChain((v) => v.multiply(b));
				// prettier-ignore
				const expected = new Mat3(
					 30,  24, 18,
					 84,  69, 54,
					138, 114, 90,
				);
				expect(a).toEqualMat3(expected);
			});

			const multiplyRTLFuncs = ['multiplyRTL', 'postMultiply'] as const;
			multiplyRTLFuncs.forEach((funcName) => {
				test(`.${Mat3.prototype[funcName].name}() should post-multiply the matrix by the passed matrix`, () => {
					const a = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
					const b = new Mat3(9, 8, 7, 6, 5, 4, 3, 2, 1);
					expect(b).toChain((v) => v[funcName](a));
					// prettier-ignore
					const expected = new Mat3(
						30,  24, 18,
						84,  69, 54,
						138, 114, 90,
					);
					expect(b).toEqualMat3(expected);
				});
			});
		});
	});

	describe('Mat3 helper functions', () => {
		describe(`${transpose3D.name}()`, () => {
			const elements = [1, 2, 3, 4, 5, 6, 7, 8, 9] as M3_T;
			// prettier-ignore
			const elementsTransposed = [
				1, 4, 7,
				2, 5, 8,
				3, 6, 9,
			] as M3_T;

			test('should transpose a Mat3', () => {
				expect(transpose3D(new Mat3(...elements))).toEqualMat3(
					new Mat3(...elementsTransposed),
				);
			});

			test('should transpose an array of length 4', () => {
				expect(transpose3D(elementsTransposed)).toEqual(elements);
			});

			test('arrays of invalid length should throw error', () => {
				expect(() => {
					transpose3D([0] as unknown as M3_T);
				}).toThrowError();

				expect(() => {
					transpose3D([0, 1, 2] as unknown as M3_T);
				}).toThrowError();

				expect(() => {
					transpose3D([0, 1, 2, 3, 4] as unknown as M3_T);
				}).toThrowError();
			});
		});

		describe(`${determinantM3.name}()`, () => {
			test('should return the determinant of a Mat3', () => {
				const a = new Mat3(...mat3DeterminantValues);
				expect(determinantM3(a)).toEqual(mat3DeterminantResult);
			});

			test('should return the determinant of an array of length 4', () => {
				const a = [...mat3DeterminantValues] as M3_T;
				expect(determinantM3(a)).toEqual(mat3DeterminantResult);
			});

			test('arrays of invalid length should throw error', () => {
				expect(() => {
					determinantM3([0] as unknown as M3_T);
				}).toThrowError();

				expect(() => {
					determinantM3([0, 1, 2] as unknown as M3_T);
				}).toThrowError();

				expect(() => {
					determinantM3([
						0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
					] as unknown as M3_T);
				}).toThrowError();
			});
		});

		describe(`${multiplyM3M3.name}()`, () => {
			test('should return the product of two 3x3 matrices', () => {
				const a = [1, 2, 3, 4, 5, 6, 7, 8, 9] as M3_T;
				const b = [9, 8, 7, 6, 5, 4, 3, 2, 1] as M3_T;
				// prettier-ignore
				const expected = [
					90, 114, 138,
					54,  69,  84,
					18,  24,  30,
				] as M3_T;
				expect(multiplyM3M3(a, b)).toEqual(expected);
			});
		});

		describe(`${multiplyM3V3.name}() `, () => {
			test('should return the product of a Mat3 and Vec3', () => {
				// prettier-ignore
				const a = new Mat3(
					 3,  5,  6,
					 7,  8,  9,
					12, 15, 12,
				);
				const b = new Vec3(1, 4, 7);
				expect(multiplyM3V3(a, b)).toEqualVec3([65, 102, 156]);
			});

			test('should return the product of an array of length 9 and an array of length 3', () => {
				// prettier-ignore
				const a = [
					3, 7, 12,
					5, 8, 15,
					6, 9, 12,
				] as M3_T;
				const b = [1, 4, 7] as V3_T;
				expect(multiplyM3V3(a, b)).toEqualVec3([65, 102, 156]);
			});

			test('arguments should throw error if they are not the correct lengths', () => {
				expect(() => {
					multiplyM3V3([0] as unknown as M3_T, [7, 8, 9]);
				}).toThrowError();

				expect(() => {
					multiplyM3V3([0, 1, 2] as unknown as M3_T, [7, 8, 9]);
				}).toThrowError();

				expect(() => {
					multiplyM3V3([0, 1, 2, 3, 4] as unknown as M3_T, [7, 8, 9]);
				}).toThrowError();

				expect(() => {
					multiplyM3V3([1, 2, 3, 4, 5, 6, 7, 8, 9], [
						7,
					] as unknown as V3_T);
				}).toThrowError();

				expect(() => {
					multiplyM3V3([1, 2, 3, 4, 5, 6, 7, 8, 9], [
						7, 8, 9, 10,
					] as unknown as V3_T);
				}).toThrowError();
			});
		});
	});
});
