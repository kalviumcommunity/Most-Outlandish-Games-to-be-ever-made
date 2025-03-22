const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv").config();

const app = express();

app.get("/ping",(request,response)=>{
    response.send("pong");
})

app.listen(8000,async ()=>{
    try {
      await mongoose.connect(process.env.MONGODB_URI);  
      console.log("Connected to the Database")
    } catch (error) {
        console.log(error)
    }
})