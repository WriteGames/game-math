import { describe, expect, test } from 'vitest';
import {
	addPos,
	addScalar,
	equal,
	isVec2,
	isVec3,
	isVec4,
	length,
	posEqual,
	scalePos,
	subPos,
	Vec2,
	Vec3,
	Vec4,
	type V2_T,
	type V3_T,
	type V4_T,
	type Vector,
} from '../index.js';
import {
	CROSS3D_A,
	CROSS3D_B,
	CROSS3D_RESULT,
	VEC2_A,
	VEC2_B,
	VEC2_DIFF,
	VEC2_SUM,
	VEC3_A,
	VEC3_B,
	VEC3_DIFF,
	VEC3_SUM,
	VEC4_A,
	VEC4_B,
	VEC4_DIFF,
	VEC4_SUM,
	VEC_A_W,
	VEC_A_Z,
} from './mock-data.js';

describe('(Vec) Vector operations', () => {
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

	describe('Vector & Vector', () => {
		describe('addPos(a, b)', () => {
			describe('when a & b are both the same length', () => {
				test('Vec2 + Vec2 should result in a Vec2 sum', () => {
					const a = new Vec2(...VEC2_A);
					const b = new Vec2(...VEC2_B);
					expect(addPos(a, b)).toEqualVec2(VEC2_SUM);
					expect(Vec2.add(a, b)).toEqualVec2(VEC2_SUM);
				});

				test('Vec3 + Vec3 should result in a Vec3 sum', () => {
					const a = new Vec3(...VEC3_A);
					const b = new Vec3(...VEC3_B);
					expect(addPos(a, b)).toEqual(VEC3_SUM);
					expect(Vec3.add(a, b)).toEqual(VEC3_SUM);
				});

				test('Vec4 + Vec4 should result in a Vec4 sum', () => {
					const a = new Vec4(...VEC4_A);
					const b = new Vec4(...VEC4_B);
					expect(addPos(a, b)).toEqual(VEC4_SUM);
					expect(Vec4.add(a, b)).toEqual(VEC4_SUM);
				});
			});

			describe('when a is longer than b', () => {
				test("sum should be of length a, treating b's missing elements as 0", () => {
					const sum = addPos([2, 3, 4], [0, 1]);
					expect(sum).toHaveLength(3);
					expect(sum).toEqual([2, 4, 4]);
				});
			});

			describe('when a is shorter than b', () => {
				test('sum should be of length a, truncating extra elements from b', () => {
					const sum = addPos([3, 4], [0, 1, 2]);
					expect(sum).toHaveLength(2);
					expect(sum).toEqual([3, 5]);
				});
			});
		});

		describe('subPos(a, b)', () => {
			describe('when a & b are both the same length', () => {
				test('Vec2 - Vec2 should result in a Vec2 difference', () => {
					const a = new Vec2(...VEC2_A);
					const b = new Vec2(...VEC2_B);
					expect(subPos(a, b)).toEqualVec2(VEC2_DIFF);
					expect(Vec2.sub(a, b)).toEqualVec2(VEC2_DIFF);
				});

				test('Vec3 - Vec3 should result in a V3 difference', () => {
					const a = new Vec3(...VEC3_A);
					const b = new Vec3(...VEC3_B);
					expect(subPos(a, b)).toEqual(VEC3_DIFF);
					expect(Vec3.sub(a, b)).toEqual(VEC3_DIFF);
				});

				test('Vec4 - Vec4 should result in a V4 difference', () => {
					const a = new Vec4(...VEC4_A);
					const b = new Vec4(...VEC4_B);
					expect(subPos(a, b)).toEqual(VEC4_DIFF);
					expect(Vec4.sub(a, b)).toEqual(VEC4_DIFF);
				});
			});

			describe('when a is longer than b', () => {
				test("difference should be of length a, treating b's missing elements as 0", () => {
					const diff = subPos([2, 3, 4], [0, 1]);
					expect(diff).toHaveLength(3);
					expect(diff).toEqual([2, 2, 4]);
				});
			});

			describe('when a is shorter than b', () => {
				test('difference should be of length a, truncating extra elements from b', () => {
					const diff = subPos([3, 4], [0, 1, 2]);
					expect(diff).toHaveLength(2);
					expect(diff).toEqual([3, 3]);
				});
			});
		});

		describe('posEqual(a, b)', () => {
			test('equal returns true?', () => {
				const a = new Vec2(1, 2);
				const b = new Vec2(1, 2);
				expect(Vec2.equal(a, b)).toEqual(true);
				expect(a.equal(b)).toEqual(true);
			});

			test('equal returns false?', () => {
				const a = new Vec2(1, 2);
				const b = new Vec2(1, 3);
				expect(Vec2.equal(a, b)).toEqual(false);
				expect(a.equal(b)).toEqual(false);
			});

			test('should return true if both vectors are of equal length and have the same valued elements', () => {
				const isEqual = posEqual([1, 2, 3], [1, 2, 3]);
				expect(isEqual).toEqual(true);
			});
			test('should return true if both vectors are of equal length and shared values are within the epsilon margin of error', () => {
				const isEqual = posEqual([0.1 + 0.2, 2, 3], [0.3, 2, 3]);
				expect(isEqual).toEqual(true);
			});

			test('should return false if the vectors do not match', () => {
				const isEqual = posEqual([1, 2, 3], [1, 2, 4]);
				expect(isEqual).toEqual(false);
			});

			test('should return false if vector a is longer, even if the shared elements match', () => {
				const isEqual = posEqual([1, 2, 3], [1, 2]);
				expect(isEqual).toEqual(false);
			});

			test('should return false if vector b is longer, even if the shared elements match', () => {
				const isEqual = posEqual([1, 2], [1, 2, 3]);
				expect(isEqual).toEqual(false);
			});
		});
	});

	describe('Vector & Scalar', () => {
		describe('addScalar(p, s)', () => {
			test('should return a vector of equal length translated by a scalar', () => {
				const scaled = addScalar(new Vec2(1, 2), 5);
				expect(scaled).toHaveLength(2);
				expect(scaled).toEqual([6, 7]);
			});

			test('should return a vector of equal length translated by a scalar', () => {
				const scaled = addScalar([1, 2, 3], 5);
				expect(scaled).toHaveLength(3);
				expect(scaled).toEqual([6, 7, 8]);
			});
		});

		describe('scalePos(p, s)', () => {
			test('should return a vector of equal length scaled by a scalar', () => {
				const scaled = scalePos(new Vec2(1, 2), 5);
				expect(scaled).toHaveLength(2);
				expect(scaled).toEqual([5, 10]);
			});

			test('should return a vector of equal length scaled by a scalar', () => {
				const scaled = scalePos([1, 2, 3], 5);
				expect(scaled).toHaveLength(3);
				expect(scaled).toEqual([5, 10, 15]);
			});
		});

		describe('scale(v)', () => {
			test('should scale itself by scalar', () => {
				const v = new Vec2(1, 2);
				expect(v.scale(5)).toEqual([5, 10]);
				expect(v).toEqual([5, 10]);
			});
		});
	});
});

describe('Scalar operations', () => {
	describe('equal(a, b)', () => {
		test('should return true for equal scalars', () => {
			const isEqual = equal(10, 10);
			expect(isEqual).toEqual(true);
		});

		test('should return true for unequal scalars that have a difference lesser than the epsilon', () => {
			const isEqual = equal(0.1 + 0.2, 0.3);
			expect(isEqual).toEqual(true);
		});

		test('should return false for unequal scalars', () => {
			const isEqual = equal(10, 7);
			expect(isEqual).toEqual(false);
		});
	});
});

describe('Vector operations', () => {
	describe('Vector & Vector', () => {
		describe('addPos(a, b)', () => {
			describe('when a & b are both the same length', () => {
				test('V2 + V2 should result in a V2 sum', () => {
					const sum = addPos([4, 5], [0, 1]);
					expect(sum).toHaveLength(2);
					expect(sum).toEqual([4, 6]);
				});

				test('V3 + V3 should result in a V3 sum', () => {
					const sum = addPos([4, 5, 6], [0, 1, 2]);
					expect(sum).toHaveLength(3);
					expect(sum).toEqual([4, 6, 8]);
				});

				test('V4 + V4 should result in a V4 sum', () => {
					const sum = addPos([4, 5, 6, 7], [0, 1, 2, 3]);
					expect(sum).toHaveLength(4);
					expect(sum).toEqual([4, 6, 8, 10]);
				});
			});

			describe('when a is longer than b', () => {
				test("sum should be of length a, treating b's missing elements as 0", () => {
					const sum = addPos([2, 3, 4], [0, 1]);
					expect(sum).toHaveLength(3);
					expect(sum).toEqual([2, 4, 4]);
				});
			});

			describe('when a is shorter than b', () => {
				test('sum should be of length a, truncating extra elements from b', () => {
					const sum = addPos([3, 4], [0, 1, 2]);
					expect(sum).toHaveLength(2);
					expect(sum).toEqual([3, 5]);
				});
			});
		});

		describe('subPos(a, b)', () => {
			describe('when a & b are both the same length', () => {
				test('V2 - V2 should result in a V2 difference', () => {
					const diff = subPos([4, 5], [0, 1]);
					expect(diff).toHaveLength(2);
					expect(diff).toEqual([4, 4]);
				});

				test('V3 - V3 should result in a V3 difference', () => {
					const diff = subPos([4, 5, 6], [0, 1, 2]);
					expect(diff).toHaveLength(3);
					expect(diff).toEqual([4, 4, 4]);
				});

				test('V4 - V4 should result in a V4 difference', () => {
					const diff = subPos([4, 5, 6, 7], [0, 1, 2, 3]);
					expect(diff).toHaveLength(4);
					expect(diff).toEqual([4, 4, 4, 4]);
				});
			});

			describe('when a is longer than b', () => {
				test("difference should be of length a, treating b's missing elements as 0", () => {
					const diff = subPos([2, 3, 4], [0, 1]);
					expect(diff).toHaveLength(3);
					expect(diff).toEqual([2, 2, 4]);
				});
			});

			describe('when a is shorter than b', () => {
				test('difference should be of length a, truncating extra elements from b', () => {
					const diff = subPos([3, 4], [0, 1, 2]);
					expect(diff).toHaveLength(2);
					expect(diff).toEqual([3, 3]);
				});
			});
		});

		describe('posEqual(a, b)', () => {
			test('should return true if both vectors are of equal length and have the same valued elements', () => {
				const isEqual = posEqual([1, 2, 3], [1, 2, 3]);
				expect(isEqual).toEqual(true);
			});
			test('should return true if both vectors are of equal length and shared values are within the epsilon margin of error', () => {
				const isEqual = posEqual([0.1 + 0.2, 2, 3], [0.3, 2, 3]);
				expect(isEqual).toEqual(true);
			});

			test('should return false if the vectors do not match', () => {
				const isEqual = posEqual([1, 2, 3], [1, 2, 4]);
				expect(isEqual).toEqual(false);
			});

			test('should return false if vector a is longer, even if the shared elements match', () => {
				const isEqual = posEqual([1, 2, 3], [1, 2]);
				expect(isEqual).toEqual(false);
			});

			test('should return false if vector b is longer, even if the shared elements match', () => {
				const isEqual = posEqual([1, 2], [1, 2, 3]);
				expect(isEqual).toEqual(false);
			});
		});
	});

	describe('Vector & Scalar', () => {
		describe('addScalar(p, s)', () => {
			test('should return a vector of equal length translated by a scalar', () => {
				const scaled = addScalar([1, 2, 3], 5);
				expect(scaled).toHaveLength(3);
				expect(scaled).toEqual([6, 7, 8]);
			});
		});

		describe('scalePos(p, s)', () => {
			test('should return a vector of equal length scaled by a scalar', () => {
				const scaled = scalePos([1, 2, 3], 5);
				expect(scaled).toHaveLength(3);
				expect(scaled).toEqual([5, 10, 15]);
			});
		});
	});
});

describe('Vector type narrowing', () => {
	const v2 = [0, 1] as V2_T;
	const v3 = [0, 1, 2] as V3_T;
	const v4 = [0, 1, 2, 3] as V4_T;

	const vec2 = new Vec2(...VEC2_B);
	const vec3 = new Vec3(...VEC3_B);
	const vec4 = new Vec4(0, 1, 2);

	const funcs = [isVec2, isVec3, isVec4];

	funcs.forEach((func, i) => {
		describe(`${func.name}()`, () => {
			[v2, v3, v4].forEach((v, i) => {
				test(`V${2 + i} <${v.join(', ')}> should not pass ${
					func.name
				}()`, () => {
					expect(func(v)).toBeFalsy();
				});
			});

			[vec2, vec3, vec4].forEach((v, j) => {
				const shouldPass = i === j;
				const passStr = shouldPass ? 'should' : 'should not';
				test(`Vec${2 + j} ${passStr} pass ${func.name}()`, () => {
					expect(func(v)).toEqual(shouldPass);
				});
			});
		});
	});
});
