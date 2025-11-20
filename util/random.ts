const xorShift32 = (random: Random): number => {
	let x = random.seed;
	x ^= x << 13;
	x ^= x >>> 17;
	x ^= x << 5;
	return (random.seed = x >>> 0);
};

export interface Random {
	seed: number;
}

export class Random {
	static staticRandom = new Random();

	constructor(seed: number = Date.now()) {
		this.seed = seed;
	}

	#next(): number {
		return Number(xorShift32(this) / 0xffffffff);
	}

	static float = (n = 1): number => Random.staticRandom.float(n);
	float(n = 1): number {
		return this.#next() * n;
	}

	static chance = (n: number, max: number): boolean =>
		Random.staticRandom.chance(n, max);
	chance(n: number, max: number): boolean {
		if (max === 0) return false;
		return this.#next() < n / max;
	}

	static int = (n: number): number => Random.staticRandom.int(n);
	int(n: number): number {
		return Math.floor(this.#next() * n);
	}

	static range = (a: number, b: number): number =>
		Random.staticRandom.range(a, b);
	range(a: number, b: number): number {
		return this.float(b - a) + a;
	}

	static bool = (): boolean => Random.staticRandom.bool();
	bool(): boolean {
		return this.int(2) > 0;
	}

	static sign = (): 1 | -1 => Random.staticRandom.sign();
	sign(): 1 | -1 {
		return this.bool() ? 1 : -1;
	}

	static angle = (): number => Random.staticRandom.angle();
	angle(): number {
		return this.float(360);
	}

	static choose = <T>(items: T[]): T => Random.staticRandom.choose(items);
	choose<T>(items: T[]): T {
		return items[this.int(items.length)];
	}

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
}
