import axios from 'axios';
import { Request } from 'express';
import { logError, logInfo } from '../logger';
import { LogOptions } from '../types/interface/common';
import dotenv from 'dotenv';

dotenv.config();
const correlationId = 'x-correlation-id';

async function getActualResponse(url: string, req: Request) {
  const headers: object = {
    'Content-Type': 'application/json',
    'x-authorization-id': req.headers['x-authorization-id'],
    'x-correlation-id': req.headers['x-correlation-id'],
    'x-session-id': req.headers['x-session-id'],
  };
  let logOptions: LogOptions = {
    [correlationId]: headers && (req.headers[correlationId] as string),
    destination: 'Activity_API',
  };

  let response: any = '';
  try {
    const body: object = { session: req.headers['x-authorization-id'] };
    response = (await axios.post(url, body, { headers: headers })).data;
    logInfo('Success ', 'Domus Cookie', response, logOptions);
  } catch (error: any) {
    const err = error as Error;
    logOptions = {
      statusCode: error.status,
      [correlationId]: headers && (req.headers[correlationId] as string),
      destination: 'Activity_Invoking_Domus_Cookie_API',
      reasonCode: error.message,
    };
    logError(
      err,
      'Domus Cookie Validation::Activity_Invoking_Domus_Cookie_API-getRequest"',
      '',
      logOptions
    );
    response = {
      error: 'Cookie validator service not available.',
      reason: error.message + ` for ${url}`,
    };
    return response;
  }
  return response;
}
export async function DomusCookieResponse(req: Request) {
  logInfo('Domus Cookie Env is: ' + process.env.ENV);
  return getActualResponse(process.env.DOMUSCOOKIE_URL as string, req);
}
