const express = require("express");

const app = express();

app.get("/ping",(request,response)=>{
    try{
        response.status(200).send({msg:"Pong!"});
    }
    catch(error){
        response.status(500).send({msg:"Something went wrong",error});
    }
})

app.listen(8000,()=>{
    console.log("Sever connected successfully");
})