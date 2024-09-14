import { Client, Collection, Events, REST, Routes } from 'discord.js';
import { getConfig, type Config } from './core/configuration';
import { logException } from './core/helpers';
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
	throw logException(exception, logger);
}

// Initialize user-configured logger
await logger.loadPlugin(config.loggingLibraryPlugin);

// Initialize Discord.js client
declare module 'discord.js' {
	interface Client {
		config: Config;
		logger: Logger;
	}
}

const discordClient = new Client({
	intents: config.discordIntents,
	partials: config.enabledPartials,
	presence: config.defaultPresence,
});
discordClient.config = config;
discordClient.logger = logger;
logger.registerClientHandlers(discordClient);

// Login to Discord
try {
	await discordClient.login(config.discordAPIKey);
} catch (exception) {
	throw logException(exception, logger);
}
