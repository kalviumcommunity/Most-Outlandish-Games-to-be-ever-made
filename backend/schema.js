const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    release_year: {
        type: Number,
        required: [true, 'Release year is required'],
        min: [1950, 'Release year must be after 1950'],
        validate: {
            validator: function(year) {
                return year <= new Date().getFullYear() + 1;
            },
            message: 'Release year cannot be in the future'
        }
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        trim: true,
        enum: {
            values: ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing', 'Puzzle', 'Fighting', 'Platformer', 'Shooter', 'Other'],
            message: '{VALUE} is not a valid genre'
        }
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    platform: {
        type: [String],
        required: [true, 'At least one platform is required'],
        validate: {
            validator: function(platforms) {
                const validPlatforms = ['PC', 'Xbox', 'PlayStation', 'Switch', 'Mobile', 'Other'];
                return platforms.every(platform => validPlatforms.includes(platform));
            },
            message: 'Invalid platform(s) provided'
        }
    },
    image: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Image must be a valid URL'
        }
    }
}, {
    timestamps: true
});

const game = mongoose.model('game', gameSchema);

module.exports = { game };
