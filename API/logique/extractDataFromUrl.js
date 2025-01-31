const puppeteer = require("puppeteer");
const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");

async function extractDataFromUrl(url, xpath) {
    let browser;
    try {
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setViewport({ width: 1000, height: 1000 });

        page.setDefaultTimeout(300000); // 5 minutes
        await page.goto(url, { waitUntil: 'networkidle0' });

        const html = await page.content();
        const dom = new JSDOM(html);
        const reader = new Readability(dom.window.document);
        const article = reader.parse().textContent;

        return article.replace(/\s+/g, ' ').trim();
    } catch (error) {
        throw new Error('Page failed to load');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = extractDataFromUrl;
