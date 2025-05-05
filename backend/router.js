const express = require('express');
const router = express.Router();
const { game } = require('./schema');

// Simple validation function
const validateGame = (data) => {
    const errors = [];
    if (!data.title || data.title.trim().length < 2) {
        errors.push('Title is required and must be at least 2 characters long');
    }
    if (!data.description || data.description.trim().length < 10) {
        errors.push('Description is required and must be at least 10 characters long');
    }
    return errors;
};

// Get all games
router.get('/games', async (req, res) => {
    try {
        const games = await game.find();
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(400).json({ message: error.message });
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
            { new: true }
        );
        if (!updatedGame) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(updatedGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a game
router.delete('/games/:id', async (req, res) => {
    try {
        // Validate that the ID exists before attempting deletion
        const gameExists = await game.findById(req.params.id);
        if (!gameExists) {
            return res.status(404).json({ message: 'Game not found' });
        }

        const deletedGame = await game.findByIdAndDelete(req.params.id);
        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;