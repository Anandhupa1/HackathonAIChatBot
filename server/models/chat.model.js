const mongoose = require("mongoose");


const dataSchema =new mongoose.Schema({
data : String, 
},{
    versionKey:false, timestamps:true
})


const DataModel =  mongoose.model("data",dataSchema);

module.exports={DataModel}
