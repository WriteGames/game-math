import { isVec2, Vec2 } from './vec2';
import { isVec3, Vec3 } from './vec3';

// TYPE(bret): Find a home for these
export type V2_T = [x: number, y: number];
export type V3_T = [x: number, y: number, z: number];
export type V4_T = [x: number, y: number, z: number, w: number];

export type Vector_T =
	| V2_T
	| Readonly<V2_T>
	| V3_T
	| Readonly<V3_T>
	| V4_T
	| Readonly<V4_T>;

export type Vector = Vector_T | Vec2 | Vec3;

export const V2 = Object.defineProperties(
	{},
	{
		zero: {
			value: [0, 0] as V2_T,
			writable: false,
		},
		one: {
			value: [1, 1] as V2_T,
			writable: false,
		},
	},
) as {
	zero: V2_T;
	one: V2_T;
};

export type FuncMapVector<T extends Vector = Vector> = <
	V extends T,
	A extends V,
	B extends V,
>(
	a: A,
	b: B,
) => A;

export type FuncCompare<T> = (a: T, b: T) => boolean;

export type FuncMapVectorByScalar = <T extends Vector>(p: T, s: number) => T;

export type FuncReduceVector<T extends Vector = Vector> = (
	a: T,
	b: T,
) => number;

export const hashPos = (pos: Vector): string => pos.join(',');

export const addPos: FuncMapVector = (a, b) => {
	return a.map((v, i) => v + (b[i] ?? 0)) as typeof a;
};

export const addScalar: FuncMapVectorByScalar = (p, s) => {
	const sums = p.map((v) => v + s);
	if (isVec2(p)) return new Vec2(...sums) as typeof p;
	if (isVec3(p)) return new Vec3(...sums) as typeof p;
	return sums as typeof p;
};

export const scalePos: FuncMapVectorByScalar = (p, s) => {
	const scaled = p.map((v) => v * s);
	if (isVec2(p)) return new Vec2(...scaled) as typeof p;
	if (isVec3(p)) return new Vec3(...scaled) as typeof p;
	return scaled as typeof p;
};

export const subPos: FuncMapVector = (a, b) => {
	return a.map((v, i) => v - (b[i] ?? 0)) as typeof a;
};

export const equal: FuncCompare<number> = (a, b) => {
	return Math.abs(a - b) < Number.EPSILON;
};

export const posEqual: FuncCompare<Vector> = (a, b) => {
	const aa = [...a];
	const bb = [...b];
	return aa.length === bb.length && aa.every((v, i) => equal(v, bb[i]));
};
