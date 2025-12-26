import { describe, expect, test } from 'vitest';
import {
	addVec,
	addScalar,
	isVec2,
	isVec3,
	isVec4,
	vecEqual,
	scaleVec,
	subVec,
	Vec2,
	Vec3,
	Vec4,
	type V2_T,
	type V3_T,
	type V4_T,
} from '../../src/linear-algebra/index';
import { equal } from '../../src/util/index';
import {
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
} from '../data.mock';

describe('(Vec) Vector operations', () => {
	describe('Vector & Vector', () => {
		describe('addPos(a, b)', () => {
			describe('when a & b are both the same length', () => {
				test('Vec2 + Vec2 should result in a Vec2 sum', () => {
					const a = new Vec2(...VEC2_A);
					const b = new Vec2(...VEC2_B);
					expect(addVec(a, b)).toEqualVec2(VEC2_SUM);
					expect(Vec2.add(a, b)).toEqualVec2(VEC2_SUM);
				});

				test('Vec3 + Vec3 should result in a Vec3 sum', () => {
					const a = new Vec3(...VEC3_A);
					const b = new Vec3(...VEC3_B);
					expect(addVec(a, b)).toEqual(VEC3_SUM);
					expect(Vec3.add(a, b)).toEqual(VEC3_SUM);
				});

				test('Vec4 + Vec4 should result in a Vec4 sum', () => {
					const a = new Vec4(...VEC4_A);
					const b = new Vec4(...VEC4_B);
					expect(addVec(a, b)).toEqual(VEC4_SUM);
					expect(Vec4.add(a, b)).toEqual(VEC4_SUM);
				});
			});

			describe('when a is longer than b', () => {
				test("sum should be of length a, treating b's missing elements as 0", () => {
					const sum = addVec([2, 3, 4], [0, 1]);
					expect(sum).toHaveLength(3);
					expect(sum).toEqual([2, 4, 4]);
				});
			});

			describe('when a is shorter than b', () => {
				test('sum should be of length a, truncating extra elements from b', () => {
					const sum = addVec([3, 4], [0, 1, 2]);
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
					expect(subVec(a, b)).toEqualVec2(VEC2_DIFF);
					expect(Vec2.sub(a, b)).toEqualVec2(VEC2_DIFF);
				});

				test('Vec3 - Vec3 should result in a V3 difference', () => {
					const a = new Vec3(...VEC3_A);
					const b = new Vec3(...VEC3_B);
					expect(subVec(a, b)).toEqual(VEC3_DIFF);
					expect(Vec3.sub(a, b)).toEqual(VEC3_DIFF);
				});

				test('Vec4 - Vec4 should result in a V4 difference', () => {
					const a = new Vec4(...VEC4_A);
					const b = new Vec4(...VEC4_B);
					expect(subVec(a, b)).toEqual(VEC4_DIFF);
					expect(Vec4.sub(a, b)).toEqual(VEC4_DIFF);
				});
			});

			describe('when a is longer than b', () => {
				test("difference should be of length a, treating b's missing elements as 0", () => {
					const diff = subVec([2, 3, 4], [0, 1]);
					expect(diff).toHaveLength(3);
					expect(diff).toEqual([2, 2, 4]);
				});
			});

			describe('when a is shorter than b', () => {
				test('difference should be of length a, truncating extra elements from b', () => {
					const diff = subVec([3, 4], [0, 1, 2]);
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
				const isEqual = vecEqual([1, 2, 3], [1, 2, 3]);
				expect(isEqual).toEqual(true);
			});
			test('should return true if both vectors are of equal length and shared values are within the epsilon margin of error', () => {
				const isEqual = vecEqual([0.1 + 0.2, 2, 3], [0.3, 2, 3]);
				expect(isEqual).toEqual(true);
			});

			test('should return false if the vectors do not match', () => {
				const isEqual = vecEqual([1, 2, 3], [1, 2, 4]);
				expect(isEqual).toEqual(false);
			});

			test('should return false if vector a is longer, even if the shared elements match', () => {
				const isEqual = vecEqual([1, 2, 3], [1, 2]);
				expect(isEqual).toEqual(false);
			});

			test('should return false if vector b is longer, even if the shared elements match', () => {
				const isEqual = vecEqual([1, 2], [1, 2, 3]);
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
				const scaled = scaleVec(new Vec2(1, 2), 5);
				expect(scaled).toHaveLength(2);
				expect(scaled).toEqual([5, 10]);
			});

			test('should return a vector of equal length scaled by a scalar', () => {
				const scaled = scaleVec([1, 2, 3], 5);
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
					const sum = addVec([4, 5], [0, 1]);
					expect(sum).toHaveLength(2);
					expect(sum).toEqual([4, 6]);
				});

				test('V3 + V3 should result in a V3 sum', () => {
					const sum = addVec([4, 5, 6], [0, 1, 2]);
					expect(sum).toHaveLength(3);
					expect(sum).toEqual([4, 6, 8]);
				});

				test('V4 + V4 should result in a V4 sum', () => {
					const sum = addVec([4, 5, 6, 7], [0, 1, 2, 3]);
					expect(sum).toHaveLength(4);
					expect(sum).toEqual([4, 6, 8, 10]);
				});
			});

			describe('when a is longer than b', () => {
				test("sum should be of length a, treating b's missing elements as 0", () => {
					const sum = addVec([2, 3, 4], [0, 1]);
					expect(sum).toHaveLength(3);
					expect(sum).toEqual([2, 4, 4]);
				});
			});

			describe('when a is shorter than b', () => {
				test('sum should be of length a, truncating extra elements from b', () => {
					const sum = addVec([3, 4], [0, 1, 2]);
					expect(sum).toHaveLength(2);
					expect(sum).toEqual([3, 5]);
				});
			});
		});

		describe('subPos(a, b)', () => {
			describe('when a & b are both the same length', () => {
				test('V2 - V2 should result in a V2 difference', () => {
					const diff = subVec([4, 5], [0, 1]);
					expect(diff).toHaveLength(2);
					expect(diff).toEqual([4, 4]);
				});

				test('V3 - V3 should result in a V3 difference', () => {
					const diff = subVec([4, 5, 6], [0, 1, 2]);
					expect(diff).toHaveLength(3);
					expect(diff).toEqual([4, 4, 4]);
				});

				test('V4 - V4 should result in a V4 difference', () => {
					const diff = subVec([4, 5, 6, 7], [0, 1, 2, 3]);
					expect(diff).toHaveLength(4);
					expect(diff).toEqual([4, 4, 4, 4]);
				});
			});

			describe('when a is longer than b', () => {
				test("difference should be of length a, treating b's missing elements as 0", () => {
					const diff = subVec([2, 3, 4], [0, 1]);
					expect(diff).toHaveLength(3);
					expect(diff).toEqual([2, 2, 4]);
				});
			});

			describe('when a is shorter than b', () => {
				test('difference should be of length a, truncating extra elements from b', () => {
					const diff = subVec([3, 4], [0, 1, 2]);
					expect(diff).toHaveLength(2);
					expect(diff).toEqual([3, 3]);
				});
			});
		});

		describe('posEqual(a, b)', () => {
			test('should return true if both vectors are of equal length and have the same valued elements', () => {
				const isEqual = vecEqual([1, 2, 3], [1, 2, 3]);
				expect(isEqual).toEqual(true);
			});
			test('should return true if both vectors are of equal length and shared values are within the epsilon margin of error', () => {
				const isEqual = vecEqual([0.1 + 0.2, 2, 3], [0.3, 2, 3]);
				expect(isEqual).toEqual(true);
			});

			test('should return false if the vectors do not match', () => {
				const isEqual = vecEqual([1, 2, 3], [1, 2, 4]);
				expect(isEqual).toEqual(false);
			});

			test('should return false if vector a is longer, even if the shared elements match', () => {
				const isEqual = vecEqual([1, 2, 3], [1, 2]);
				expect(isEqual).toEqual(false);
			});

			test('should return false if vector b is longer, even if the shared elements match', () => {
				const isEqual = vecEqual([1, 2], [1, 2, 3]);
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
				const scaled = scaleVec([1, 2, 3], 5);
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
