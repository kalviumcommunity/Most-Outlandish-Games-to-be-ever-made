const express = require('express');
const router = express.Router();
const { game } = require('./schema');

// Validation function
const validateGame = (data) => {
    const errors = [];
    const { title, description, release_year, genre, platform } = data;

    // Title validation
    if (!title || title.trim().length < 2) {
        errors.push('Title is required and must be at least 2 characters long');
    }

    // Description validation
    if (!description || description.trim().length < 10) {
        errors.push('Description is required and must be at least 10 characters long');
    }

    // Release year validation
    const currentYear = new Date().getFullYear();
    if (!release_year || isNaN(release_year) || release_year < 1950 || release_year > currentYear) {
        errors.push(`Release year must be between 1950 and ${currentYear}`);
    }

    // Genre validation
    const validGenres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 
                        'Racing', 'Puzzle', 'Fighting', 'Platformer', 'Shooter', 'Other'];
    if (!genre || !validGenres.includes(genre)) {
        errors.push('Genre is required and must be one of: ' + validGenres.join(', '));
    }

    // Platform validation
    const validPlatforms = ['PC', 'Xbox', 'PlayStation', 'Switch', 'Mobile', 'Other'];
    if (!platform || !Array.isArray(platform) || platform.length === 0) {
        errors.push('At least one platform is required');
    } else if (!platform.every(p => validPlatforms.includes(p))) {
        errors.push('Platform must be one or more of: ' + validPlatforms.join(', '));
    }

    return errors;
};

// Get all games
router.get('/games', async (req, res) => {
    try {
        const games = await game.find();
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a single game
router.get('/games/:id', async (req, res) => {
    try {
        const foundGame = await game.findById(req.params.id);
        if (!foundGame) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(foundGame);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new game
router.post('/games', async (req, res) => {
    try {
        const errors = validateGame(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const newGame = new game(req.body);
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: Object.values(error.errors).map(e => e.message) });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a game
router.put('/games/:id', async (req, res) => {
    try {
        const errors = validateGame(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const updatedGame = await game.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedGame) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(updatedGame);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: Object.values(error.errors).map(e => e.message) });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a game
router.delete('/games/:id', async (req, res) => {
    try {
        const gameExists = await game.findById(req.params.id);
        if (!gameExists) {
            return res.status(404).json({ message: 'Game not found' });
        }

        await game.findByIdAndDelete(req.params.id);
        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;