import { describe, expect, test } from 'vitest';
import {
	addPos,
	addScalar,
	approachVec,
	hashPos,
	isPointOnLine,
	isWithinBounds,
	length,
	lengthSq,
	posDistance,
	posDistanceSq,
	posEqual,
	scalePos,
	subPos,
	V2_T,
	Vec2,
	Vec3,
	Vec4,
	Quat,
} from '../src';

describe(`${addPos.name}()`, () => {
	test('should add vectors together', () => {
		expect(addPos([1, 2], [3, 4])).toEqualVec2([4, 6]);
		expect(addPos(new Vec2(1, 2), [3, 4])).toEqualVec2([4, 6]);
		expect(addPos(new Vec2(1, 2), new Vec2(3, 4))).toEqualVec2([4, 6]);
		expect(addPos([1, 2], new Vec2(3, 4))).toEqualVec2([4, 6]);

		expect(addPos([1, 2, 3], [3, 4])).toEqualVec3([4, 6, 3]);
	});
});

describe(`${addScalar.name}()`, () => {
	test('should add a scalar to each element in a vector', () => {
		const resultArr = addScalar([1, 2], 3);
		expect(resultArr).not.toBeInstanceOf(Vec2);
		expect(resultArr).not.toBeInstanceOf(Vec3);
		expect(resultArr).not.toBeInstanceOf(Vec4);
		expect(resultArr).not.toBeInstanceOf(Quat);
		expect(resultArr).toEqualVec2([4, 5]);

		const resultVec2 = addScalar(new Vec2(1, 2), 3);
		expect(resultVec2).toBeInstanceOf(Vec2);
		expect(resultVec2).toEqualVec2([4, 5]);

		const resultVec3 = addScalar(new Vec3(1, 2, 3), 3);
		expect(resultVec3).toBeInstanceOf(Vec3);
		expect(resultVec3).toEqualVec3([4, 5, 6]);

		const resultVec4 = addScalar(new Vec4(1, 2, 3, 4), 3);
		expect(resultVec4).toBeInstanceOf(Vec4);
		expect(resultVec4).toEqualVec4([4, 5, 6, 7]);

		const resultQuat = addScalar(new Quat(1, 2, 3, 4), 3);
		expect(resultQuat).toBeInstanceOf(Quat);
		expect(resultQuat).toEqualQuat([4, 5, 6, 7]);
	});
});

describe(`${approachVec.name}()`, () => {
	test('should approach a vector', () => {
		expect(approachVec([0, 0], [5, 5], [2, 2])).toEqualVec2([2, 2]);
	});

	test('should approach a vector of a smaller length', () => {
		expect(approachVec([0, 0, 0], [5, 5], [2, 2])).toEqualVec3([2, 2, 0]);
	});

	test('should approach a vector of a larger length', () => {
		expect(approachVec([0, 0], [5, 5, 5], [2, 2])).toEqualVec2([2, 2]);
	});
});

describe(`${hashPos.name}()`, () => {
	test('should hash a vector', () => {
		expect(hashPos([5, -5])).toEqual('5,-5');
		expect(hashPos(new Vec2(-5, 5))).toEqual('-5,5');

		expect(hashPos([-1, 2, -3])).toEqual('-1,2,-3');
		expect(hashPos(new Vec3(-1, 2, -3))).toEqual('-1,2,-3');

		expect(hashPos([-1, 2, -3, 4])).toEqual('-1,2,-3,4');
		expect(hashPos(new Vec4(-1, 2, -3, 4))).toEqual('-1,2,-3,4');
		expect(hashPos(new Quat(-1, 2, -3, 4))).toEqual('-1,2,-3,4');
	});
});

describe(`${isPointOnLine.name}()`, () => {
	test('should return true when a point is on a line', () => {
		expect(isPointOnLine([-1, -1], [-1, -1], [1, 1])).toEqual(true);
		expect(isPointOnLine([0, 0], [-1, -1], [1, 1])).toEqual(true);
		expect(isPointOnLine([1, 1], [-1, -1], [1, 1])).toEqual(true);
	});

	test('should return false when a point is not on a line', () => {
		expect(isPointOnLine([-2, -2], [-1, -1], [1, 1])).toEqual(false);
		expect(isPointOnLine([0, 5], [-1, -1], [1, 1])).toEqual(false);
		expect(isPointOnLine([2, 2], [-1, -1], [1, 1])).toEqual(false);
	});
});

describe(`${isWithinBounds.name}()`, () => {
	const start: V2_T = [-10, -10];
	const end: V2_T = [10, 10];
	test('should return true when a point is within bounds', () => {
		expect(isWithinBounds([0, 0], start, end)).toEqual(true);

		// inclusive start
		expect(isWithinBounds(start, start, end)).toEqual(true);
	});

	test('should return true when a point is within bounds', () => {
		expect(isWithinBounds([0, 100], start, end)).toEqual(false);
		expect(isWithinBounds([100, 100], start, end)).toEqual(false);
		expect(isWithinBounds([100, 0], start, end)).toEqual(false);

		// exclusive end
		expect(isWithinBounds(end, start, end)).toEqual(false);
	});
});

describe(`${length.name}()`, () => {
	test('should compute the length of a vector', () => {
		expect(length([3, 4])).toEqual(5);
		expect(length(new Vec2(3, 4))).toEqual(5);
		expect(length([3, 4, 12])).toEqual(13);
		expect(length(new Vec3(3, 4, 12))).toEqual(13);
		expect(length([1, 2, 2, 4])).toEqual(5);
		expect(length(new Vec4(1, 2, 2, 4))).toEqual(5);
	});
});

describe(`${lengthSq.name}()`, () => {
	test('should compute the length of a vector, squared', () => {
		expect(lengthSq([3, 4])).toEqual(25);
		expect(lengthSq(new Vec2(3, 4))).toEqual(25);
		expect(lengthSq([3, 4, 12])).toEqual(169);
		expect(lengthSq(new Vec3(3, 4, 12))).toEqual(169);
		expect(lengthSq([1, 2, 2, 4])).toEqual(25);
		expect(lengthSq(new Vec4(1, 2, 2, 4))).toEqual(25);
		expect(lengthSq(new Quat(1, 2, 2, 4))).toEqual(25);
	});
});

describe(`${posDistance.name}()`, () => {
	test('should find the distance between two vectors', () => {
		const a: V2_T = [-1, -1];
		const b: V2_T = [2, 3];
		expect(posDistance(a, b)).toEqual(5);
	});
});

describe(`${posDistanceSq.name}()`, () => {
	test('should find the distance between two vectors, squared', () => {
		const a: V2_T = [-1, -1];
		const b: V2_T = [2, 3];
		expect(posDistanceSq(a, b)).toEqual(25);
	});
});

describe(`${posEqual.name}()`, () => {
	test('should match equal vectors', () => {
		const a1 = [5, 5];
		const a2 = [5, 5];
		const b1 = new Vec2(5, 5);
		const b2 = new Vec2(5, 5);
		expect(posEqual(a1, a2)).toEqual(true);
		expect(posEqual(b1, b2)).toEqual(true);
		expect(posEqual(a1, b2)).toEqual(true);
	});

	test('should not match non-equal vectors', () => {
		const a1 = [5, 5];
		const a2 = [0, 0];
		const b1 = new Vec2(5, 5);
		const b2 = new Vec2(0, 0);
		expect(posEqual(a1, a2)).toEqual(false);
		expect(posEqual(b1, b2)).toEqual(false);
		expect(posEqual(a1, b2)).toEqual(false);
	});
});

describe(`${scalePos.name}()`, () => {
	test('should scale a vector', () => {
		const resultArr = scalePos([3, 4], 5);
		expect(resultArr).not.toBeInstanceOf(Vec2);
		expect(resultArr).not.toBeInstanceOf(Vec3);
		expect(resultArr).not.toBeInstanceOf(Vec4);
		expect(resultArr).not.toBeInstanceOf(Quat);
		expect(resultArr).toEqualVec2([15, 20]);

		const resultVec2 = scalePos(new Vec2(3, 4), 5);
		expect(resultVec2).toBeInstanceOf(Vec2);
		expect(resultVec2).toEqualVec2([15, 20]);

		const resultVec3 = scalePos(new Vec3(3, 4, 5), 5);
		expect(resultVec3).toBeInstanceOf(Vec3);
		expect(resultVec3).toEqualVec3([15, 20, 25]);

		const resultVec4 = scalePos(new Vec4(3, 4, 5, 6), 5);
		expect(resultVec4).toBeInstanceOf(Vec4);
		expect(resultVec4).toEqualVec4([15, 20, 25, 30]);

		const resultQuat = scalePos(new Quat(3, 4, 5, 6), 5);
		expect(resultQuat).toBeInstanceOf(Quat);
		expect(resultQuat).toEqualQuat([15, 20, 25, 30]);
	});
});

describe(`${subPos.name}()`, () => {
	test('should subtract vectors', () => {
		expect(subPos([1, 2], [3, 4])).toEqualVec2([-2, -2]);
		expect(subPos(new Vec2(1, 2), [3, 4])).toEqualVec2([-2, -2]);
		expect(subPos(new Vec2(1, 2), new Vec2(3, 4))).toEqualVec2([-2, -2]);
		expect(subPos([1, 2], new Vec2(3, 4))).toEqualVec2([-2, -2]);

		expect(subPos([1, 2, 3], [3, 4])).toEqualVec3([-2, -2, 3]);
	});
});
