/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
describe('azureSql', () => {

  const logInfoMock = jest.fn();
  const logErrorMock = jest.fn();

  beforeEach(() => {
    jest.resetModules();
    jest.doMock('../logger', () => ({
      logInfo: logInfoMock,
      logError: logErrorMock,
    }));

    jest.doMock('../config/dbConfig', () => {
      return {
        __esModule: true,
        default: jest.fn(),
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.resetModules();
  });

  let mockQuery: any;
  const mockClose = jest.fn();
  const mockExecute = jest.fn();
  let mockConnect: any;
  let mockRequest: any;

  const setup = (connectFn: any, queryFn: any) => {
    mockQuery = queryFn;
    const mockInput = jest.fn().mockReturnValue({ execute: mockExecute });
    mockRequest = jest.fn().mockReturnValue({
      input: mockInput,
      query: mockQuery,
    });

    mockConnect = connectFn;
    connectFn.request = mockRequest;
    jest.doMock('mssql', () => ({
      ConnectionPool: jest.fn().mockReturnValue({
        connect: mockConnect,
        close: mockClose,
      }),
      Request: mockRequest,
      NVarChar: jest.fn(),
    }));
  };

  test.each(['insertRecord', 'getRecord', 'updateRecord'])(
    '%s calls db conns with sql parameter',
    async (functionName: any) => {
      const databaseResult = '';
      const mockTransaction = jest.fn().mockImplementation(() => {
        return {
          commit: jest.fn(),
          rollback: jest.fn(),
        };
      });
      setup(
        jest.fn().mockImplementation(() => {
          return Promise.resolve({
            transaction: mockTransaction,
            close: mockClose,
            request: mockRequest,
          });
        }),
        jest.fn().mockResolvedValue(databaseResult)
      );
      const sqlQuery = 'select';
      const azureSql = require('./azureSql');
      const result = await azureSql[functionName](sqlQuery);
      expect(mockQuery).toBeCalledWith(sqlQuery);
      expect(mockConnect).toBeCalled();
      expect(mockClose).toBeCalled();
      expect(result).toEqual(databaseResult);
      expect(logInfoMock).toBeCalledTimes(2);
      expect(logErrorMock).not.toBeCalled();
    }
  );

  test.each(['insertRecord', 'getRecord', 'updateRecord'])(
    '%s throws error when db.query throws error',
    async (functionName: any) => {
      const mockTransaction = jest.fn().mockImplementation(() => {
        return {
          commit: jest.fn(),
          rollback: jest.fn(),
        };
      });
      const errorMessage = 'dbOperation Connection Error';
      setup(
        jest.fn().mockImplementation(() => {
          return Promise.resolve({
            transaction: mockTransaction,
            close: mockClose,
            request: mockRequest,
          });
        }),
        jest.fn().mockRejectedValue(new Error(errorMessage))
      );
      const sqlQuery = 'select';
      const azureSql = require('./azureSql');
      const result = await azureSql[functionName](sqlQuery);
      expect(result).toEqual(undefined);
      expect(mockQuery).toBeCalled();
      expect(mockConnect).toBeCalled();
      expect(mockClose).toBeCalled();
      expect(logErrorMock).toBeCalledTimes(1);
      expect(logInfoMock).toBeCalledTimes(1);
    }
  );

  test.each(['insertRecord', 'getRecord', 'updateRecord'])(
    '%s throws error when db.connection throws error',
    async (functionName: any) => {
      const errorMessage = 'dbOperation Connection Error';
      setup(jest.fn().mockRejectedValue(new Error(errorMessage)), jest.fn());
      const sqlQuery = 'select';
      const azureSql = require('./azureSql');
      const result = await azureSql[functionName](sqlQuery);
      expect(result).toEqual(undefined);
      expect(mockConnect).toBeCalled();
      expect(mockClose).not.toBeCalled();
      expect(logErrorMock).toBeCalledTimes(1);
      expect(logInfoMock).toBeCalledTimes(1);
    }
  );
});
