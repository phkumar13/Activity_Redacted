import { Response } from 'express';
import { httpStatusCode } from '../types/enum/httpStatusCode';

const clientCertificateAuth = (req: any, res: Response, next: any) => {
  if (req && req.client && req.client['_requestCert']) {
    // Try to do an SSL redirect if this doesn't look like an SSL request.
    // Ensure that the certificate was validated at the protocol level
    if (!req.client.authorized) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: 'Unauthorized: Client certificate required ',
      });
    }

    // Obtain certificate details
    const cert = req.connection.getPeerCertificate();
    if (!cert || !Object.keys(cert).length) {
      // Handle the bizarre and probably not-real case that a certificate was
      // validated but we can't actually inspect it
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message:
          '\'Client certificate was authenticated but certificate information could not be retrieved.\'',
      });
    }
    return next();
  }
  return next();
};

export default clientCertificateAuth;
