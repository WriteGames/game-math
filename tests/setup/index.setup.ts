import { expect } from 'vitest';
import type { V2_T, V3_T, V4_T, Vec2, Vec3, Vec4 } from '../../.';
import { toEqualVector } from './matchers/toEqualVector';
import { toChain } from './matchers/toChain';

expect.extend({
	toChain,
	toEqualVec2: toEqualVector,
	toEqualVec3: toEqualVector,
	toEqualVec4: toEqualVector,
});

type OnlyIf<T, Type, Func> = T extends Type ? Func : never;

declare module 'vitest' {
	interface Assertion<T> {
		toChain: (callback: (v: T) => T) => void;
		toEqualVec2: OnlyIf<T, Vec2, (expected: Vec2 | V2_T) => void>;
		toEqualVec3: OnlyIf<T, Vec3, (expected: Vec3 | V3_T) => void>;
		toEqualVec4: OnlyIf<T, Vec4, (expected: Vec4 | V4_T) => void>;
	}
}
