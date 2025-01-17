const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const user = req.user;

    try {
        console.log("Getting all bubbles for user ", user);
        const bubbles = await user.rainbowInstance.getAllBubbles();

        console.log("Bubbles found ", bubbles);

        return res.status(200).json(bubbles);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

});

module.exports = router;