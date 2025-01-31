const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const cookieParser = require('cookie-parser');
const verifyToken = require('./logique/middleware');

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    exposedHeaders: 'Authorization',
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const helloRoute = require('./routes/hello');
app.use('/api/hello', helloRoute);

const login = require("./routes/login");
app.use("/api/login", login);

const getStatistics = require("./routes/get-statistics");
app.use("/api/getStatistics", getStatistics);

const dialoguewithllama = require('./routes/dialoguewithllama');
app.use('/api/dialoguewithllama', dialoguewithllama);

const extractDataFromUrl = require('./routes/extractDataFromUrl');
app.use('/api/extractDataFromUrl', extractDataFromUrl);

const rainbowGetBubbles = require('./routes/rainbow-get-bubbles');
app.use('/api/rainbowGetBubbles', verifyToken, rainbowGetBubbles);

const rainbowSendMessageToBubbles = require('./routes/rainbow-send-message-to-bubbles');
app.use('/api/rainbowSendMessageToBubbles', verifyToken, rainbowSendMessageToBubbles);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server listen on port ${PORT}`);
    });
}

module.exports = app;
