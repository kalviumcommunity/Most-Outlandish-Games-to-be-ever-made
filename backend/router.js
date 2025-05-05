const express = require('express');
const router = express.Router();
const {game} = require('./schema');
const mongoose = require('mongoose');
const Game = require("./models/game");

// Simple validation function
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

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Helper function to handle errors
const handleError = (res, error, status = 500) => {
    console.error('Error:', error);
    res.status(status).json({ 
        message: error.message || 'An error occurred',
        error: process.env.NODE_ENV === 'development' ? error : undefined
    });
};

router.post('/AddGame', async(request,response)=>{
    try {
        // Validate input
        const errors = validateGame(request.body);
        if (errors.length > 0) {
            return response.status(400).json({
                message: 'Validation failed',
                errors: errors
            });
        }

        // Create a new game instance with the request body
        const gameData = request.body;
        const newGame = new game(gameData);
        
        // Save the new game to the database
        const savedGame = await newGame.save();
        
        return response.status(201).json({
            message: "Game added successfully",
            game: savedGame
        });
    } catch (error) {
        handleError(response, error);
    }
});

router.get('/AllGames',async(request,response)=>{
    try {
        const allGames = await game.find().sort({ createdAt: -1 });
        return response.status(200).json({message:"All games fetched successfully",games:allGames});
    } catch (error) {
        handleError(response, error);
    }
});

router.put('/UpdateGame/:id', async(request,response)=>{
    try {
        // Validate ID
        const gameId = request.params.id;
        if (!gameId || gameId.length !== 24) {
            return response.status(400).json({ message: "Invalid game ID" });
        }

        // Validate input
        const errors = validateGame(request.body);
        if (errors.length > 0) {
            return response.status(400).json({
                message: 'Validation failed',
                errors: errors
            });
        }

        const updatedGame = await game.findByIdAndUpdate(
            gameId,
            request.body,
            { new: true }
        );

        if (!updatedGame) {
            return response.status(404).json({message:"Game not found"});
        }
        return response.status(200).json({message:"Game updated successfully",game:updatedGame});
    } catch (error) {
        handleError(response, error);
    }
});

router.delete('/DeleteGame/:id', async(request,response)=>{
    try {
        // Validate ID
        const gameId = request.params.id;
        if (!gameId || gameId.length !== 24) {
            return response.status(400).json({ message: "Invalid game ID" });
        }

        const deletedGame = await game.findByIdAndDelete(gameId);
        
        if (!deletedGame) {
            return response.status(404).json({message:"Game not found"});
        }
        return response.status(200).json({message:"Game deleted successfully",game:deletedGame});
    } catch (error) {
        handleError(response, error);
    }
});

// Get all games
router.get("/games", async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (error) {
        handleError(res, error);
    }
});

// Get a single game by ID
router.get("/games/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid game ID format' });
        }

        const game = await Game.findById(id);
        
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json(game);
    } catch (error) {
        handleError(res, error);
    }
});

// Create a new game
router.post("/games", async (req, res) => {
    try {
        const { title, description, genre, releaseDate, rating } = req.body;

        // Basic validation
        if (!title || !description || !genre) {
            return res.status(400).json({ 
                message: 'Title, description, and genre are required' 
            });
        }

        if (rating && (rating < 0 || rating > 10)) {
            return res.status(400).json({ 
                message: 'Rating must be between 0 and 10' 
            });
        }

        const game = new Game({
            title,
            description,
            genre,
            releaseDate: releaseDate || new Date(),
            rating: rating || 0
        });

        const savedGame = await game.save();
        res.status(201).json(savedGame);
    } catch (error) {
        handleError(res, error);
    }
});

// Update a game
router.put("/games/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid game ID format' });
        }

        const { title, description, genre, releaseDate, rating } = req.body;

        // Basic validation
        if (rating && (rating < 0 || rating > 10)) {
            return res.status(400).json({ 
                message: 'Rating must be between 0 and 10' 
            });
        }

        const updatedGame = await Game.findByIdAndUpdate(
            id,
            { title, description, genre, releaseDate, rating },
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
router.delete("/games/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid game ID format' });
        }

        const deletedGame = await Game.findByIdAndDelete(id);

        if (!deletedGame) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
});

module.exports = router;