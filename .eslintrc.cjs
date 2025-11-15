// NOTE(bret): This file was brought over from the canvas-lord repo
// TODO(bret): We'll want to update this to use "@writegames.com/style-guide/eslint/canvas-lord" or something!

const { resolve } = require('node:path');

const project = resolve(__dirname, 'tsconfig.json');

// canvas-lord
module.exports = {
	extends: [
		'@vercel/style-guide/eslint/browser',
		'@vercel/style-guide/eslint/node',
		'@vercel/style-guide/eslint/typescript',
	].map(require.resolve),
	env: {
		es2022: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project,
	},
	ignorePatterns: ['node_modules/', '**/*.js'],
	rules: {
		curly: 0, // ['error', 'multi'],
		'no-bitwise': 0,
		'no-multi-assign': 0,
		'no-implicit-coercion': [
			'error',
			{
				allow: ['~', '+'],
			},
		],

		// Revisit
		'@typescript-eslint/no-confusing-void-expression': 0,

		// Temporary
		'no-console': 0,
		'no-constant-condition': 0,
		'no-extend-native': 0,
		'no-lonely-if': 0,
		// 'no-unused-vars': 0,

		'@typescript-eslint/array-type': [
			'error',
			{
				default: 'array-simple',
				readonly: 'array-simple',
			},
		],

		'@typescript-eslint/naming-convention': [
			'error',
			{
				format: ['PascalCase'],
				selector: ['typeLike', 'enumMember'],
			},
		],

		'@typescript-eslint/prefer-for-of': 0,

		// revisit
		'@typescript-eslint/method-signature-style': 0,
		'@typescript-eslint/unified-signatures': 0,
		'@typescript-eslint/no-non-null-assertion': 0,

		'import/order': 0,

		// temporary
		'@typescript-eslint/no-unsafe-declaration-merging': 0,
		'@typescript-eslint/no-shadow': 0,
		'@typescript-eslint/non-nullable-type-assertion-style': 0,
	},
};
