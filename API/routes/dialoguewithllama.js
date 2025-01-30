const express = require("express");
const router = express.Router();
const extractDataFromUrl = require("../logique/extractDataFromUrl");
const summarize = require("../logique/summarize");

/*
Description:
Cette route est la porte d'entrée pour résumer un article.
Elle permet de tester le contenu de la requête avant de véritablement l'envoyer à l'IA responsable de résumer.

Paramètres:
L'url de l'article qu'on souhaite résumer.

Retour:
Retourne un JSON avec l'article résumé dans la ppt data
 */
router.post("/summarize", async (req, res) => {
    try {
        if (!req.body.url) {
            return res.status(400).send("URL is required");
        }

        if (!req.body.lang) {
            return res.status(400).send("LANG is required");
        }

        // vérifier lang qu'il soit bien FR, EN, IT ...

        // const isValideUrl = isValidUrl(req.body.url);
        // if (!isValideUrl) {
        //     return res.status(400).json("Invalid URL or URL is not reachable");
        // }

        const extractedDataFromUrl = await extractDataFromUrl(req.body.url, req.body.xpath);

        const dataAfterIA = await summarize(extractedDataFromUrl, req.body.lang);

        return res.status(200).json({
            data: {
                summarized: dataAfterIA.summarized,
                title: dataAfterIA.title,
                themes: dataAfterIA.themes.split(",").map((theme) => theme.trim()),
                suggestThemeFromTopicsInBubbles: dataAfterIA.suggestThemeFromTopicsInBubbles
                    .trim()
                    .split(",")
                    .map((theme) => theme.trim()),
                hookphrase: dataAfterIA.hookphrase,
            },
        });
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

router.post("/summarize/text", async (req, res) => {
    // vérifier lang qu'il soit bien FR, EN, IT ...

    // const isValideUrl = isValidUrl(req.body.url);
    // if (!isValideUrl) {
    //     return res.status(400).json("Invalid URL or URL is not reachable");
    // }

    const dataAfterIA = await summarize(req.body.text, req.body.lang);

    if (dataAfterIA) {
        return res.status(200).json({
            data: {
                summarized: dataAfterIA.summarized,
                title: dataAfterIA.title,
                themes: dataAfterIA.themes.split(",").map((theme) => theme.trim()),
                hookphrase: dataAfterIA.hookphrase,
                suggestThemeFromTopicsInBubbles: [dataAfterIA.suggestThemeFromTopicsInBubbles],
            },
        });
    } else {
        return res.status(500).send("Error");
    }
});

module.exports = router;
