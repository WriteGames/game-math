import type { Mat2Like, Matrix, Vec2Like } from './common.js';
import { posEqual } from './common.js';
import { Vec2 } from './vec2.js';

/**
 * Checks if a given argument is an instance of {@link Mat2}.
 * @category Linear Algebra
 * @param mat Potential Mat2
 * @returns Whether or not the argument is a Mat2
 */
export function isMat2(mat: Matrix): mat is Mat2 {
	return mat instanceof Mat2;
}

// prettier-ignore
const INDICES = [
	0, 2,
	1, 3,
] as const;

/** Column 0, Row 0 index */
const M00 = INDICES[0];
/** Column 1, Row 0 index */
const M10 = INDICES[1];

/** Column 0, Row 1 index */
const M01 = INDICES[2];
/** Column 1, Row 1 index */
const M11 = INDICES[3];

/**
 * A 2x2 matrix. While it is initialized/set as row-major, internally,
 * it represents itself as column-major
 * @category Linear Algebra
 */
export class Mat2 extends Array<number> {
	// length: 4 = 4 as const;

	/**
	 * Uninitialized values defaults to the 2x2 identity matrix.
	 * @param {number} m00 Element at column 0, row 0
	 * @param {number} m10 Element at column 1, row 0
	 * @param {number} m01 Element at column 0, row 1
	 * @param {number} m11 Element at column 1, row 1
	 */
	constructor(m00 = 1, m10 = 0, m01 = 0, m11 = 1) {
		// prettier-ignore
		super(
			m00, m01,
			m10, m11
		);
	}

	/**
	 * Creates an instance of the 2x2 identity matrix.
	 */
	static get identity(): Mat2 {
		return new Mat2(1, 0, 0, 1);
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

	/** Returns row 0 as a Vec2 */
	get row0(): Vec2 {
		return new Vec2(this[M00], this[M10]);
	}
	set row0(v: Vec2Like) {
		this[M00] = v[0];
		this[M10] = v[1];
	}
	/** Returns row 1 as a Vec2 */
	get row1(): Vec2 {
		return new Vec2(this[M01], this[M11]);
	}
	set row1(v: Vec2Like) {
		this[M01] = v[0];
		this[M11] = v[1];
	}
	/** Returns all rows as an array of Vec2s */
	get rows(): [Vec2, Vec2] {
		return [this.row0, this.row1];
	}
	set rows(v: [Vec2Like, Vec2Like]) {
		this.row0 = v[0];
		this.row1 = v[1];
	}

	/** Returns column 0 as a Vec2 */
	get column0(): Vec2 {
		return new Vec2(this[M00], this[M01]);
	}
	set column0(v: Vec2Like) {
		this[M00] = v[0];
		this[M01] = v[1];
	}
	/** Returns column 1 as a Vec2 */
	get column1(): Vec2 {
		return new Vec2(this[M10], this[M11]);
	}
	set column1(v: Vec2Like) {
		this[M10] = v[0];
		this[M11] = v[1];
	}
	/** Returns all columns as an array of Vec2s */
	get columns(): [Vec2, Vec2] {
		return [this.col0, this.col1];
	}
	set columns(v: [Vec2Like, Vec2Like]) {
		this.column0 = v[0];
		this.column1 = v[1];
	}

	/**
	 * Alias for column0
	 * @alias Mat2#column0
	 */
	get col0(): Vec2 {
		return this.column0;
	}
	set col0(v: Vec2Like) {
		this.column0 = v;
	}
	/**
	 * Alias for column1
	 * @alias Mat2#column1
	 */
	get col1(): Vec2 {
		return this.column1;
	}
	set col1(v: Vec2Like) {
		this.column1 = v;
	}
	/**
	 * Alias for columns
	 * @alias Mat2#columns
	 */
	get cols(): [Vec2, Vec2] {
		return this.columns;
	}
	set cols(v: [Vec2Like, Vec2Like]) {
		this.columns = v;
	}

	/**
	 * Creates a clone of the matrix.
	 * @returns A new matrix
	 */
	clone(): Mat2 {
		// prettier-ignore
		return new Mat2(
			this[M00], this[M10],
			this[M01], this[M11]
		);
	}

	/**
	 * Sets the matrix to the 2x2 identity matrix
	 * @returns this
	 */
	setIdentity(): this {
		this[M00] = 1;
		this[M01] = 0;
		this[M10] = 0;
		this[M11] = 1;
		return this;
	}

	/**
	 * Sets the matrix to new values
	 * @param m00 Element at column 0, row 0
	 * @param m10 Element at column 1, row 0
	 * @param m01 Element at column 0, row 1
	 * @param m11 Element at column 1, row 1
	 * @returns this
	 */
	set(m00: number, m01: number, m10: number, m11: number): this {
		this[M00] = m00;
		this[M01] = m10;
		this[M10] = m01;
		this[M11] = m11;
		return this;
	}

	/**
	 * Sets this matrix to the values of another matrix.
	 * @param m New values
	 * @returns this
	 */
	setMat2(m: Mat2Like): this {
		this[M00] = m[M00];
		this[M01] = m[M01];
		this[M10] = m[M10];
		this[M11] = m[M11];
		return this;
	}

	/**
	 * Returns a 2x2 rotation matrix.
	 * @param angle Angle of rotation
	 */
	static rotate(angle: number): Mat2 {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		// prettier-ignore
		return new Mat2(
			cos, -sin,
			sin, cos,
		);
	}

	/**
	 * Returns a 2x2 scale matrix.
	 * @param scale Scale factor
	 */
	static scale(scale: number): Mat2;
	/**
	 * Returns a 2x2 scale matrix.
	 * @param x X-scale factor
	 * @param y Y-scale factor
	 */
	static scale(x: number, y: number): Mat2;
	static scale(x: number, y = x): Mat2 {
		// prettier-ignore
		return new Mat2(
			x, 0,
			0, y,
		);
	}

	/**
	 * Returns the determinant of a matrix
	 * @param m Input matrix
	 * @returns Determinant
	 */
	static determinant(m: Mat2Like): number {
		return determinantM2(m);
	}

	/**
	 * Returns the matrix's determinant
	 * @returns Determinant
	 */
	determinant(): number {
		return Mat2.determinant(this);
	}

	/**
	 * Transposes a matrix
	 * @param m Input matrix
	 * @returns New, transposed matrix
	 */
	static transpose<T extends Mat2Like>(m: T): T {
		return transpose2D(m);
	}

	/**
	 * Transposes the matrix in-place
	 * @returns this
	 */
	transpose(): this {
		return this.setMat2(Mat2.transpose(this));
	}

	/**
	 * Multiplies the matrices (left x right) left to right.
	 * @param left Matrix a
	 * @param right Matrix b
	 * @returns The product of the two matrices
	 */
	static multiply<T extends Mat2Like>(left: T, right: Mat2Like): T {
		return multiplyM2M2(left, right);
	}

	/**
	 * Multiplies the matrices (this x other) left to right.
	 * @param other
	 * @returns The product of the two matrices
	 */
	multiply(other: Mat2Like): this {
		return this.setMat2(Mat2.multiply([...this], other));
	}

	/**
	 * Multiplies the matrices (this x other) right to left.
	 * @param other
	 * @returns The product of the two matrices
	 */
	multiplyRTL(other: Mat2Like): this {
		return this.setMat2(Mat2.multiply(other, [...this]));
	}

	/**
	 * Alias for multiplyRTL. Multiplies the matrices (this x other) right to left.
	 * @param other
	 * @returns The product of the two matrices
	 */
	postMultiply(other: Mat2Like): this {
		return this.multiplyRTL(other);
	}

	/**
	 * Inverts the matrix in-place.
	 * @returns this
	 */
	invert(): this {
		const invDeterminant = 1 / this.determinant();
		const temp = this[M00];
		this[M00] = invDeterminant * this[M11];
		this[M10] *= -invDeterminant;
		this[M01] *= -invDeterminant;
		this[M11] = invDeterminant * temp;
		return this;
	}

	/**
	 * Check if two matrices are equal to one another.
	 * @param a Matrix a
	 * @param b Matrix b
	 * @returns Equality result
	 */
	static equal(a: Mat2, b: Mat2Like): boolean {
		return posEqual(a, b);
	}

	/**
	 * Check if this matrix is equal to another.
	 * @param m Other matrix
	 * @returns Equality result
	 */
	equal(m: Mat2Like): boolean {
		return Mat2.equal(this, m);
	}
}

/**
 * Transposes a matrix
 * @category Linear Algebra
 * @param m Input matrix
 * @returns New, transposed matrix
 */
export function transpose2D<T extends Mat2Like>(m: T): T {
	if (m.length !== 4) throw new Error('not a valid 2x2 matrix');
	const result = (isMat2(m) ? m.clone() : [...m]) as typeof m;
	const temp = result[M01];
	result[M01] = result[M10];
	result[M10] = temp;
	return result;
}

/**
 * Throws an error if input is not a 2x2 matrix.
 * @category Linear Algebra
 * @param m Input matrix
 */
function assertMat2(m: Mat2Like): void {
	if (m.length !== 4) throw new Error('not a valid 2x2 matrix');
}

/**
 * Throws an error if input is not a 2D array
 * @category Linear Algebra
 * @param m Input matrix
 */
function assertVec2(v: Vec2Like): void {
	if (v.length !== 2) throw new Error('not a valid 2D vector');
}

/**
 * Computes the determinant of a matrix.
 * @category Linear Algebra
 * @param m Input matrix
 * @returns Determinant
 */
export function determinantM2(m: Mat2Like): number {
	assertMat2(m);
	return m[M00] * m[M11] - m[M10] * m[M01];
}

/**
 * Multiplies the matrices (left x right) left to right.
 * @category Linear Algebra
 * @param left Matrix a
 * @param right Matrix b
 * @returns The product of the two matrices
 */
export function multiplyM2M2<T extends Mat2Like>(left: T, right: Mat2Like): T {
	assertMat2(left);
	assertMat2(right);
	const result = (isMat2(left) ? new Mat2() : [1, 0, 0, 1]) as typeof left;
	result[M00] = left[M00] * right[M00] + left[M10] * right[M01];
	result[M01] = left[M01] * right[M00] + left[M11] * right[M01];
	result[M10] = left[M00] * right[M10] + left[M10] * right[M11];
	result[M11] = left[M01] * right[M10] + left[M11] * right[M11];
	return result;
}

/**
 * Multiplies a 2x2 matrix by a 2D vector
 * @category Linear Algebra
 * @param m Matrix
 * @param v Vector
 * @returns Product (2D Vector)
 */
export function multiplyM2V2(m: Mat2Like, v: Vec2Like): Vec2 {
	assertMat2(m);
	assertVec2(v);
	const result = new Vec2();
	result[0] = m[M00] * v[0] + m[M10] * v[1];
	result[1] = m[M01] * v[0] + m[M11] * v[1];
	return result;
}
