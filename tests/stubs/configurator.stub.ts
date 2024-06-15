import { join } from 'node:path';
import { mock } from 'bun:test';
import { SECRET } from '../../types/config.ts';

// Mock config file to ensure all edge cases are covered in testing
await mock.module(join(import.meta.dir, '../../sparkbot.config.ts'), () => {
	Bun.env['discordApiKey'] = 'test';
	Bun.env['testSecret'] = 'test';
	return {
		config: {
			discordApiKey: SECRET,
			discordAppId: {
				prod: 'prod',
				dev: 'dev',
			},
			intents: [1],
			partials: [],
			dbEnabled: false,
			secretsVault: {
				name: '@sparkbot/secrets-environment',
			},
			loggingLib: {
				prod: { name: 'prod', options: { testSecret: SECRET } },
				dev: { name: 'dev', options: { testSecret: SECRET } },
			},
			channelMap: {
				channel1: '1232124512312',
				channel2: { prod: '123123', dev: '123123' },
			},
			extraProp: 'extra',
		},
	};
});
