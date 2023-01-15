const mongoose = require('mongoose')
const { Schema } = mongoose;


const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"]
  },

  specs: {
    category: [{
      categoryName:{
            type:String,
            required: [true, 'product category required']
        },
      highlights: {
        type: String,
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
      images: {
        type: [String],
        required: [true, 'Images required']
      }
     
    }]   
   },
    description:{
        type: String
    }
})


module.exports = mongoose.models.product || mongoose.model("product", productSchema);
