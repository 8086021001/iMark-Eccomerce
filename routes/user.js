const express =require('express')
const router = express.Router()
const user = require('../model/user')
const bcrypt = require('bcrypt');
const session = require('express-session');
const {userAuthenticated} = require('../middlewares/userAuth')
const {userLogin,userSignUp,getSignin,getSignup,
    getLanding,getOtp,resendOtp,getHome,logout,
    getViewProduct,getShop,getCatProduct,getFeatured,getUserWallet,
    getUserProfile,updateUseraddress,UpdateUserProfile,searchproducts,getNextPage} = require('../controller/user-controller');
const {addToCart,getCart,cartDelete,cartIncrement,cartDecrement} =require('../controller/cart-controller')


router.get('/',getLanding)
router.get('/signup',getSignup)
router.get('/signIn',getSignin)
router.get('/home',userAuthenticated,getHome)
router.get('/logout',logout)
router.get('/product/view/:_id',userAuthenticated,getViewProduct)
router.get('/cart',userAuthenticated,getCart)
router.get('/product/cart/:_id',userAuthenticated,addToCart)
router.get('/shop',getShop)
router.get('/shop/:name',getCatProduct)
router.get('/featured/:highlights',getFeatured)
router.get('/user/wallet',userAuthenticated,getUserWallet)
router.get('/profile',userAuthenticated,getUserProfile)
router.get('/search',searchproducts)
router.get('/shop/next/:num',getNextPage)



router.route('/register').post(userSignUp)
router.route('/signin').post(userLogin)
router.route('/otp').post(getOtp)
router.route('/otp/resend').post(resendOtp)
router.post('/update/useraddress/:id',updateUseraddress)
router.post('/update/userProfile',UpdateUserProfile)

router.delete('/cart/:_id',cartDelete)

router.put('/cart/inc/:_id',cartIncrement)
router.put('/cart/dec/:_id',cartDecrement)






module.exports = router;