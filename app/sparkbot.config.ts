import { GatewayIntentBits } from 'discord.js';

export const config: SparkBotConfig = {
	discordAPIKey: '*secret*',
	discordAppID: '*secret*',
	discordIntents: GatewayIntentBits.Guilds,
	plugins: {
		secretsVault: {
			name: '@sparkbot/secrets-environment',
		},
		loggingLib: {
			name: '',
		},
	},
};
