import { expect } from 'vitest';

import {
	Mat2Like,
	Mat3Like,
	Mat4Like,
	QuatLike,
	Vec2Like,
	Vec3Like,
	Vec4Like,
} from '../../src';
import { toChain } from './matchers/toChain';
import { toEqualMatrix } from './matchers/toEqualMatrix';
import { toEqualVector } from './matchers/toEqualVector';

expect.extend({
	toChain,
	toEqualMat2: toEqualMatrix,
	toEqualMat3: toEqualMatrix,
	toEqualMat4: toEqualMatrix,
	toEqualVec2: toEqualVector,
	toEqualVec3: toEqualVector,
	toEqualVec4: toEqualVector,
	toEqualQuat: toEqualVector,
});

type OnlyIf<T, Type, Func> = T extends Type ? Func : never;

declare module 'vitest' {
	interface Assertion<T> {
		toChain: (callback: (v: T) => T) => void;
		toEqualMat2: OnlyIf<T, Mat2Like, (expected: Mat2Like) => void>;
		toEqualMat3: OnlyIf<T, Mat3Like, (expected: Mat3Like) => void>;
		toEqualMat4: OnlyIf<T, Mat4Like, (expected: Mat4Like) => void>;
		toEqualVec2: OnlyIf<T, Vec2Like, (expected: Vec2Like) => void>;
		toEqualVec3: OnlyIf<T, Vec3Like, (expected: Vec3Like) => void>;
		toEqualVec4: OnlyIf<T, Vec4Like, (expected: Vec4Like) => void>;
		toEqualQuat: OnlyIf<T, QuatLike, (expected: QuatLike) => void>;
	}
}
