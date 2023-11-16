import { Request, Response, NextFunction } from 'express';
import joi from 'joi';
import { httpStatusCode } from '../types/enum/httpStatusCode';
import { logInfo } from '../logger';
const xAuthSchema = joi.object({
  'x-authorization-id': joi.string().required(),
});
const xCorsSchema = joi.object({
  'x-correlation-id': joi.string().required(),
});
const xSessionSchema = joi.object({
  'x-session-id': joi.string().required(),
});
const validateXAuth = (authID: string) => {
  let isValid = true;
  if (authID) {
    const { error } = xAuthSchema.validate(
      { 'x-authorization-id': authID },
      { abortEarly: false }
    );
    if (error) {
      isValid = false;
    }
  } else {
    isValid = false;
  }
  return isValid;
};
const validateXCors = (corsID: string) => {
  let isValid = true;
  if (corsID) {
    const { error } = xCorsSchema.validate(
      { 'x-correlation-id': corsID },
      { abortEarly: false }
    );
    if (error) {
      isValid = false;
    }
  } else {
    isValid = false;
  }
  return isValid;
};
const validateXSession = (sessionID: string) => {
  let isValid = true;
  if (sessionID) {
    const { error } = xSessionSchema.validate(
      { 'x-session-id': sessionID },
      { abortEarly: false }
    );
    if (error) {
      isValid = false;
    }
  } else {
    isValid = false;
  }
  return isValid;
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  logInfo(' >>>>>>>>>>>> method and URL >>>>>>>>>>> ',
    req.rawHeaders[req.rawHeaders.indexOf('Origin')] ?
    req.rawHeaders[req.rawHeaders.indexOf('Origin') + 1] : 'Origin not available');
  const requestHeaders: any = req.headers;
  logInfo(' >>>>>>>>>>>> isAuth requestHeaders >>>>>>>>>>> ', requestHeaders);
  // Check if headers exist
  if (requestHeaders) {
    // Only validate if x-authorization-d exist
    const xauthorizationid: string = <string>req.headers['x-authorization-id'];
    if (!validateXAuth(xauthorizationid)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: 'x-authorization-id supplied is not valid',
      });
    }
    // Only validate if x-correlation-d exist
    const xcorrelationid: string = <string>req.headers['x-correlation-id'];
    if (!validateXCors(xcorrelationid)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: 'x-correlation-id supplied is not valid',
      });
    }
    // Only validate if x-session-d exist
    const xsessionid: string = <string>req.headers['x-session-id'];
    if (!validateXSession(xsessionid)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: 'x-session-id supplied is not valid',
      });
    }
    next();
  } else {
    return res.status(httpStatusCode.BAD_REQUEST).json({
      message: 'Headers not supplied',
    });
  }
};

export const isSeccertAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestHeaders: any = req.headers;
  logInfo(
    ' >>>>>>>>>>>> isSeccertAuth requestHeaders >>>>>>>>>>> ',
    requestHeaders
  );
  // Check if headers exist
  if (requestHeaders) {
    // Only validate if x-correlation-d exist
    const xcorrelationid: string = <string>req.headers['x-correlation-id'];
    if (!validateXCors(xcorrelationid)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: 'x-correlation-id supplied is not valid',
      });
    }
    next();
  } else {
    return res.status(httpStatusCode.BAD_REQUEST).json({
      message: 'Headers not supplied',
    });
  }
};
