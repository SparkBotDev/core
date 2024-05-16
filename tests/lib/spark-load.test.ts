import { describe, expect, it } from 'bun:test';
import { sparkLoad } from '../../lib/spark-load.ts';

describe('sparkLoad()', () => {
	it('imports a single object', async () => {
		expect(await sparkLoad('/stub/single.ts')).toBeArrayOfSize(1);
	});

	it('imports multiple objects', async () => {
		expect(await sparkLoad('/stub/multiple.ts')).toBeArrayOfSize(4);
	});

	it('only imports ts files', async () => {
		let error: boolean;
		try {
			await sparkLoad('/stub/invalid.js');
			error = false;
		} catch {
			error = true;
		}

		expect(error).toBeTrue();
	});

	it('ignores files in lib dir', async () => {
		let error: boolean;
		try {
			await sparkLoad('/stub/lib/library.ts');
			error = false;
		} catch {
			error = true;
		}

		expect(error).toBeTrue();
	});

	it('imports from a directory recursively', async () => {
		expect(await sparkLoad('/stub')).toBeArrayOfSize(6);
	});
});
