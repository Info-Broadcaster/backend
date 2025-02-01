const request = require('supertest');
const express = require('express');
const router = require('../../routes/extractDataFromUrl');
const extractDataFromUrl = require('../../logique/extractDataFromUrl');
const summarize = require('../../logique/summarize');

jest.mock('../../logique/extractDataFromUrl');
jest.mock('../../logique/summarize');

const app = express();
app.use(express.json());
app.use('/extract', router);

describe('POST /extract', () => {
    it('should return 400 if URL is missing', async () => {
        const res = await request(app)
            .post('/extract')
            .send({ lang: 'en' });

        expect(res.status).toBe(400);
        expect(res.text).toBe('URL is required');
    });

    it('should return 400 if LANG is missing', async () => {
        const res = await request(app)
            .post('/extract')
            .send({ url: 'http://example.com' });

        expect(res.status).toBe(400);
        expect(res.text).toBe('LANG is required');
    });

    it('should return 200 and summarized data if extraction and summarization succeed', async () => {
        extractDataFromUrl.mockResolvedValue('extracted data');
        summarize.mockResolvedValue({
            summarized: 'summary',
            title: 'title',
            themes: ['theme1', 'theme2'],
            suggestThemeFromTopicsInBubbles: 'suggested theme'
        });

        const res = await request(app)
            .post('/extract')
            .send({ url: 'http://example.com', lang: 'en', xpath: '//div' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            data: {
                summarized: 'summary',
                title: 'title',
                themes: ['theme1', 'theme2'],
                suggestThemeFromTopicsInBubbles: 'suggested theme'
            }
        });
    });

    it('should return 500 if data extraction or summarization fails', async () => {
        extractDataFromUrl.mockResolvedValue('extracted data');
        summarize.mockRejectedValue(new Error('Summarization failed'));

        const res = await request(app)
            .post('/extract')
            .send({ url: 'http://example.com', lang: 'en', xpath: '//div' });

        expect(res.status).toBe(500);
        expect(res.body).toEqual({
            error: "Failed to extract data.",
            details: "Summarization failed"
        });
    });
});