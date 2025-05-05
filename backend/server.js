const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./router");

// Load environment variables first
dotenv.config();

// Ensure NODE_ENV is set
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Security middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Limit payload size

// Routes
app.use('/api', router);

// Health check endpoint
app.get("/ping", (request, response) => {
    response.send("pong");
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
    // Log the error for debugging
    console.error('Server error:', err);

    // Determine if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Create a safe error response
    const errorResponse = {
        message: 'An error occurred',
        ...(isDevelopment && { 
            error: err.message,
            stack: err.stack
        })
    };

    // Send appropriate status code
    res.status(err.status || 500).json(errorResponse);
});

const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
        console.log("Connected to the Database");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
});