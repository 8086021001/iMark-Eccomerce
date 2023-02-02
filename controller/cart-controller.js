const User = require('../model/user')
const product = require('../model/product')





const getCart = async(req,res)=>{
  try {
    
    const user = await User.find({_id: req.session.userId}).populate('cart.proId');
    const prodData = user[0].cart
    // console.log(prodData)

    // const TotProPrice = prodData.map((prod)=>{
    //   return prod.proId.price * 3;
    // })
    // console.log(TotProPrice)
      const totalQuantity = prodData.reduce((total , prod) => {
      return total+prod.quantity;
   } , 0);
      const totalPrice = prodData.reduce((total , prod) => {
      return total+ (prod.quantity * prod.proId.price) 
   } , 0);   
   console.log(totalQuantity,totalPrice)

    prodData.forEach((prod) => {
     if(prod.quantity >= prod.proId.inventory) {
        //  console.log(prod.quantity);
        //  console.log(prod.proId.stock)
         prod.increment = true
     } 
     else if(prod.quantity === 1) {
      prod.decrement = true;
     }

  })
  return res.render('cart',{prod:prodData, totQuant:totalQuantity, totPrice:totalPrice})



  } catch (error) {
    console.log(error)
  }
  
}

const addToCart = async(req,res)=>{

  try {
    const Product =await product.find({_id:req.params._id})
    const prodId = Product[0]._id
    const price =  Product[0].price
    console.log(price)
    const user = await User.find({_id: req.session.userId})
    if(Product[0].inventory!=0){
      await user[0].addCart(prodId,price);
      return res.redirect('/cart');
    }else{
      return res.redirect('/shop',{message:'product out of stock'})
    }


  } catch (error) {
    console.log(error)

  }
}
const cartIncrement = async  (req,res) => {
  const id = req.params._id;
  try {
      const user = await User.find({_id: req.session.userId});
      console.log(user[0].cart[0].quantity)
      const index = await user[0].cart.findIndex((item) => { return item.proId.valueOf() === `${id}` });
      user[0].cart[index].quantity = user[0].cart[index].quantity + 1;
      await  user[0].save();
      res.json({redirect: '/cart'});
  } catch(e) {
      console.log(e);
  }
}

const cartDecrement = async  (req,res) => {
  const id = req.params._id;
  try {
      const user = await User.find({_id: req.session.userId});
      const index = await user[0].cart.findIndex((item) => { return item.proId.valueOf() === `${id}` });
      user[0].cart[index].quantity = user[0].cart[index].quantity - 1;
      await  user[0].save();
      res.json({redirect: '/cart'});
  } catch(e) {
      console.log(e);
  }
}

const cartDelete = async (req,res) => {
  const {id} = req.params;
  try {
      const user = await User.find({_id: req.session.userId});
      const index = await user[0].cart.findIndex((item) => { return item.proId.valueOf() === `${id}` })
      console.log(index);
      user[0].cart.splice(index , 1);
      await user[0].save();
      res.json({redirect: '/cart'});
  }  catch(e) {
      console.log(e);
  }
  
}



module.exports = {addToCart,getCart,cartDelete,cartIncrement,cartDecrement}