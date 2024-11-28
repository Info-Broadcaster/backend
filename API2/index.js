const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialisation du serveur Express et HTTP
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

const login = require("./routes/login");
app.use("/api/login", login);

// Gérer les connexions WebSocket
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    // Réception d'un message et renvoi à tous les clients connectés
    socket.on('message', (msg) => {
        console.log('Message reçu :', msg);
        io.emit('message', `Serveur : ${msg}`);
    });

    // Déconnexion
    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});

// Démarrage du serveur
server.listen(PORT, () => {
    console.log(`Serveur WebSocket en cours d'exécution sur le port ${PORT}`);
});
