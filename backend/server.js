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

// Validate and parse CORS origins
const validateOrigins = () => {
    const defaultOrigins = ['http://localhost:5173'];
    
    if (!process.env.ALLOWED_ORIGINS) {
        return defaultOrigins;
    }

    const origins = process.env.ALLOWED_ORIGINS.split(',')
        .map(origin => origin.trim())
        .filter(origin => {
            // Basic URL validation
            try {
                new URL(origin);
                return true;
            } catch {
                console.warn(`Invalid origin URL: ${origin}`);
                return false;
            }
        });

    // In production, ensure we have at least one valid origin
    if (process.env.NODE_ENV === 'production' && origins.length === 0) {
        console.error('No valid origins configured for production');
        process.exit(1);
    }

    return origins.length > 0 ? origins : defaultOrigins;
};

// CORS configuration
const corsOptions = {
    origin: validateOrigins(),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
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