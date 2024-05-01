import { describe, expect, it } from 'bun:test';
import { config } from '../../app/lib/configurator.js';

describe('lib/configurator library', () => {
	it('provides config', () => {
		expect(config).toBeDefined();
	});
});
