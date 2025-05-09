const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    release_year: { type: Number, required: true },
    genre: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }
});

// Create a compound index for userId and title to ensure a user can't add the same game twice
gameSchema.index({ userId: 1, title: 1 }, { unique: true });

const Game = mongoose.model('Game', gameSchema);

module.exports = { Game };
