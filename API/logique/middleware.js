const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = "fatih_est_trop_beau";

function verifyToken(req, res, next) {
    const token = req.cookies["token"];

    const app = {
        id: process.env.APP_ID,
        secret: process.env.APP_SECRET,
    };

    if (app.id == null || app.secret == null) {
        console.log("ERROR: appId or appSecret are not set in .env file");
        return res.status(400).json({ error: "appId or appSecret are not set in .env file" });
    }

    if (!token) {
        console.log("ERROR: No token provided");
        return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" });
        }

        req.user = decoded;

        const userSessions = require("../userSessions");

        // console.log('sessions', userSessions);

        const rainbowInstance = userSessions.get(decoded.username);

        if (!rainbowInstance) {
            console.log("Pas d'instance rainbow. Deconnexion de l'utilisateur");
            return res.status(403).json({ error: "Votre session rainbow a expiré, veuillez vous reconnecter." });
        }

        req.user.rainbowInstance = rainbowInstance;

        next();
    });
}

module.exports = verifyToken;
