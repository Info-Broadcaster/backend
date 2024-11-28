const express = require('express');
const router = express.Router();
const Rainbow = require("../logique/rainbow/rainbowInteraction");

router.get('/', async (req, res) => {
    const user = req.user;

    const rainbowSdk = new Rainbow(user.username, user.password, process.env.APP_ID, process.env.APP_SECRET);

    try {
        const bubbles = await rainbowSdk.getAllBubbles();

        console.log("Bubbles found ", bubbles);

        return res.status(200).json(bubbles);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

});

module.exports = router;