const puppeteer = require("puppeteer");
const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");

async function extractDataFromUrl(url, xpath) {
    try {
        const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1000,
            height: 1000,
        });

        page.setDefaultTimeout(300000); // 5 minutes

        await page.goto(url, { waitUntil: "networkidle0" });

        const html = await page.content();
        const dom = new JSDOM(html);
        const reader = new Readability(dom.window.document);
        const article = reader.parse().textContent;

        await browser.close();

        return article.replace(/\s+/g, " ");
    } catch (error) {
        throw new Error("L'article n'a pas pu être extrait. Veuillez vérifier l'URL et réessayer.");
    }
}

module.exports = extractDataFromUrl;
