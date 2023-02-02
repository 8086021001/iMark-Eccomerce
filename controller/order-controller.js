

const User = require('../model/user')
const product = require('../model/product')
const Order = require('../model/order')
const Razorpay = require('razorpay');





const getUserOrder = async(req,res)=>{
    try {
        const id = req.session.userId
        const userData = await User.find({_id:id}).populate('cart.proId')
        const prodData = userData[0].cart
        const addressDat = userData[0].address
        const totalQuantity = prodData.reduce((total , prod) => {
            return total+prod.quantity;
         } , 0);
        const totalPrice = prodData.reduce((total , prod) => {
            return total+ (prod.quantity * prod.proId.price) 
         } , 0); 
         console.log(totalPrice)
        res.render('billing',{totquant:totalQuantity,totprice:totalPrice,add:addressDat})
    } catch (error) {
        console.log(error)
    }

}

const addAddress= async (req,res)=>{
    try {
        let id = req.session.userId
        let userDetails = await User.findById(id)
        let AddressData = {
            houseName:req.body.housename,
            address:req.body.address,
            phone:req.body.phone,
            city:req.body.city,
            zip:req.body.zip,
            state:req.body.state,
            country:req.body.country,
            message:req.body.message,
        }
        userDetails.address.push(AddressData)
        await userDetails.save((error) => {
            if (error) throw error;
            console.log("Document updated");
          });

          res.redirect('/order')
        
    } catch (error) {
        console.log(error)
    }
}
const getOrderSuccess = (req,res)=>{
    try {
        res.render('orderSucess')
    } catch (error) {
        console.log(error)
    }
}

const  createOrder = async (req, res) => {
    const { totalAmount, orderStatus, paymentMethod, shippingInfo } = req.body;

    try {
        const id= req.session.userId
        const user = await User.findById(id);
        console.log(user.address)
        const index = user.address.findIndex((item) => {
            return item._id.valueOf() == shippingInfo;
        })
        console.log(index)
        let shippingAddres = user.address[index];
        if (paymentMethod == 'cash on delivery') {
            console.log('if  cod controller wroks!!');
            const newOrder = await Order.create({
                shippingInfo: shippingAddres,
                user: user._id,
                orderItems: user.cart,
                totalAmount: totalAmount,
                orderStatus: orderStatus,
                paymentMode: paymentMethod,
            })

            user.cart.splice(0);
            await user.save({ validateBeforeSave: false });
            await newOrder.save();
            res.json({ redirect: '/order/success' });
        } else if (paymentMethod === 'Razor pay') {
            console.log('if razor pay controller wroks!!')
            let instance = new Razorpay({
                key_id: process.env.Razorpay_key,
                key_secret: process.env.Razorpay_secret
            });
            const myOrder = await instance.orders.create({
                amount: totalAmount * 100,
                currency: "INR",
                // order_id:Order.id,
                receipt: "receipt@1"
            })
            console.log(myOrder);

            const newOrder = await Order.create({
                shippingInfo: shippingAddres,
                user: user._id,
                orderItems: user.cart,
                totalAmount: totalAmount,
                orderStatus: orderStatus,
                paymentMode: paymentMethod,
            })
            console.log(newOrder)
            user.cart.splice(0);
            await user.save({ validateBeforeSave: false });
            await newOrder.save();
            console.log('order saved in db');
            res.json({myOrder: myOrder , redirect: '/order/success'})
        }
    } catch (e) {
        console.log(e);
    }

}






module.exports = {getUserOrder,addAddress,getOrderSuccess,createOrder}