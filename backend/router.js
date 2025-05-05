const express = require('express');
const router = express.Router();
const {game} = require('./schema');

// Validation helper functions
const validateGameData = (data) => {
    const errors = [];
    const { title, release_year, genre, description, platform, image } = data;

    // Title validation
    if (!title || typeof title !== 'string' || title.length < 2 || title.length > 100) {
        errors.push('Title must be between 2 and 100 characters');
    }

    // Release year validation
    const currentYear = new Date().getFullYear();
    if (!release_year || typeof release_year !== 'number' || 
        release_year < 1950 || release_year > currentYear + 1) {
        errors.push('Release year must be between 1950 and next year');
    }

    // Genre validation
    const validGenres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 
                        'Racing', 'Puzzle', 'Fighting', 'Platformer', 'Shooter', 'Other'];
    if (!genre || !validGenres.includes(genre)) {
        errors.push('Invalid genre provided');
    }

    // Description validation
    if (!description || typeof description !== 'string' || 
        description.length < 10 || description.length > 1000) {
        errors.push('Description must be between 10 and 1000 characters');
    }

    // Platform validation
    const validPlatforms = ['PC', 'Xbox', 'PlayStation', 'Switch', 'Mobile', 'Other'];
    if (!platform || !Array.isArray(platform) || platform.length === 0 || 
        !platform.every(p => validPlatforms.includes(p))) {
        errors.push('At least one valid platform must be provided');
    }

    // Image validation (optional)
    if (image && typeof image === 'string' && !image.match(/^https?:\/\/.+/)) {
        errors.push('Image must be a valid URL');
    }

    return errors;
};

const validateId = (id) => {
    return id && id.match(/^[0-9a-fA-F]{24}$/);
};

router.post('/AddGame', async(request,response)=>{
    try {
        // Validate input data
        const validationErrors = validateGameData(request.body);
        if (validationErrors.length > 0) {
            return response.status(400).json({
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        const {title,release_year,genre,description,platform,image} = request.body;
        const newGame = new game({title,release_year,genre,description,platform,image});
        await newGame.save();
        return response.status(201).json({message:"Game added successfully",game:newGame});
    } catch (error) {
        console.error("Error adding game:", error);
        if (error.name === 'ValidationError') {
            return response.status(400).json({
                message: "Validation failed",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        return response.status(500).json({ message: "Internal server error" });
    }
});

router.get('/AllGames',async(request,response)=>{
    try {
        const allGames = await game.find().sort({ createdAt: -1 });
        return response.status(200).json({message:"All games fetched successfully",games:allGames});
    } catch (error) {
        console.error("Error fetching games:", error);
        return response.status(500).json({ message: "Internal server error" });
    }
});

router.put('/UpdateGame/:id', async(request,response)=>{
    try {
        const {id} = request.params;
        
        // Validate ID
        if (!validateId(id)) {
            return response.status(400).json({
                message: 'Invalid game ID format'
            });
        }

        // Validate input data
        const validationErrors = validateGameData(request.body);
        if (validationErrors.length > 0) {
            return response.status(400).json({
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        const {title,release_year,genre,description,platform,image} = request.body;
        const updatedGame = await game.findByIdAndUpdate(id,{title,release_year,genre,description,platform,image},{new:true,runValidators:true});
        if(!updatedGame){
            return response.status(404).json({message:"Game not found"});
        }
        return response.status(200).json({message:"Game updated successfully",game:updatedGame});
    } catch (error) {
        console.error("Error updating game:", error);
        if (error.name === 'ValidationError') {
            return response.status(400).json({
                message: "Validation failed",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        return response.status(500).json({ message: "Internal server error" });
    }
});

router.delete('/DeleteGame/:id', async(request,response)=>{
    try {
        const {id} = request.params;
        
        // Validate ID
        if (!validateId(id)) {
            return response.status(400).json({
                message: 'Invalid game ID format'
            });
        }

        const deletedGame = await game.findByIdAndDelete(id);
        if(!deletedGame){
            return response.status(404).json({message:"Game not found"});
        }
        return response.status(200).json({message:"Game deleted successfully",game:deletedGame});
    } catch (error) {
        console.error("Error deleting game:", error);
        return response.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;