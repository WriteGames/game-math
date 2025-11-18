import { expect } from 'vitest';
import type { M2_T, Mat2, V2_T, V3_T, V4_T, Vec2, Vec3, Vec4 } from '../../.';
import { toChain } from './matchers/toChain';
import { toEqualMatrix } from './matchers/toEqualMatrix';
import { toEqualVector } from './matchers/toEqualVector';

expect.extend({
	toChain,
	toEqualMat2: toEqualMatrix,
	toEqualVec2: toEqualVector,
	toEqualVec3: toEqualVector,
	toEqualVec4: toEqualVector,
});

type OnlyIf<T, Type, Func> = T extends Type ? Func : never;

declare module 'vitest' {
	interface Assertion<T> {
		toChain: (callback: (v: T) => T) => void;
		toEqualMat2: OnlyIf<T, Mat2, (expected: Mat2 | M2_T) => void>;
		toEqualVec2: OnlyIf<T, Vec2, (expected: Vec2 | V2_T) => void>;
		toEqualVec3: OnlyIf<T, Vec3, (expected: Vec3 | V3_T) => void>;
		toEqualVec4: OnlyIf<T, Vec4, (expected: Vec4 | V4_T) => void>;
	}
}
