const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const user = req.user;

    try {
        const bubbles = await user.rainbowInstance.getAllBubbles();
        return res.status(200).json(bubbles);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

});

module.exports = router;