import pino, { Logger } from 'pino';

import { app } from '../config';

const createLogger = (): Logger => {
  const logLevel = (): string => {
    if (app.env === 'development') return 'debug';

    return 'info';
  };

  return pino({
    level: logLevel(),
    prettyPrint: true,
  });
};

const logger = createLogger();

export default logger;
