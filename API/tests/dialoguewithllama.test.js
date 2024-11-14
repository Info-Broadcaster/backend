const request = require('supertest');
const app = require('../index');
const { test } = require('node:test');
const assert = require('assert');

test('POST /api/dialoguewithllama/summarize should return 400 if URL is missing', async (t) => {
    const res = await request(app)
        .post('/api/dialoguewithllama/summarize')
        .send({ lang: 'EN' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.text, 'URL is required');
});

test('POST /api/dialoguewithllama/summarize should return 400 if LANG is missing', async (t) => {
    const res = await request(app)
        .post('/api/dialoguewithllama/summarize')
        .send({ url: 'http://example.com' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.text, 'LANG is required');
});