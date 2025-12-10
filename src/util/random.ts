import { Vec2, Vec3, Vec4 } from '../linear-algebra';

type RandomFunc = (seed: number) => number;

const xorShift32: RandomFunc = (seed): number => {
	let x = seed;
	x ^= x << 13;
	x ^= x >>> 17;
	x ^= x << 5;
	return x >>> 0;
};

export interface Random {
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

	constructor(seed: number = Date.now()) {
		this.seed = seed;
		this.setGenerator(globalRandomFunc);
	}

	/**
	 * @group Static
	 */
	static setDefaultGenerator(randomFunc: RandomFunc) {
		Random.staticRandom.setGenerator(randomFunc);
		globalRandomFunc = randomFunc;
	}
	/**
	 * @group Static
	 */
	static resetDefaultGenerator() {
		Random.setDefaultGenerator(xorShift32);
	}
	setGenerator(randomFunc: RandomFunc) {
		this.#randomFunc = randomFunc;
	}

	#next(): number {
		this.seed = this.#randomFunc(this.seed);
		return Number(this.seed / 0xffffffff);
	}

	/**
	 * @group Static
	 */
	static float = (n = 1): number => Random.staticRandom.float(n);
	float(n = 1): number {
		return this.#next() * n;
	}

	/**
	 * @group Static
	 */
	static chance = (n: number, max: number): boolean =>
		Random.staticRandom.chance(n, max);
	chance(n: number, max: number): boolean {
		if (max === 0) return false;
		return this.#next() < n / max;
	}

	/**
	 * @group Static
	 */
	static int = (n: number): number => Random.staticRandom.int(n);
	int(n: number): number {
		return Math.floor(this.#next() * n);
	}

	/**
	 * @group Static
	 */
	static range = (a: number, b: number): number =>
		Random.staticRandom.range(a, b);
	range(a: number, b: number): number {
		return this.float(b - a) + a;
	}

	/**
	 * @group Static
	 */
	static bool = (): boolean => Random.staticRandom.bool();
	bool(): boolean {
		return this.int(2) > 0;
	}

	/**
	 * @group Static
	 */
	static sign = (): 1 | -1 => Random.staticRandom.sign();
	sign(): 1 | -1 {
		return this.bool() ? 1 : -1;
	}

	/**
	 * @group Static
	 */
	static angle = (): number => Random.staticRandom.angle();
	angle(): number {
		return this.float(360);
	}

	/**
	 * @group Static
	 */
	static choose = <T>(items: T[]): T => Random.staticRandom.choose(items);
	choose<T>(items: T[]): T {
		return items[this.int(items.length)];
	}

	/**
	 * @group Static
	 */
	static shuffle = <T>(arr: T[]): T[] => Random.staticRandom.shuffle(arr);
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
	 * @group Static
	 */
	static vec2 = (scale = 1): Vec2 => Random.staticRandom.vec2(scale);
	vec2(scale = 1): Vec2 {
		return new Vec2(scale, 0).rotate(this.float(Math.PI * 2));
	}

	/**
	 * @group Static
	 */
	static vec3 = (scale = 1): Vec3 => Random.staticRandom.vec3(scale);
	vec3(scale = 1): Vec3 {
		const v = new Vec3(
			this.range(-1, 1),
			this.range(-1, 1),
			this.range(-1, 1),
		);
		return v.normalize().scale(scale);
	}

	/**
	 * @group Static
	 */
	static vec4 = (scale = 1): Vec4 => Random.staticRandom.vec4(scale);
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
