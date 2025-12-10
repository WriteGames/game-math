import { describe, expect, test } from 'vitest';
import { length, Vec2, Vec3, Vec4, type V3_T } from '../../index.js';
import {
	CROSS3D_A,
	CROSS3D_B,
	CROSS3D_RESULT,
	VEC2_B,
	VEC2_DIFF,
	VEC2_SUM,
	VEC3_A,
	VEC3_B,
	VEC3_DIFF,
	VEC3_SUM,
	VEC4_B,
	VEC_A_Z,
} from '../data.mock.js';

describe('Vec3', () => {
	describe('getter/setters work as intended', () => {
		test('get x/y/z/[0]/[1]/[2]', () => {
			const X = 13;
			const Y = 27;
			const Z = 42;
			const a = new Vec3(X, Y, Z);

			expect(a.x).toEqual(X);
			expect(a[0]).toEqual(X);

			expect(a.y).toEqual(Y);
			expect(a[1]).toEqual(Y);

			expect(a.z).toEqual(Z);
			expect(a[2]).toEqual(Z);
		});

		test('set x/y/z/[0]/[1]/[2]', () => {
			const X = 13;
			const Y = 27;
			const Z = 42;
			const a = new Vec3();

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
		});
	});

	test('test iterator', () => {
		const X = 5;
		const Y = 7;
		const Z = 9;
		expect([...new Vec3(X, Y, Z)]).toEqual([X, Y, Z]);
	});

	describe('static Vec3 getters', () => {
		test('Vec3.zero should be a Vec3 with all properties set to 0', () => {
			expect(Vec3.zero).toEqualVec3([0, 0, 0]);
		});

		test('Vec3.one should be a Vec3 with all properties set to 0', () => {
			expect(Vec3.one).toEqualVec3([1, 1, 1]);
		});

		test('Vec3.left should be a Vec3 set to <-1, 0, 0>', () => {
			expect(Vec3.left).toEqualVec3([-1, 0, 0]);
		});

		test('Vec3.right should be a Vec3 set to <1, 0, 0>', () => {
			expect(Vec3.right).toEqualVec3([1, 0, 0]);
		});

		test('Vec3.down should be a Vec3 set to <0, -1, 0>', () => {
			expect(Vec3.down).toEqualVec3([0, -1, 0]);
		});

		test('Vec3.up should be a Vec3 set to <0, 1, 0>', () => {
			expect(Vec3.up).toEqualVec3([0, 1, 0]);
		});

		test('Vec3.back should be a Vec3 set to <0, 0, -1>', () => {
			expect(Vec3.back).toEqualVec3([0, 0, -1]);
		});

		test('Vec3.forward should be a Vec3 set to <0, 0, 1>', () => {
			expect(Vec3.forward).toEqualVec3([0, 0, 1]);
		});
	});

	describe('normalize', () => {
		test('Vec3 with length zero should normalize to itself', () => {
			expect(new Vec3().normalize()).toEqualVec3(Vec3.zero);
		});

		test('should normalize the vector', () => {
			const vec = new Vec3(1, -2, 3).normalize();
			expect(length(vec)).toBeCloseTo(1);
			expect(vec.x).toBeGreaterThan(0);
			expect(vec.y).toBeLessThan(0);
			expect(vec.z).toBeGreaterThan(0);
		});
	});

	test('clone', () => {
		const a = new Vec3(5, 7, 9);
		const b = a.clone();
		expect(a === b).toEqual(false);
		expect(a).toEqualVec3(b);
	});

	test('cross(v)', () => {
		const v1 = new Vec3(...CROSS3D_A);
		const v2 = new Vec3(...CROSS3D_B);

		expect(v1.cross(v2)).toEqualVec3(CROSS3D_RESULT);
		expect(Vec3.cross(v1, v2)).toEqualVec3(CROSS3D_RESULT);
	});

	describe('add(v)', () => {
		test('should add Vec2 to itself', () => {
			const a = new Vec3(...VEC3_A);
			const b = new Vec2(...VEC2_B);
			expect(a.add(b)).toEqualVec3([...VEC2_SUM, VEC_A_Z]);
			expect(a).toEqualVec3([...VEC2_SUM, VEC_A_Z]);
		});

		test('should add Vec3 to itself', () => {
			const a = new Vec3(...VEC3_A);
			const b = new Vec3(...VEC3_B);
			expect(a.add(b)).toEqualVec3(VEC3_SUM);
			expect(a).toEqualVec3(VEC3_SUM);
		});

		test('should add Vec4 to itself', () => {
			const a = new Vec3(...VEC3_A);
			const b = new Vec4(...VEC4_B);
			expect(a.add(b)).toEqualVec3(VEC3_SUM);
			expect(a).toEqualVec3(VEC3_SUM);
		});
	});

	describe('sub(v)', () => {
		test('should subtract Vec2 from itself', () => {
			const a = new Vec3(...VEC3_A);
			const b = new Vec2(...VEC2_B);
			const expected = [...VEC2_DIFF, VEC_A_Z] as V3_T;
			expect(a.sub(b)).toEqualVec3(expected);
			expect(a).toEqualVec3(expected);
		});

		test('should subtract Vec3 from itself', () => {
			const a = new Vec3(...VEC3_A);
			const b = new Vec3(...VEC3_B);
			expect(a.sub(b)).toEqualVec3(VEC3_DIFF);
			expect(a).toEqualVec3(VEC3_DIFF);
		});

		test('should subtract Vec4 from itself', () => {
			const a = new Vec3(...VEC3_A);
			const b = new Vec4(...VEC4_B);
			expect(a.sub(b)).toEqualVec3(VEC3_DIFF);
			expect(a).toEqualVec3(VEC3_DIFF);
		});
	});
});
