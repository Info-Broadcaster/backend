const request = require('supertest');
const app = require('../index'); // Adjust the path as necessary
const { test } = require('node:test');
const assert = require('assert');

test('GET /api/hello should return Hello World', async (t) => {
    const res = await request(app).get('/api/hello');
    assert.equal(res.status, 200);
    assert.equal(res.body, 'Hello World');
});