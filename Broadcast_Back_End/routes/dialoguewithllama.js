const express = require('express');
const router = express.Router();


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

    const sumamarize = require("../logique/summarize");
    const summarized = await sumamarize(req.body.url);

    if (summarized) {
        return res.status(200).json({"data": summarized});
    } else {
        return res.status(500).send("Error");
    }
})

module.exports = router;