/**
 * Predicate function for Array.prototype.reduce() that multiplies all values together
 * @param acc Accumulator
 * @param v Next value
 * @returns Product
 */
export function reduceProduct(acc: number, v: number): number {
	return acc * v;
}

/**
 * Predicate function for Array.prototype.reduce() that sums all values together
 * @param acc Accumulator
 * @param v Next value
 * @returns Sum
 */
export function reduceSum(acc: number, v: number): number {
	return acc + v;
}
