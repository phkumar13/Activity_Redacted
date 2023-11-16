import { Request, Response } from 'express';
import { httpStatusCode } from '../types/enum/httpStatusCode';
import { logInfo, logError } from '../logger';
import { DomusCookieResponse } from '../helpers/domusCookie';
import { getRecord, insertRecord } from '../utils/azureSql';
import {
  validateProspectParam,
  validateActivityParam,
  validateActivityBody,
} from '../middleware/paramsValidator';
import {
  ActivityQuery,
  AllActivitiesQuery,
  AddActivityQuery,
  ProspectQuery,
} from '../utils/dbQueries';

const GetActivityJson = (activity: any) => {
  return {
    activity: activity.Activity,
    status: activity.Status,
    activityDate: activity.ActivityDate,
  };
};

export const getActivity = async (req: Request, res: Response) => {
  const prospectId: string = req.params.prospectId;
  const activity: string = req.params.activity;
  const errorMessage = 'Parameter prospectId is not valid';

  logInfo('Request Parameters received ', ' getActivity ', {
    prospectId: prospectId,
    activity: activity,
  });

  try {
    // Validate Parameters
    if (validateProspectParam(prospectId)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: errorMessage,
      });
    }
    if (Number.isNaN(Number.parseFloat(prospectId))) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: errorMessage,
      });
    }

    if (validateActivityParam(activity)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: 'Parameter activity is not valid',
      });
    }

    // Invoke Domus Cookie Validator
    const domus_cookie_response: Promise<any> = await DomusCookieResponse(req);
    logInfo(
      'Domus Cookie Validator Response >>>> ',
      ' getActivity - ',
      domus_cookie_response
    );
    if (!Object.prototype.hasOwnProperty.call(domus_cookie_response, 'error')) {
      const activitiesDbResponse = await getRecord(
        ActivityQuery(prospectId, activity)
      );
      logInfo('Activity', ' getActivity - ', activitiesDbResponse);

      if (
        !Object.prototype.hasOwnProperty.call(activitiesDbResponse, 'error')
      ) {
        const activities = activitiesDbResponse.recordset;
        if (activities.length > 0) {
          return res
            .status(httpStatusCode.OK)
            .json(GetActivityJson(activities[0]));
        } else {
          return res.status(httpStatusCode.NOT_FOUND).json({
            message: 'No activity found for given prospect.',
          });
        }
      } else {
        return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
          message: 'Some error occurred while fetching prospect activities.',
        });
      }
    } else {
      return res.status(httpStatusCode.NOT_FOUND).json(domus_cookie_response);
    }
  } catch (err: any) {
    logError(err, `getActivity - ${httpStatusCode.INTERNAL_SERVER_ERROR}`);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      message:
        err.message ||
        'Some error occurred while fetching prospect activities.',
    });
  }
};

export const getActivities = async (req: Request, res: Response) => {
  const prospectId = req.params.prospectId;
  const errorMessage = 'Parameter prospectId is not valid';

  try {
    if (validateProspectParam(prospectId)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: errorMessage,
      });
    }
    if (Number.isNaN(Number.parseFloat(prospectId))) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: errorMessage,
      });
    }

    // Invoke Domus Cookie Validator
    const domus_cookie_response = await DomusCookieResponse(req);
    logInfo(
      'Domus Cookie Validator Response >>>> ',
      ' getActivity - ',
      domus_cookie_response
    );

    if (!Object.prototype.hasOwnProperty.call(domus_cookie_response, 'error')) {
      const activities = (await getRecord(AllActivitiesQuery(prospectId)))
        .recordset;
      logInfo('Activity', ' getActivities - ', activities);

      if (activities.length > 0) {
        const activitiesList: any = [];
        activities.forEach((element: any) => {
          activitiesList.push(GetActivityJson(element));
        });
        return res.status(httpStatusCode.OK).json(activitiesList);
      } else {
        return res.status(httpStatusCode.NOT_FOUND).json({
          message: 'No activities found for given prospect.',
        });
      }
    } else {
      return res.status(httpStatusCode.NOT_FOUND).json(domus_cookie_response);
    }
  } catch (err: any) {
    logError(err, `getActivities - ${httpStatusCode.INTERNAL_SERVER_ERROR}`);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      message:
        err.message ||
        'Some error occurred while fetching prospect activities.',
    });
  }
};

const dateToEpoch = (activityDate: any)=> {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const dateTimeRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/ 
  const dateTimeRegexWithoutT = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/;

  try{
    if (dateTimeRegex.test(activityDate) || dateTimeRegexWithoutT.test(activityDate)) {
      return new Date(activityDate).toISOString();
    } else if (dateRegex.test(activityDate)) {
      const currentTime = new Date().toLocaleString().slice(10);
      return new Date(activityDate + currentTime).toISOString();
    } else {
      return 'Incorrect Date Format'
    }
  }catch(err){
    return 'Incorrect Date Format'
  }
}
export const addActivity = async (req: Request, res: Response) => {
  const prospectId = req.params.prospectId;
  const errorMessage = 'Parameter prospectId is not valid';

  try {
    if (validateProspectParam(prospectId)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: errorMessage,
      });
    }
    if (validateActivityBody(req.body)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: 'Request body is not valid',
      });
    }
    req.body.activityDate = dateToEpoch(req.body.activityDate);
    if (req.body.activityDate == 'Incorrect Date Format') {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: 'Date format is not valid',
      });
    }
    if (Number.isNaN(Number.parseFloat(prospectId))) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: errorMessage,
      });
    }

    // Invoke Domus Cookie Validator
    const domus_cookie_response = await DomusCookieResponse(req);
    logInfo(
      'Domus Cookie Validator Response >>>> ',
      ' getActivity - ',
      domus_cookie_response
    );

    const newActivity = {
      prospectId: prospectId,
      activity: req.body.activity,
      status: req.body.status,
      activityDate: req.body.activityDate,
    };
    logInfo('new Activity', ' addActivity - ', newActivity);

    if (
      !newActivity.activity ||
      !newActivity.status ||
      !newActivity.activityDate
    ) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: 'Supplied activity details not valid',
      });
    }

    if (!Object.prototype.hasOwnProperty.call(domus_cookie_response, 'error')) {
      // Check if prospect exist in the database.
      const prospect = (await getRecord(ProspectQuery(prospectId))).recordset;
      logInfo('>>>>>>>> Prospect >>>>>>>>>>', ' addActivity - ', prospect);

      if (prospect.length > 0) {
        // Add new Activity
        await insertRecord(
          AddActivityQuery(
            prospectId,
            newActivity.activity,
            newActivity.status,
            newActivity.activityDate
          )
        );
        logInfo(
          'Activity',
          ' addActivity - Successfully added prospect activity'
        );

        res.status(httpStatusCode.CREATED).json({
          message: 'Successfully added prospect activity',
        });
      } else {
        // Prospect not found - invalid prospect
        return res.status(httpStatusCode.NOT_FOUND).json({
          message: 'No prospect found for given prospect id.',
        });
      }
    } else {
      return res.status(httpStatusCode.NOT_FOUND).json(domus_cookie_response);
    }
  } catch (err: any) {
    logError(err, `addActivity - ${httpStatusCode.INTERNAL_SERVER_ERROR}`);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      message:
        err.message || 'Some error occurred while adding prospect activity.',
    });
  }
};

export const addSeccretActivity = async (req: Request, res: Response) => {
  const prospectId = req.params.prospectId;
  const errorMessage = 'Parameter prospectId is not valid';
  logInfo(' >>>>>>>>>>>> add Seccret Activity >>>>>>>>>>> ');

  try {
    if (validateProspectParam(prospectId)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: errorMessage,
      });
    }
    if (Number.isNaN(Number.parseFloat(prospectId))) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: errorMessage,
      });
    }

    const newActivity = {
      prospectId: prospectId,
      activity: req.body.activity,
      status: req.body.status,
      activityDate: req.body.activityDate,
    };
    logInfo('new Activity', ' addActivity - ', newActivity);

    if (
      !newActivity.activity ||
      !newActivity.status ||
      !newActivity.activityDate
    ) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: 'Supplied activity details not valid',
      });
    }

    // Check if prospect exist in the database.
    const prospect = (await getRecord(ProspectQuery(prospectId))).recordset;
    logInfo('>>>>>>>> Prospect >>>>>>>>>>', ' addActivity - ', prospect);

    if (prospect.length > 0) {
      // Add new Activity
      await insertRecord(
        AddActivityQuery(
          prospectId,
          newActivity.activity,
          newActivity.status,
          newActivity.activityDate
        )
      );
      logInfo(
        'Activity',
        ' addActivity - Successfully added prospect activity'
      );

      res.status(httpStatusCode.CREATED).json({
        message: 'Successfully added prospect activity',
      });
    } else {
      // Prospect not found - invalid prospect
      return res.status(httpStatusCode.NOT_FOUND).json({
        message: 'No prospect found for given prospect id.',
      });
    }
  } catch (err: any) {
    logError(err, `addSeccertActivity - ${httpStatusCode.INTERNAL_SERVER_ERROR}`);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      message:
        err.message || 'Some error occurred while adding prospect activity.',
    });
  }
};

