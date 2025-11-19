import { describe, expect, test } from 'vitest';
import { Vec4 } from '../index.js';
import type { M4_T, V4_T } from '../index.js';
import {
	determinantM4,
	Mat4,
	multiplyM4M4,
	multiplyM4V4,
	transpose4D,
} from '../vectors/mat4.js';

// prettier-ignore
const INDICES = [
	0, 4, 8, 12,
	1, 5, 9, 13,
	2, 6, 10, 14,
	3, 7, 11, 15,
] as const satisfies M4_T;

const M4_00 = INDICES[0];
const M4_10 = INDICES[1];
const M4_20 = INDICES[2];
const M4_30 = INDICES[3];

const M4_01 = INDICES[4];
const M4_11 = INDICES[5];
const M4_21 = INDICES[6];
const M4_31 = INDICES[7];

const M4_02 = INDICES[8];
const M4_12 = INDICES[9];
const M4_22 = INDICES[10];
const M4_32 = INDICES[11];

const M4_03 = INDICES[12];
const M4_13 = INDICES[13];
const M4_23 = INDICES[14];
const M4_33 = INDICES[15];

describe('Matrix operations', () => {
	// prettier-ignore
	const mat4DeterminantValues = [
		2, 1, 0, 3,
		4, -1, 2, 0,
		-3, 2, 1, 5,
		1, 0, -2, 3,
	] as M4_T;
	const mat4DeterminantResult = -85;

	describe('class Mat4', () => {
		describe('constructor', () => {
			test('should set matrix to 4x4 identity matrix if no arguments are given', () => {
				const mat4 = new Mat4();
				expect(mat4).toEqualMat4(Mat4.identity);
			});

			test('should set internal values to column-major', () => {
				// prettier-ignore
				const mat4 = new Mat4(
					 1,  2,  3,  4,
					 5,  6,  7,  8,
					 9, 10, 11, 12,
					13, 14, 15, 16,
				);
				// prettier-ignore
				expect(mat4).toEqualMat4([
					1, 5,  9, 13,
					2, 6, 10, 14,
					3, 7, 11, 15,
					4, 8, 12, 16,
				]);
			});
		});

		describe('getters', () => {
			const [M00, M10, M20, M30] = [1, 2, 3, 4];
			const [M01, M11, M21, M31] = [5, 6, 7, 8];
			const [M02, M12, M22, M32] = [9, 10, 11, 12];
			const [M03, M13, M23, M33] = [13, 14, 15, 16];

			// prettier-ignore
			const a = new Mat4(
				M00, M10, M20, M30,
				M01, M11, M21, M31,
				M02, M12, M22, M32,
				M03, M13, M23, M33,
			);

			const row0: V4_T = [M00, M10, M20, M30];
			const row1: V4_T = [M01, M11, M21, M31];
			const row2: V4_T = [M02, M12, M22, M32];
			const row3: V4_T = [M03, M13, M23, M33];

			const col0: V4_T = [M00, M01, M02, M03];
			const col1: V4_T = [M10, M11, M12, M13];
			const col2: V4_T = [M20, M21, M22, M23];
			const col3: V4_T = [M30, M31, M32, M33];

			test('get mXX/[x]', () => {
				expect(a.m00).toEqual(M00);
				expect(a[M4_00]).toEqual(M00);

				expect(a.m01).toEqual(M01);
				expect(a[M4_01]).toEqual(M01);

				expect(a.m02).toEqual(M02);
				expect(a[M4_02]).toEqual(M02);

				expect(a.m03).toEqual(M03);
				expect(a[M4_03]).toEqual(M03);

				expect(a.m10).toEqual(M10);
				expect(a[M4_10]).toEqual(M10);

				expect(a.m11).toEqual(M11);
				expect(a[M4_11]).toEqual(M11);

				expect(a.m12).toEqual(M12);
				expect(a[M4_12]).toEqual(M12);

				expect(a.m13).toEqual(M13);
				expect(a[M4_13]).toEqual(M13);

				expect(a.m20).toEqual(M20);
				expect(a[M4_20]).toEqual(M20);

				expect(a.m21).toEqual(M21);
				expect(a[M4_21]).toEqual(M21);

				expect(a.m22).toEqual(M22);
				expect(a[M4_22]).toEqual(M22);

				expect(a.m23).toEqual(M23);
				expect(a[M4_23]).toEqual(M23);

				expect(a.m30).toEqual(M30);
				expect(a[M4_30]).toEqual(M30);

				expect(a.m31).toEqual(M31);
				expect(a[M4_31]).toEqual(M31);

				expect(a.m32).toEqual(M32);
				expect(a[M4_32]).toEqual(M32);

				expect(a.m33).toEqual(M33);
				expect(a[M4_33]).toEqual(M33);
			});

			test('get rows', () => {
				expect(a.row0).toEqualVec4(row0);
				expect(a.row1).toEqualVec4(row1);
				expect(a.row2).toEqualVec4(row2);
				expect(a.row3).toEqualVec4(row3);
				expect(a.rows).toEqual([row0, row1, row2, row3]);

				expect(a.row0).not.toEqualVec4(a.slice(0, 4) as V4_T);
				expect(a.row1).not.toEqualVec4(a.slice(4, 8) as V4_T);
				expect(a.row2).not.toEqualVec4(a.slice(8, 12) as V4_T);
				expect(a.row3).not.toEqualVec4(a.slice(12, 16) as V4_T);
			});

			test('get columns', () => {
				expect(a.column0).toEqualVec4(col0);
				expect(a.column1).toEqualVec4(col1);
				expect(a.column2).toEqualVec4(col2);
				expect(a.column3).toEqualVec4(col3);
				expect(a.columns).toEqual([col0, col1, col2, col3]);

				expect(a.col0).toEqualVec4(col0);
				expect(a.col1).toEqualVec4(col1);
				expect(a.col2).toEqualVec4(col2);
				expect(a.col3).toEqualVec4(col3);
				expect(a.cols).toEqual([col0, col1, col2, col3]);

				expect(a.column0).toEqualVec4(a.slice(0, 4) as V4_T);
				expect(a.column1).toEqualVec4(a.slice(4, 8) as V4_T);
				expect(a.column2).toEqualVec4(a.slice(8, 12) as V4_T);
				expect(a.column3).toEqualVec4(a.slice(12, 16) as V4_T);
			});
		});

		describe('setters', () => {
			const [M00, M10, M20, M30] = [1, 2, 3, 4];
			const [M01, M11, M21, M31] = [5, 6, 7, 8];
			const [M02, M12, M22, M32] = [9, 10, 11, 12];
			const [M03, M13, M23, M33] = [13, 14, 15, 16];

			// prettier-ignore
			const a = new Mat4(
				M00, M10, M20, M30,
				M01, M11, M21, M31,
				M02, M12, M22, M32,
				M03, M13, M23, M33,
			);

			const row0: V4_T = [M00, M10, M20, M30];
			const row1: V4_T = [M01, M11, M21, M31];
			const row2: V4_T = [M02, M12, M22, M32];
			const row3: V4_T = [M03, M13, M23, M33];

			const col0: V4_T = [M00, M01, M02, M03];
			const col1: V4_T = [M10, M11, M12, M13];
			const col2: V4_T = [M20, M21, M22, M23];
			const col3: V4_T = [M30, M31, M32, M33];

			test('set mXX/[x]', () => {
				const a = new Mat4();

				a.m00 = M00;
				expect(a.m00).toEqual(M00);
				a[M4_00] = -M00;
				expect(a.m00).toEqual(-M00);

				a.m01 = M01;
				expect(a.m01).toEqual(M01);
				a[M4_01] = -M01;
				expect(a.m01).toEqual(-M01);

				a.m02 = M02;
				expect(a.m02).toEqual(M02);
				a[M4_02] = -M02;
				expect(a.m02).toEqual(-M02);

				a.m03 = M03;
				expect(a.m03).toEqual(M03);
				a[M4_03] = -M03;
				expect(a.m03).toEqual(-M03);

				a.m10 = M10;
				expect(a.m10).toEqual(M10);
				a[M4_10] = -M10;
				expect(a.m10).toEqual(-M10);

				a.m11 = M11;
				expect(a.m11).toEqual(M11);
				a[M4_11] = -M11;
				expect(a.m11).toEqual(-M11);

				a.m12 = M12;
				expect(a.m12).toEqual(M12);
				a[M4_12] = -M12;
				expect(a.m12).toEqual(-M12);

				a.m13 = M13;
				expect(a.m13).toEqual(M13);
				a[M4_13] = -M13;
				expect(a.m13).toEqual(-M13);

				a.m20 = M20;
				expect(a.m20).toEqual(M20);
				a[M4_20] = -M20;
				expect(a.m20).toEqual(-M20);

				a.m21 = M21;
				expect(a.m21).toEqual(M21);
				a[M4_21] = -M21;
				expect(a.m21).toEqual(-M21);

				a.m22 = M22;
				expect(a.m22).toEqual(M22);
				a[M4_22] = -M22;
				expect(a.m22).toEqual(-M22);

				a.m23 = M23;
				expect(a.m23).toEqual(M23);
				a[M4_23] = -M23;
				expect(a.m23).toEqual(-M23);

				a.m30 = M30;
				expect(a.m30).toEqual(M30);
				a[M4_30] = -M30;
				expect(a.m30).toEqual(-M30);

				a.m31 = M31;
				expect(a.m31).toEqual(M31);
				a[M4_31] = -M31;
				expect(a.m31).toEqual(-M31);

				a.m32 = M32;
				expect(a.m32).toEqual(M32);
				a[M4_32] = -M32;
				expect(a.m32).toEqual(-M32);

				a.m33 = M33;
				expect(a.m33).toEqual(M33);
				a[M4_33] = -M33;
				expect(a.m33).toEqual(-M33);
			});

			test('set rows', () => {
				const a = new Mat4();
				a.row0 = row0;
				expect(a.row0).toEqual(row0);
				a.row1 = row1;
				expect(a.row1).toEqual(row1);
				a.row2 = row2;
				expect(a.row2).toEqual(row2);
				a.row3 = row3;
				expect(a.row3).toEqual(row3);

				const b = new Mat4();
				b.rows = [row0, row1, row2, row3];
				expect(b.row0).toEqual(row0);
				expect(b.row1).toEqual(row1);
				expect(b.row2).toEqual(row2);
				expect(b.row3).toEqual(row3);
			});

			test('set columns', () => {
				const a = new Mat4();
				a.column0 = col0;
				expect(a.column0).toEqual(col0);
				a.column1 = col1;
				expect(a.column1).toEqual(col1);
				a.column2 = col2;
				expect(a.column2).toEqual(col2);
				a.column3 = col3;
				expect(a.column3).toEqual(col3);

				const b = new Mat4();
				b.columns = [col0, col1, col2, col3];
				expect(b.column0).toEqual(col0);
				expect(b.column1).toEqual(col1);
				expect(b.column2).toEqual(col2);
				expect(b.column3).toEqual(col3);

				const c = new Mat4();
				c.col0 = col0;
				expect(c.col0).toEqual(col0);
				c.col1 = col1;
				expect(c.col1).toEqual(col1);
				c.col2 = col2;
				expect(c.col2).toEqual(col2);
				c.col3 = col3;
				expect(c.col3).toEqual(col3);

				const d = new Mat4();
				d.cols = [col0, col1, col2, col3];
				expect(d.col0).toEqual(col0);
				expect(d.col1).toEqual(col1);
				expect(d.col2).toEqual(col2);
				expect(d.col3).toEqual(col3);
			});
		});

		describe('iterator', () => {
			test('should return an ArrayIterator consisting of 16 numbers', () => {
				// prettier-ignore
				expect([...new Mat4(
					 1,  2,  3,  4,
					 5,  6,  7,  8,
					 9, 10, 11, 12,
					13, 14, 15, 16,
				)]).toEqual([
					1, 5, 9,  13,
					2, 6, 10, 14,
					3, 7, 11, 15,
					4, 8, 12, 16,
				]);
			});
		});

		describe('static properties', () => {
			test(`.identity should return the 4x4 identity matrix`, () => {
				// prettier-ignore
				expect(Mat4.identity).toEqualMat4([
					1, 0, 0, 0,
					0, 1, 0, 0,
					0, 0, 1, 0,
					0, 0, 0, 1,
				]);
			});

			test(`.${Mat4.rotate.name}() should return a 4x4 rotation matrix around an arbitrary axis`, () => {
				const a = Mat4.rotate([1, 0, 0], Math.PI / 2);
				// prettier-ignore
				expect(a).toEqualMat4([
					+1, +0, +0, +0,
					+0, +0, +1, +0,
					+0, -1, +0, +0,
					+0, +0, +0, +1,
				]);
				const b = Mat4.rotate([0, 2, 0], Math.PI / 2);
				// prettier-ignore
				expect(b).toEqualMat4([
					+0, +0, -1, +0,
					+0, +1, +0, +0,
					+1, +0, +0, +0,
					+0, +0, +0, +1,
				]);
				const c = Mat4.rotate([0, 0, 1], Math.PI / 2);
				// prettier-ignore
				expect(c).toEqualMat4([
					+0, +1, +0, +0,
					-1, +0, +0, +0,
					+0, +0, +1, +0,
					+0, +0, +0, +1,
				]);
				const d = Mat4.rotate([1, 0, 0], Math.PI / 4);
				const s = Math.sqrt(2) / 2;
				// prettier-ignore
				expect(d).toEqualMat4([
					+1, +0, +0, +0,
					+0, +s, +s, +0,
					+0, -s, +s, +0,
					+0, +0, +0, +1,
				]);
			});

			test(`.${Mat4.rotateX.name}() should return a 4x4 rotation matrix rotated around the x-axis`, () => {
				const a = Mat4.rotateX(0);
				// prettier-ignore
				expect(a).toEqualMat4([
					+1, +0, +0, +0,
					-0, +1, +0, +0,
					+0, +0, +1, +0,
					+0, +0, +0, +1,
				]);

				const b = Mat4.rotateX(Math.PI / 2);
				// prettier-ignore
				expect(b).toEqualMat4([
					+1, +0, +0, +0,
					+0, +0, +1, +0,
					+0, -1, +0, +0,
					+0, +0, +0, +1,
				]);

				const c = Mat4.rotateX(Math.PI);
				// prettier-ignore
				expect(c).toEqualMat4([
					+1, +0, +0, +0,
					+0, -1, +0, +0,
					+0, -0, -1, +0,
					+0, +0, +0, +1,
				]);

				const d = Mat4.rotateX((3 * Math.PI) / 2);
				// prettier-ignore
				expect(d).toEqualMat4([
					+1, +0, +0, +0,
					+0, +0, -1, +0,
					+0, +1, +0, +0,
					+0, +0, +0, +1,
				]);
			});

			test(`.${Mat4.rotateY.name}() should return a 4x4 rotation matrix`, () => {
				const a = Mat4.rotateY(0);
				// prettier-ignore
				expect(a).toEqualMat4([
					+1, +0, +0, +0,
					+0, +1, +0, +0,
					+0, +0, +1, +0,
					+0, +0, +0, +1,
				]);

				const b = Mat4.rotateY(Math.PI / 2);
				// prettier-ignore
				expect(b).toEqualMat4([
					+0, +0, -1, +0,
					+0, +1, +0, +0,
					+1, +0, +0, +0,
					+0, +0, +0, +1,
				]);

				const c = Mat4.rotateY(Math.PI);
				// prettier-ignore
				expect(c).toEqualMat4([
					-1, +0, -0, +0,
					+0, +1, +0, +0,
					+0, +0, -1, +0,
					+0, +0, +0, +1,
				]);

				const d = Mat4.rotateY((3 * Math.PI) / 2);
				// prettier-ignore
				expect(d).toEqualMat4([
					-0, +0, +1, +0,
					+0, +1, +0, +0,
					-1, +0, -0, +0,
					+0, +0, +0, +1,
				]);
			});

			test(`.${Mat4.rotateZ.name}() should return a 4x4 rotation matrix`, () => {
				const a = Mat4.rotateZ(0);
				// prettier-ignore
				expect(a).toEqualMat4([
					+1, +0, +0, +0,
					-0, +1, +0, +0,
					+0, +0, +1, +0,
					+0, +0, +0, +1,
				]);

				const b = Mat4.rotateZ(Math.PI / 2);
				// prettier-ignore
				expect(b).toEqualMat4([
					+0, +1, +0, +0,
					-1, +0, +0, +0,
					+0, +0, +1, +0,
					+0, +0, +0, +1,
				]);

				const c = Mat4.rotateZ(Math.PI);
				// prettier-ignore
				expect(c).toEqualMat4([
					-1, +0, +0, +0,
					+0, -1, +0, +0,
					+0, +0, +1, +0,
					+0, +0, +0, +1,
				]);

				const d = Mat4.rotateZ((3 * Math.PI) / 2);
				// prettier-ignore
				expect(d).toEqualMat4([
					+0, -1, +0, +0,
					+1, +0, +0, +0,
					+0, +0, +1, +0,
					+0, +0, +0, +1,
				]);
			});

			describe(`.${Mat4.scale.name}`, () => {
				test(`should return a 4x4 scale matrix (one arg)`, () => {
					const a = Mat4.scale(0);
					// prettier-ignore
					expect(a).toEqualMat4([
						0, 0, 0, 0,
						0, 0, 0, 0,
						0, 0, 0, 0,
						0, 0, 0, 1,
					]);

					const b = Mat4.scale(1);
					// prettier-ignore
					expect(b).toEqualMat4([
						1, 0, 0, 0,
						0, 1, 0, 0,
						0, 0, 1, 0,
						0, 0, 0, 1,
					]);

					const c = Mat4.scale(7.7);
					// prettier-ignore
					expect(c).toEqualMat4([
						7.7, 0.0, 0.0, 0.0,
						0.0, 7.7, 0.0, 0.0,
						0.0, 0.0, 7.7, 0.0,
						0.0, 0.0, 0.0, 1.0,
					]);
				});

				test(`should return a 4x4 scale matrix (three args)`, () => {
					const a = Mat4.scale(0, 0, 0);
					// prettier-ignore
					expect(a).toEqualMat4([
						0, 0, 0, 0,
						0, 0, 0, 0,
						0, 0, 0, 0,
						0, 0, 0, 1,
					]);

					const b = Mat4.scale(1, 1, 1);
					// prettier-ignore
					expect(b).toEqualMat4([
						1, 0, 0, 0,
						0, 1, 0, 0,
						0, 0, 1, 0,
						0, 0, 0, 1,
					]);

					const c = Mat4.scale(4.5, 6.7, 8.9);
					// prettier-ignore
					expect(c).toEqualMat4([
						4.5, 0.0, 0.0, 0.0,
						0.0, 6.7, 0.0, 0.0,
						0.0, 0.0, 8.9, 0.0,
						0.0, 0.0, 0.0, 1.0,
					]);
				});
			});
		});

		describe('.prototype', () => {
			test(`.${Mat4.prototype.clone.name}() should return an identical 4x4 matrix`, () => {
				const a = new Mat4(
					1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					10,
					11,
					12,
					13,
					14,
					15,
					16,
				);
				const b = a.clone();
				expect(a).not.toBe(b);
				expect(a).toEqualMat4(b);
			});

			test(`.${Mat4.prototype.equal.name}() should match identical matricies`, () => {
				const a = new Mat4(
					1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					10,
					11,
					12,
					13,
					14,
					15,
					16,
				);
				const b = new Mat4(
					1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					10,
					11,
					12,
					13,
					14,
					15,
					16,
				);
				const c = new Mat4(
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				);

				expect(a.equal(b)).toBeTruthy();
				expect(a.equal(c)).toBeFalsy();
			});

			test(`.${Mat4.prototype.transpose.name}() should transpose the matrix in-place`, () => {
				// prettier-ignore
				const a = new Mat4(
					 1,  2,  3,  4,
					 5,  6,  7,  8,
					 9, 10, 11, 12,
					13, 14, 15, 16,
				);
				// prettier-ignore
				const expected = new Mat4(
					1, 5,  9, 13,
					2, 6, 10, 14,
					3, 7, 11, 15,
					4, 8, 12, 16,
				);

				expect(a).toChain((v) => v.transpose());
				expect(a).toEqualMat4(expected);
			});

			test(`.${Mat4.prototype.setIdentity.name}() should set the matrix to the 4x4 identity matrix`, () => {
				const a = new Mat4(...Array.from({ length: 16 }, () => 5));
				expect(a.setIdentity()).toBe(a);
				expect(a).toEqualMat4(Mat4.identity);
			});

			test(`.${Mat4.prototype.determinant.name}() should return the determinant`, () => {
				const a = new Mat4(...mat4DeterminantValues);
				expect(a.determinant()).toEqual(mat4DeterminantResult);
			});

			test(`.${Mat4.prototype.invert.name}() should invert the matrix in-place`, () => {
				const a = new Mat4(...mat4DeterminantValues);
				const b = a.clone();
				expect(b).toChain((m) => m.invert());
				a.multiply(b);
				expect(a).toEqualMat4(Mat4.identity);
			});

			test(`.${Mat4.prototype.multiply.name}() should pre-multiply the matrix by the passed matrix`, () => {
				// prettier-ignore
				const a = new Mat4(
					 1,  2,  3,  4,
					 5,  6,  7,  8,
					 9, 10, 11, 12,
					13, 14, 15, 16,
				);
				// prettier-ignore
				const b = new Mat4(
					16, 15, 14, 13,
					12, 11, 10,  9,
					 8,  7,  6,  5,
					 4,  3,  2,  1,
				);
				expect(a).toChain((v) => v.multiply(b));
				// prettier-ignore
				const expected = [
					80, 240, 400, 560,
					70, 214, 358, 502,
					60, 188, 316, 444,
					50, 162, 274, 386,
				] as M4_T;
				expect(a).toEqualMat4(expected);
			});

			const multiplyRTLFuncs = ['multiplyRTL', 'postMultiply'] as const;
			multiplyRTLFuncs.forEach((funcName) => {
				test(`.${Mat4.prototype[funcName].name}() should post-multiply the matrix by the passed matrix`, () => {
					// prettier-ignore
					const a = new Mat4(
						 1,  2,  3,  4,
						 5,  6,  7,  8,
						 9, 10, 11, 12,
						13, 14, 15, 16,
					);
					// prettier-ignore
					const b = new Mat4(
						16, 15, 14, 13,
						12, 11, 10,  9,
						 8,  7,  6,  5,
						 4,  3,  2,  1,
					);
					expect(b).toChain((v) => v[funcName](a));
					// prettier-ignore
					const expected = [
						80, 240, 400, 560,
						70, 214, 358, 502,
						60, 188, 316, 444,
						50, 162, 274, 386,
					] as M4_T;
					expect(b).toEqualMat4(expected);
				});
			});
		});
	});

	describe('Mat4 helper functions', () => {
		describe(`${transpose4D.name}()`, () => {
			// prettier-ignore
			const elements = [
				 1,  2,  3,  4,
				 5,  6,  7,  8,
				 9, 10, 11, 12,
				13, 14, 15, 16,
			] as M4_T;
			// prettier-ignore
			const elementsTransposed = [
				1, 5,  9, 13,
				2, 6, 10, 14,
				3, 7, 11, 15,
				4, 8, 12, 16,
			] as M4_T;

			test('should transpose a Mat4', () => {
				expect(transpose4D(new Mat4(...elements))).toEqualMat4(
					new Mat4(...elementsTransposed),
				);
			});

			test('should transpose an array of length 4', () => {
				expect(transpose4D(elementsTransposed)).toEqual(elements);
			});

			test('arrays of invalid length should throw error', () => {
				expect(() => {
					transpose4D([0] as unknown as M4_T);
				}).toThrowError();

				expect(() => {
					transpose4D([0, 1, 2] as unknown as M4_T);
				}).toThrowError();

				expect(() => {
					transpose4D([0, 1, 2, 3, 4] as unknown as M4_T);
				}).toThrowError();
			});
		});

		describe(`${determinantM4.name}()`, () => {
			test('should return the determinant of a Mat4', () => {
				const a = new Mat4(...mat4DeterminantValues);
				expect(determinantM4(a)).toEqual(mat4DeterminantResult);
			});

			test('should return the determinant of an array of length 4', () => {
				const a = [...mat4DeterminantValues] as M4_T;
				expect(determinantM4(a)).toEqual(mat4DeterminantResult);
			});

			test('arrays of invalid length should throw error', () => {
				expect(() => {
					determinantM4([0] as unknown as M4_T);
				}).toThrowError();

				expect(() => {
					determinantM4([0, 1, 2] as unknown as M4_T);
				}).toThrowError();

				expect(() => {
					determinantM4([
						Array.from({ length: 17 }, () => 0),
					] as unknown as M4_T);
				}).toThrowError();
			});
		});

		describe(`${multiplyM4M4.name}()`, () => {
			test('should return the product of two 4x4 matrices', () => {
				// prettier-ignore
				const a = [
					1,  5,  9, 13,
					2,  6, 10, 14,
					3,  7, 11, 15,
					4,  8, 12, 16,
				] as M4_T;
				// prettier-ignore
				const b = [
					16, 12, 8, 4,
					15, 11, 7, 3,
					14, 10, 6, 2,
					13,  9, 5, 1,
				] as M4_T;
				// prettier-ignore
				const expected = [
					80, 240, 400, 560,
					70, 214, 358, 502,
					60, 188, 316, 444,
					50, 162, 274, 386,
				] as M4_T;
				expect(multiplyM4M4(a, b)).toEqual(expected);
			});
		});

		describe(`${multiplyM4V4.name}() `, () => {
			test('should return the product of a Mat4 and Vec4', () => {
				// prettier-ignore
				const a = new Mat4(
					 1,  2,  3,  4,
					 5,  6,  7,  8,
					 9, 10, 11, 12,
					13, 14, 15, 16,
				);
				const b = new Vec4(1, 2, 3, 4);
				expect(multiplyM4V4(a, b)).toEqualVec4([30, 70, 110, 150]);
			});

			test('should return the product of an array of length 16 and an array of length 4', () => {
				// prettier-ignore
				const a = [
					1, 5,  9, 13,
					2, 6, 10, 14,
					3, 7, 11, 15,
					4, 8, 12, 16,
				] as M4_T;
				const b = [1, 2, 3, 4] as V4_T;
				expect(multiplyM4V4(a, b)).toEqualVec4([30, 70, 110, 150]);
			});

			test('arguments should throw error if they are not the correct lengths', () => {
				expect(() => {
					multiplyM4V4([0] as unknown as M4_T, [6, 7, 8, 9]);
				}).toThrowError();

				expect(() => {
					multiplyM4V4([0, 1, 2] as unknown as M4_T, [6, 7, 8, 9]);
				}).toThrowError();

				expect(() => {
					multiplyM4V4(
						[0, 1, 2, 3, 4] as unknown as M4_T,
						[6, 7, 8, 9],
					);
				}).toThrowError();

				expect(() => {
					multiplyM4V4(
						Array.from({ length: 16 }, () => 1) as M4_T,
						[7] as unknown as V4_T,
					);
				}).toThrowError();

				expect(() => {
					multiplyM4V4(
						Array.from({ length: 16 }, () => 1) as M4_T,
						[7, 8, 9, 10, 11] as unknown as V4_T,
					);
				}).toThrowError();
			});
		});
	});
});
