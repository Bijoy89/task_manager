process.env.DB_PATH = './data/test.db';
const fs = require('fs');
const request = require('supertest');
const app = require('../src/app');

const dbFile = './data/test.db';

afterAll(() => {
  if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);
  if (fs.existsSync(dbFile + '-wal')) fs.unlinkSync(dbFile + '-wal');
  if (fs.existsSync(dbFile + '-shm')) fs.unlinkSync(dbFile + '-shm');
});

describe('Task API', () => {
  let createdId;

  test('POST /api/tasks rejects missing title', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'no title' });
    expect(res.status).toBe(400);
  });

  test('POST /api/tasks creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Write report', priority: 'High', status: 'Pending' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Write report');
    createdId = res.body.id;
  });

  test('GET /api/tasks returns list including created task', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.some((t) => t.id === createdId)).toBe(true);
  });

  test('PUT /api/tasks/:id updates status', async () => {
    const res = await request(app).put(`/api/tasks/${createdId}`).send({ status: 'Completed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Completed');
  });

  test('DELETE /api/tasks/:id removes task', async () => {
    const res = await request(app).delete(`/api/tasks/${createdId}`);
    expect(res.status).toBe(200);
    const check = await request(app).get(`/api/tasks/${createdId}`);
    expect(check.status).toBe(404);
  });
});