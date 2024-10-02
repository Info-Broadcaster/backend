const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;

app.use(cors({
    origin: "*",
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // headers: 'Content-Type, Authorization',
    // exposedHeaders: 'Authorization'
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const helloRoute = require("./routes/hello");
app.use("/api/hello", helloRoute);

const dialoguewithllama = require("./routes/dialoguewithllama");
app.use("/api/dialoguewithllama", dialoguewithllama);

const extractDataFromUrl = require("./routes/extractDataFromUrl");
app.use("/api/extractDataFromUrl", extractDataFromUrl);

app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
})
