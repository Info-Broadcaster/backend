const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 443;

app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
})