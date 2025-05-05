const express = require('express');
const router = express.Router();
const { game } = require('./schema');
const mongoose = require('mongoose');

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Helper function to sanitize input
const sanitizeInput = (data) => {
    const sanitized = {};
    
    // Sanitize strings
    if (data.title) sanitized.title = data.title.trim().replace(/[<>]/g, '');
    if (data.description) sanitized.description = data.description.trim().replace(/[<>]/g, '');
    if (data.genre) sanitized.genre = data.genre.trim().replace(/[<>]/g, '');
    if (data.image) sanitized.image = data.image.trim();
    
    // Sanitize arrays
    if (data.platform && Array.isArray(data.platform)) {
        sanitized.platform = data.platform.map(p => p.trim().replace(/[<>]/g, ''));
    }
    
    // Sanitize numbers
    if (data.release_year) {
        const year = parseInt(data.release_year);
        if (!isNaN(year)) sanitized.release_year = year;
    }
    
    return sanitized;
};

// Helper function to handle errors
const handleError = (res, error, status = 500) => {
    // Log the error for debugging
    console.error('Error:', error);

    // Create a safe error response
    const errorResponse = {
        message: 'An error occurred',
        ...(process.env.NODE_ENV === 'development' && { 
            error: error.message
        })
    };

    res.status(status).json(errorResponse);
};

// Validation function
const validateGame = (data) => {
    const errors = [];
    const { title, release_year, genre, description, platform, image } = data;

    // Title validation
    if (!title || title.length < 2) {
        errors.push('Title must be at least 2 characters long');
    }

    // Release year validation
    const currentYear = new Date().getFullYear();
    if (!release_year || release_year < 1950 || release_year > currentYear) {
        errors.push('Release year must be between 1950 and current year');
    }

    // Genre validation
    const validGenres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 
                        'Racing', 'Puzzle', 'Fighting', 'Platformer', 'Shooter', 'Other'];
    if (!genre || !validGenres.includes(genre)) {
        errors.push('Invalid genre');
    }

    // Description validation
    if (!description || description.length < 10) {
        errors.push('Description must be at least 10 characters long');
    }

    // Platform validation
    const validPlatforms = ['PC', 'Xbox', 'PlayStation', 'Switch', 'Mobile', 'Other'];
    if (!platform || !Array.isArray(platform) || platform.length === 0) {
        errors.push('At least one platform is required');
    } else if (!platform.every(p => validPlatforms.includes(p))) {
        errors.push('Invalid platform(s)');
    }

    // Image validation (optional)
    if (image && !image.startsWith('http')) {
        errors.push('Image must be a valid URL');
    }

    return errors;
};

// Get all games
router.get('/games', async (req, res) => {
    try {
        const games = await game.find().sort({ createdAt: -1 });
        res.json(games);
    } catch (error) {
        handleError(res, error);
    }
});

// Get a single game by ID
router.get('/games/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid game ID format' });
        }

        const foundGame = await game.findById(id);
        
        if (!foundGame) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json(foundGame);
    } catch (error) {
        handleError(res, error);
    }
});

// Create a new game
router.post('/games', async (req, res) => {
    try {
        // Sanitize input
        const sanitizedData = sanitizeInput(req.body);
        
        // Validate input
        const errors = validateGame(sanitizedData);
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors
            });
        }

        const newGame = new game(sanitizedData);
        const savedGame = await newGame.save();
        
        res.status(201).json(savedGame);
    } catch (error) {
        handleError(res, error);
    }
});

// Update a game
router.put('/games/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid game ID format' });
        }

        // Sanitize input
        const sanitizedData = sanitizeInput(req.body);
        
        // Validate input
        const errors = validateGame(sanitizedData);
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors
            });
        }

        const updatedGame = await game.findByIdAndUpdate(
            id,
            sanitizedData,
            { new: true, runValidators: true }
        );

        if (!updatedGame) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json(updatedGame);
    } catch (error) {
        handleError(res, error);
    }
});

// Delete a game
router.delete('/games/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid game ID format' });
        }

        const deletedGame = await game.findByIdAndDelete(id);

        if (!deletedGame) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
});

module.exports = router;