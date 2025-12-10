import type { V2_T, V3_T, V4_T } from '../src/linear-algebra';

export const VEC_A_X = 4;
export const VEC_A_Y = 5;
export const VEC_A_Z = 6;
export const VEC_A_W = 7;

export const VEC_B_X = 8;
export const VEC_B_Y = 6;
export const VEC_B_Z = 4;
export const VEC_B_W = 2;

export const VEC_SUM_X = VEC_A_X + VEC_B_X;
export const VEC_SUM_Y = VEC_A_Y + VEC_B_Y;
export const VEC_SUM_Z = VEC_A_Z + VEC_B_Z;
export const VEC_SUM_W = VEC_A_W + VEC_B_W;

export const VEC_DIFF_X = VEC_A_X - VEC_B_X;
export const VEC_DIFF_Y = VEC_A_Y - VEC_B_Y;
export const VEC_DIFF_Z = VEC_A_Z - VEC_B_Z;
export const VEC_DIFF_W = VEC_A_W - VEC_B_W;

export const VEC2_A = [VEC_A_X, VEC_A_Y] as V2_T;
export const VEC2_B = [VEC_B_X, VEC_B_Y] as V2_T;
export const VEC2_SUM = [VEC_SUM_X, VEC_SUM_Y] as V2_T;
export const VEC2_DIFF = [VEC_DIFF_X, VEC_DIFF_Y] as V2_T;

export const VEC3_A = [VEC_A_X, VEC_A_Y, VEC_A_Z] as V3_T;
export const VEC3_B = [VEC_B_X, VEC_B_Y, VEC_B_Z] as V3_T;
export const VEC3_SUM = [VEC_SUM_X, VEC_SUM_Y, VEC_SUM_Z] as V3_T;
export const VEC3_DIFF = [VEC_DIFF_X, VEC_DIFF_Y, VEC_DIFF_Z] as V3_T;

export const VEC4_A = [VEC_A_X, VEC_A_Y, VEC_A_Z, VEC_A_W] as V4_T;
export const VEC4_B = [VEC_B_X, VEC_B_Y, VEC_B_Z, VEC_B_W] as V4_T;
export const VEC4_SUM = [VEC_SUM_X, VEC_SUM_Y, VEC_SUM_Z, VEC_SUM_W] as V4_T;
export const VEC4_DIFF = [
	VEC_DIFF_X,
	VEC_DIFF_Y,
	VEC_DIFF_Z,
	VEC_DIFF_W,
] as V4_T;

export const CROSS3D_A = [1, 2, 3] as V3_T;
export const CROSS3D_B = [4, 5, 6] as V3_T;
export const CROSS3D_RESULT = [-3, 6, -3] as V3_T;
