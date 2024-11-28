const express = require('express');
const Rainbow = require("../logique/rainbow/rainbowInteraction");
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'fatih_est_trop_beau';

router.post("/", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            "error": "Missing username or password!"
        });
    }

    const rainbowSdk = new Rainbow(req.body.username, req.body.password, process.env.APP_ID, process.env.APP_SECRET);

    try {
        await rainbowSdk.testConnection();
    } catch (error) {
        return res.status(401).json({
            "error": "Incorrect credentials!"
        });
    }

    const payload = {
        username: req.body.username,
        password: req.body.password
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
        "token": token
    });
});

module.exports = router;