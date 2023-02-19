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
    },
    cart: [
        {
           proId: {
             type: mongoose.Schema.Types.ObjectId ,
             ref: "product"
           },
           quantity: {
             type: Number
           },

           increment: {
            type: Boolean
          },
          decrement: {
            type: Boolean
          }
        }
     ] ,
     address: [
         {
             houseName: {
               type : String ,
               required: true
             } ,
             address: {
              type : String ,
              required: true
            } ,
             phone: {
               type : Number ,
               required: true
             },
             city: {
               type : String ,
               required: true
             } ,
             zip: {
               type : String ,
               required: true
             },
             state: {
               type : String ,
               required: true
             },
             country: {
               type : String ,
               required: true
             },
             message:{
              type: String,
             }
         }
     ],
     wallet:{
      balance:{
        type:Number,
        default:0
      },
      transactions:[{
        order:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'order'
        }
      } ]
     }

}
)




userSchema.methods.addCart = async function(prodId,price) {
  const cartProductIndex = this.cart.findIndex(cp => {
    return cp.proId._id.toString() === prodId.toString();
  });

  // let newQuantity = 1;
  let updatedCart = [...this.cart]
  if (cartProductIndex >= 0) {
    console.log(this.cart[cartProductIndex].quantity)
    let newQuantity = this.cart[cartProductIndex].quantity + 1;
    // let newPrice = this.cart[cartProductIndex].quantity * price;
    updatedCart[cartProductIndex].quantity = newQuantity;
  } else {
     this.cart.push({
      proId: prodId,
      quantity: 1
    });
  }
  return await this.save();
};





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

