const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://nitindpatil2002:Sonu2002@cluster0.8ua0qdk.mongodb.net/"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;