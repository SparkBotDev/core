import { describe, expect, it } from 'bun:test';
import { importObjects } from '../../app/lib/import-objects.js';

describe('importObjects() library', () => {
	it('imports a single file', async () => {
		const testImport = await importObjects('/objects/single.ts');
		expect(testImport).toBeArrayOfSize(1);
	});

	it('imports a directory recursively, skipping directories named lib and files without .ts ext', async () => {
		const testImport = await importObjects('/objects');
		expect(testImport).toBeArrayOfSize(6);
	});

	it('imports a node module', async () => {
		const testImport = await importObjects('@commitlint/cli');
		expect(testImport).toBeArrayOfSize(1);
	});

	it('Does not fault if path invalid', async () => {
		try {
			let testImport = await importObjects('/object');
			testImport = await importObjects('asdasd.ts');
			testImport = await importObjects('blah');
		} catch (exception) {
			expect(exception).toBeUndefined();
		}
	});
});
