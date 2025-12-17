import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			cleanOnRerun: true,
			allowExternal: true,
			provider: 'v8',
			exclude: ['setup/matchers/*'],
		},
		root: 'tests',
		setupFiles: ['setup/index.setup.ts'],
	},
});
