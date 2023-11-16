import { isAuth, isSeccertAuth } from './is-auth';
import { NextFunction, Response, Request } from 'express';

describe('authentication validator tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      rawHeaders: [],
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('without Headers', async () => {
    const expectedResponse = {
      message: 'Headers not supplied',
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test('with empty authorisation Header', async () => {
    mockRequest = {
      ...mockRequest,
      headers: {
        'x-authorization-id': '',
      },
    };
    const expectedResponse = {
      message: 'x-authorization-id supplied is not valid',
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test('with inValid authorisation Header', async () => {
    mockRequest = {
      ...mockRequest,
      headers: {
        'x-authorization-id': ['testauth1', 'testauth2'],
      },
    };
    const expectedResponse = {
      message: 'x-authorization-id supplied is not valid',
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test('with only authorisation id in Header', async () => {
    mockRequest = {
      ...mockRequest,
      headers: {
        'x-authorization-id': 'TestAuth',
      },
    };
    const expectedResponse = {
      message: 'x-correlation-id supplied is not valid',
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test('with empty correlation ID', async () => {
    mockRequest = {
      ...mockRequest,
      headers: {
        'x-authorization-id': 'TestAuth',
        'x-correlation-id': '',
      },
    };
    const expectedResponse = {
      message: 'x-correlation-id supplied is not valid',
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test('with inValid correlation ID', async () => {
    mockRequest = {
      ...mockRequest,
      headers: {
        'x-authorization-id': 'TestAuth',
        'x-correlation-id': ['testcor1', 'testcor2'],
      },
    };
    const expectedResponse = {
      message: 'x-correlation-id supplied is not valid',
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });
  test('with authorization and correlation headers only', async () => {
    mockRequest = {
      ...mockRequest,
      headers: {
        'x-authorization-id': 'TestAuth',
        'x-correlation-id': 'TestCors',
      },
    };
    const expectedResponse = {
      message: 'x-session-id supplied is not valid',
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test('with empty Session header', async () => {
    mockRequest = {
      ...mockRequest,
      headers: {
        'x-authorization-id': 'TestAuth',
        'x-correlation-id': 'TestCors',
        'x-session-id': '',
      },
    };
    const expectedResponse = {
      message: 'x-session-id supplied is not valid',
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });
  test('with inValid Session header', async () => {
    mockRequest = {
      ...mockRequest,
      headers: {
        'x-authorization-id': 'TestAuth',
        'x-correlation-id': 'TestCors',
        'x-session-id': ['testsession1', 'testsession2'],
      },
    };
    const expectedResponse = {
      message: 'x-session-id supplied is not valid',
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });
  test('with empty Session header', async () => {
    mockRequest = {
      rawHeaders:['Origin'],
      headers: {
        'x-authorization-id': 'TestAuth',
        'x-correlation-id': 'TestCors',
        'x-session-id': 'testsession',
      },
    };
    const expectedResponse = {
      message: 'x-session-id supplied is not valid',
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledTimes(0);
  });
});

describe('authentication validator isSeccertAuth tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  test('without Headers', async () => {
    const expectedResponse = {
      message: 'Headers not supplied',
    };
    isSeccertAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });
  test('with empty correlation ID', async () => {
    mockRequest = {
      headers: {
        'x-correlation-id': '',
      },
    };
    const expectedResponse = {
      message: 'x-correlation-id supplied is not valid',
    };
    isSeccertAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test('with inValid correlation ID', async () => {
    mockRequest = {
      headers: {
        'x-correlation-id': ['testcor1', 'testcor2'],
      },
    };
    const expectedResponse = {
      message: 'x-correlation-id supplied is not valid',
    };
    isSeccertAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });
  test('with inValid correlation ID', async () => {
    mockRequest = {
      headers: {
        'x-correlation-id': 'testcor1',
      },
    };
    isSeccertAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(nextFunction).toHaveBeenCalled();
  });
});
