const express = require('express');
const Rainbow = require('../logique/rainbow/rainbowInteraction');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fatih_est_trop_beau';


const userSessions = require('../userSessions');


router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password!' });
    }

    try {
        const rainbowInstance = new Rainbow(username, password);

        await rainbowInstance.start();
        userSessions.set(username, rainbowInstance); 

        const payload = { username };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Erreur lors de la connexion à Rainbow :', error);
        return res.status(401).json({ error: 'Incorrect credentials or Rainbow connection failed!' });
    }
});

module.exports = router;
