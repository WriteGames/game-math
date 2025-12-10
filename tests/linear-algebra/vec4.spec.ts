import { describe, expect, test } from 'vitest';
import {
	length,
	Vec2,
	Vec3,
	Vec4,
	type V4_T,
} from '../../src/linear-algebra/index.js';
import {
	VEC2_B,
	VEC2_DIFF,
	VEC2_SUM,
	VEC3_B,
	VEC3_DIFF,
	VEC3_SUM,
	VEC4_A,
	VEC4_B,
	VEC4_DIFF,
	VEC4_SUM,
	VEC_A_W,
	VEC_A_Z,
} from '../data.mock.js';

describe('Vec4', () => {
	describe('getter/setters work as intended', () => {
		test('get x/y/z/w/[0]/[1]/[2]/[3]', () => {
			const X = 13;
			const Y = 27;
			const Z = 42;
			const W = 68;
			const a = new Vec4(X, Y, Z, W);

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
			const a = new Vec4();

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
		expect([...new Vec4(X, Y, Z, W)]).toEqual([X, Y, Z, W]);
	});

	describe('static Vec4 getters', () => {
		test('Vec4.zero should be a Vec4 with all properties set to 0', () => {
			expect(Vec4.zero).toEqualVec4([0, 0, 0, 0]);
		});

		test('Vec4.one should be a Vec4 with all properties set to 0', () => {
			expect(Vec4.one).toEqualVec4([1, 1, 1, 1]);
		});
	});

	describe('normalize', () => {
		test('Vec4 with length zero should normalize to itself', () => {
			expect(new Vec4().normalize()).toEqualVec4(Vec4.zero);
		});

		test('should normalize the vector', () => {
			const vec = new Vec4(1, -2, 3, -1).normalize();
			expect(length(vec)).toBeCloseTo(1);
			expect(vec.x).toBeGreaterThan(0);
			expect(vec.y).toBeLessThan(0);
			expect(vec.z).toBeGreaterThan(0);
			expect(vec.w).toBeLessThan(0);
		});
	});

	test('clone', () => {
		const a = new Vec4(5, 7, 9, 11);
		const b = a.clone();
		expect(a === b).toEqual(false);
		expect(a).toEqualVec4(b);
	});

	describe('add(v)', () => {
		test('should add Vec2 to itself', () => {
			const a = new Vec4(...VEC4_A);
			const b = new Vec2(...VEC2_B);
			const expected = [...VEC2_SUM, VEC_A_Z, VEC_A_W] as V4_T;
			expect(a.add(b)).toEqualVec4(expected);
			expect(a).toEqualVec4(expected);
		});

		test('should add Vec3 to itself', () => {
			const a = new Vec4(...VEC4_A);
			const b = new Vec3(...VEC3_B);
			const expected = [...VEC3_SUM, VEC_A_W] as V4_T;
			expect(a.add(b)).toEqualVec4(expected);
			expect(a).toEqualVec4(expected);
		});

		test('should add Vec4 to itself', () => {
			const a = new Vec4(...VEC4_A);
			const b = new Vec4(...VEC4_B);
			expect(a.add(b)).toEqualVec4(VEC4_SUM);
			expect(a).toEqualVec4(VEC4_SUM);
		});
	});

	describe('sub(v)', () => {
		test('should subtract Vec2 from itself', () => {
			const a = new Vec4(...VEC4_A);
			const b = new Vec2(...VEC2_B);
			const expected = [...VEC2_DIFF, VEC_A_Z, VEC_A_W] as V4_T;
			expect(a.sub(b)).toEqualVec4(expected);
			expect(a).toEqualVec4(expected);
		});

		test('should subtract Vec3 from itself', () => {
			const a = new Vec4(...VEC4_A);
			const b = new Vec3(...VEC3_B);
			const expected = [...VEC3_DIFF, VEC_A_W] as V4_T;
			expect(a.sub(b)).toEqualVec4(expected);
			expect(a).toEqualVec4(expected);
		});

		test('should subtract Vec4 from itself', () => {
			const a = new Vec4(...VEC4_A);
			const b = new Vec4(...VEC4_B);
			expect(a.sub(b)).toEqualVec4(VEC4_DIFF);
			expect(a).toEqualVec4(VEC4_DIFF);
		});
	});
});
