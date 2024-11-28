const express = require('express');
const Rainbow = require('../logique/rainbow/rainbowInteraction');
const router = express.Router();
const jwt = require('jsonwebtoken');
//dot env
require('dotenv').config();

const JWT_SECRET = 'fatih_est_trop_beau';

// Stockage des instances Rainbow par utilisateur
const userSessions = require('../userSessions');


router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password!' });
    }

    try {
        const rainbowInstance = new Rainbow(username, password, process.env.APP_ID, process.env.APP_SECRET);

        await rainbowInstance.start();

        userSessions.set(username, rainbowInstance);
        console.log('Sessions actives :', Array.from(userSessions.keys()));

        console.log(`Rainbow SDK initialisé pour l'utilisateur : ${username}`);

        const payload = { username };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Erreur lors de la connexion à Rainbow :', error);
        return res.status(401).json({ error: 'Incorrect credentials or Rainbow connection failed!' });
    }
});

module.exports = router;
