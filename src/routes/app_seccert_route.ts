import express from 'express';
import {
  addSeccretActivity,
} from '../controller/activity';
import clientCertificateAuth from '../middleware/clientCertificateAuth';

import { isSeccertAuth } from '../middleware/is-auth';

import dotenv from 'dotenv';
dotenv.config();

const appSeccertRoutes = express.Router();

appSeccertRoutes.post(
  '/:prospectId',
  isSeccertAuth,
  clientCertificateAuth,
  addSeccretActivity
);

export default { appSeccertRoutes };
