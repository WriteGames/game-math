import { posEqual } from './common';
import type { M2_T, V2_T } from './common';
import { Vec2 } from './vec2';

const M00 = 0; // Top Left
const M10 = 2; // Top Right
const M01 = 1; // Bottom Left
const M11 = 3; // Bottom Right

export class Mat2 extends Array<number> {
	// length: 4 = 4 as const;

	constructor(m00 = 1, m10 = 0, m01 = 0, m11 = 1) {
		// prettier-ignore
		super(
			m00, m01,
			m10, m11
		);
	}

	static get identity(): Mat2 {
		return new Mat2(1, 0, 0, 1);
	}

	get m00(): number {
		return this[M00];
	}
	set m00(value: number) {
		this[M00] = value;
	}

	get m10(): number {
		return this[M10];
	}
	set m10(value: number) {
		this[M10] = value;
	}

	get m01(): number {
		return this[M01];
	}
	set m01(value: number) {
		this[M01] = value;
	}

	get m11(): number {
		return this[M11];
	}
	set m11(value: number) {
		this[M11] = value;
	}

	clone(): Mat2 {
		// prettier-ignore
		return new Mat2(
			this[M00], this[M10],
			this[M01], this[M11]
		);
	}

	setIdentity(): this {
		this[M00] = 1;
		this[M01] = 0;
		this[M10] = 0;
		this[M11] = 1;
		return this;
	}

	set(m00: number, m01: number, m10: number, m11: number): this {
		this[M00] = m00;
		this[M01] = m10;
		this[M10] = m01;
		this[M11] = m11;
		return this;
	}

	static determinant = (m: Mat2 | M2_T): number => determinant2D(m);
	determinant(): number {
		return Mat2.determinant(this);
	}

	static transpose = <T extends Mat2 | M2_T>(m: T): T => transpose2D(m);
	transpose(): this {
		return Mat2.transpose(this);
	}

	// DECIDE(bret): how do we want to do the static method for multiply, since it's going to return a new value? Does Mat2.map() return a new Mat2 instance or just a generic array? Does a static method even make sense here?

	static multiply = (left: Mat2 | M2_T, right: Mat2 | M2_T): Mat2 =>
		multiply2D(left, right);
	#multiply(left: Mat2 | M2_T, right: Mat2 | M2_T): this {
		const result = Mat2.multiply(left, right);
		this[M00] = result[M00];
		this[M10] = result[M10];
		this[M01] = result[M01];
		this[M11] = result[M11];
		return this;
	}

	multiply(m: Mat2 | M2_T): this {
		return this.#multiply([...this], m);
	}

	invert(): this {
		const invDeterminant = 1 / this.determinant();
		const temp = this[M00];
		this[M00] = invDeterminant * this[M11];
		this[M10] *= -invDeterminant;
		this[M01] *= -invDeterminant;
		this[M11] = invDeterminant * temp;
		return this;
	}

	static equal = (a: Mat2, b: Mat2 | M2_T): boolean => posEqual(a, b);
	equal(v: Mat2 | M2_T): boolean {
		return Mat2.equal(this, v);
	}
}

export const transpose2D = <T extends Mat2 | M2_T>(m: T): T => {
	if (m.length !== 4) throw new Error('not a valid 2x2 matrix');
	let temp = m[M10];
	m[M10] = m[M01];
	m[M01] = temp;
	return m;
};

const assertMat2 = (m: Mat2 | M2_T): void => {
	if (m.length !== 4) throw new Error('not a valid 2x2 matrix');
};

const assertVec2 = (m: Vec2 | V2_T): void => {
	if (m.length !== 2) throw new Error('not a valid 2D vector');
};

export const determinant2D = (m: Mat2 | M2_T): number => {
	assertMat2(m);
	return m[M00] * m[M11] - m[M10] * m[M01];
};

// DECIDE(bret): do we want to return a Mat2 or M2_T? Do it conditionally?
export const multiply2D = (left: Mat2 | M2_T, right: Mat2 | M2_T): Mat2 => {
	assertMat2(left);
	assertMat2(right);
	const result = new Mat2();
	result[M00] = left[M00] * right[M00] + left[M10] * right[M01];
	result[M10] = left[M00] * right[M10] + left[M10] * right[M11];
	result[M01] = left[M01] * right[M00] + left[M11] * right[M01];
	result[M11] = left[M01] * right[M10] + left[M11] * right[M11];
	return result;
};

export const multiplyM2V2 = (m: Mat2 | M2_T, v: Vec2 | V2_T): Vec2 => {
	assertMat2(m);
	assertVec2(v);
	const result = new Vec2();
	result[0] = m[M00] * v[0] + m[M10] * v[1];
	result[1] = m[M01] * v[0] + m[M11] * v[1];
	return result;
};
