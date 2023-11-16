import request from 'supertest';
import express from 'express';

//import activity_route from './app_route';

const app = express();
app.use(express.json());
//app.use('/', activity_route.appRoutes);

// const app_entry_point: string = envConfig.env.APP_ENTRY_POINT;

describe('App Routes', () => {
  test('resposnds to /ready', async () => {
    const res = await request(app).get('/1001');
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(404);
  });
  //   test('resposnds to /live', async () => {
  //     const res = await request(app).get('/live');
  //     expect(res.header['content-type']).toBe('text/html; charset=utf-8');
  //     expect(res.statusCode).toBe(200);
  //   });
  //   test('resposnds to /health', async () => {
  //     const res = await request(app).get('/health');
  //     expect(res.header['content-type']).toBe('text/html; charset=utf-8');
  //     expect(res.statusCode).toBe(200);
  //   });
  //   test('resposnds to app_entry_point/__health', async () => {
  //     const res = await request(app).get(`${app_entry_point}__health`);
  //     expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
  //     expect(res.statusCode).toBe(200);
  //   });
});
