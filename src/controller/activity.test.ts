import {
  addActivity,
  getActivities,
  getActivity,
  addSeccretActivity,
} from './activity';
import { Request, Response } from 'express';
import * as validator from '../middleware/paramsValidator';
import { ValidationError } from 'joi';
import * as DomusCookieResponse from '../helpers/domusCookie';
import * as dbQueries from '../utils/azureSql';
import { httpStatusCode } from '../types/enum/httpStatusCode';

describe('activity controller tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    mockRequest = {};
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  test('getActivity with inValid prospect Id should return Bad Request', async () => {
    mockRequest = {
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest
      .spyOn(validator, 'validateProspectParam')
      .mockReturnValue(new ValidationError('error', [], 'error'));
    await getActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Parameter prospectId is not valid',
    });
  });

  test('getActivity with not a Number prospect Id should return Bad Request', async () => {
    mockRequest = {
      params: {
        prospectId: 'abc',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    await getActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Parameter prospectId is not valid',
    });
  });

  test('getActivity with inValid Activity should return Bad Request', async () => {
    mockRequest = {
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest
      .spyOn(validator, 'validateActivityParam')
      .mockReturnValue(new ValidationError('error', [], 'error'));
    await getActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Parameter activity is not valid',
    });
  });

  test('getActivity with headers gives domus cookie should return Not Found', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityParam').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockResolvedValue({ error: 'has Error' });
    await getActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.NOT_FOUND);
    expect(mockResponse.json).toBeCalledWith({
      error: 'has Error',
    });
  });

  test('getActivity with headers gives domus cookie throws an unknown Error should return Internal Server Error', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityParam').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockImplementationOnce(() => {
        throw new Error(undefined);
      });
    await getActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(
      httpStatusCode.INTERNAL_SERVER_ERROR
    );
    expect(mockResponse.json).toBeCalledWith({
      message: 'Some error occurred while fetching prospect activities.',
    });
  });

  test('getActivity with activity found for given prospect should return OK_Status', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityParam').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockResolvedValue({});
    jest.spyOn(dbQueries, 'getRecord');
    jest.spyOn(dbQueries, 'getRecord').mockResolvedValue({
      recordset: [
        {
          activity: undefined,
          activityDate: undefined,
          status: undefined,
        },
        {
          activity: undefined,
          activityDate: undefined,
          status: undefined,
        },
      ],
    });
    await getActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.OK);
    expect(mockResponse.json).toBeCalledWith({
      activity: undefined,
      activityDate: undefined,
      status: undefined,
    });
  });

  test('getActivity with no activity found should return Not Found', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityParam').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockResolvedValue({});
    jest.spyOn(dbQueries, 'getRecord').mockResolvedValue({ recordset: false });
    await getActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.NOT_FOUND);
    expect(mockResponse.json).toBeCalledWith({
      message: 'No activity found for given prospect.',
    });
  });

  test('getActivity with activity found and has error should return Internal Server Error', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityParam').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockResolvedValue({});
    jest
      .spyOn(dbQueries, 'getRecord')
      .mockResolvedValue({ error: 'has Error' });
    await getActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(
      httpStatusCode.INTERNAL_SERVER_ERROR
    );
    expect(mockResponse.json).toBeCalledWith({
      message: 'Some error occurred while fetching prospect activities.',
    });
  });

  test('getActivities with inValid prospect Id should return Bad Request', async () => {
    mockRequest = {
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest
      .spyOn(validator, 'validateProspectParam')
      .mockReturnValue(new ValidationError('error', [], 'error'));
    await getActivities(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Parameter prospectId is not valid',
    });
  });

  test('getActivities with not a Number prospect Id should return Bad Request', async () => {
    mockRequest = {
      params: {
        prospectId: 'abc',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    await getActivities(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Parameter prospectId is not valid',
    });
  });

  test('getActivities with headers gives domus cookie should return Not Found', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityParam').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockResolvedValue({ error: 'has Error' });
    await getActivities(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.NOT_FOUND);
    expect(mockResponse.json).toBeCalledWith({
      error: 'has Error',
    });
  });

  test('getActivities with headers gives domus cookie throws an unknown Error should return Internal Server Error', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityParam').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockImplementationOnce(() => {
        throw new Error(undefined);
      });
    await getActivities(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(
      httpStatusCode.INTERNAL_SERVER_ERROR
    );
    expect(mockResponse.json).toBeCalledWith({
      message: 'Some error occurred while fetching prospect activities.',
    });
  });

  test('getActivities with activities found for given prospect should return OK_Status', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityParam').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockResolvedValue({});
    jest.spyOn(dbQueries, 'getRecord');
    jest.spyOn(dbQueries, 'getRecord').mockResolvedValue({
      recordset: [
        {
          activity: undefined,
          activityDate: undefined,
          status: undefined,
        },
        {
          activity: undefined,
          activityDate: undefined,
          status: undefined,
        },
      ],
    });
    await getActivities(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.OK);
    expect(mockResponse.json).toBeCalledWith([
      {
        activity: undefined,
        activityDate: undefined,
        status: undefined,
      },
      {
        activity: undefined,
        activityDate: undefined,
        status: undefined,
      },
    ]);
  });

  test('getActivities with no activities found should return Not Found', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityParam').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockResolvedValue({});
    jest.spyOn(dbQueries, 'getRecord').mockResolvedValue({ recordset: false });
    await getActivities(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.NOT_FOUND);
    expect(mockResponse.json).toBeCalledWith({
      message: 'No activities found for given prospect.',
    });
  });

  test.each(['2023-02-4','2023-22-04'])('addActivity with inValid Date %s should return Bad Request', async (dateInParams:string) => {
    mockRequest = {
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
      body: {
        activityDate: dateInParams,
      },
    };
    jest
      .spyOn(validator, 'validateProspectParam')
      .mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityBody').mockReturnValue(undefined);
    await addActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Date format is not valid',
    });
  });
  test('addActivity with inValid prospect Id should return Bad Request', async () => {
    mockRequest = {
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
      body: {
        activityDate: '2023-02-14',
      },
    };
    jest
      .spyOn(validator, 'validateProspectParam')
      .mockReturnValue(new ValidationError('error', [], 'error'));
    jest.spyOn(validator, 'validateActivityBody').mockReturnValue(undefined);
    await addActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Parameter prospectId is not valid',
    });
  });
  test('addActivity with inValid request body should return Bad Request', async () => {
    mockRequest = {
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
      body: {
        activityDate: '2023-02-14',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest
      .spyOn(validator, 'validateActivityBody')
      .mockReturnValue(new ValidationError('error', [], 'error'));
    await addActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Request body is not valid',
    });
  });

  test('addActivity with not a Number prospect Id should return Bad Request', async () => {
    mockRequest = {
      params: {
        prospectId: 'abc',
        activity: 'temp',
      },
      body: {
        activityDate: '2023-02-14',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityBody').mockReturnValue(undefined);
    await addActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Parameter prospectId is not valid',
    });
  });
  test('addActivity with headers but no body should return Bad Request', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
      body: {
        activityDate: '2023-02-14',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityBody').mockReturnValue(undefined);
    await addActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Supplied activity details not valid',
    });
  });

  test('addActivity with headers gives domus cookie should return Not Found', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
      body: {
        activity: 'temp',
        status: 'temp',
        activityDate: '2023-02-14',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityBody').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockResolvedValue({ error: 'has Error' });
    await addActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.NOT_FOUND);
    expect(mockResponse.json).toBeCalledWith({
      error: 'has Error',
    });
  });

  test('addActivity with headers gives domus cookie throws an unknown Error should return Internal Server Error', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
      body: {
        activity: 'temp',
        status: 'temp',
        activityDate: '2023-02-14',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityBody').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockImplementationOnce(() => {
        throw new Error(undefined);
      });
    await addActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(
      httpStatusCode.INTERNAL_SERVER_ERROR
    );
    expect(mockResponse.json).toBeCalledWith({
      message: 'Some error occurred while adding prospect activity.',
    });
  });

  test('addActivity with correct activity details should return Created_Status', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
      body: {
        activity: 'temp',
        status: 'temp',
        activityDate: '2023-02-14 03:02:46Z',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityBody').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockResolvedValue({});
    jest
      .spyOn(dbQueries, 'getRecord')
      .mockResolvedValue({ recordset: ['1', '2'] });
    jest.spyOn(dbQueries, 'insertRecord').mockResolvedValue(() => {
      console.log(`record inserted`);
    });
    await addActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.CREATED);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Successfully added prospect activity',
    });
  });

  test('addActivity with correct activity details & No prospect found should return Not Found', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
      body: {
        activity: 'temp',
        status: 'temp',
        activityDate: '2023-02-14',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(validator, 'validateActivityBody').mockReturnValue(undefined);
    jest
      .spyOn(DomusCookieResponse, 'DomusCookieResponse')
      .mockResolvedValue({});
    jest.spyOn(dbQueries, 'getRecord').mockResolvedValue({ recordset: [] });
    await addActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.NOT_FOUND);
    expect(mockResponse.json).toBeCalledWith({
      message: 'No prospect found for given prospect id.',
    });
  });

  test('addSeccretActivity with inValid prospect Id should return Bad Request', async () => {
    mockRequest = {
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
    };
    jest
      .spyOn(validator, 'validateProspectParam')
      .mockReturnValue(new ValidationError('error', [], 'error'));
    await addSeccretActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Parameter prospectId is not valid',
    });
  });
  test('addSeccretActivity with not a Number prospect Id should return Bad Request', async () => {
    mockRequest = {
      params: {
        prospectId: 'abc',
        activity: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    await addSeccretActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Parameter prospectId is not valid',
    });
  });
  test('addSeccretActivity with headers but no body should return Bad Request', async () => {
    mockRequest = {
      headers: { '': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
      body: {},
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    await addSeccretActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Supplied activity details not valid',
    });
  });
  test('addSeccretActivity with correct activity details should return Created_Status', async () => {
    mockRequest = {
      headers: { '': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
      body: {
        activity: 'temp',
        status: 'temp',
        activityDate: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest
      .spyOn(dbQueries, 'getRecord')
      .mockResolvedValue({ recordset: ['1', '2'] });
    jest.spyOn(dbQueries, 'insertRecord').mockResolvedValue(() => {
      console.log(`record inserted`);
    });
    await addSeccretActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.CREATED);
    expect(mockResponse.json).toBeCalledWith({
      message: 'Successfully added prospect activity',
    });
  });

  test('addSeccretActivity with correct activity details & No prospect found should return Not Found', async () => {
    mockRequest = {
      headers: { '': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
      body: {
        activity: 'temp',
        status: 'temp',
        activityDate: 'temp',
      },
    };
    jest.spyOn(validator, 'validateProspectParam').mockReturnValue(undefined);
    jest.spyOn(dbQueries, 'getRecord').mockResolvedValue({ recordset: [] });
    await addSeccretActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(httpStatusCode.NOT_FOUND);
    expect(mockResponse.json).toBeCalledWith({
      message: 'No prospect found for given prospect id.',
    });
  });
  test('addSeccretActivity with headers gives domus cookie throws an unknown Error should return Internal Server Error', async () => {
    mockRequest = {
      headers: { 'x-authorization-id': 'temp' },
      params: {
        prospectId: '100001',
        activity: 'temp',
      },
      body: {
        activity: 'temp',
        status: 'temp',
        activityDate: 'temp',
      },
    };
    jest
      .spyOn(validator, 'validateProspectParam')
      .mockImplementationOnce(() => {
        throw new Error(undefined);
      });
    await addSeccretActivity(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(
      httpStatusCode.INTERNAL_SERVER_ERROR
    );
    expect(mockResponse.json).toBeCalledWith({
      message: 'Some error occurred while adding prospect activity.',
    });
  });

});
