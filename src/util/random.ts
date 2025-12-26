import { Vec2, Vec3, Vec4 } from '../linear-algebra';

function xorShift32(seed: number): number {
	let x = seed;
	x ^= x << 13;
	x ^= x >>> 17;
	x ^= x << 5;
	return x >>> 0;
}

type RandomFunc = typeof xorShift32;

export interface Random {
	/** RNG seed */
	seed: number;
}

let globalRandomFunc = xorShift32;

/**
 * @category Random
 */
export class Random {
	/**
	 * @group Static
	 */
	static staticRandom = new Random();

	#randomFunc = globalRandomFunc;

	/**
	 * A class with functions for randomness.
	 * @param seed - Seed for RNG
	 */
	constructor(seed: number = Date.now()) {
		this.seed = seed;
		this.setGenerator(globalRandomFunc);
	}

	/**
	 * Sets the default RNG function to use for instances of {@link Random}.
	 * @group Static
	 * @param randomFunc - Function to use
	 */
	static setDefaultGenerator(randomFunc: RandomFunc): void {
		Random.staticRandom.setGenerator(randomFunc);
		globalRandomFunc = randomFunc;
	}

	/**
	 * Sets the RNG function to the default (xorShift32).
	 * @group Static
	 */
	static resetDefaultGenerator(): void {
		Random.setDefaultGenerator(xorShift32);
	}

	/**
	 * Sets the RNG function to use.
	 * @param randomFunc - Function to use
	 */
	setGenerator(randomFunc: RandomFunc): void {
		this.#randomFunc = randomFunc;
	}

	#next(): number {
		this.seed = this.#randomFunc(this.seed);
		return Number(this.seed / 0xffffffff);
	}

	/**
	 * Generates a random number.
	 * @group Static
	 * @param n - Upper bound (exclusive)
	 * @returns Random number
	 */
	static float(n = 1): number {
		return Random.staticRandom.float(n);
	}

	/**
	 * Generates a random number.
	 * @param n - Upper bound (exclusive)
	 * @returns Random number
	 */
	float(n = 1): number {
		return this.#next() * n;
	}

	/**
	 * A roll of the dice.
	 * Ex: `chance(2, 5)` returns `true` 50% of the time
	 * @group Static
	 * @param n - Number of chances
	 * @param max - Out of
	 * @returns If fate smiled upon you
	 */
	static chance(n: number, max: number): boolean {
		return Random.staticRandom.chance(n, max);
	}

	/**
	 * A roll of the dice.
	 * Ex: `chance(2, 5)` returns `true` 50% of the time
	 * @param n - Number of chances
	 * @param max - Out of
	 * @returns If fate smiled upon you
	 */
	chance(n: number, max: number): boolean {
		if (max === 0) return false;
		return this.#next() < n / max;
	}

	/**
	 * Generates a random integer.
	 * @group Static
	 * @param n - Upper bound (exclusive)
	 * @returns Random integer
	 */
	static int(n: number): number {
		return Random.staticRandom.int(n);
	}

	/**
	 * Generates a random integer.
	 * @param n - Upper bound (exclusive)
	 * @returns Random integer
	 */
	int(n: number): number {
		return Math.floor(this.#next() * n);
	}

	/**
	 * Generates a random number within a given range.
	 * @group Static
	 * @param a - Lower bound (inclusive)
	 * @param b - Upper bound (exclusive)
	 * @returns Random number in range
	 */
	static range(a: number, b: number): number {
		return Random.staticRandom.range(a, b);
	}

	/**
	 * Generates a random number within a given range.
	 * @param a - Lower bound (inclusive)
	 * @param b - Upper bound (exclusive)
	 * @returns Random number in range
	 */
	range(a: number, b: number): number {
		return this.float(b - a) + a;
	}

	/**
	 * Returns a random boolean.
	 * @group Static
	 * @returns Random boolean (true or false)
	 */
	static bool(): boolean {
		return Random.staticRandom.bool();
	}

	/**
	 * Returns a random bool.
	 * @returns Random bool (true or false)
	 */
	bool(): boolean {
		return this.int(2) > 0;
	}

	/**
	 * Generates a random sign.
	 * @group Static
	 * @returns Random sign (-1 or 1)
	 */
	static sign(): 1 | -1 {
		return Random.staticRandom.sign();
	}

	/**
	 * Generates a random sign.
	 * @returns Random sign (-1 or 1)
	 */
	sign(): 1 | -1 {
		return this.bool() ? 1 : -1;
	}

	/**
	 * Generates a random angle [0-360).
	 * @group Static
	 * @returns Random angle
	 */
	static angle(): number {
		return Random.staticRandom.angle();
	}

	/**
	 * Generates a random angle [0-360).
	 * @returns Random angle
	 */
	angle(): number {
		return this.float(360);
	}

	/**
	 * Returns a random element from passed arguments.
	 * @group Static
	 * @param items - Values to choose from
	 * @returns Random item
	 */
	static choose<T>(...items: T[]): T {
		return Random.staticRandom.choose(...items);
	}

	/**
	 * Returns a random element from passed arguments.
	 * @param items - Values to choose from
	 * @returns Random item
	 */
	choose<T>(...items: T[]): T {
		return items[this.int(items.length)];
	}

	/**
	 * Shuffles an array in-place.
	 * @group Static
	 * @param arr - Array to shuffle
	 * @returns `arr`
	 */
	static shuffle<T>(arr: T[]): T[] {
		return Random.staticRandom.shuffle(arr);
	}

	/**
	 * Shuffles an array in-place.
	 * @param arr - Array to shuffle
	 * @returns `arr`
	 */
	shuffle<T>(arr: T[]): T[] {
		let m = arr.length;
		let t: T;
		let i: number;
		while (m) {
			i = this.int(m--);

			t = arr[m];
			arr[m] = arr[i];
			arr[i] = t;
		}

		return arr;
	}

	/**
	 * Generates a random {@link Vec2}
	 * @group Static
	 * @param scale - Scale of vector (optional)
	 * @returns Random Vec2
	 */
	static vec2(scale = 1): Vec2 {
		return Random.staticRandom.vec2(scale);
	}

	/**
	 * Generates a random {@link Vec2}
	 * @param scale - Scale of vector (optional)
	 * @returns Random Vec2
	 */
	vec2(scale = 1): Vec2 {
		return new Vec2(scale, 0).rotate(this.float(Math.PI * 2));
	}

	/**
	 * Generates a random {@link Vec3}
	 * @group Static
	 * @param scale - Scale of vector (optional)
	 * @returns Random Vec3
	 */
	static vec3(scale = 1): Vec3 {
		return Random.staticRandom.vec3(scale);
	}

	/**
	 * Generates a random {@link Vec3}
	 * @param scale - Scale of vector (optional)
	 * @returns Random Vec3
	 */
	vec3(scale = 1): Vec3 {
		const v = new Vec3(
			this.range(-1, 1),
			this.range(-1, 1),
			this.range(-1, 1),
		);
		return v.normalize().scale(scale);
	}

	/**
	 * Generates a random {@link Vec4}
	 * @group Static
	 * @param scale - Scale of vector (optional)
	 * @returns Random Vec4
	 */
	static vec4(scale = 1): Vec4 {
		return Random.staticRandom.vec4(scale);
	}

	/**
	 * Generates a random {@link Vec4}
	 * @param scale - Scale of vector (optional)
	 * @returns Random Vec4
	 */
	vec4(scale = 1): Vec4 {
		const v = new Vec4(
			this.range(-1, 1),
			this.range(-1, 1),
			this.range(-1, 1),
			this.range(-1, 1),
		);
		return v.normalize().scale(scale);
	}
}
