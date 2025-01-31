const extractDataFromUrl = require('../logique/extractDataFromUrl');
const puppeteer = require('puppeteer');

jest.mock('puppeteer');

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
        await expect(extractDataFromUrl('https://wrkt-fake-article.com')).rejects.toThrow('Page failed to load');
        expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });
});
