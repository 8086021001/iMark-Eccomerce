const express =require('express')
const router = express.Router()
const user = require('../model/user')
const bcrypt = require('bcrypt');
const session = require('express-session');
const {userAuthenticated} = require('../middlewares/userAuth')
const {userLogin,userSignUp,getSignin,getSignup,
    getLanding,getOtp,resendOtp,getHome,logout,
    getViewProduct,getShop,getCatProduct,getFeatured} = require('../controller/user-controller');
const {addToCart,getCart,cartDelete,cartIncrement,cartDecrement} =require('../controller/cart-controller')
// const {userAuthenticated} = require('../middlewares/userAuth')

router.get('/signup',getSignup)
router.get('/signIn',getSignin)
router.get('/landing',getLanding)
router.get('/home',userAuthenticated,getHome)
router.get('/logout',logout)
router.get('/product/view/:_id',userAuthenticated,getViewProduct)
router.get('/cart',userAuthenticated,getCart)
router.get('/product/cart/:_id',addToCart)
router.get('/shop',getShop)
router.get('/shop/:name',getCatProduct)
router.get('/featured/:highlights',getFeatured)


router.route('/register').post(userSignUp)
router.route('/signin').post(userLogin)
router.route('/otp').post(getOtp)
router.route('/otp/resend').post(resendOtp)
router.delete('/cart/:_id',cartDelete)
router.put('/cart/inc/:_id',cartIncrement)
router.put('/cart/dec/:_id',cartDecrement)






module.exports = router;