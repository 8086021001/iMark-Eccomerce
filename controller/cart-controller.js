const User = require('../model/user')
const product = require('../model/product')



const getCart = async(req,res)=>{
  try {
    
    const user = await User.find({_id: req.session.userId}).populate('cart.proId');
    const prodData = user[0].cart
    const totalQuantity = prodData.reduce((total,prod) => {
      return total+prod.quantity;
   } , 0);
      const totalPrice = prodData.reduce((total , prod) => {
      return total+ (prod.quantity * prod.proId.price) 
   } , 0);   
    prodData.forEach((prod) => {
     if(prod.quantity >= prod.proId.inventory) {
         prod.increment = true
     } 
     else if(prod.quantity === 1 ) {
      prod.decrement = true;
     }
  })
  let message = req.session.message
  req.session.message = null
  return res.render('cart',{prod:prodData, totQuant:totalQuantity, totPrice:totalPrice, message})
  } catch (error) {
    console.log(error)
  }
  
}

const addToCart = async(req,res)=>{

  try {
    const Product =await product.find({_id:req.params._id})
    const prodId = Product[0]._id
    const price =  Product[0].price
    const user = await User.find({_id: req.session.userId})
    if(Product[0].inventory!=0){
      await user[0].addCart(prodId,price);
      const nowUserCart = await User.find({_id: req.session.userId})
      let cartProductIndex = nowUserCart[0].cart.findIndex(cp => {
        return cp.proId._id.toString() === prodId.toString();
      });

      let quant = nowUserCart[0].cart[cartProductIndex].quantity
      Product[0].inventory = Product[0].inventory-quant
      Product[0].save();
      return res.redirect('/cart');
    }else{
      return res.redirect('/shop')
    }
  } catch (error) {
    console.log(error)

  }
}


const cartIncrement = async  (req,res) => {
  const id = req.params._id;
  try {
      const user = await User.find({_id: req.session.userId});
      const Product =await product.find({_id:req.params._id}) 
      const index = await user[0].cart.findIndex((item) => {
       return item.proId.valueOf() === `${id}` });
      if(Product[0].inventory!=0){
        user[0].cart[index].quantity = user[0].cart[index].quantity + 1;
        await  user[0].save();
        Product[0].inventory = Product[0].inventory-1
        await Product[0].save();
        res.json({redirect: '/cart'});
      }else{
        req.session.message = 'Out of stock'
        res.json({redirect: '/cart'});
      }
  } catch(e) {
      console.log(e);
  }
}

const cartDecrement = async  (req,res) => {
  try {
      const id = req.params._id;
      const cartProductQuantity = req.body.quantValue
      console.log(cartProductQuantity)
      const user = await User.find({_id: req.session.userId}).populate('cart.proId');
      const Product = await product.find({_id:req.params._id}) 
      const index = await user[0].cart.findIndex((item) => { 
        return item.proId._id.valueOf() === `${id}` 
      });
      if(cartProductQuantity!=1){
          user[0].cart[index].quantity = user[0].cart[index].quantity - 1;
          await  user[0].save();
          Product[0].inventory=Product[0].inventory+1;
          await Product[0].save();
          const totalPrice = user[0].cart.reduce((total , prod) => {
            return total+ (prod.quantity * prod.proId.price) 
          } , 0);  
          res.json({
            quantity: user[0].cart[index].quantity,
            totalAmount: totalPrice
          });
        }else{
          if(index!== -1){
            user[0].cart.splice(index,1)
            await user[0].save();
            res.json({redirect:'/cart'})
          }
        }


  } catch(e) {
      console.log(e);
  }
}

const cartDelete = async (req,res) => {
  const {_id} = req.params;
  try {
    const Product =await product.find({_id:req.params._id})
      const user = await User.find({_id: req.session.userId});
      const index = await user[0].cart.findIndex((item) => { 
        return item.proId.valueOf() === `${_id}` })
      let updatedQuantity = user[0].cart[index].quantity
      user[0].cart.splice(index , 1);
      await user[0].save();
      Product[0].inventory = Product[0].inventory+updatedQuantity;
      await Product[0].save()
      res.json({redirect: '/cart'});
  }  catch(e) {
      console.log(e);
  }
  
}



module.exports = {addToCart,getCart,cartDelete,cartIncrement,cartDecrement}