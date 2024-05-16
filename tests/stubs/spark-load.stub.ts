import { extname } from 'node:path';
import { mock } from 'bun:test';

// Creates a mocked file system for sparkLoad() testing

await mock.module('node:fs', () => {
	return {
		readdirSync() {
			return [
				'single.ts',
				'multiple.ts',
				'invalid.js',
				'lib/library.ts',
				'sub/sub.ts',
			];
		},
		statSync(path: string) {
			if (path === '/stub') {
				return {
					isDirectory() {
						return true;
					},
					isFile() {
						return false;
					},
				};
			}

			if (extname(path) !== '') {
				return {
					isDirectory() {
						return false;
					},
					isFile() {
						return true;
					},
				};
			}

			return {
				isDirectory() {
					return false;
				},
				isFile() {
					return false;
				},
			};
		},
	};
});

const validObject = { name: 'valid' };
const invalidObject = { data: 'invalid' };

await mock.module('/stub/single.ts', () => {
	return { object1: validObject };
});

await mock.module('/stub/multiple.ts', () => {
	return {
		object1: validObject,
		object2: validObject,
		object3: invalidObject,
		object4: validObject,
	};
});

await mock.module('/stub/invalid.js', () => {
	return { object1: validObject };
});

await mock.module('/stub/lib/library.ts', () => {
	return { object1: validObject };
});

await mock.module('/stub/sub/sub.ts', () => {
	return { object1: validObject };
});
