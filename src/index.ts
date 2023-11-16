import { Request, Response } from 'express';
import { httpStatusCode } from './types/enum/httpStatusCode';
import app from './app';
import { logInfo } from './logger';
import { checkTraffic } from './server';
const port: number = parseInt(process.env.APP_PORT as string);
app.get(
  [
    '/dataapi/activity/live',
    '/dataapi/activity/ready',
    '/dataapi/activity/health',
    '/dataapi/activity/__health',
    '/dataapi/activity/',
    '/live',
    '/ready',
    '/health',
    '/__health',
    '/',
  ],
  (req: Request, res: Response) => {
    logInfo('reuqest uri with application context path : ', req.originalUrl);
    res
      .status(httpStatusCode.OK)
      .json({ message: 'Appilcation is live, ready and healty' });
  }
);

// unknown request
app.get('*', (req: Request, res: Response) =>
  res
    .status(httpStatusCode.BAD_REQUEST)
    .json({ message: 'not a valid request' })
);

export const server = checkTraffic(app, port, process.env.ALLOW_HTTPS);

export default app;
