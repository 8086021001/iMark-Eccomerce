

const User = require('../model/user')
const product = require('../model/product')
const Order = require('../model/order')
const Category = require('../model/categories')
const Razorpay = require('razorpay');
const coupon = require('../model/coupon')
// const paypal = require("paypal-rest-sdk");
const paypal = require("@paypal/checkout-server-sdk");
const { parse } = require('handlebars');
require("dotenv").config()
const moment = require('moment');





const Environment = process.env.NODE_ENV === 'production'
        ?paypal.core.LiveEnvironment
        :paypal.core.SandboxEnvironment

const paypalClient = new paypal.core.PayPalHttpClient(
    new Environment(
        process.env.Paypal_clientId,
        process.env.Paypal_secret
    )
)        








const getUserOrder = async(req,res)=>{
    
    try {
        const id = req.session.userId
        const userData = await User.find({_id:id}).populate('cart.proId')
        const prodData = userData[0].cart
        const addressDat = userData[0].address
        const totalQuantity = prodData.reduce((total , prod) => {
            return total+prod.quantity;
         } , 0);
         
        let totalPrice = 0;

        let walletBalance = userData[0].wallet.balance;
        for (let i = 0; i < prodData.length; i++) {
          let product = prodData[i].proId;
          if (product.Poffer !== 0) {
             totalPrice += product.Poffer;
          } else {
             totalPrice += product.price;
          }
        }
        const number = parseFloat(totalPrice);
        let price = parseInt(number); // Convert the number to an integer
         res.render('billing',{paypal:process.env.Paypal_clientId,totquant:totalQuantity,totprice:price,add:addressDat,walBal:walletBalance})

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
        await userDetails.save();

        res.redirect('/order')
        
    } catch (error) {
        console.log(error)
    }
}
const getOrderSuccess = async (req,res)=>{
    try {
        const id= req.session.userId;
        const orderDetails = await Order.find({user:id}).populate('user').populate('orderItems.proId')
        const order = orderDetails;
        // console.log(order);
        if(order){
            res.render('orderSucess',{order: order})
        }else{
            res.render('orderSucess')
        }
    } catch (error) {
        console.log(error)
    }
}

const  createOrder = async (req, res) => {
    const { totalAmount, orderStatus, paymentMethod, shippingInfo,items} = req.body;
console.log(paymentMethod)
console.log(items)
    try {
        
        const id= req.session.userId
        const user = await User.findById(id).populate('cart.proId');
        let productName = user.cart[0].proId.name;
        let index = user.address.findIndex((item) => {
            return item._id.valueOf() == shippingInfo;
        })
        console.log(index)
        let shippingAddres = user.address[index];
        if (paymentMethod == 'cash on delivery') {
            const newOrder = await Order.create({
                shippingInfo: shippingAddres,
                user: user._id,
                orderItems: user.cart,
                totalAmount: totalAmount,
                orderStatus: orderStatus,
                paymentMode: paymentMethod,
            })


            await newOrder.save();


            user.cart.splice(0);
            await user.save({ validateBeforeSave: false });
           
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
             res.json({myOrder: myOrder , redirect: 'http://localhost:4000/order/success'})
        }else if(paymentMethod === 'Wallet'){
            const newOrder = await Order.create({
                shippingInfo: shippingAddres,
                user: user._id,
                orderItems: user.cart,
                totalAmount: totalAmount,
                orderStatus: orderStatus,
                paymentMode: paymentMethod,
            })
            console.log(newOrder);


            await newOrder.save();

            user.wallet.balance -= totalAmount;
            user.cart.splice(0);
            await user.save({ validateBeforeSave: false });
           
            res.json({ redirect: '/order/success' });

        }else if(items){
            console.log('In paypal')
            let Paypalindex = user.address.findIndex((item) => {
                return item._id.valueOf() == items[3].shippingInfo;
            })
            console.log(Paypalindex)
            let PaypalShippingAddress = user.address[Paypalindex];

            
            let total = items[0].totalAmount
            console.log(total)
            try {
                const request = new paypal.orders.OrdersCreateRequest()
                request.prefer("return=representation");
                request.requestBody({
                    intent: 'CAPTURE',
                    purchase_units:[
                        {
                            amount:{
                                currency_code:'USD',
                                value:total,
                                breakdown:{
                                    item_total:{
                                        currency_code:'USD',
                                        value:total
                                    }
                                }
                            }
                        }
                    ]
                })
                try {
                    const order = await paypalClient.execute(request)
                    const newOrder = await Order.create({
                        shippingInfo: PaypalShippingAddress,
                        user: user._id,
                        orderItems: user.cart,
                        totalAmount: items[0].totalAmount,
                        orderStatus: items[2].orderStatus,
                        paymentMode:items[1].paymentMethod,
                    })
                    console.log(newOrder)
                    user.cart.splice(0);
                    await user.save({ validateBeforeSave: false });
                    await newOrder.save();
                    console.log('order saved in db');
                     res.json({id:order.result.id, redirect: '/order/success'})
                } catch (error) {
                    console.log(error)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }catch (e) {
            console.log(e);
        }
    } 

//user cancel order
const cancelOrder = async (req,res)=>{
    try {
        let orderId = req.params.orderId
        const orderDetails = await Order.find({_id:orderId})

        if(orderDetails[0].isShipped==false){
            orderDetails[0].isCancelled = true;
            orderDetails[0].save();

            let productUpdate = async function(proId,quantity){
                const Product = await product.find({_id: proId});
                Product[0].inventory = Product[0].inventory + quantity;
                await Product[0].save();
           }
           orderDetails[0].orderItems.forEach((item)=> {
               productUpdate(item.proId,item.quantity)
           })
           res.json({redirect: '/order/success'})
        }else{
            let msg = 'Order shipped, please dilever it and return.'
            res.json({messag:msg})
        }

    } catch (error) {
        console.log(error)
    }


}


 

const applyingCoupon = async (req,res)=>{
    try {
        const {couponcode,totalAmount} = req.body
        let exists = await coupon.find({code:couponcode})
        let currentDate = new Date();
        console.log(currentDate)
        if(exists.length!=0){
            if(exists[0].expiry>currentDate){
                let amount = parseInt(totalAmount) 
                let newAmount =  amount*(1-(exists[0].discount/100))
                console.log(newAmount)

                let message = 'Coupon applied'
                newAmount.toFixed(1)
                res.json({totalAmount:newAmount,msg:message})
            }else{
                let message = 'Coupon expired'
                res.json({msg:message})
            }
        }else{
            let message = 'Coupon not available, try another!';
            res.json({msg:message})
        }


    } catch (error) {
        console.log(error)
        
    }
}

//user returning order

const returnOrder = async (req, res) => {
    try {
      const id = req.params._id;
      const ordered = await Order.find({ _id: id });
      const deliveryDate = ordered[0].deliveredAt;
  
      const deliveredDate = moment(deliveryDate);
      const threeDaysFromThis = moment().add(3, 'days');
      
  
      if (deliveredDate.isBetween(moment().subtract(1, 'day'), threeDaysFromThis)) {
        console.log('Hi');
        if (ordered[0].isDelivered) {
            console.log(ordered[0].isDelivered)
          ordered[0].inReturn = true;
          await ordered[0].save(); // Use "await" to wait for the save operation to complete
          const mesg = 'Waiting for Approval';
          res.json({ redirect: '/order/success',message:mesg });
        } else {
          res.json({ redirect: '/order/success' });
        }
      } else {
        const msg = 'Return possible only within 3 days after delivery.';
        res.json({ redirect: '/order/success', messag: msg });
      }
    } catch (error) {
      console.log(error);
    }
  };
  





module.exports = {getUserOrder,addAddress,getOrderSuccess,createOrder,cancelOrder,applyingCoupon,returnOrder}