const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.get("/ping",(request,response)=>{
    response.send("pong");
})

app.listen(8000,async ()=>{
    try {
      await mongoose.connect("mongodb+srv://nezareeen:3YdHJ4t2eNMWwspE@cluster0.r1j0h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")  
    } catch (error) {
        console.log(error)
    }
})