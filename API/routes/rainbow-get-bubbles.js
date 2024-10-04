const express = require('express');
const router = express.Router();
const Rainbow = require("../logique/rainbow/rainbowInteraction");


router.post('/get-all-bubbles', (req, res) => {
    const { email, password, appId, appSecret } = req.body;

    if (!email || !password || !appId || !appSecret) {
        return res.status(400).json({ error: 'Missing email, password, appId or appSecret' });
    }

    const rainbowSdk = new Rainbow(email, password, appId, appSecret);

    try {

        let bubbles = rainbowSdk.getAllBubbles();
        return res.json(bubbles).status(200);

    } catch (error) {

        return res.status(400).json({ error: error });

    } finally {

        rainbowSdk.stop();

    }

});

module.exports = router;