// tests/route.test.js

const request = require('supertest');
const server = require('../server');

describe('API Routes', () => {
  test('GET /api/hello should return a hello message', async () => {
    const response = await request(server).get('/');
    
    //expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello' });
  });
});
