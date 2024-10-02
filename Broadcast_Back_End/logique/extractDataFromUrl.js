const puppeteer = require("puppeteer");

async function extractDataFromUrl(url, xpath) {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({
        width: 1000,
        height: 1000,
    });

    await page.goto(url);

    const body = await page.evaluate((xpath) => {
        if (xpath) {
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            return result ? result.innerText : null;
        }
        return document.body.innerText;
    }, xpath); // Pass xpath as a parameter to evaluate

    await browser.close();

    return body.replace(/\s+/g, " ");
}


module.exports = extractDataFromUrl;