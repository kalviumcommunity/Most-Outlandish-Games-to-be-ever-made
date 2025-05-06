const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: String,
    release_year: Number,
    genre: String,
    description: String
});

const game = mongoose.model('game', gameSchema);

module.exports = {game};
