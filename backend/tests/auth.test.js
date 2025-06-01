// backend/tests/auth.test.js
const request = require('supertest');
const app = require('../server');

jest.mock('../config/db', () => ({ query: jest.fn() }));

describe('POST /api/auth/login', () => {
  it('renvoie 400 et un tableau errors si email manquant', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: '123456' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);
  });
});
