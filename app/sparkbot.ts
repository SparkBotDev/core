import process from 'node:process';
import { Client, Collection, Events } from 'discord.js';
import type { LoggerPlugin } from '@sparkbot/logger-plugin-interface';
import { config } from './lib/configurator.js';
import { importObjects } from './lib/import-objects.js';

// Temp util get to command stuff
type Command = {
	name: string;
};

declare module 'discord.js' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Client {
		config: Config;
		logger: LoggerPlugin;
		commands: Collection<string, Command>;
		coolDowns: Collection<string, number>;
	}
}

/*
 * Initialize client
 */
const discordClient = new Client({ intents: config.discordIntents });
discordClient.config = config;

discordClient.commands = new Collection();
discordClient.coolDowns = new Collection();

/*
 * Initialize and configure logger
 */
const importedObjects = await importObjects<
	new (options: unknown) => LoggerPlugin
>(discordClient.config.plugins.loggingLib.name);

const loggerPlugin = importedObjects[0];

if (loggerPlugin) {
	// eslint-disable-next-line new-cap
	discordClient.logger = new loggerPlugin(
		discordClient.config.plugins.loggingLib.options,
	);
}

discordClient.on(Events.Debug, (message) => {
	discordClient.logger.debug(message);
});
discordClient.on(Events.Warn, (message) => {
	discordClient.logger.warn(message);
});
discordClient.on(Events.Error, (message) => {
	discordClient.logger.error(message);
});

process.on('uncaughtException', (error) => {
	discordClient.logger.error(
		new Error('Uncaught Exception:', { cause: error }),
	);
	process.exit(1);
});
process.on('unhandledRejection', (error) => {
	discordClient.logger.error(
		new Error('Unhandled promise rejection:', { cause: error }),
	);
	process.exit(1);
});
