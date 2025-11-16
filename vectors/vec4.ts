import { addPos, posEqual, scalePos, subPos, type Vector } from './common';

export const isVec4 = (vec: Vector): vec is Vec4 => {
	return vec instanceof Vec4;
};

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

export class Vec4 extends Array<number> {
	// length: 4 = 4 as const;

	constructor(x = 0, y = 0, z = 0, w = 0) {
		super(x, y, z, w);
	}

	static get zero(): Vec4 {
		return new Vec4(0, 0, 0, 0);
	}

	static get one(): Vec4 {
		return new Vec4(1, 1, 1, 1);
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

	get w(): number {
		return this[W];
	}

	set w(value: number) {
		this[W] = value;
	}

	get magnitude(): number {
		return magnitude4D(this);
	}

	set(v: Vec4): void {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = v.w;
	}

	setXYZW(x: number, y: number, z: number, w: number): void {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	static normalize = (v: Vec4): Vec4 => {
		return v.clone().invScale(v.magnitude);
	};
	normalize(): this {
		const mag = this.magnitude;
		this.x /= mag;
		this.y /= mag;
		this.z /= mag;
		this.w /= mag;
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

	clone(): Vec4 {
		return new Vec4(...this);
	}

	static add = (a: Vec4, b: Vec4): Vec4 => addPos(a, b);
	add(v: Vec4): this {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;
		return this;
	}

	static plus = (a: Vec4, b: Vec4): Vec4 => Vec4.add(a, b);
	plus(v: Vec4): this {
		return this.add(v);
	}

	static sub = (a: Vec4, b: Vec4): Vec4 => subPos(a, b);
	sub(v: Vec4): this {
		this.x -= v.x;
		this.y -= v.y;
		this.w -= v.w;
		this.z -= v.z;
		return this;
	}

	static minus = (a: Vec4, b: Vec4): Vec4 => Vec4.sub(a, b);
	minus(v: Vec4): this {
		return this.sub(v);
	}

	static scale = (v: Vec4, s: number): Vec4 => scalePos(v, s);
	scale(s: number): this {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		this.w *= s;
		return this;
	}

	static invScale = (v: Vec4, s: number): Vec4 => scalePos(v, 1 / s);
	invScale(s: number): this {
		const iS = 1 / s;
		this.x *= iS;
		this.y *= iS;
		this.z *= iS;
		this.w *= iS;
		return this;
	}

	// TODO(bret): is there a cross & dot product for vec4?
	// TODO(bret): rotation

	static equal = (a: Vec4, b: Vec4): boolean => posEqual(a, b);
	equal(v: Vec4): boolean {
		return Vec4.equal(this, v);
	}

	static lerp = (a: Vec4, b: Vec4, t: number): Vec4 => {
		return Vec4.sub(b, a).scale(t).add(a);
	};
}

export const magnitude4D = (v: Vec4): number =>
	Math.sqrt(v[X] ** 2 + v[Y] ** 2 + v[Z] ** 2 + v[W] ** 2);
