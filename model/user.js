const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        max: 32,
        required: true,
      },
    lastName: {
       type: String,
       max: 32,
     },  
    email: {
        type: String,
        required: true,
    },
    
    password: {
       type: String,
       max: 1022,
       min: 8,
       required: true,
     },
     phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
    },
    Action: {
      type:Boolean,
      default:true
    }

})

userSchema.pre('save', async function(next){
  try {
    hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
    next();
  } catch (error) {
    console.log(error)
  }
})

module.exports = mongoose.models.user || mongoose.model("user", userSchema);

