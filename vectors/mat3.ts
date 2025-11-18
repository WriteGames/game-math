import type { M3_T, Matrix, V3_T } from './common.js';
import { posEqual } from './common.js';
import { Vec3 } from './vec3.js';

export const isMat3 = (mat: Matrix): mat is Mat3 => {
	return mat instanceof Mat3;
};

// prettier-ignore
const INDICES = [
	0, 3, 6,
	1, 4, 7,
	2, 5, 8,
] as const;

/** Column 0, Row 0 index */
const M00 = INDICES[0];
/** Column 1, Row 0 index */
const M10 = INDICES[1];
/** Column 2, Row 0 index */
const M20 = INDICES[2];

/** Column 0, Row 1 index */
const M01 = INDICES[3];
/** Column 1, Row 1 index */
const M11 = INDICES[4];
/** Column 2, Row 1 index */
const M21 = INDICES[5];

/** Column 0, Row 2 index */
const M02 = INDICES[6];
/** Column 1, Row 2 index */
const M12 = INDICES[7];
/** Column 2, Row 2 index */
const M22 = INDICES[8];

/**
 * A 3x3 matrix. While it is initialized/set as row-major, internally,
 * it represents itself as column-major
 */
export class Mat3 extends Array<number> {
	// length: 9 = 9 as const;

	/**
	 * Uninitialized values defaults to the 3x3 identity matrix.
	 * @param m00 Element at column 0, row 0
	 * @param m10 Element at column 1, row 0
	 * @param m20 Element at column 2, row 0
	 * @param m01 Element at column 0, row 1
	 * @param m11 Element at column 1, row 1
	 * @param m21 Element at column 2, row 1
	 * @param m02 Element at column 0, row 2
	 * @param m12 Element at column 1, row 2
	 * @param m22 Element at column 2, row 2
	 */
	// prettier-ignore
	constructor(
		m00 = 1, m10 = 0, m20 = 0,
		m01 = 0, m11 = 1, m21 = 0,
		m02 = 0, m12 = 0, m22 = 1,
	) {
		// prettier-ignore
		super(
			m00, m01, m02,
			m10, m11, m12,
			m20, m21, m22,
		);
	}

	/**
	 * Creates an instance of the 3x3 identity matrix.
	 */
	static get identity(): Mat3 {
		// prettier-ignore
		return new Mat3(
			1, 0, 0,
			0, 1, 0,
			0, 0, 1,
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

	/**
	 * Creates a clone of the matrix.
	 * @returns A new matrix
	 */
	clone(): Mat3 {
		// prettier-ignore
		return new Mat3(
			this[M00], this[M10], this[M20],
			this[M01], this[M11], this[M21],
			this[M02], this[M12], this[M22],
		);
	}

	/**
	 * Sets the matrix to the 3x3 identity matrix
	 * @returns this
	 */
	setIdentity(): this {
		this[M00] = 1;
		this[M01] = 0;
		this[M02] = 0;

		this[M10] = 0;
		this[M11] = 1;
		this[M12] = 0;

		this[M20] = 0;
		this[M21] = 0;
		this[M22] = 1;

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
	setMat3(m: Mat3 | M3_T): this {
		this[M00] = m[M00];
		this[M01] = m[M01];
		this[M02] = m[M02];

		this[M10] = m[M10];
		this[M11] = m[M11];
		this[M12] = m[M12];

		this[M20] = m[M20];
		this[M21] = m[M21];
		this[M22] = m[M22];

		return this;
	}

	/**
	 * Returns a 3x3 rotation matrix.
	 * @param angle Angle of rotation
	 */
	static rotate(angle: number): Mat3 {
		throw new Error('implement');
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		// prettier-ignore
		return new Mat3(
			cos, -sin,
			sin, cos,
		);
	}

	/**
	 * Returns a 3x3 rotation matrix around the X-axis.
	 * @param angle Angle of rotation
	 */
	static rotateX(angle: number): Mat3 {
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		// prettier-ignore
		return new Mat3(
			+1, +0, +0,
			+0, +c, -s,
			+0, +s, +c,
		);
	}

	/**
	 * Returns a 3x3 rotation matrix around the Y-axis.
	 * @param angle Angle of rotation
	 */
	static rotateY(angle: number): Mat3 {
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		// prettier-ignore
		return new Mat3(
			+c, +0, +s,
			+0, +1, +0,
			-s, +0, +c,
		);
	}

	/**
	 * Returns a 3x3 rotation matrix around the Z-axis.
	 * @param angle Angle of rotation
	 */
	static rotateZ(angle: number): Mat3 {
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		// prettier-ignore
		return new Mat3(
			+c, -s, +0,
			+s, +c, +0,
			+0, +0, +1,
		);
	}

	/**
	 * Returns a 3x3 scale matrix.
	 * @param scale Scale factor
	 */
	static scale(scale: number): Mat3;
	/**
	 * Returns a 3x3 scale matrix.
	 * @param x X factor
	 * @param y Y factor
	 * @param z Z factor
	 */
	static scale(x: number, y: number, z: number): Mat3;
	static scale(x: number, y = x, z = x): Mat3 {
		// prettier-ignore
		return new Mat3(
			x, 0, 0,
			0, y, 0,
			0, 0, z,
		);
	}

	/**
	 * Returns the determinant of a matrix
	 * @param m Input matrix
	 * @returns Determinant
	 */
	static determinant = (m: Mat3 | M3_T): number => determinantM3(m);
	/**
	 * Returns the matrix's determinant
	 * @returns Determinant
	 */
	determinant(): number {
		return Mat3.determinant(this);
	}

	/**
	 * Transposes a matrix
	 * @param m Input matrix
	 * @returns New, transposed matrix
	 */
	static transpose = <T extends Mat3 | M3_T>(m: T): T => transpose3D(m);
	/**
	 * Transposes the matrix in-place
	 * @returns this
	 */
	transpose(): this {
		return this.setMat3(Mat3.transpose(this));
	}

	/**
	 * Multiplies the matrices (left x right) left to right.
	 * @param left Matrix a
	 * @param right Matrix b
	 * @returns The product of the two matrices
	 */
	static multiply = <T extends Mat3 | M3_T>(left: T, right: Mat3 | M3_T): T =>
		multiplyM3M3(left, right);

	/**
	 * Multiplies the matrices (this x other) left to right.
	 * @param other
	 * @returns The product of the two matrices
	 */
	multiply(other: Mat3 | M3_T): this {
		return this.setMat3(Mat3.multiply([...this], other));
	}

	/**
	 * Multiplies the matrices (this x other) right to left.
	 * @param other
	 * @returns The product of the two matrices
	 */
	multiplyRTL(other: Mat3 | M3_T): this {
		return this.setMat3(Mat3.multiply(other, [...this]));
	}

	/**
	 * Alias for multiplyRTL. Multiplies the matrices (this x other) right to left.
	 * @param other
	 * @returns The product of the two matrices
	 */
	postMultiply(m: Mat3 | M3_T): this {
		return this.multiplyRTL(m);
	}

	/**
	 * Inverts the matrix in-place.
	 * @returns this
	 */
	invert(): this {
		// TODO(bret): Let's implement the cross-product first
		throw new Error('not yet implemented');
	}

	/**
	 * Check if two matrices are equal to one another.
	 * @param a Matrix a
	 * @param b Matrix b
	 * @returns Equality result
	 */
	static equal = (a: Mat3, b: Mat3 | M3_T): boolean => posEqual(a, b);
	/**
	 * Check if this matrix is equal to another.
	 * @param m Other matrix
	 * @returns Equality result
	 */
	equal(m: Mat3 | M3_T): boolean {
		return Mat3.equal(this, m);
	}
}

/**
 * Transposes a matrix
 * @param m Input matrix
 * @returns New, transposed matrix
 */
export const transpose3D = <T extends Mat3 | M3_T>(m: T): T => {
	if (m.length !== 9) throw new Error('not a valid 3x3 matrix');
	const result = (isMat3(m) ? m.clone() : [...m]) as typeof m;

	let temp = result[M01];
	result[M01] = result[M10];
	result[M10] = temp;

	temp = result[M02];
	result[M02] = result[M20];
	result[M20] = temp;

	temp = result[M12];
	result[M12] = result[M21];
	result[M21] = temp;

	return result;
};

/**
 * Throws an error if input is not a 3x3 matrix.
 * @param m Input matrix
 */
const assertMat3 = (m: Mat3 | M3_T): void => {
	if (m.length !== 9) throw new Error('not a valid 3x3 matrix');
};

/**
 * Throws an error if input is not a 2D array
 * @param m Input matrix
 */
const assertVec3 = (v: Vec3 | V3_T): void => {
	if (v.length !== 3) throw new Error('not a valid 2D vector');
};

/**
 * Computes the determinant of a matrix.
 * @param m Input matrix
 * @returns Determinant
 */
export const determinantM3 = (m: Mat3 | M3_T): number => {
	assertMat3(m);
	return (
		m[M00] * (m[M22] * m[M11] - m[M12] * m[M21]) +
		m[M01] * (m[M12] * m[M20] - m[M22] * m[M10]) +
		m[M02] * (m[M21] * m[M10] - m[M11] * m[M20])
	);
};

/**
 * Multiplies the matrices (left x right) left to right.
 * @param l Left matrix
 * @param r Right matrix
 * @returns The product of the two matrices
 */
export const multiplyM3M3 = <T extends Mat3 | M3_T>(
	l: T,
	r: Mat3 | M3_T,
): T => {
	assertMat3(l);
	assertMat3(r);

	const result = (
		isMat3(l) ? new Mat3() : [1, 0, 0, 0, 1, 0, 0, 0, 1]
	) as typeof l;

	result[M00] = l[M00] * r[M00] + l[M10] * r[M01] + l[M20] * r[M02];
	result[M01] = l[M01] * r[M00] + l[M11] * r[M01] + l[M21] * r[M02];
	result[M02] = l[M02] * r[M00] + l[M12] * r[M01] + l[M22] * r[M02];

	result[M10] = l[M00] * r[M10] + l[M10] * r[M11] + l[M20] * r[M12];
	result[M11] = l[M01] * r[M10] + l[M11] * r[M11] + l[M21] * r[M12];
	result[M12] = l[M02] * r[M10] + l[M12] * r[M11] + l[M22] * r[M12];

	result[M20] = l[M00] * r[M20] + l[M10] * r[M21] + l[M20] * r[M22];
	result[M21] = l[M01] * r[M20] + l[M11] * r[M21] + l[M21] * r[M22];
	result[M22] = l[M02] * r[M20] + l[M12] * r[M21] + l[M22] * r[M22];

	return result;
};

/**
 * Multiplies a 3x3 matrix by a 2D vector
 * @param m Matrix
 * @param v Vector
 * @returns Product (2D Vector)
 */
export const multiplyM3V3 = (m: Mat3 | M3_T, v: Vec3 | V3_T): Vec3 => {
	assertMat3(m);
	assertVec3(v);
	throw new Error('implement');
	const result = new Vec3();
	result[0] = m[M00] * v[0] + m[M10] * v[1];
	result[1] = m[M01] * v[0] + m[M11] * v[1];
	return result;
};
