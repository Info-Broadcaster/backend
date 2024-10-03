const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

app.use(cors({ 
    origin: "http://localhost:5173", 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    allowedHeaders: 'Content-Type, Authorization', 
    exposedHeaders: 'Authorization', 
    credentials: true 
})); 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const helloRoute = require('./routes/hello');
app.use('/api/hello', helloRoute);

const dialoguewithllama = require('./routes/dialoguewithllama');
app.use('/api/dialoguewithllama', dialoguewithllama);

app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
});
