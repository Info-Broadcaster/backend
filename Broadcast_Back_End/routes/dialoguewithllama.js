const express = require('express');
const router = express.Router();
const {execSync} = require('child_process');
const os = require('os');

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
    if (!req.body.url) {
        return res.status(400).send("URL is required");
    }

    if(!req.body.lang) {
        return res.status(400).send("LANG is required");
    }

    // vérifier lang qu'il soit bien FR, EN, IT ...

    const isValideUrl = isValidUrl(req.body.url);
    if (!isValideUrl) {
        return res.status(400).json("Invalid URL or URL is not reachable");
    }

    const sumamarize = require("../logique/summarize");
    const summarized = await sumamarize(req.body.url, req.body.lang);

    if (summarized) {
        return res.status(200).json({"data": summarized});
    } else {
        return res.status(500).send("Error");
    }
})

function isValidUrl(url) {
    let stdout;

    try {
        if (os.platform() === "win32")
            stdout = execSync(`curl -o NUL -s -w "%{http_code}" "${url}"`, {encoding: 'utf-8'});
        else
            stdout = execSync(`curl -o /dev/null -s -w "%{http_code}" "${url}"`, {encoding: 'utf-8'});

        const statusCode = parseInt(stdout, 10);
        return statusCode >= 200 && statusCode < 400;
    } catch (error) {
        return false;
    }
}

module.exports = router;