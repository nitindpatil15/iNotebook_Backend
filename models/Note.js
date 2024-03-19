const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user : {
        // another user can't see anyones notes
        type : mongoose.Schema.Types.ObjectId,
        ref:'user'    //refrences from user   
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true, 
    },
    tag:{
        type: String,
        default: "General"
    },
    date:{
        type: Date,
        default: Date.now
    },
  });

  module.exports = mongoose.model('notes', NotesSchema);