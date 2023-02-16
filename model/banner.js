const mongoose = require('mongoose');
const { Schema } = mongoose;




const banner = new Schema({
    caption:{
        type:String,
        required:true
    },
      images: [
    {
       type: String ,
       required: true
    }
  ] 
})


module.exports = mongoose.models.banner || mongoose.model("banner", banner);