import { Client, type Collection } from 'discord.js';
import { getConfig, type Config } from './core/configuration';
import { gateLoader, type Gate } from './core/gates';
import { logException } from './core/helpers';
import { Logger } from './core/logger';
import { appConfig } from './.sparkbot.config';
import { sparkLoader } from './core/sparks';

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
try {
	await logger.loadPlugin(config.loggingLibraryPlugin);
} catch (exception) {
	throw logException(exception, logger);
}

// Initialize Discord.js client
declare module 'discord.js' {
	interface Client {
		config: Config;
		gates: Collection<string, Gate>;
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

// Load gates
try {
	discordClient.gates = await gateLoader();
} catch (exception) {
	throw logException(exception, logger);
}

// Load sparks
try {
	await sparkLoader(discordClient);
} catch (exception) {
	throw logException(exception, logger);
}

// Login to Discord
try {
	await discordClient.login(config.discordAPIKey);
} catch (exception) {
	throw logException(exception, logger);
}
