import { describe, expect, test } from 'vitest';
// @ts-ignore -- chi-squared has no types
import chiSquared from 'chi-squared';
// @ts-ignore -- chi-squared has no types
import pRank from 'permutation-rank';
import { Random } from '../util/random';
import { Vec2, Vec3 } from '../vectors';
import { RAD_TO_DEG } from '../util';

const sampleCount = 1000;

function getXForChi(observed: number, expected: number): number {
	return (observed - expected) ** 2 / expected;
}

function testRandom({
	samples,
	bCount,
	expected = Array.from({ length: bCount }, () => samples / bCount),
	callback,
}: {
	samples: number;
	bCount: number;
	expected?: number[];
	callback: (bCount: number) => [number, number];
}) {
	function iteration() {
		const buckets = Array.from({ length: bCount }, () => 0);
		let values: number[] = [];
		for (let i = 0; i < samples; ++i) {
			const [value, bIndex] = callback(bCount);
			values.push(value);
			++buckets[bIndex];
		}

		let xx = 0;
		for (let i = 0; i < bCount; ++i) {
			xx += getXForChi(buckets[i], expected[i]);
		}
		const pValue = 1 - chiSquared.cdf(xx, bCount - 1);

		if (values.every((v) => typeof v === 'number')) {
			const min = Math.min(...values);
			const max = Math.max(...values);

			const sum = values.reduce((a, v) => a + v);
			const mean = sum / values.length;
			return { min, max, mean, pValue };
		}
		return { pValue };
	}

	const means: number[] = [];
	const result = {
		min: undefined,
		max: undefined,
		mean: undefined,
		pValue: 0,
	} as { min?: number; max?: number; mean?: number; pValue: number };

	const numTrials = 10;
	for (let i = 0; i < numTrials; ++i) {
		const { min, max, mean, pValue } = iteration();

		if (min !== undefined) result.min = Math.min(result.min ?? min, min);
		if (max !== undefined) result.max = Math.max(result.max ?? max, max);
		if (mean) means.push(mean);

		result.pValue = Math.max(result.pValue, pValue);
	}

	if (means.length) {
		result.mean = means.reduce((a, v) => a + v) / means.length;
	}

	return result;
}

describe('class Random', () => {
	describe('constructor', () => {
		test('should default seed to current time when no argument is passed', () => {
			const { seed } = new Random();
			expect(seed).toBeGreaterThan(Date.now() - 10);
			expect(seed).toBeLessThan(Date.now() + 10);
		});

		test('should default seed to first argument', () => {
			const { seed } = new Random(100);
			expect(seed).toEqual(100);
		});
	});

	describe('supplying custom generator function', () => {
		const mockRandomFunc = (seed: number) => seed;

		test.afterEach(() => {
			Random.resetDefaultGenerator();
		});

		test(`.prototype.${Random.prototype.setGenerator.name}() should set the random generator's random function`, () => {
			const seed = Date.now() >>> 0;
			const random = new Random(seed);
			random.setGenerator(mockRandomFunc);
			for (let i = 0; i < 100; ++i) {
				const v = random.float();
				expect(v).toBeGreaterThanOrEqual(0);
				expect(v).toBeLessThan(1);
				expect(random.seed).toEqual(seed);
			}
		});

		test(`.${Random.setDefaultGenerator.name}() should set the default random function`, () => {
			const seed = Date.now() >>> 0;
			Random.setDefaultGenerator(mockRandomFunc);
			const random = new Random(seed);
			for (let i = 0; i < 100; ++i) {
				const v = random.float();
				expect(v).toBeGreaterThanOrEqual(0);
				expect(v).toBeLessThan(1);
				expect(random.seed).toEqual(seed);
			}
		});

		test(`.${Random.resetDefaultGenerator.name}() should reset the default random function`, () => {
			const seed = Date.now() >>> 0;
			Random.setDefaultGenerator(mockRandomFunc);
			Random.resetDefaultGenerator();
			const random = new Random(seed);
			for (let i = 0; i < 100; ++i) {
				const v = random.float();
				expect(v).toBeGreaterThanOrEqual(0);
				expect(v).toBeLessThan(1);
				expect(random.seed).not.toEqual(seed);
			}
		});

		test(`.${Random.setDefaultGenerator.name}() should set the global Random instance's random function`, () => {
			const seed = Date.now() >>> 0;
			Random.staticRandom.seed = seed;
			Random.setDefaultGenerator(mockRandomFunc);
			for (let i = 0; i < 100; ++i) {
				const v = Random.float();
				expect(v).toBeGreaterThanOrEqual(0);
				expect(v).toBeLessThan(1);
				expect(Random.staticRandom.seed).toEqual(seed);
			}
		});

		test(`.${Random.setDefaultGenerator.name}() should not affect existing Random instances`, () => {
			const seed = Date.now() >>> 0;
			const random = new Random(seed);
			Random.setDefaultGenerator(mockRandomFunc);
			for (let i = 0; i < 100; ++i) {
				const v = random.float();
				expect(v).toBeGreaterThanOrEqual(0);
				expect(v).toBeLessThan(1);
				expect(random.seed).not.toEqual(seed);
			}
		});
	});

	describe('.prototype', () => {
		const random = new Random();

		describe(`${Random.prototype.float.name}()`, () => {
			test('should return a random float between [0, 1) when no argument is passed', () => {
				const samples = sampleCount;
				const bCount = 10;

				const { pValue, min, max, mean } = testRandom({
					samples,
					bCount,
					callback: (bCount: number) => {
						const value = random.float();
						return [value, Math.floor(value * bCount)];
					},
				});

				expect(min).toBeGreaterThanOrEqual(0);
				expect(min).toBeLessThan(0.1);
				expect(max).toBeGreaterThan(0.9);
				expect(max).toBeLessThan(1);

				expect(mean).approximately(0.5, 0.045);
				expect(pValue).toBeGreaterThanOrEqual(0.045);
			});

			test('should return a random float between [0, n) when an argument is passed', () => {
				const samples = sampleCount;
				const bCount = 10;

				const n = 10;
				const { pValue, min, max, mean } = testRandom({
					samples,
					bCount,
					callback: (bCount: number) => {
						const value = random.float(n);
						return [value, Math.floor((value / n) * bCount)];
					},
				});

				expect(min).toBeGreaterThanOrEqual(0);
				expect(min).toBeLessThan(0.1);
				expect(max).toBeGreaterThan(n - 0.1);
				expect(max).toBeLessThan(n);

				expect(mean).approximately(5, 0.25);
				expect(pValue).toBeGreaterThanOrEqual(0.045);
			});
		});

		describe(`${Random.prototype.chance.name}()`, () => {
			test('should return a boolean for chance', () => {
				const value = random.chance(1, 10);
				expect(value).toBeTypeOf('boolean');
			});

			test('should have even distribution', () => {
				const chances = 5;
				for (let n = 1; n < chances; ++n) {
					const samples = sampleCount;
					const { mean, pValue } = testRandom({
						samples,
						bCount: 2,
						expected: [
							((chances - n) / chances) * samples,
							(n / chances) * samples,
						],
						callback: () => {
							const value = random.chance(n, chances);
							return [+value, +value];
						},
					});

					expect(mean).approximately(n / chances, 0.045);
					expect(pValue).toBeGreaterThanOrEqual(0.045);
				}
			});

			test('should not error on division by zero', () => {
				expect(random.chance(1, 0)).toBeFalsy();
			});

			test('should not ever return true for 0 / n chance', () => {
				for (let i = 0; i < 100; ++i) {
					expect(random.chance(0, 5)).toBeFalsy();
				}
			});

			test('should always return true for n / n chance', () => {
				for (let i = 0; i < 100; ++i) {
					expect(random.chance(5, 5)).toBeTruthy();
				}
			});
		});

		describe(`${Random.prototype.int.name}()`, () => {
			test('should return a random int between [0, n)', () => {
				const samples = sampleCount;
				const n = 13;

				const { pValue, min, max, mean } = testRandom({
					samples,
					bCount: n,
					callback: () => {
						const value = random.int(n);

						return [value, value];
					},
				});

				expect(min).toEqual(0);
				expect(max).toEqual(n - 1);

				expect(mean).approximately(6, 0.3);
				expect(pValue).toBeGreaterThanOrEqual(0.045);
			});
		});

		describe(`${Random.prototype.range.name}()`, () => {
			test('should return a random float between [a, b)', () => {
				const samples = sampleCount;
				const bCount = 10;

				const a = -3;
				const b = 7;
				const n = Math.abs(b - a);
				const { pValue, min, max, mean } = testRandom({
					samples,
					bCount,
					callback: (bCount: number) => {
						const value = random.range(a, b);

						return [value, Math.floor(((value - a) / n) * bCount)];
					},
				});

				expect(min).toBeGreaterThanOrEqual(a);
				expect(min).toBeLessThan(a + 0.1);
				expect(max).toBeGreaterThan(b - 0.1);
				expect(max).toBeLessThan(b);

				expect(mean).approximately(2, 0.25);
				expect(pValue).toBeGreaterThanOrEqual(0.045);
			});
		});

		describe(`${Random.prototype.bool.name}()`, () => {
			test('should return either true or false', () => {
				const samples = sampleCount;
				const { mean, pValue } = testRandom({
					samples,
					bCount: 2,
					callback: () => {
						const value = random.bool();
						return [+value, +value];
					},
				});

				expect(mean).approximately(0.5, 0.045);
				expect(pValue).toBeGreaterThanOrEqual(0.045);
			});
		});

		describe(`${Random.prototype.sign.name}()`, () => {
			test('should only return either 1 or -1', () => {
				for (let i = 0; i < 100; ++i) {
					const value = random.sign();
					expect(Math.abs(value)).toEqual(1);
				}
			});

			test('should have even distribution', () => {
				const samples = sampleCount;
				const { min, max, mean, pValue } = testRandom({
					samples,
					bCount: 2,
					callback: () => {
						const value = random.sign();
						return [value, (value + 1) / 2];
					},
				});

				expect(min).toEqual(-1);
				expect(max).toEqual(1);

				expect(mean).approximately(0, 0.1);
				expect(pValue).toBeGreaterThanOrEqual(0.045);
			});
		});

		describe(`${Random.prototype.angle.name}()`, () => {
			test('should return an angle between [0, 360)', () => {
				const samples = sampleCount;
				const bCount = 360;

				const { pValue, min, max, mean } = testRandom({
					samples,
					bCount,
					callback: (bCount: number) => {
						const value = random.angle();
						return [value, Math.floor((value / 360) * bCount)];
					},
				});

				expect(min).toBeGreaterThanOrEqual(0);
				expect(min).toBeLessThan(5);
				expect(max).toBeGreaterThan(360 - 5);
				expect(max).toBeLessThan(360);

				expect(mean).approximately(180, 5);
				expect(pValue).toBeGreaterThanOrEqual(0.045);
			});
		});

		describe(`${Random.prototype.choose.name}()`, () => {
			test('should choose a random item from input array of numbers', () => {
				const samples = sampleCount;
				const bCount = 4;

				const choices = [0, 1, 2, 3];

				const { pValue, min, max, mean } = testRandom({
					samples,
					bCount,
					callback: () => {
						const value = random.choose(choices);
						return [value, value];
					},
				});

				expect(min).toEqual(0);
				expect(max).toEqual(3);

				expect(mean).approximately(1.5, 0.1);
				expect(pValue).toBeGreaterThanOrEqual(0.045);
			});

			test('should choose a random item from input array of any type', () => {
				const samples = sampleCount;
				const bCount = 4;

				const choices = ['boo', true, null, 30];

				const { pValue, min, max, mean } = testRandom({
					samples,
					bCount,
					callback: () => {
						const value = random.choose(choices);
						const index = choices.indexOf(value);
						return [index, index];
					},
				});

				expect(min).toEqual(0);
				expect(max).toEqual(3);

				expect(mean).approximately(1.5, 0.1);
				expect(pValue).toBeGreaterThanOrEqual(0.045);
			});
		});

		describe(`${Random.prototype.shuffle.name}()`, () => {
			test('should return the passed array', () => {
				const arr = [0, 1];
				expect(random.shuffle(arr)).toBe(arr);
			});

			test('should handle an array of length zero', () => {
				const arr: number[] = [];
				expect(random.shuffle(arr)).toEqual([]);
			});

			test('should shuffle array', () => {
				const samples = sampleCount;
				const arr = [0, 1, 2, 3];
				const nPermutations = 24;

				const { pValue, min, max, mean } = testRandom({
					samples,
					bCount: nPermutations,
					callback: () => {
						const a = [...arr];
						random.shuffle(a);
						const rank = pRank.rank(a);
						return [rank, rank];
					},
				});

				expect(min).toEqual(0);
				expect(max).toEqual(23);

				expect(mean).approximately(11.5, 0.5);
				expect(pValue).toBeGreaterThanOrEqual(0.045);
			});
		});

		describe(`${Random.prototype.vec2.name}()`, () => {
			test('should return a Vec2', () => {
				expect(random.vec2()).toBeInstanceOf(Vec2);
			});

			test('should return a Vec2 of length 1 when no argument is provided', () => {
				expect(random.vec2().magnitude).toBeCloseTo(1);
			});

			test('should return a Vec2 of the passed scale', () => {
				const scale = 7.7;
				expect(random.vec2(scale).magnitude).toBeCloseTo(scale);
			});

			test('should have a uniform sample distribution', () => {
				const samples = sampleCount;
				const bCount = 36;

				const { pValue, min, max, mean } = testRandom({
					samples,
					bCount,
					callback: () => {
						const v = random.vec2();
						const rad = Math.atan2(v.y, v.x);
						const angle = Math.floor(rad * RAD_TO_DEG);
						return [
							angle,
							Math.floor(angle / (360 / bCount)) + bCount / 2,
						];
					},
				});

				expect(min).toEqual(-180);
				expect(max).toEqual(179);

				expect(mean).approximately(0, 3);
				expect(pValue).toBeGreaterThanOrEqual(0.045);
			});
		});

		describe(`${Random.prototype.vec3.name}()`, () => {
			test('should return a Vec3', () => {
				expect(random.vec3()).toBeInstanceOf(Vec3);
			});

			test('should return a Vec3 of length 1 when no argument is provided', () => {
				expect(random.vec3().magnitude).toBeCloseTo(1);
			});

			test('should return a Vec3 of the passed scale', () => {
				const scale = 7.7;
				expect(random.vec3(scale).magnitude).toBeCloseTo(scale);
			});

			test('should have a uniform sample distribution', () => {
				const samples = sampleCount * 3;

				const points: Vec3[] = [];
				for (let i = 0; i < samples; ++i) {
					points.push(random.vec3());
				}

				(['x', 'y', 'z'] as const).forEach((prop) => {
					const values = points.map((p) => p[prop]);
					const min = Math.min(...values);
					const max = Math.max(...values);
					const mean = values.reduce((a, v) => a + v) / values.length;

					expect(min).approximately(-1, 0.05);
					expect(max).approximately(1, 0.05);
					expect(mean).approximately(0, 0.05);
				});

				const neighbors = Array.from({ length: samples }, () => 0);
				for (let i = 0; i < samples; ++i) {
					const a = points[i];
					for (let j = i + 1; j < samples; ++j) {
						const b = points[j];
						const d = Math.sqrt(
							(a[0] - b[0]) ** 2 +
								(a[1] - b[1]) ** 2 +
								(a[2] - b[2]) ** 2,
						);
						if (d < 1) {
							++neighbors[i];
							++neighbors[j];
						}
					}
				}

				const mean =
					neighbors.reduce((a, v) => a + v) / neighbors.length;

				expect(mean).approximately(samples / 4, samples / 200);
			});
		});
	});
});
