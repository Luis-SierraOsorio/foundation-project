// imports
const express = require("express");
require('dotenv').config({ path: "../.env" });

// initialization
const app = express();


// middleware
app.use(express.json());

app.get("/", (req, res) => {
    res.send("request acknowledged");
})

app.listen(process.env.PORT, () => {
    console.log(`listening on port: ${process.env.PORT}`)
})