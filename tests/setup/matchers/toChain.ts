export const toChain = <T>(actual: T, callback: (v: T) => T) => {
	const pass = actual === callback(actual);

	return {
		pass,
		message: () =>
			pass ? 'Expected method to not chain' : `Expected method to chain`,
	};
};
