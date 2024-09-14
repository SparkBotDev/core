import process from 'node:process';
import PinoPlugin, { LoggerPlugin } from '@sparkbot/plugin-logger'; // eslint-disable-line @typescript-eslint/naming-convention
import { loadPlugin } from '../plugin-manager';

type LoggerConfig = {
	module: string;
	options?: Record<string, unknown> | undefined;
};

export class Logger {
	logger: LoggerPlugin;

	constructor() {
		this.logger = new PinoPlugin({
			loggingLevel: 'debug',
			transports: [
				{
					target: 'pino-pretty',
					options: {
						colorize: true,
					},
				},
			],
		});

		// Register logger to log unhandled exceptions
		process.on('exit', (code) => {
			this.logger.info(`❌ Spark⚡️Bot process exited with code ${code}`);
		});

		process.on('uncaughtException', (error) => {
			this.logger.error(new Error('Uncaught Exception:', { cause: error }));
			process.exit(1);
		});

		process.on('unhandledRejection', (error) => {
			this.logger.error(
				new Error('Unhandled promise rejection:', { cause: error }),
			);
			process.exit(1);
		});
	}

	async loadPlugin(config: LoggerConfig) {
		const Plugin = await loadPlugin<LoggerPlugin>(LoggerPlugin, config.module); // eslint-disable-line @typescript-eslint/naming-convention
		this.logger = new Plugin(config.options);
	}

	error(exception: Error | string) {
		this.logger.error(exception);
	}

	warn(exception: Error | string) {
		this.logger.warn(exception);
	}

	info(exception: Error | string) {
		this.logger.info(exception);
	}

	debug(exception: Error | string) {
		this.logger.debug(exception);
	}
}
