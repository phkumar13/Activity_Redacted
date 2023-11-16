import request from 'supertest';

import {server} from './index';

const app_entry_point: string = '/dataapi/activity/';

describe('App Routes', () => {
  afterAll((done) => {
    server.close(() => {
      console.log(`Server stopped`);
      done();
    });
  });
  test.each(['ready', 'live', '__health', 'health'])(
    'resposnds to app_entry_point/%s',
    async (pathInParam: string) => {
      const res = await request(server).get(`${app_entry_point}${pathInParam}`);
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8'
      );
      expect(res.statusCode).toBe(200);
    }
  );
  test.each(['ready', 'live', '__health', 'health'])(
    'resposnds to /%s',
    async (pathInParam: string) => {
      const res = await request(server).get(`/${pathInParam}`);
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8'
      );
      expect(res.statusCode).toBe(200);
    }
  );
  test('resposnds to *', async () => {
    const res = await request(server).get('/*');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(400);
  });
  test('resposnds to app_entry_point', async () => {
    const res = await request(server).get(`${app_entry_point}`);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });
});
