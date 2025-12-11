import { build, type LibraryOptions, type BuildEnvironmentOptions } from 'vite';
// @ts-expect-error - we want to import a json file here
import pkg from '../package.json' with { type: 'json' };

const { version } = pkg as { version: string };

const outDir = 'dist';

const sharedLib: LibraryOptions = {
	entry: 'src/index.ts',
	formats: ['es'],
};

const sharedBuild: BuildEnvironmentOptions = {
	rollupOptions: {
		treeshake: false,
	},
	outDir,
	sourcemap: true,
};

await build({
	build: {
		...sharedBuild,
		lib: {
			...sharedLib,
			fileName: () => `game-math-${version}.js`,
		},
		minify: false,
		emptyOutDir: true,
	},
});

await build({
	build: {
		...sharedBuild,
		lib: {
			...sharedLib,
			fileName: () => `game-math-${version}.min.js`,
		},
		minify: 'terser',
		emptyOutDir: false,
	},
});
