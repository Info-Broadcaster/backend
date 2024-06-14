const express = require('express');
const router = express.Router();

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