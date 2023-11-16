import axios from 'axios';
import { Request } from 'express';
import * as domusCookie from './domusCookie';

describe('domus cookie test cases', () => {
  let mockRequest: Partial<Request>;
  test('DomusCookieResponse returns response', async () => {
    mockRequest = {
      headers: {
        correlationId: '123',
        'x-authorization-id':'temp',
      },
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    axios.post = jest.fn().mockResolvedValue({ data: 'response' });
    const result = await domusCookie.DomusCookieResponse( mockRequest as Request);
    expect(result).toBe('response');
  });
  //
  test('getResponsePayload returns error', async () => {
    const headers = {
      'Content-Type': 'application/json',
    };
    mockRequest = {
      headers: {
        correlationId: '123',
      },
    };
    let x_auth = 'temp';
    axios.post = jest.fn().mockImplementation(() => {
      throw new Error('error at axios connection');
    });
    const result = await domusCookie.DomusCookieResponse( mockRequest as Request);
    expect(result).toMatchObject({
      error: 'Cookie validator service not available.',
      reason: 'error at axios connection for http://localhost:3000/validate/',
    });
  });
});
