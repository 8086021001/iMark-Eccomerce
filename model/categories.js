const mongoose = require('mongoose');
const { Schema } = mongoose;



const category = new Schema({
    name:{
        type:String,
        required:true
    },
    offer:{
        type:Number,
        default:0
    },
      images: [
    {
       type: String ,
       required: true
    }
  ] 
})


module.exports = mongoose.models.category || mongoose.model("category", category);
