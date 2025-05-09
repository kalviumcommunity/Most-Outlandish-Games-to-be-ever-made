const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = require("./router");
const cors = require("cors");
const userRouter = require("./userRouter");

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);
app.use('/user', userRouter);

app.get("/ping", (request, response) => {
    response.send("pong");
});

// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });