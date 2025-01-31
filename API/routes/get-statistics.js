const express = require('express');
const router = express.Router();
const { getTrackerDataFromLinkly } = require('../logique/link-tracker');

router.get('/', async (req, res) => {
    try {
        const trackerData = await getTrackerDataFromLinkly();

        console.log('Tracker data found ', trackerData);

        return res.status(200).json(trackerData);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;
