const extractDataFromUrl = require('../logique/extractDataFromUrl');
const puppeteer = require('puppeteer');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

jest.mock('puppeteer');
jest.mock('@mozilla/readability');
jest.mock('jsdom');

describe('extractDataFromUrl', () => {
    let mockBrowser, mockPage;

    beforeEach(() => {
        mockPage = {
            setViewport: jest.fn(),
            setDefaultTimeout: jest.fn(),
            goto: jest.fn(),
            content: jest.fn().mockResolvedValue('<html><body>Hello there 😶‍🌫️! This is just a mock article from WRKT.</body></html>'),
        };

        mockBrowser = {
            newPage: jest.fn().mockResolvedValue(mockPage),
            close: jest.fn(),
        };

        puppeteer.launch.mockResolvedValue(mockBrowser);

        // Mock Readability
        const mockReadability = {
            parse: jest.fn().mockReturnValue({ textContent: 'Hello there 😶‍🌫️! This is just a mock article from WRKT.' })
        };
        Readability.mockImplementation(() => mockReadability);

        // Mock JSDOM
        JSDOM.mockImplementation(() => ({
            window: {
                document: {}
            }
        }));
    });

    it('should extract readable text from a valid URL', async () => {
        const result = await extractDataFromUrl('https://wrkt-fake-article.com');
        expect(result).toBe('Hello there 😶‍🌫️! This is just a mock article from WRKT.');
        expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should handle puppeteer.launch() failure', async () => {
        puppeteer.launch.mockRejectedValue(new Error('Failed to launch browser'));

        await expect(extractDataFromUrl('https://wrkt-fake-article.com')).rejects.toThrow('Page failed to load');
    });

    it('should handle page.goto() failure', async () => {
        mockPage.goto.mockRejectedValue(new Error('Navigation error'));

        await expect(extractDataFromUrl('https://wrkt-fake-article.com')).rejects.toThrow('Page failed to load');
        expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should handle page.content() failure', async () => {
        mockPage.content.mockRejectedValue(new Error('Content loading error'));

        await expect(extractDataFromUrl('https://wrkt-fake-article.com')).rejects.toThrow('Page failed to load');
        expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should handle Readability.parse() failure', async () => {
        mockPage.content.mockResolvedValue('<html><body></body></html>');
        Readability.mockImplementation(() => {
            throw new Error('Readability error');
        });
        await expect(extractDataFromUrl('https://wrkt-fake-article.com')).rejects.toThrow('Page failed to load');
        expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should set correct browser launch arguments', async () => {
        await extractDataFromUrl('https://wrkt-fake-article.com');
        expect(puppeteer.launch).toHaveBeenCalledWith({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    });

    it('should set viewport to 1000x1000', async () => {
        await extractDataFromUrl('https://wrkt-fake-article.com');
        expect(mockPage.setViewport).toHaveBeenCalledWith({ width: 1000, height: 1000 });
    });

    it('should set default timeout to 5 minutes', async () => {
        await extractDataFromUrl('https://wrkt-fake-article.com');
        expect(mockPage.setDefaultTimeout).toHaveBeenCalledWith(300000);
    });

    it('should wait for network idle before parsing', async () => {
        await extractDataFromUrl('https://wrkt-fake-article.com');
        expect(mockPage.goto).toHaveBeenCalledWith('https://wrkt-fake-article.com', { waitUntil: 'networkidle0' });
    });
});