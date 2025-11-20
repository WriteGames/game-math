import type {
	M4_T,
	Mat4Like,
	Matrix,
	V4_T,
	Vec3Like,
	Vec4Like,
} from './common.js';
import { posEqual } from './common.js';
import { Mat3 } from './mat3.js';
import { magnitude3D, Vec3 } from './vec3.js';
import { Vec4 } from './vec4.js';

export const isMat4 = (mat: Matrix): mat is Mat4 => {
	return mat instanceof Mat4;
};

// prettier-ignore
const INDICES = [
	0,  4,  8, 12,
	1,  5,  9, 13,
	2,  6, 10, 14,
	3,  7, 11, 15,
] as const;

/** Column 0, Row 0 index */
const M00 = INDICES[0];
/** Column 1, Row 0 index */
const M10 = INDICES[1];
/** Column 2, Row 0 index */
const M20 = INDICES[2];
/** Column 2, Row 0 index */
const M30 = INDICES[3];

/** Column 0, Row 1 index */
const M01 = INDICES[4];
/** Column 1, Row 1 index */
const M11 = INDICES[5];
/** Column 2, Row 1 index */
const M21 = INDICES[6];
/** Column 3, Row 1 index */
const M31 = INDICES[7];

/** Column 0, Row 2 index */
const M02 = INDICES[8];
/** Column 1, Row 2 index */
const M12 = INDICES[9];
/** Column 2, Row 2 index */
const M22 = INDICES[10];
/** Column 3, Row 2 index */
const M32 = INDICES[11];

/** Column 0, Row 2 index */
const M03 = INDICES[12];
/** Column 1, Row 2 index */
const M13 = INDICES[13];
/** Column 2, Row 2 index */
const M23 = INDICES[14];
/** Column 3, Row 2 index */
const M33 = INDICES[15];

/**
 * A 4x4 matrix. While it is initialized/set as row-major, internally,
 * it represents itself as column-major
 */
export class Mat4 extends Array<number> {
	// length: 9 = 9 as const;

	/**
	 * Uninitialized values defaults to the 4x4 identity matrix.
	 * @param m00 Element at column 0, row 0
	 * @param m10 Element at column 1, row 0
	 * @param m20 Element at column 2, row 0
	 * @param m30 Element at column 3, row 0
	 * @param m01 Element at column 0, row 1
	 * @param m11 Element at column 1, row 1
	 * @param m21 Element at column 2, row 1
	 * @param m31 Element at column 3, row 1
	 * @param m02 Element at column 0, row 2
	 * @param m12 Element at column 1, row 2
	 * @param m22 Element at column 2, row 2
	 * @param m32 Element at column 3, row 2
	 * @param m03 Element at column 0, row 3
	 * @param m13 Element at column 1, row 3
	 * @param m23 Element at column 2, row 3
	 * @param m33 Element at column 3, row 3
	 */
	// prettier-ignore
	constructor(
		m00 = 1, m10 = 0, m20 = 0, m30 = 0,
		m01 = 0, m11 = 1, m21 = 0, m31 = 0,
		m02 = 0, m12 = 0, m22 = 1, m32 = 0,
		m03 = 0, m13 = 0, m23 = 0, m33 = 1,
	) {
		// prettier-ignore
		super(
			m00, m01, m02, m03,
			m10, m11, m12, m13,
			m20, m21, m22, m23,
			m30, m31, m32, m33,
		);
	}

	/**
	 * Creates an instance of the 4x4 identity matrix.
	 */
	static get identity(): Mat4 {
		// prettier-ignore
		return new Mat4(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		);
	}

	/** Element at column 0, row 0 */
	get m00(): number {
		return this[M00];
	}
	set m00(value: number) {
		this[M00] = value;
	}

	/** Element at column 1, row 0 */
	get m10(): number {
		return this[M10];
	}
	set m10(value: number) {
		this[M10] = value;
	}

	/** Element at column 2, row 0 */
	get m20(): number {
		return this[M20];
	}
	set m20(value: number) {
		this[M20] = value;
	}

	/** Element at column 3, row 0 */
	get m30(): number {
		return this[M30];
	}
	set m30(value: number) {
		this[M30] = value;
	}

	/** Element at column 0, row 1 */
	get m01(): number {
		return this[M01];
	}
	set m01(value: number) {
		this[M01] = value;
	}

	/** Element at column 1, row 1 */
	get m11(): number {
		return this[M11];
	}
	set m11(value: number) {
		this[M11] = value;
	}

	/** Element at column 2, row 1 */
	get m21(): number {
		return this[M21];
	}
	set m21(value: number) {
		this[M21] = value;
	}

	/** Element at column 3, row 1 */
	get m31(): number {
		return this[M31];
	}
	set m31(value: number) {
		this[M31] = value;
	}

	/** Element at column 0, row 2 */
	get m02(): number {
		return this[M02];
	}
	set m02(value: number) {
		this[M02] = value;
	}

	/** Element at column 1, row 2 */
	get m12(): number {
		return this[M12];
	}
	set m12(value: number) {
		this[M12] = value;
	}

	/** Element at column 2, row 2 */
	get m22(): number {
		return this[M22];
	}
	set m22(value: number) {
		this[M22] = value;
	}

	/** Element at column 3, row 2 */
	get m32(): number {
		return this[M32];
	}
	set m32(value: number) {
		this[M32] = value;
	}

	/** Element at column 0, row 3 */
	get m03(): number {
		return this[M03];
	}
	set m03(value: number) {
		this[M03] = value;
	}

	/** Element at column 1, row 3 */
	get m13(): number {
		return this[M13];
	}
	set m13(value: number) {
		this[M13] = value;
	}

	/** Element at column 2, row 3 */
	get m23(): number {
		return this[M23];
	}
	set m23(value: number) {
		this[M23] = value;
	}

	/** Element at column 3, row 3 */
	get m33(): number {
		return this[M33];
	}
	set m33(value: number) {
		this[M33] = value;
	}

	/** Returns row 0 as a Vec4 */
	get row0(): Vec4 {
		return new Vec4(this[M00], this[M10], this[M20], this[M30]);
	}
	set row0(v: Vec4Like) {
		this[M00] = v[0];
		this[M10] = v[1];
		this[M20] = v[2];
		this[M30] = v[3];
	}
	/** Returns row 1 as a Vec4 */
	get row1(): Vec4 {
		return new Vec4(this[M01], this[M11], this[M21], this[M31]);
	}
	set row1(v: Vec4Like) {
		this[M01] = v[0];
		this[M11] = v[1];
		this[M21] = v[2];
		this[M31] = v[3];
	}
	/** Returns row 2 as a Vec4 */
	get row2(): Vec4 {
		return new Vec4(this[M02], this[M12], this[M22], this[M32]);
	}
	set row2(v: Vec4Like) {
		this[M02] = v[0];
		this[M12] = v[1];
		this[M22] = v[2];
		this[M32] = v[3];
	}
	/** Returns row 3 as a Vec4 */
	get row3(): Vec4 {
		return new Vec4(this[M03], this[M13], this[M23], this[M33]);
	}
	set row3(v: Vec4Like) {
		this[M03] = v[0];
		this[M13] = v[1];
		this[M23] = v[2];
		this[M33] = v[3];
	}
	/** Returns all rows as an array of Vec4s */
	get rows(): [Vec4, Vec4, Vec4, Vec4] {
		return [this.row0, this.row1, this.row2, this.row3];
	}
	set rows(v: [Vec4Like, Vec4Like, Vec4Like, Vec4Like]) {
		this.row0 = v[0];
		this.row1 = v[1];
		this.row2 = v[2];
		this.row3 = v[3];
	}

	/** Returns column 0 as a Vec4 */
	get column0(): Vec4 {
		return new Vec4(this[M00], this[M01], this[M02], this[M03]);
	}
	set column0(v: Vec4Like) {
		this[M00] = v[0];
		this[M01] = v[1];
		this[M02] = v[2];
		this[M03] = v[3];
	}
	/** Returns column 1 as a Vec4 */
	get column1(): Vec4 {
		return new Vec4(this[M10], this[M11], this[M12], this[M13]);
	}
	set column1(v: Vec4Like) {
		this[M10] = v[0];
		this[M11] = v[1];
		this[M12] = v[2];
		this[M13] = v[3];
	}
	/** Returns column 2 as a Vec4 */
	get column2(): Vec4 {
		return new Vec4(this[M20], this[M21], this[M22], this[M23]);
	}
	set column2(v: Vec4Like) {
		this[M20] = v[0];
		this[M21] = v[1];
		this[M22] = v[2];
		this[M23] = v[3];
	}
	/** Returns column 3 as a Vec4 */
	get column3(): Vec4 {
		return new Vec4(this[M30], this[M31], this[M32], this[M33]);
	}
	set column3(v: Vec4Like) {
		this[M30] = v[0];
		this[M31] = v[1];
		this[M32] = v[2];
		this[M33] = v[3];
	}
	/** Returns all columns as an array of Vec4s */
	get columns(): [Vec4, Vec4, Vec4, Vec4] {
		return [this.column0, this.column1, this.column2, this.column3];
	}
	set columns(v: [Vec4Like, Vec4Like, Vec4Like, Vec4Like]) {
		this.column0 = v[0];
		this.column1 = v[1];
		this.column2 = v[2];
		this.column3 = v[3];
	}

	/**
	 * Alias for column0
	 * @alias Mat4#column0
	 */
	get col0(): Vec4 {
		return this.column0;
	}
	set col0(v: Vec4Like) {
		this.column0 = v;
	}
	/**
	 * Alias for column1
	 * @alias Mat4#column1
	 */
	get col1(): Vec4 {
		return this.column1;
	}
	set col1(v: Vec4Like) {
		this.column1 = v;
	}
	/**
	 * Alias for column2
	 * @alias Mat4#column1
	 */
	get col2(): Vec4 {
		return this.column2;
	}
	set col2(v: Vec4Like) {
		this.column2 = v;
	}
	/**
	 * Alias for column3
	 * @alias Mat4#column1
	 */
	get col3(): Vec4 {
		return this.column3;
	}
	set col3(v: Vec4Like) {
		this.column3 = v;
	}
	/**
	 * Alias for columns
	 * @alias Mat4#columns
	 */
	get cols(): [Vec4, Vec4, Vec4, Vec4] {
		return this.columns;
	}
	set cols(v: [Vec4Like, Vec4Like, Vec4Like, Vec4Like]) {
		this.columns = v;
	}

	/**
	 * Creates a clone of the matrix.
	 * @returns A new matrix
	 */
	clone(): Mat4 {
		// prettier-ignore
		return new Mat4(
			this[M00], this[M10], this[M20], this[M30],
			this[M01], this[M11], this[M21], this[M31],
			this[M02], this[M12], this[M22], this[M32],
			this[M03], this[M13], this[M23], this[M33],
		);
	}

	/**
	 * Sets the matrix to the 4x4 identity matrix
	 * @returns this
	 */
	setIdentity(): this {
		this[M00] = 1;
		this[M01] = 0;
		this[M02] = 0;
		this[M03] = 0;

		this[M10] = 0;
		this[M11] = 1;
		this[M12] = 0;
		this[M13] = 0;

		this[M20] = 0;
		this[M21] = 0;
		this[M22] = 1;
		this[M23] = 0;

		this[M30] = 0;
		this[M31] = 0;
		this[M32] = 0;
		this[M33] = 1;

		return this;
	}

	/**
	 * Sets the matrix to new values
	 * @param m00 Element at column 0, row 0
	 * @param m10 Element at column 1, row 0
	 * @param m20 Element at column 2, row 0
	 * @param m01 Element at column 0, row 1
	 * @param m11 Element at column 1, row 1
	 * @param m21 Element at column 2, row 1
	 * @param m02 Element at column 0, row 2
	 * @param m12 Element at column 1, row 2
	 * @param m22 Element at column 2, row 2
	 * @returns this
	 */
	// prettier-ignore
	set(
		m00: number, m01: number, m02: number,
		m10: number, m11: number, m12: number,
		m20: number, m21: number, m22: number,
	): this {
		this[M00] = m00;
		this[M01] = m01;
		this[M02] = m02;

		this[M10] = m10;
		this[M11] = m11;
		this[M12] = m12;

		this[M20] = m20;
		this[M21] = m21;
		this[M22] = m22;
		return this;
	}

	/**
	 * Sets this matrix to the values of another matrix.
	 * @param m New values
	 * @returns this
	 */
	setMat4(m: Mat4Like): this {
		this[M00] = m[M00];
		this[M01] = m[M01];
		this[M02] = m[M02];
		this[M03] = m[M03];

		this[M10] = m[M10];
		this[M11] = m[M11];
		this[M12] = m[M12];
		this[M13] = m[M13];

		this[M20] = m[M20];
		this[M21] = m[M21];
		this[M22] = m[M22];
		this[M23] = m[M23];

		this[M30] = m[M30];
		this[M31] = m[M31];
		this[M32] = m[M32];
		this[M33] = m[M33];

		return this;
	}

	/**
	 * Returns a 4x4 translation matrix around an axis.
	 * @param x X factor
	 * @param y Y factor
	 * @param z Y factor
	 */
	static translate(x: number, y: number, z: number): Mat4 {
		const result = new Mat4();
		result[M30] = x;
		result[M31] = y;
		result[M32] = z;
		return result;
	}

	/**
	 * Returns a 4x4 rotation matrix around an axis.
	 * @param axis Axis to rotate around
	 * @param angle Angle of rotation
	 */
	static rotate(axis: Vec3Like, angle: number): Mat4 {
		const result = new Mat4();

		let [x, y, z] = axis;
		const invLen = 1 / magnitude3D(axis);
		x *= invLen;
		y *= invLen;
		z *= invLen;

		const c = Math.cos(angle);
		const s = Math.sin(angle);
		const o = 1 - c;

		result[M00] = x * x * o + c;
		result[M01] = x * y * o + z * s;
		result[M02] = x * z * o - y * s;
		result[M03] = 0;

		result[M10] = y * x * o - z * s;
		result[M11] = y * y * o + c;
		result[M12] = y * z * o + x * s;
		result[M13] = 0;

		result[M20] = z * x * o + y * s;
		result[M21] = z * y * o - x * s;
		result[M22] = z * z * o + c;
		result[M23] = 0;

		result[M30] = 0;
		result[M31] = 0;
		result[M32] = 0;
		result[M33] = 1;

		return result;
	}

	/**
	 * Returns a 4x4 rotation matrix around the X-axis.
	 * @param angle Angle of rotation
	 */
	static rotateX(angle: number): Mat4 {
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		// prettier-ignore
		return new Mat4(
			+1, +0, +0, +0,
			+0, +c, -s, +0,
			+0, +s, +c, +0,
			+0, +0, +0, +1,
		);
	}

	/**
	 * Returns a 4x4 rotation matrix around the Y-axis.
	 * @param angle Angle of rotation
	 */
	static rotateY(angle: number): Mat4 {
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		// prettier-ignore
		return new Mat4(
			+c, +0, +s, +0,
			+0, +1, +0, +0,
			-s, +0, +c, +0,
			+0, +0, +0, +1,
		);
	}

	/**
	 * Returns a 4x4 rotation matrix around the Z-axis.
	 * @param angle Angle of rotation
	 */
	static rotateZ(angle: number): Mat4 {
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		// prettier-ignore
		return new Mat4(
			+c, -s, +0, +0,
			+s, +c, +0, +0,
			+0, +0, +1, +0,
			+0, +0, +0, +1,
		);
	}

	/**
	 * Returns a 4x4 scale matrix.
	 * @param scale Scale factor
	 */
	static scale(scale: number): Mat4;
	/**
	 * Returns a 4x4 scale matrix.
	 * @param x X factor
	 * @param y Y factor
	 * @param z Z factor
	 */
	static scale(x: number, y: number, z: number): Mat4;
	static scale(x: number, y = x, z = x): Mat4 {
		// prettier-ignore
		return new Mat4(
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1,
		);
	}

	/**
	 * Returns the determinant of a matrix
	 * @param m Input matrix
	 * @returns Determinant
	 */
	static determinant = (m: Mat4Like): number => determinantM4(m);
	/**
	 * Returns the matrix's determinant
	 * @returns Determinant
	 */
	determinant(): number {
		return Mat4.determinant(this);
	}

	/**
	 * Transposes a matrix
	 * @param m Input matrix
	 * @returns New, transposed matrix
	 */
	static transpose = <T extends Mat4Like>(m: T): T => transpose4D(m);
	/**
	 * Transposes the matrix in-place
	 * @returns this
	 */
	transpose(): this {
		return this.setMat4(Mat4.transpose(this));
	}

	/**
	 * Multiplies the matrices (left x right) left to right.
	 * @param left Matrix a
	 * @param right Matrix b
	 * @returns The product of the two matrices
	 */
	static multiply = <T extends Mat4Like>(left: T, right: Mat4Like): T =>
		multiplyM4M4(left, right);

	/**
	 * Multiplies the matrices (this x other) left to right.
	 * @param other
	 * @returns The product of the two matrices
	 */
	multiply(other: Mat4Like): this {
		return this.setMat4(Mat4.multiply([...this], other));
	}

	/**
	 * Multiplies the matrices (this x other) right to left.
	 * @param other
	 * @returns The product of the two matrices
	 */
	multiplyRTL(other: Mat4Like): this {
		return this.setMat4(Mat4.multiply(other, [...this]));
	}

	/**
	 * Alias for multiplyRTL. Multiplies the matrices (this x other) right to left.
	 * @param other
	 * @returns The product of the two matrices
	 */
	postMultiply(m: Mat4Like): this {
		return this.multiplyRTL(m);
	}

	/**
	 * Inverts the matrix in-place.
	 * @returns this
	 */
	invert(): this {
		return this.setMat4(invertM4(this));
	}

	/**
	 * Check if two matrices are equal to one another.
	 * @param a Matrix a
	 * @param b Matrix b
	 * @returns Equality result
	 */
	static equal = (a: Mat4, b: Mat4Like): boolean => posEqual(a, b);
	/**
	 * Check if this matrix is equal to another.
	 * @param m Other matrix
	 * @returns Equality result
	 */
	equal(m: Mat4Like): boolean {
		return Mat4.equal(this, m);
	}
}

/**
 * Transposes a matrix
 * @param m Input matrix
 * @returns New, transposed matrix
 */
export const transpose4D = <T extends Mat4Like>(m: T): T => {
	if (m.length !== 16) throw new Error('not a valid 4x4 matrix');

	const result = (isMat4(m) ? m.clone() : [...m]) as typeof m;

	let temp = result[M01];
	result[M01] = result[M10];
	result[M10] = temp;

	temp = result[M02];
	result[M02] = result[M20];
	result[M20] = temp;

	temp = result[M03];
	result[M03] = result[M30];
	result[M30] = temp;

	temp = result[M12];
	result[M12] = result[M21];
	result[M21] = temp;

	temp = result[M13];
	result[M13] = result[M31];
	result[M31] = temp;

	temp = result[M23];
	result[M23] = result[M32];
	result[M32] = temp;

	return result;
};

/**
 * Throws an error if input is not a 4x4 matrix.
 * @param m Input matrix
 */
const assertMat4 = (m: Mat4Like): void => {
	if (m.length !== 16) throw new Error('not a valid 4x4 matrix');
};

/**
 * Throws an error if input is not a 2D array
 * @param m Input matrix
 */
const assertVec4 = (v: Vec4Like): void => {
	if (v.length !== 4) throw new Error('not a valid 4D vector');
};

/**
 * Computes the determinant of a matrix.
 * @param m Input matrix
 * @returns Determinant
 */
export const determinantM4 = (m: Mat4Like): number => {
	assertMat4(m);

	// prettier-ignore
	const a0 = new Mat3(
		m[M11], m[M21], m[M31],
		m[M12], m[M22], m[M32],
		m[M13], m[M23], m[M33],
	);
	// prettier-ignore
	const a1 = new Mat3(
		m[M01], m[M21], m[M31],
		m[M02], m[M22], m[M32],
		m[M03], m[M23], m[M33],
	);
	// prettier-ignore
	const a2 = new Mat3(
		m[M01], m[M11], m[M31],
		m[M02], m[M12], m[M32],
		m[M03], m[M13], m[M33],
	);
	// prettier-ignore
	const a3 = new Mat3(
		m[M01], m[M11], m[M21],
		m[M02], m[M12], m[M22],
		m[M03], m[M13], m[M23],
	);
	return (
		m[M00] * a0.determinant() -
		m[M10] * a1.determinant() +
		m[M20] * a2.determinant() -
		m[M30] * a3.determinant()
	);
};

/**
 * Multiplies the matrices (left x right) left to right.
 * @param l Left matrix
 * @param r Right matrix
 * @returns The product of the two matrices
 */
export const multiplyM4M4 = <T extends Mat4Like>(l: T, r: Mat4Like): T => {
	assertMat4(l);
	assertMat4(r);

	// prettier-ignore
	const f = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	] satisfies M4_T;
	const result = (isMat4(l) ? new Mat4() : f) as typeof l;

	result[M00] =
		l[M00] * r[M00] + l[M10] * r[M01] + l[M20] * r[M02] + l[M30] * r[M03];
	result[M01] =
		l[M01] * r[M00] + l[M11] * r[M01] + l[M21] * r[M02] + l[M31] * r[M03];
	result[M02] =
		l[M02] * r[M00] + l[M12] * r[M01] + l[M22] * r[M02] + l[M32] * r[M03];
	result[M03] =
		l[M03] * r[M00] + l[M13] * r[M01] + l[M23] * r[M02] + l[M33] * r[M03];

	result[M10] =
		l[M00] * r[M10] + l[M10] * r[M11] + l[M20] * r[M12] + l[M30] * r[M13];
	result[M11] =
		l[M01] * r[M10] + l[M11] * r[M11] + l[M21] * r[M12] + l[M31] * r[M13];
	result[M12] =
		l[M02] * r[M10] + l[M12] * r[M11] + l[M22] * r[M12] + l[M32] * r[M13];
	result[M13] =
		l[M03] * r[M10] + l[M13] * r[M11] + l[M23] * r[M12] + l[M33] * r[M13];

	result[M20] =
		l[M00] * r[M20] + l[M10] * r[M21] + l[M20] * r[M22] + l[M30] * r[M23];
	result[M21] =
		l[M01] * r[M20] + l[M11] * r[M21] + l[M21] * r[M22] + l[M31] * r[M23];
	result[M22] =
		l[M02] * r[M20] + l[M12] * r[M21] + l[M22] * r[M22] + l[M32] * r[M23];
	result[M23] =
		l[M03] * r[M20] + l[M13] * r[M21] + l[M23] * r[M22] + l[M33] * r[M23];

	result[M30] =
		l[M00] * r[M30] + l[M10] * r[M31] + l[M20] * r[M32] + l[M30] * r[M33];
	result[M31] =
		l[M01] * r[M30] + l[M11] * r[M31] + l[M21] * r[M32] + l[M31] * r[M33];
	result[M32] =
		l[M02] * r[M30] + l[M12] * r[M31] + l[M22] * r[M32] + l[M32] * r[M33];
	result[M33] =
		l[M03] * r[M30] + l[M13] * r[M31] + l[M23] * r[M32] + l[M33] * r[M33];

	return result;
};

/**
 * Multiplies a 4x4 matrix by a 2D vector
 * @param m Matrix
 * @param v Vector
 * @returns Product (2D Vector)
 */
export const multiplyM4V4 = (m: Mat4Like, v: Vec4Like): Vec4 => {
	assertMat4(m);
	assertVec4(v);

	const result = new Vec4();
	result[0] = m[M00] * v[0] + m[M10] * v[1] + m[M20] * v[2] + m[M30] * v[3];
	result[1] = m[M01] * v[0] + m[M11] * v[1] + m[M21] * v[2] + m[M31] * v[3];
	result[2] = m[M02] * v[0] + m[M12] * v[1] + m[M22] * v[2] + m[M32] * v[3];
	result[3] = m[M03] * v[0] + m[M13] * v[1] + m[M23] * v[2] + m[M33] * v[3];
	return result;
};

export function invertM4(m: Mat4): Mat4 {
	const { col0, col1, col2, col3 } = m;

	const C01 = col0.xyz.cross(col1.xyz);
	const C23 = col2.xyz.cross(col3.xyz);
	const B10 = col0.xyz.scale(col1.w).sub(col1.xyz.scale(col0.w));
	const B32 = col2.xyz.scale(col3.w).sub(col3.xyz.scale(col2.w));

	const invDeterminant = 1 / (C01.dot(B32) + C23.dot(B10));
	C01.scale(invDeterminant);
	C23.scale(invDeterminant);
	B10.scale(invDeterminant);
	B32.scale(invDeterminant);

	const result = new Mat4(...Array.from({ length: 16 }, () => 99));
	result.col0 = [
		...col1.xyz.cross(B32).add(Vec3.scale(C23, col1.w)),
		-col1.xyz.dot(C23),
	] as V4_T;
	result.col1 = [
		...B32.cross(col0.xyz).sub(Vec3.scale(C23, col0.w)),
		+col0.xyz.dot(C23),
	] as V4_T;
	result.col2 = [
		...col3.xyz.cross(B10).add(Vec3.scale(C01, col3.w)),
		-col3.xyz.dot(C01),
	] as V4_T;
	result.col3 = [
		...B10.cross(col2.xyz).sub(Vec3.scale(C01, m.column2.w)),
		+m.column2.xyz.dot(C01),
	] as V4_T;

	return result.transpose();
}
