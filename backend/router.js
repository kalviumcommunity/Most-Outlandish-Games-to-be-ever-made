const express = require('express');
const router = express.Router();
const {game} = require('./schema');

router.post('/AddGame', async(request,response)=>{
    try {
        const {title,release_year,genre,description} = request.body;
        const newGame = new game({title,release_year,genre,description});
        await newGame.save();
        return response.status(201).send({message:"Game added successfully",game:newGame});
    } catch (error) {
        console.log("Something went wrong",error);
        return response.status(500).send({message:"Internal server error"});
    }
});

router.get('/AllGames',async(request,response)=>{
    try {
        const allGames = await game.find();
        return response.status(200).send({message:"All games fetched successfully",games:allGames});
    } catch (error) {
        console.log("Something went wrong",error);
        return response.status(500).send({message:"Internal server error"});
    }
});

router.put('/UpdateGame/:id',async(request,response)=>{
    try {
    const {id} = request.params;
    const {title,release_year,genre,description} = request.body;
    const updatedGame = await game.findByIdAndUpdate(id,{title,release_year,genre,description},{new:true});
    if(!updatedGame){
        return response.status(404).send({message:"Game not found"});
    }
    return response.status(200).send({message:"Game updated successfully",game:updatedGame});
    } catch (error) {
        console.log("Something went wrong",error);
        return response.status(500).send({message:"Internal server error"});
    }
});

router.delete('/DeleteGame/:id',async(request,response)=>{
    try {
        const {id} = request.params;
        const deletedGame = await game.findByIdAndDelete(id);
        if(!deletedGame){
            return response.status(404).send({message:"Game not found"});
        }
        return response.status(200).send({message:"Game deleted successfully"});
    } catch (error) {
        console.log("Something went wrong",error);
        return response.status(500).send({message:"Internal server error"});
    }
});

module.exports = router;