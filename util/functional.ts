import type { Vector } from '../vectors/index.js';

export type FuncReduceNumber = (acc: number, v: number) => number;
export type FuncMapVector<
	T extends Vector = Vector,
	AT extends T = T,
	BT extends T = T,
> = <A extends AT, B extends BT>(a: A, b: B) => A;
export type FuncTernaryVector<
	T extends Vector = Vector,
	AT extends T = T,
	BT extends T = T,
	CT extends T = T,
> = <A extends AT, B extends BT, C extends CT>(a: A, b: B, c: C) => A;

export type FuncCompare<T> = (a: T, b: T) => boolean;

export type FuncMapVectorByScalar = <T extends Vector>(p: T, s: number) => T;

export type FuncReduceVector<T extends Vector = Vector> = (
	a: T,
	b: T,
) => number;

/**
 * Predicate function for Array.prototype.reduce() that sums all values together
 * @param acc Accumulator
 * @param v Next value
 * @returns Sum
 */
export const reduceSum: FuncReduceNumber = (acc, v) => acc + v;

/**
 * Predicate function for Array.prototype.reduce() that multiplies all values together
 * @param acc Accumulator
 * @param v Next value
 * @returns Product
 */
export const reduceProduct: FuncReduceNumber = (acc, v) => acc * v;
