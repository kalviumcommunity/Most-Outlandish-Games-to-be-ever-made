const express = require('express');
const router = express.Router();
const { Game } = require('./schema');

router.post('/AddGame', async(request, response) => {
    try {
        const { title, release_year, genre, description, userId } = request.body;
        
        // Validation checks
        if (!title || !release_year || !genre || !description || !userId) {
            return response.status(400).send({ message: "All fields (title, release_year, genre, description, userId) are required" });
        }
        
        if (typeof title !== 'string' || title.trim().length === 0) {
            return response.status(400).send({ message: "Title must be a non-empty string" });
        }
        
        if (typeof release_year !== 'number' || release_year < 1950 || release_year > new Date().getFullYear()) {
            return response.status(400).send({ message: "Release year must be a valid year between 1950 and current year" });
        }
        
        if (typeof genre !== 'string' || genre.trim().length === 0) {
            return response.status(400).send({ message: "Genre must be a non-empty string" });
        }
        
        if (typeof description !== 'string' || description.trim().length === 0) {
            return response.status(400).send({ message: "Description must be a non-empty string" });
        }

        const newGame = new Game({ title, release_year, genre, description, userId });
        await newGame.save();
        return response.status(201).send({ message: "Game added successfully", game: newGame });
    } catch (error) {
        console.log("Something went wrong", error);
        if (error.code === 11000) {
            return response.status(400).send({ message: "A game with this title already exists" });
        }
        return response.status(500).send({ message: "Internal server error" });
    }
});

router.get('/AllGames', async(request, response) => {
    try {
        const allGames = await Game.find();
        return response.status(200).send({ message: "All games fetched successfully", games: allGames });
    } catch (error) {
        console.log("Something went wrong", error);
        return response.status(500).send({ message: "Internal server error" });
    }
});

// Updated games-by-user route
router.get('/games-by-user/:userId', async(request, response) => {
    try {
        const { userId } = request.params;
       // console.log(userId)
        console.log('Fetching games for userId:', userId); // Add debug log
        
        const games = await Game.find({ userId })
            .populate('userId', 'name email');
        
        console.log('Found games:', games); // Add debug log
        
        return response.status(200).send({ 
            message: "Games fetched successfully", 
            games 
        });
    } catch (error) {
        console.log("Something went wrong", error);
        return response.status(500).send({ message: "Internal server error" });
    }
});

router.put('/UpdateGame/:id', async(request, response) => {
    try {
        const { id } = request.params;
        const { title, release_year, genre, description } = request.body;
        
        // Validation checks
        if (!title && !release_year && !genre && !description) {
            return response.status(400).send({ message: "At least one field must be provided for update" });
        }
        
        if (title && (typeof title !== 'string' || title.trim().length === 0)) {
            return response.status(400).send({ message: "Title must be a non-empty string" });
        }
        
        if (release_year && (typeof release_year !== 'number' || release_year < 1950 || release_year > new Date().getFullYear())) {
            return response.status(400).send({ message: "Release year must be a valid year between 1950 and current year" });
        }
        
        if (genre && (typeof genre !== 'string' || genre.trim().length === 0)) {
            return response.status(400).send({ message: "Genre must be a non-empty string" });
        }
        
        if (description && (typeof description !== 'string' || description.trim().length === 0)) {
            return response.status(400).send({ message: "Description must be a non-empty string" });
        }

        const updatedGame = await Game.findByIdAndUpdate(id, { title, release_year, genre, description }, { new: true });
        if(!updatedGame) {
            return response.status(404).send({ message: "Game not found" });
        }
        return response.status(200).send({ message: "Game updated successfully", game: updatedGame });
    } catch (error) {
        console.log("Something went wrong", error);
        if (error.code === 11000) {
            return response.status(400).send({ message: "A game with this title already exists" });
        }
        return response.status(500).send({ message: "Internal server error" });
    }
});

router.delete('/DeleteGame/:id', async(request, response) => {
    try {
        const { id } = request.params;
        const deletedGame = await Game.findByIdAndDelete(id);
        if(!deletedGame) {
            return response.status(404).send({ message: "Game not found" });
        }
        return response.status(200).send({ message: "Game deleted successfully" });
    } catch (error) {
        console.log("Something went wrong", error);
        return response.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;