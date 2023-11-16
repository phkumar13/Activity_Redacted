import express from 'express';
import bodyParser from 'body-parser';
import activity_route from './routes/app_route';
import appSeccertRoutes from './routes/app_seccert_route'
import { logInfo } from './logger';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(function (req, res, next) {
  res.set('Date', '');
  next();
});

// api entry point
const api_context = '/dataapi/activity/v' + process.env.API_VERSION;
logInfo('api_context', api_context);
app.use(api_context, activity_route.appRoutes);
const api_seccert_context = '/dataapi/activity/seccert/v' + process.env.API_VERSION;
app.use(api_seccert_context, appSeccertRoutes.appSeccertRoutes);
export default app;
