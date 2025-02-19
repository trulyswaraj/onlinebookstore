const mongoose = require("mongoose");

const conn = async () => {
    try{
        await mongoose.connect(`${process.env.URI}`);
        console.log("Connect to Database.");
    } catch(error){
        console.log(error)
    }
};
conn();