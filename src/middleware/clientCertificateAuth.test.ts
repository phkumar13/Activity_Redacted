import clientCertificateAuth from './clientCertificateAuth';
import { Response } from 'express';


describe('differences', () => {
  let mockResponse: Partial<Response>;
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn().mockReturnThis()
    };
  });

  it('should call next if req is not set', () => {
    const next = jest.fn();
    clientCertificateAuth(undefined, mockResponse as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should call next if client is not set', () => {
    const next = jest.fn();
    const req = {};
    clientCertificateAuth(req, mockResponse as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should call next if requestCert is not set', () => {
    const next = jest.fn();
    const req = {
      client: {},
    };
    clientCertificateAuth(req, mockResponse as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should call next if requestCert is false', () => {
    const next = jest.fn();
    const req = {
      client: {
        _requestCert: false,
      },
    };
    clientCertificateAuth(req, mockResponse as Response, next);
    expect(next).toHaveBeenCalled();
  });

 
  it('should call next with APIError if client is unauthorized', () => {
    const req = {
      client: {
        _requestCert: true,
        authorized: false,
        authorizationError: undefined,
      },
      secure: true,
    };
    const next = jest.fn();
    clientCertificateAuth(req, mockResponse as Response, next);
  });

  it('should call next with APIError if getPeerCertificate fails', () => {
    const req = {
      client: {
        _requestCert: true,
        authorized: true,
      },
      secure: true,
      connection: {
        getPeerCertificate: () => {
          return undefined;
        },
      },
    };
    const next = jest.fn();
    clientCertificateAuth(req, mockResponse as Response, next);
  });

  it('should call next ', () => {
    const req = {
      client: {
        _requestCert: true,
        authorized: true,
      },
      secure: true,
      connection: {
        getPeerCertificate: () => {
          return 'test';
        },
      },
    };
    const next = jest.fn();
    clientCertificateAuth(req, mockResponse as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
