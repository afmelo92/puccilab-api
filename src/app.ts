import 'express-async-errors';
import express from 'express';

import Server from './server';
import logger from './utils/logger';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  logger.log({
    level: 'error',
    message: `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`,
  });

  throw reason;
});

process.on(`uncaughtException`, (error) => {
  logger.log({
    level: 'error',
    message: `App exiting due to an uncaught exception: ${error}`,
  });
  process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
  try {
    const app = express();

    const server = new Server({ app, port: 3333 });

    await server.init();
  } catch (err: unknown) {
    logger.log({
      level: 'error',
      message: `App exited with error: ${err as Error}`,
    });
    process.exit(ExitStatus.Failure);
  }
})();
