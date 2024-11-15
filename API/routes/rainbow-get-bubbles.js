const express = require('express');
const router = express.Router();
const Rainbow = require("../logique/rainbow/rainbowInteraction");

router.get('/', async (req, res) => {
    const user = req.user;

    const rainbowSdk = new Rainbow(user.username, user.password);

    try {
        const bubbles = await rainbowSdk.getAllBubbles();

        console.log("Bubbles found ", bubbles);

        return res.status(200).json(bubbles);

    } catch (error) {
        return res.status(404).json({ error: "Bubble not found.", details: error.message });
    }

});

module.exports = router;