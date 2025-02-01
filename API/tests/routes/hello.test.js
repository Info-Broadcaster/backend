const request = require('supertest');
const app = require('../../index');

describe('GET /api/hello', () => {
    it('should return Hello World', async () => {
        const res = await request(app).get('/api/hello');
        expect(res.status).toBe(200);
        expect(res.body).toBe('Hello World');
    });
});