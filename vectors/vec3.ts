import {
	addPos,
	FuncMapVector,
	FuncReduceVector,
	posEqual,
	scalePos,
	subPos,
	type V3_T,
	type Vector,
} from './common';

export const isVec3 = (vec: Vector): vec is Vec3 => {
	return vec instanceof Vec3;
};

const X = 0;
const Y = 1;
const Z = 2;

export class Vec3 extends Array<number> {
	// length: 3 = 3 as const;

	constructor(x = 0, y = 0, z = 0) {
		super(x, y, z);
	}

	static get zero(): Vec3 {
		return new Vec3(0, 0, 0);
	}

	static get one(): Vec3 {
		return new Vec3(1, 1, 1);
	}

	static get right(): Vec3 {
		return new Vec3(1, 0, 0);
	}

	static get up(): Vec3 {
		return new Vec3(0, 1, 0);
	}

	static get forward(): Vec3 {
		// DECIDE(bret): which way is forward?
		return new Vec3(0, 0, 1);
	}

	get x(): number {
		return this[X];
	}

	set x(value: number) {
		this[X] = value;
	}

	get y(): number {
		return this[Y];
	}

	set y(value: number) {
		this[Y] = value;
	}

	get z(): number {
		return this[Z];
	}

	set z(value: number) {
		this[Z] = value;
	}

	get magnitude(): number {
		return magnitude3D(this);
	}

	set(v: Vec3): void {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	}

	setXYZ(x: number, y: number, z: number): void {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	static normalize = (v: Vec3): Vec3 => {
		return v.clone().invScale(v.magnitude);
	};
	normalize(): this {
		const mag = this.magnitude;
		this.x /= mag;
		this.y /= mag;
		this.z /= mag;
		return this;
	}

	map<U>(
		// DECIDE: index: 0 | 1 ?
		callbackfn: (value: number, index: number, array: number[]) => U,
		thisArg?: unknown,
	): [U, U] {
		return super.map(callbackfn, thisArg) as [U, U];
	}

	every<S extends number>(
		predicate: (value: number, index: number, array: number[]) => boolean,
		thisArg?: unknown,
	): this is S[] {
		return super.every(predicate, thisArg);
	}

	join(separator?: string): string {
		return super.join(separator);
	}

	[Symbol.iterator](): ArrayIterator<number> {
		return super.values();
	}

	clone(): Vec3 {
		return new Vec3(...this);
	}

	static add = (a: Vec3, b: Vec3): Vec3 => addPos(a, b);
	add(v: Vec3): this {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	static plus = (a: Vec3, b: Vec3): Vec3 => Vec3.add(a, b);
	plus(v: Vec3): this {
		return this.add(v);
	}

	static sub = (a: Vec3, b: Vec3): Vec3 => subPos(a, b);
	sub(v: Vec3): this {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	static minus = (a: Vec3, b: Vec3): Vec3 => Vec3.sub(a, b);
	minus(v: Vec3): this {
		return this.sub(v);
	}

	static scale = (v: Vec3, s: number): Vec3 => scalePos(v, s);
	scale(s: number): this {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	}

	static invScale = (v: Vec3, s: number): Vec3 => scalePos(v, 1 / s);
	invScale(s: number): this {
		const iS = 1 / s;
		this.x *= iS;
		this.y *= iS;
		this.z *= iS;
		return this;
	}

	static cross = (a: Vec3, b: Vec3): Vec3 => crossProduct3D(a, b);
	cross(v: Vec3): Vec3 {
		return Vec3.cross(this, v);
	}

	static dot = (a: Vec3, b: Vec3): number => dotProduct3D(a, b);
	dot(v: Vec3): number {
		return Vec3.dot(this, v);
	}

	// TODO(bret): rotation

	static equal = (a: Vec3, b: Vec3): boolean => posEqual(a, b);
	equal(v: Vec3): boolean {
		return Vec3.equal(this, v);
	}

	static lerp = (a: Vec3, b: Vec3, t: number): Vec3 => {
		return Vec3.sub(b, a).scale(t).add(a);
	};
}

export const crossProduct3D: FuncMapVector<V3_T | Vec3> = (a, b) => {
	const c1 = a[Y] * b[Z] - a[Z] * b[Y];
	const c2 = a[Z] * b[X] - a[X] * b[Z];
	const c3 = a[X] * b[Y] - a[Y] * b[X];
	return new Vec3(c1, c2, c3) as typeof a;
};
export const dotProduct3D: FuncReduceVector<V3_T | Vec3> = (a, b) =>
	a[X] * b[X] + a[Y] * b[Y] + a[Z] * b[Z];
export const magnitude3D = (v: Vec3): number =>
	Math.sqrt(v[X] ** 2 + v[Y] ** 2 + v[Z] ** 2);
