describe('logger', () => {
  beforeAll(() => {});

  afterAll(() => {
    delete process.env.NODE_CONFIG_DIR;
    delete process.env.SUPPRESS_NO_CONFIG_WARNING;
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('Successfully log a standard Error', async () => {
    const logger = require('./index');
    const errorLogger = jest.spyOn(logger, 'getLogger');
    logger.logError('message', new Error('Error'), 'source');
    expect(errorLogger).toBeCalled();
  });
  test('Successfully log a standard Error without message', async () => {
    const logger = require('./index');
    const errorLogger = jest.spyOn(logger, 'getLogger');
    logger.logError(new Error('Error'));
    expect(errorLogger).toBeCalled();
  });
  test('Successfully call logInfo method', async () => {
    const logger = require('./index');
    process.env.NODE_ENV = 'production';
    const getApplicationOutLogger = jest.spyOn(logger, 'getLogger');
    logger.logInfo('message', 'source', '{ "thisIsA", "response" }');
    expect(getApplicationOutLogger).toBeCalled();
    delete process.env.NODE_ENV;
  });
});
