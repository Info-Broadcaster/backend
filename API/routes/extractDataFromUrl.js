const express = require('express');
const router = express.Router();
const extractDataFromUrl = require('../logique/extractDataFromUrl');
const summarize = require('../logique/summarize');

router.post('/', async (req, res) => {
    if (!req.body.url) {
        return res.status(400).send('URL is required');
    }

    if (!req.body.lang) {
        return res.status(400).send('LANG is required');
    }

    try {
        const extractedDataFromUrl = await extractDataFromUrl(
            req.body.url,
            req.body.xpath
        );

        const dataAfterIA = await summarize(extractedDataFromUrl, req.body.lang);

        return res.status(200).json({
            data: {
                summarized: dataAfterIA.summarized,
                title: dataAfterIA.title,
                themes: dataAfterIA.themes,
                suggestThemeFromTopicsInBubbles: dataAfterIA.suggestThemeFromTopicsInBubbles,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to extract data.", details: error.message });
    }
});

module.exports = router;

