const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title:{type:String,required:true},
    release_year:{type:Number,required:true},
    genre:{type:String,required:true},
    description:{type:String,required:true},
});

const game = mongoose.model('game',gameSchema);

module.exports = {game};
