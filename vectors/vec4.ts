import type { FuncReduceVector } from '../util/functional.js';
import {
	addPos,
	approachVec,
	posEqual,
	scalePos,
	subPos,
	Vec4Like,
	type V4_T,
	type Vec2Like,
	type Vec3Like,
	type Vector,
} from './common.js';
import { Vec2 } from './vec2.js';
import { Vec3 } from './vec3.js';

export const isVec4 = (vec: Vector): vec is Vec4 => {
	return vec instanceof Vec4;
};

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

/**
 * A 4d vector.
 * @category Linear Algebra
 */
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

	get xy(): Vec2 {
		return new Vec2(this.x, this.y);
	}
	set xy(v: Vec2Like) {
		this.x = v[X];
		this.y = v[Y];
	}

	get xyz(): Vec3 {
		return new Vec3(this.x, this.y, this.z);
	}
	set xyz(v: Vec3Like) {
		this.x = v[X];
		this.y = v[Y];
		this.z = v[Z];
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
		return this.invScale(this.magnitude);
	}

	map<U>(
		// DECIDE: index: 0 | 1 ?
		callbackfn: (value: number, index: number, array: number[]) => U,
		thisArg?: unknown,
	): [U, U] {
		return super.map(callbackfn, thisArg) as [U, U];
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

	static add = (a: Vec4, b: Vec4 | Vector): Vec4 => addPos(a, b);
	add(v: Vec4 | Vector): this {
		this.x += v[X];
		this.y += v[Y];
		this.z += v[Z] ?? 0;
		this.w += v[W] ?? 0;
		return this;
	}

	static plus = (a: Vec4, b: Vec4 | Vector): Vec4 => Vec4.add(a, b);
	plus(v: Vec4 | Vector): this {
		return this.add(v);
	}

	static sub = (a: Vec4, b: Vec4 | Vector): Vec4 => subPos(a, b);
	sub(v: Vec4 | Vector): this {
		this.x -= v[X];
		this.y -= v[Y];
		this.z -= v[Z] ?? 0;
		this.w -= v[W] ?? 0;
		return this;
	}

	static minus = (a: Vec4, b: Vec4 | Vector): Vec4 => Vec4.sub(a, b);
	minus(v: Vec4 | Vector): this {
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
		const iS = s !== 0 ? 1 / s : 0;
		this.x *= iS;
		this.y *= iS;
		this.z *= iS;
		this.w *= iS;
		return this;
	}

	static dot = (a: Vec4, b: Vec4 | V4_T): number => dotProduct4D(a, b);
	dot(v: Vec4 | V4_T): number {
		return Vec4.dot(this, v);
	}

	static equal = (a: Vec4, b: Vec4 | V4_T): boolean => posEqual(a, b);
	equal(v: Vec4): boolean {
		return Vec4.equal(this, v);
	}

	static lerp = (a: Vec4, b: Vec4, t: number): Vec4 => {
		return Vec4.sub(b, a).scale(t).add(a);
	};

	static approach = (
		v: Vec4Like,
		target: Vec4Like,
		amount: Vec4Like,
	): Vec4Like => approachVec(v, target, amount);
}

export const dotProduct4D: FuncReduceVector<Vec4 | V4_T> = (a, b) =>
	a[X] * b[X] + a[Y] * b[Y] + a[Z] * b[Z] + a[W] * b[W];
export const magnitude4D = (v: Vec4): number =>
	Math.sqrt(v[X] ** 2 + v[Y] ** 2 + v[Z] ** 2 + v[W] ** 2);
