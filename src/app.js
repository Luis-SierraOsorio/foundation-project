// imports
const express = require("express");
const authenticationRoutes = require("./routes/authenticationRoute");
const ticketRoutes = require("./routes/ticketRoute");
const { logger } = require("./utils/logger");

// getting environment variables
require('dotenv').config({ path: "../.env" });

// initialization
const app = express();

// middleware
app.use(express.json());
app.use("", authenticationRoutes);
app.use("/tickets", ticketRoutes);


app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port: ${process.env.PORT}`);
})