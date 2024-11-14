const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const JWT_SECRET = 'fatih_est_trop_beau';

router.post("/", async (req, res) => {
    
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            "error": "Missing username or password"
        });
    }
    
    //TODO: verifier si le username et le password sont corrects sur rainbow

    const payload = {
        username: req.body.username,
        password: req.body.password
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
        "token" : token
    });
})

module.exports = router;