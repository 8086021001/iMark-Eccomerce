const express =require('express')
const router = express.Router();
require('dotenv').config({ path: '.env' })



const {getUserOrder,addAddress,getOrderSuccess,createOrder} = require('../controller/order-controller')





router.get('/order',getUserOrder)
router.get('/order/success',getOrderSuccess)

router.post('/order/payment',addAddress)
router.post('/order/create',createOrder)


module.exports = router