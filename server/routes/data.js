const { DataModel } = require("../models/chat.model");

const dataRouter = require("express").Router();

dataRouter.get("/",async(req,res)=>{
    try {
        let output = await DataModel.find();
        res.send(output)
    } catch (error) {
        console.log(error);
        res.status(400).json({error })
    }
})
dataRouter.post("/",async(req,res)=>{
    try {
        const {data}=req.body;
        if(!data){res.status(404).json({error: "please provide data "})}
        else {
        let newData = new DataModel({data})
        let output = await newData.save();
        res.send({message : "success",data:output})
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({error })
    }
})




module.exports={dataRouter}