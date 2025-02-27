const mongoose = require("mongoose");

const book = new mongoose.Schema(
    {
        url:{
            type:String, 
            required: true,
        },
        title:{
            type:String,
            reqiured:true,
        },
        author:{
            type:String,
            reqiured:true,
        },
        price:{
            type:Number,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        language:{
            type:String,
            required:true,
        },
    },
    {timestamps:true}
);

module.exports = mongoose.model("books", book); 