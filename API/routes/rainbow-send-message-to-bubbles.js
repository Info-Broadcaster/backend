const express = require('express');
const router = express.Router();
const Rainbow = require('../logique/rainbow/rainbowInteraction');

router.post('/', async (req, res) => {
    const user = req.user;
    const { bubbles, message } = req.body; // Extract the bubbleJid and message from the request body.

    if (bubbles == null || bubbles?.length === 0 || !message || message === '') {
        return res.status(400).json({ error: 'bubbles and message are required.' });
    }

    const rainbowSdk = new Rainbow(user.username, user.password, process.env.APP_ID, process.env.APP_SECRET);

    try {
        // await rainbowSdk.sendMessageToBubble(bubbles[0], message);
        await Promise.all(bubbles.map(bubble => rainbowSdk.sendMessageToBubble(bubble, message)));
        return res.status(200).json({ success: true, message: 'Message sent successfully!.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    } finally {
        rainbowSdk.stop(); // Clean up the SDK session
    }
});

module.exports = router;
