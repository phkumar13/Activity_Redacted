import https from 'https';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { logInfo } from './logger';


export const checkTraffic = (
  app: any,
  port: any,
  isHttpsTrafficAllowed: any
) => {
  if (isHttpsTrafficAllowed === 'yes') {
    dotenv.config();
    try {
      const certPath = path.join(
        process.cwd(),
        <string>process.env.CERTIFICATE_PATH
      );
      const certKeyPath = path.join(
        process.cwd(),
        <string>process.env.CERTIFICATE_KEY_PATH
      );
      const httpsCreds = {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(certKeyPath),
        ca: fs.readFileSync(certPath),
        requestCert: true,
        rejectUnauthorized: false,
      };
      const server = https.createServer(httpsCreds, app).listen(port);
      logInfo(`Server listening on https port:${port}`);
      return server;
    } catch (e) {
      logInfo('No HTTPS version of the server running');
    }
  } else {
    const server = app.listen(port, () => {
      console.log(`Server running on port:${port}`);
    });
    return server;
  }
};
