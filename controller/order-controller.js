

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
        for (let i = 0; i < prodData.length; i++) {
          let product = prodData[i].proId;
          if (product.Poffer !== 0) {
            totalPrice += product.Poffer;
          } else {
            totalPrice += product.price;
          }
        }
        totalPrice.toFixed(2)
         res.render('billing',{paypal:process.env.Paypal_clientId,totquant:totalQuantity,totprice:totalPrice,add:addressDat})


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
        } else if(items){
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
        }}catch (e) {
            console.log(e);
        }
    } 


const cancelOrder = async (req,res)=>{
    try {
        let orderId = req.params.orderId
        const orderDetails = await Order.find({_id:orderId,isShipped:false},
            {$set:{isCancelled:true}},{new:true},
            (err,orderDetails)=>{
                if(err){
                    console.log(err)
                }else if(!orderDetails){
                    let mes = "Product Shipped, Please return your order after receiving."
                    res.json({redirect: '/order/success',mes})
                }else{
                    let productUpdate = async function(proId,quantity){
                        const Product = await product.find({_id: proId});
                        Product[0].inventory = Product[0].inventory + quantity;
                        await Product[0].save();
                   }
                   orderDetails[0].orderItems.forEach((item)=> {
                       productUpdate(item.proId,item.quantity)
                   })
                   res.json({redirect: '/order/success'})
                }
            })
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

const returnOrder =async(req,res)=>{
    try {
        let id = req.params._id
        let ordered = await Order.find({_id:id})
        let shipped = ordered[0].isShipped
        console.log(shipped)
        if(!shipped){
            let order = await Order.findOneAndUpdate({_id:id},{$set:{inReturn:true}})
            res.json({redirect:"/order/success"})
        }else{
            let message = 'Order shipped, please return the order'
            res.json({message})
        }

    } catch (error) {
        console.log(error)
    }
}





module.exports = {getUserOrder,addAddress,getOrderSuccess,createOrder,cancelOrder,applyingCoupon,returnOrder}