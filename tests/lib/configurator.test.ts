import { describe, expect, it } from 'bun:test';
import { parse } from 'valibot';
import { config } from '../../lib/configurator.ts';
import { configSchema } from '../../types/config.ts';

// Configurator exports a config object that has been parsed from a user made config file
// and validated against a config schema
// ad has been transformed with *secrets* replaced and prod/dev flattened
describe('lib/configurator.ts', () => {
	it('exports valid config object', () => {
		expect(parse(configSchema, config)).toEqual(config);
	});

	it('transforms prod/dev into flat keys', () => {
		expect(config.discordAppId).toEqual('dev');
		expect(config.loggingLib.name).toEqual('dev');
		expect(config.channelMap!['channel2']).toEqual(123123);
	});

	it('replaces SECRETs', () => {
		expect(config.discordApiKey).toEqual('test');
		expect(config.loggingLib.options['testSecret']).toEqual('test');
	});

	it('permits extra properties', () => {
		expect(config['extraProp']).toBeDefined();
	});
});
