import process from 'node:process';
import { Client, Collection, Events, REST, Routes } from 'discord.js';
import { getConfig, type Config } from './core/configuration';
import { logErrorAndThrow } from './core/helpers';
import { Logger } from './core/logger';
import { appConfig } from './.sparkbot.config';

/* Spark⚡️Bot is designed to run with Bun and will have errors if run in a
   different environment. */
if (!Bun) {
	throw new Error('Must be run with Bun');
}

// Initialize Logger
const logger = new Logger();

// Get parsed config
let config: Config;
try {
	config = await getConfig(appConfig);
} catch (exception) {
	logErrorAndThrow(exception, logger);
	process.exit(1);
}

// Initialize user-configured logger
await logger.loadPlugin(config.loggingLibraryPlugin);

// Initialize a new Discord.js client
declare module 'discord.js' {
	interface Client {
		config: Config;
	}
}

const discordClient = new Client({
	intents: config.discordIntents,
	partials: config.enabledPartials,
	presence: config.defaultPresence,
});
discordClient.config = config;
