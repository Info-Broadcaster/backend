//#region Imports
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fatih_est_trop_beau';
const userSessions = require('./userSessions');
require('dotenv').config();
const middleware = require('./logique/middleware');
//#endregion Imports

//#region App Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    exposedHeaders: 'Authorization',
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
//#endregion App Configuration

//#region Server Configuration
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
//#endregion Server Configuration

//#region Routes
const login = require("./routes/login");
app.use("/api/login", login);

const dialoguewithllama = require('./routes/dialoguewithllama');
app.use('/api/dialoguewithllama', middleware, dialoguewithllama);

const extractDataFromUrl = require('./routes/extractDataFromUrl');
app.use('/api/extractDataFromUrl', middleware, extractDataFromUrl);

//#endregion Routes

//#region Middleware Socket.io

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentification requise'));
    }

    // Vérifier et décoder le jeton
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Jeton invalide'));
        }
        socket.user = decoded; // Ajouter les infos utilisateur au socket
        next();
    });
});

//#endregion Middleware Socket.io

//#region WebSocket
io.on('connection', (socket) => {
    console.log(`Client connecté : ${socket.id}`);

    const token = socket.handshake.auth.token;
    if (!token) {
        socket.emit('error', { message: 'Token manquant' });
        return socket.disconnect();
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET || 'fatih_est_trop_beau';
        const decoded = jwt.verify(token, JWT_SECRET);
        const username = decoded.username;

        console.log(`Utilisateur connecté a : ${username}`);

        const rainbowInstance = userSessions.get(username);
        if (!rainbowInstance) {
            throw new Error('Rainbow SDK non initialisé pour cet utilisateur');
        }

        console.log(`Rainbow SDK prêt pour l'utilisateur : ${username}`);

        socket.on('getBubbles', async () => {
            try {
                const bubbles = await rainbowInstance.getBubbles();
                console.log('Bulles récupérées :', bubbles.length);
                socket.emit('bubblesList', bubbles);
            } catch (error) {
                console.error('Erreur lors de la récupération des bulles :', error);
                socket.emit('error', { message: 'Erreur lors de la récupération des bulles' });
            }
        });

        socket.on('sendMessage', async ({ bubbleJids, message, title, link }) => {
            if (!Array.isArray(bubbleJids)) {
                socket.emit('error', { message: 'La liste des bulles doit être un tableau' });
                return;
            }
        
            try {
                const results = []; 
        
                for (const bubbleJid of bubbleJids) {
                    try {
                        console.log(`Envoi du message à la bulle ${bubbleJid}`);

                        const formattedMessage = `${title} \n\n ${message} \n\n ${link}`;
                        await rainbowInstance.sendMessageToBubble(bubbleJid, formattedMessage);

                        results.push({ bubbleJid, status: 'success' });
                    } catch (err) {
                        console.error(`Erreur lors de l'envoi à la bulle ${bubbleJid} :`, err);
                        results.push({ bubbleJid, status: 'error', error: err.message });
                    }
                }
        
                socket.emit('messageSent', { status: 'success' });
            } catch (error) {
                console.error('Erreur générale lors de l\'envoi du message :', error);
                socket.emit('error', { message: 'Erreur générale lors de l\'envoi du message' });
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Client déconnecté : ${socket.id}`);
        });
    } catch (error) {
        console.error('Erreur lors de la connexion WebSocket :', error.message);
        socket.emit('error', { message: 'Token invalide ou expiré' });
        socket.disconnect();
    }
});
//#endregion WebSocket

server.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
