import type { V4_T } from '../vectors/index.js';

export const dirNN = 0;
const orthoDirections = Array.from({ length: 4 }).map((_, i) => 1 << i) as V4_T;
export const [dirRN, dirNU, dirLN, dirND] = orthoDirections;
// prettier-ignore
export const [
	dirLU, dirRU,
	dirLD, dirRD,
] = [
	dirLN | dirNU, dirRN | dirNU,
	dirLN | dirND, dirRN | dirND,
];
