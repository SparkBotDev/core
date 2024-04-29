import { mock } from 'bun:test';

// Creates a mocked file system for import-objects testing

await mock.module('node:fs', () => {
	return {
		readdirSync() {
			return [
				'single.ts',
				'multi.ts',
				'ignoreme.js',
				'lib/ignoreme.ts',
				'sub/sub.ts',
			];
		},
		statSync(path: string) {
			if (path === '/objects') {
				return {
					isDirectory() {
						return true;
					},
				};
			}

			return {
				isDirectory() {
					return false;
				},
			};
		},
	};
});

const validObject = { name: 'valid' };
const invalidObject = { data: 'invalid' };

await mock.module('/objects/single.ts', () => {
	return { object1: validObject };
});

await mock.module('/objects/multi.ts', () => {
	return {
		object1: validObject,
		object2: validObject,
		object3: invalidObject,
		object4: validObject,
	};
});

await mock.module('/objects/ignoreme.js', () => {
	return { object1: validObject };
});

await mock.module('/objects/lib/ignoreme.ts', () => {
	return { object1: validObject };
});

await mock.module('/objects/sub/sub.ts', () => {
	return { object1: validObject };
});
