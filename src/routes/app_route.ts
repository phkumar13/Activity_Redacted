import express from 'express';
import {
  getActivity,
  getActivities,
  addActivity,
} from '../controller/activity';

import { isAuth } from '../middleware/is-auth';

import dotenv from 'dotenv';
dotenv.config();

const appRoutes = express.Router();

// GET /1
appRoutes.get( '/:prospectId', isAuth, getActivities);

// GET /1/intent
appRoutes.get('/:prospectId/:activity', isAuth, getActivity);

// POST /1
appRoutes.post( '/:prospectId', isAuth, addActivity);


export default { appRoutes };
