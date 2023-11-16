import { checkTraffic } from './server';
import express from 'express';
import https from 'https';
jest.mock('https', () => ({
    createServer: jest.fn(() => ({ listen: jest.fn() })),
  }));


describe('App Routes', () => {
  const app = express();
  test('resposnds to app_entry_point', async () => {
    await checkTraffic(app, 8088, 'yes');
    expect(https.createServer).toBeCalled();
  });
  test('resposnds to app_entry_point', async () => {
    const app = undefined;
    jest.mock('https', () => ({
        createServer: new Error(),
      }));
    await checkTraffic(undefined, undefined, 'yes');
  });
});
