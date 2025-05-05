const express = require('express');
const router = express.Router();
const {game} = require('./schema');
const mongoose = require('mongoose');

// Helper function to handle MongoDB errors
const handleMongoError = (error, res) => {
    if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            message: "Validation failed",
            errors: Object.values(error.errors).map(err => err.message)
        });
    }
    if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            message: "Invalid ID format",
            error: error.message
        });
    }
    console.error("Database error:", error);
    return res.status(500).json({ message: "Internal server error" });
};

router.post('/AddGame', async(request,response)=>{
    try {
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
        return handleMongoError(error, response);
    }
});

router.get('/AllGames',async(request,response)=>{
    try {
        const allGames = await game.find().sort({ createdAt: -1 });
        return response.status(200).json({message:"All games fetched successfully",games:allGames});
    } catch (error) {
        return handleMongoError(error, response);
    }
});

router.put('/UpdateGame/:id', async(request,response)=>{
    try {
        const gameId = request.params.id;
        const updateData = request.body;
        
        const updatedGame = await game.findByIdAndUpdate(
            gameId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedGame) {
            return response.status(404).json({message:"Game not found"});
        }
        return response.status(200).json({message:"Game updated successfully",game:updatedGame});
    } catch (error) {
        return handleMongoError(error, response);
    }
});

router.delete('/DeleteGame/:id', async(request,response)=>{
    try {
        const gameId = request.params.id;
        const deletedGame = await game.findByIdAndDelete(gameId);
        
        if (!deletedGame) {
            return response.status(404).json({message:"Game not found"});
        }
        return response.status(200).json({message:"Game deleted successfully",game:deletedGame});
    } catch (error) {
        return handleMongoError(error, response);
    }
});

module.exports = router;