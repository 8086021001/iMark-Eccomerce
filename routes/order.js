const express =require('express')
const router = express.Router();
require('dotenv').config({ path: '.env' })



const {getUserOrder,addAddress,getOrderSuccess,createOrder,cancelOrder,applyingCoupon,returnOrder} = require('../controller/order-controller')





router.get('/order',getUserOrder)
router.get('/order/success',getOrderSuccess)

router.post('/order/payment',addAddress)
router.post('/order/create',createOrder)
router.post('/order/applycoupon',applyingCoupon)
router.put('/order/cancel/:orderId',cancelOrder)
router.put('/order/returnOrder/:_id',returnOrder)




module.exports = router