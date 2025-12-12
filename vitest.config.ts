import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		root: 'tests',
		setupFiles: ['setup/index.setup.ts'],
	},
});
