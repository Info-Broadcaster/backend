const request = require('supertest');
const app = require('../index');
const assert = require('assert');

jest.mock('../logique/summarize');
jest.mock('../logique/extractDataFromUrl');

const summarize = require('../logique/summarize');
const extractDataFromUrl = require('../logique/extractDataFromUrl');

describe('POST /api/dialoguewithllama/summarize', () => {
    it('should return 400 if URL is missing', async () => {
        const res = await request(app)
            .post('/api/dialoguewithllama/summarize')
            .set('Content-Type', 'application/json')
            .send({ lang: 'EN' });
        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.text, 'URL is required');
    });

    it('should return 400 if LANG is missing', async () => {
        const res = await request(app)
            .post('/api/dialoguewithllama/summarize')
            .set('Content-Type', 'application/json')
            .send({ url: 'https://test.infobroadcaster.com' });
        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.text, 'LANG is required');
    });

    it('should return 200 if URL and LANG are provided', async () => {
        summarize.mockResolvedValue({
            suggestThemeFromTopicsInBubbles: 'This is a theme',
            summarized: 'This is a summary',
            title: 'This is a title',
            themes: 'theme1, theme2',
            hookphrase: 'This is a hookphrase',
        });

        extractDataFromUrl.mockResolvedValue('This is the extracted data');

        const res = await request(app)
            .post('/api/dialoguewithllama/summarize')
            .set('Content-Type', 'application/json')
            .send({ url: 'https://test.infobroadcaster.com', lang: 'EN' });

        assert.strictEqual(res.status, 200);
        assert.deepStrictEqual(res.body, {
            data: {
                suggestThemeFromTopicsInBubbles: ['This is a theme'],
                summarized: 'This is a summary',
                title: 'This is a title',
                themes: ['theme1', 'theme2'],
                hookphrase: 'This is a hookphrase',
            },
        });
    });

    it('should return 500 if an error occurred', async () => {
        summarize.mockResolvedValue(null);

        const res = await request(app)
            .post('/api/dialoguewithllama/summarize')
            .set('Content-Type', 'application/json')
            .send({ url: 'https://test.infobroadcaster.com', lang: 'EN' });

        assert.strictEqual(res.status, 500);
        assert.strictEqual(res.text, 'Error');
    });
});