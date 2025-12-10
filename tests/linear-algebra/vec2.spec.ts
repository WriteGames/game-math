import { describe, expect, test } from 'vitest';
import { Vec2, Vec3, Vec4 } from '../../src/linear-algebra/index.js';
import {
	VEC2_A,
	VEC2_B,
	VEC2_DIFF,
	VEC2_SUM,
	VEC3_B,
	VEC4_B,
} from '../data.mock.js';

describe('Vec2', () => {
	describe('getter/setters work as intended', () => {
		test('get x/y/[0]/[1]', () => {
			const X = 13;
			const Y = 27;
			const a = new Vec2(X, Y);

			expect(a.x).toEqual(X);
			expect(a[0]).toEqual(X);

			expect(a.y).toEqual(Y);
			expect(a[1]).toEqual(Y);
		});

		test('set x/y/[0]/[1]', () => {
			const X = 13;
			const Y = 27;
			const a = new Vec2();

			a.x = X;
			expect(a.x).toEqual(X);
			a[0] = -X;
			expect(a.x).toEqual(-X);

			a.y = Y;
			expect(a.y).toEqual(Y);
			a[1] = -Y;
			expect(a.y).toEqual(-Y);
		});
	});

	test('test iterator', () => {
		const X = 5;
		const Y = 7;
		expect([...new Vec2(X, Y)]).toEqual([X, Y]);
	});

	describe('static Vec2 getters', () => {
		test('Vec2.zero should be a Vec2 with all properties set to 0', () => {
			expect(Vec2.zero).toEqualVec2([0, 0]);
		});

		test('Vec2.one should be a Vec2 with all properties set to 0', () => {
			expect(Vec2.one).toEqualVec2([1, 1]);
		});

		test('Vec2.left should be a Vec2 set to <-1, 0>', () => {
			expect(Vec2.left).toEqualVec2([-1, 0]);
		});

		test('Vec2.right should be a Vec2 set to <1, 0>', () => {
			expect(Vec2.right).toEqualVec2([1, 0]);
		});

		test('Vec2.up should be a Vec2 set to <0, -1>', () => {
			expect(Vec2.up).toEqualVec2([0, -1]);
		});

		test('Vec2.down should be a Vec2 set to <0, 1>', () => {
			expect(Vec2.down).toEqualVec2([0, 1]);
		});
	});

	test('clone', () => {
		const a = new Vec2(5, 7);
		const b = a.clone();
		expect(a === b).toEqual(false);
		expect(a).toEqualVec2(b);
	});

	describe('add(v)', () => {
		test('should add Vec2 to itself', () => {
			const a = new Vec2(...VEC2_A);
			const b = new Vec2(...VEC2_B);
			expect(a.add(b)).toEqualVec2(VEC2_SUM);
			expect(a).toEqualVec2(VEC2_SUM);
		});

		test('should add Vec3 to itself', () => {
			const a = new Vec2(...VEC2_A);
			const b = new Vec3(...VEC3_B);
			expect(a.add(b)).toEqualVec2(VEC2_SUM);
			expect(a).toEqualVec2(VEC2_SUM);
		});

		test('should add Vec4 to itself', () => {
			const a = new Vec2(...VEC2_A);
			const b = new Vec4(...VEC4_B);
			expect(a.add(b)).toEqualVec2(VEC2_SUM);
			expect(a).toEqualVec2(VEC2_SUM);
		});
	});

	describe('sub(v)', () => {
		test('should subtract Vec2 from itself', () => {
			const a = new Vec2(...VEC2_A);
			const b = new Vec2(...VEC2_B);
			expect(a.sub(b)).toEqualVec2(VEC2_DIFF);
			expect(a).toEqualVec2(VEC2_DIFF);
		});

		test('should subtract Vec3 from itself', () => {
			const a = new Vec2(...VEC2_A);
			const b = new Vec3(...VEC3_B);
			expect(a.sub(b)).toEqualVec2(VEC2_DIFF);
			expect(a).toEqualVec2(VEC2_DIFF);
		});

		test('should subtract Vec4 from itself', () => {
			const a = new Vec2(...VEC2_A);
			const b = new Vec4(...VEC4_B);
			expect(a.sub(b)).toEqualVec2(VEC2_DIFF);
			expect(a).toEqualVec2(VEC2_DIFF);
		});
	});
});
