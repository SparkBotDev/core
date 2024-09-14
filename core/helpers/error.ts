import type { Logger } from '../logger';

export function logErrorAndThrow(exception: unknown, logger: Logger) {
	if (exception instanceof Error) {
		logger.error(exception);
		throw exception;
	}

	logger.error(String(exception));
	throw new Error(String(exception));
}
