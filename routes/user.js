const express =require('express')
const router = express.Router()
const user = require('../model/user')
const bcrypt = require('bcrypt');
const {userLogin,userSignUp,getSignin,getSignup,getLanding,getOtp,resendOtp,getHome,logout} = require('../controller/user-controller');
const { route } = require('./admin');


router.route('/signUp').get(getSignup)
router.route('/signIn').get(getSignin)
router.route('/landing').get(getLanding)
router.route('/home').get(getHome)
router.route('/logout').get(logout)

router.route('/register').post(userSignUp)
router.route('/signin').post(userLogin)
router.route('/otp').post(getOtp)
router.route('/otp/resend').post(resendOtp)




module.exports = router;