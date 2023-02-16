const mongoose = require('mongoose')
const { Schema } = mongoose;
const cate = require('./categories')


const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"]
  },
  
  category: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'category'
     },

  highlights:{
    type:String
  },
  price: {
    type: Number,
    required: [true, 'Price required']
  },
  size: {
    type: String,
  },
  inventory: {
    type: Number,
    required: [true, 'Total products available']
  },
  description:{
    type: String
  },
  isActive:{
    type:Boolean,
    default:true
  },
  Poffer:{
    type:Number,
    default:0
  },
  images: [
    {
       type: String ,
       required: true
    }
  ] ,

})


module.exports = mongoose.models.product || mongoose.model("product", productSchema);
