import express from 'express'

const app= express();
const port=8000;

app.get('/', (req,res)=>{
    res.send("hellow from server")
})

app.listen(port,(err)=>{
    try{
        console.log(`http://localhost:${port}/`)
    }
    catch(err){
        console.log("Server error")
    }
})