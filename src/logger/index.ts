import * as winston from 'winston';
import { LogOptions } from '../types/interface/common';

const correlationId = 'x-correlation-id';

let applicationLoggerInstance: winston.Logger;
export const getLogger = (): winston.Logger => {
  if (applicationLoggerInstance) {
    return applicationLoggerInstance;
  }
  applicationLoggerInstance = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.json()
    ),

    transports: [
      new winston.transports.Console({
        handleExceptions: true,
      }),
    ],
  });
  return applicationLoggerInstance;
};

export const logInfo = (
  message: string,
  source?: string,
  response?: object,
  logOptions?: LogOptions
) => {
  getLogger().info({
    app_name: process.env.APP_NAME,
    [correlationId]: (logOptions && logOptions[correlationId]) || '',
    message: message,
    statusCode: logOptions && logOptions.statusCode,
    destination: logOptions && logOptions.destination,
    source: source,
    response: response,
    reasonCode: logOptions?.reasonCode,
  });
};

const logBasicError = (
  err: Error,
  source?: string,
  request?: string,
  logOptions?: LogOptions
) => {
  getLogger().error({
    app_name: process.env.APP_NAME,
    statusCode: logOptions?.statusCode,
    destination: logOptions?.destination,
    [correlationId]: logOptions && logOptions[correlationId],
    message: err.message,
    source: source ? source : '',
    name: err.name,
    request: request ? request : '',
    reasonCode: logOptions?.reasonCode,
  });
};

export const logError = (
  err: Error,
  source?: string,
  request?: string,
  logOptions?: LogOptions
): void => {
  logBasicError(err, source, request, logOptions);
};
