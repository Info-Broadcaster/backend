const express = require('express');
const router = express.Router();
const Rainbow = require("../logique/rainbow/rainbowInteraction");


router.post('/', async (req, res) => {
    const { email, password, appId, appSecret } = req.body;

    if (!email || !password || !appId || !appSecret) {
        return res.status(400).json({ error: 'Missing email, password, appId or appSecret' });
    }

    const rainbowSdk = new Rainbow(email, password, appId, appSecret);

    try {

        const bubbles = await rainbowSdk.getAllBubbles();

        console.log("Bubbles found ", bubbles);

        return res.status(200).json(bubbles);

    } catch (error) {

        return res.status(400).json({ error: error });

    }

});

module.exports = router;