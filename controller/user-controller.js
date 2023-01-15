var user = require('../model/user')
const axios = require('axios')
const bcrypt = require('bcrypt')



const getSignin = (req,res)=>{
  if(req.session.userId) {
    res.redirect('/home')
  }else{
    res.render('signIn')
  }
}
const getSignup= (req,res)=>{
  if(req.session.userId) {
    res.redirect('/home')
  }else{
    res.render('signUp')
  }
}
const getLanding = (req,res)=>{
    res.render('landing')
}

const getHome = (req,res)=>{
    try {
        console.log(req.session.userId)
        if(req.session.userId){
           res.render('home') 
        }else{
            res.render('signIn')
        }
    } catch (error) {
        console.log(error)
        return res.render('404')
    }
    
}

const logout = (req,res)=>{
  console.log('HI')
  req.session.user = null ;
  req.session.userId = null ;
  res.redirect('/signIn');
}


const userLogin = async(req,res)=>{
    try {
        console.log(req.body)
        const myuser = await user.find({email: req.body.email})
        const isVerified = await bcrypt.compare(req.body.password ,myuser[0].password)
        console.log(isVerified)
        req.session.userId = myuser[0];
        // req.session.user.Id = myuser[0]._id;
        if(myuser.length===1 && isVerified){
            res.redirect('/home')
        }else{
            res.render('signUp',
            {errMessage: `User doesn't exist. Please signUp`},
            )
          }
    } catch (error) {
        console.log(error)
        return res.send('404')
    }
    
}
const userSignUp = async(req,res)=>{
    try {
        let userData = new user(req.body)
        let myuser =await user.find({email: req.body.email})
        if(myuser.length>=1){
         console.log(myuser)
           console.log("User email already available")
           res.render('signup',{errMessage: `Email already exist, try using different email.`})
       }else{
        req.session.user={
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
          } 
          async function generateOtp() {    
            console.log('generateOtp')  
            let otp = Math.floor(100000 + Math.random()*900000)
            console.log(otp+" "+req.body.phone) ;   
            req.session.phone=req.body.phone
            res.req.session.otp = otp;
            await sendOtp(otp, req.body.phone)
            }
            generateOtp();
        res.render('otp');    
       }
    } catch (error) {
        console.log(error)
        res.redirect('/signup')
    }   
}
function sendOtp(otp, number){
    console.log('sendotp')
    console.log(otp)
    const body = {
      "authorization" : process.env.AUTHORIZATION_KEY,
      "variables_values" : otp,
      "route" : "otp",
      "numbers" : number
    }
    return axios({
      method : 'GET',
      url : 'https://www.fast2sms.com/dev/bulkV2',
      data: body
    })
  }

const getOtp = async(req,res)=>{
        console.log('check otp')
        console.log(req.body.otp)
       const otp = req.session.otp
        if(req.body.otp == otp){
           console.log(req.session.user) 
        try{
          var myData = new user(req.session.user)
          console.log(myData)
            await myData.save()
            res.redirect('/signIn')
          }catch(error){
            console.log(error)
            res.redirect('/register')
          }
          
        }else{
          res.json({
            message: 'Invalid OTP'
          })
        }
      
}

const resendOtp =  (req, res, next) => {
    otp = Math.floor(100000 + Math.random()*900000)
    sendOtp(otp, req.body.phone)
    .then((response)=>{
      console.log(response.data)
      if(response.data.return){
        return res.json({message: "OTP sent successfully"})
      }else{
        return res.json({message: "Some error occured"})
      }
    })
    .catch((error) => {
      console.log(error)
      return res.json({message: "Could not resend, Please try again"})
    })
  }






module.exports = {userLogin,userSignUp,getSignin,getSignup,getLanding,getOtp,resendOtp,getHome,logout}