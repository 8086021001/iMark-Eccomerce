const user = require('../model/user')
const axios = require('axios')
const bcrypt = require('bcrypt')
const product = require('../model/product')
const session = require('express-session')
const categories = require('../model/categories')
const banner = require('../model/banner')
const { trusted } = require('mongoose')






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
const getLanding = async(req,res)=>{
  try {
    const proData = await product.find({$and: [{highlights:{$exists:true,$nin:[""]}},{isActive:{$exists:true}}]}).populate('category')
    const catData = await categories.find({})
    const banners = await banner.find()

    if(proData.length!=0||catData.length!=0||banners.length!=0){
        proData.forEach((product, index, array)=>{
          array[index].images = product.images.splice(0,1);
          })
        }
        res.render('landing',{bannerData:banners,categories:catData,prod:proData,})

    
  } catch (error) {
    console.log(error);
    
  }
}

const getHome = async(req,res)=>{
    try {
        if(req.session.userId){
          const proData = await product.find({$and: [{highlights:{$exists:true,$nin:[""]}},{isActive:{$exists:true}}]}).populate('category')
          const catData = await categories.find({})
          const banners = await banner.find()
    
          if(proData.length!=0||catData.length!=0||banners.length!=0){
              proData.forEach((product, index, array)=>{
                array[index].images = product.images.splice(0,1);
                })
                res.render('home',{bannerData:banners,categories:catData,prod:proData,})
          }else{
            res.render('home')
          }
        }else{
            res.render('signIn')
        }
    } catch (error) {
        console.log(error)
    }
    
}

const logout = (req,res)=>{
  req.session.userId = null ;
  res.redirect('/signIn');
}

const getShop = async(req,res)=>{
  try {
const perPage = 6;
const page = 2;

const totalCount = await product.countDocuments({});

const skip = (page - 1) * perPage;

const prodData = await product.find({isActive: true})
  .populate('category')
  .skip(skip)
  .limit(perPage);

const paginationInfo = {
  currentPage: page,
  totalPages: Math.ceil(totalCount / perPage),
  totalCount: totalCount
};
let pagenumber = [];
for(let i=1;i<=paginationInfo.totalPages;i++){
  pagenumber[i] =i;
}


const result = {
  pagination: paginationInfo,
  products: prodData
};
    const catData =await categories.find({})
    if(prodData.lenth!=0){
      if(prodData[0].isActive){
        prodData.forEach((Pro,index,array)=>{
          array[index].images = Pro.images.splice(0,1);
        })

        res.render('shop',{prod:prodData,cat:catData,pagenumber})
      }else{
        res.render('shop')
      }
    }
    else{
      res.render('shop')
    }
    
  } catch (error) {
    console.log(error)
  }


}

const getFeatured = async(req,res)=>{
try {
  const featName = req.params.highlights
  console.log(featName)
  res.render('featured')
} catch (error) {
  
}
}


const getCatProduct = async(req,res)=>{
  try {
    
    const catName = req.params.name
    let prodData = await product.find({}).populate('category')
    const catData =await categories.find({})
    if(prodData[0].isActive){
      prodData = prodData.filter((prod)=>{
        if(prod.category.name == catName){
          return prod;
        }
      })
      prodData.forEach((Pro,index,array)=>{
        array[index].images = Pro.images.splice(0,1);
      })
      res.render('shop',{prod:prodData,cat:catData})
    }

  } catch (error) {
    
  }
}



const userLogin = async(req,res)=>{
    try {
        console.log(req.body)
        const myuser = await user.find({email: req.body.email})
        console.log(myuser)
        
        if(myuser.length == 1 && myuser[0].Action){
          req.session.userId = myuser[0]._id;
          let isVerified = await bcrypt.compare(req.body.password, myuser[0].password)
          console.log(myuser[0].password);
          console.log(isVerified)
          if(isVerified){
            res.redirect('/home')
          }else{
            res.render('signIn',{errMessage: `Invalid Password`})
            
          }  
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
        let myuser =await user.find({$or:[{email: req.body.email},{phone:req.body.phone}]})
        if(myuser.length>=1){
         console.log(myuser)
           console.log("User already available")
           res.render('signup',{errMessage: `Email or phone already exist, try using different.`})
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
       console.log(otp);
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
          res.render("otp",{
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
        return res.render({message: "OTP sent successfully"})
      }else{
        return res.render({message: "Some error occured"})
      }
    })
    .catch((error) => {
      console.log(error)
      return res.json({message: "Could not resend, Please try again"})
    })
  }

const getViewProduct = async(req,res)=>{
  try {
    const proId = req.params._id
    const prodData = await product.findById(proId).populate('category')
    // const img = {...prodData.images}
    res.render('productPage',{prodData})
  } catch (error) {
    return res.status(500).send(error)
  }

}


//user Wallet
const getUserWallet = async(req,res)=>{
  try {
    let Id = req.session.userId
    let User = await user.find({_id:Id}).populate('wallet.transactions.order')
    let balance = User[0].wallet.balance;
    let trans =User[0].wallet.transactions;
    res.render('userWallet',{balance:balance,transactions:trans})
  } catch (error) {
    console.log(error)
  }

}

//user Profile
const getUserProfile = async(req,res)=>{
  try {
    let id = req.session.userId;
    let User = await user.findById(id)
    res.render('userProfile',{User})
  } catch (error) {
    console.log(error)
  }
}
//update user Address
const updateUseraddress = async(req,res)=>{
  try {
    let Id =req.session.userId
    let addId =req.params.id
    let {houseAddress,streetAddress,city,state,zipCode} = req.body
    let User = await user.findById(Id)
    let index = User.address.findIndex((item) => {
      return item._id.valueOf() == addId
    })
     User.address[index].houseName = houseAddress;
     User.address[index].address = streetAddress
     User.address[index].city = city
     User.address[index].state = state
     User.address[index].zip = zipCode

     await User.save()
     res.redirect('/profile')

  } catch (error) {
    console.log(error)
    
  }

}
//update user data password


const UpdateUserProfile = async(req, res) => {
  const userId = req.session.userId; 
  let User = await user.findById(userId)
  console.log(req.body)
  const {firstName, lastName, email, password } = req.body; 

  if (password !== User.password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    User.firstName = firstName;
    User.lastName = lastName;
    User.email = email;
    User.password = hashedPassword;

    await User.save()
   res.redirect('/profile');

  } else {
    User.firstName = firstName;
    User.lastName = lastName;
    User.email = email;
    await User.save()
    res.redirect('/profile');
  }
}

//search 
const searchproducts =async(req,res)=>{
  try {
    const element = req.query.search;
    console.log(element)
    const regex = new RegExp(element, 'i');
    const prod = await product.find({ name: regex })
    res.json({products:prod});
  
  } catch (error) {
    console.log(error)
  }

}

//get next page pagnation
const getNextPage = async(req,res)=>{


  try {
    let number =req.params.num
    console.log(number)
      const num = parseInt(number.match(/\d+/)[0], 10);
    let perPage = 6;
    const page = num;

    
    const totalCount = await product.countDocuments({});
   let totalPages = Math.ceil(totalCount / perPage)

    
    const skip = (page - 1) * perPage;
    if (page === totalPages) {
      const remainingProducts = totalCount % perPage;
      if (remainingProducts > 0) {

        perPage = remainingProducts;
      }
    }
    
    const prodData = await product.find({isActive: true})
      .populate('category')
      .skip(skip)
      .limit(perPage);
    
    const paginationInfo = {
      currentPage: page,
      totalPages: Math.ceil(totalCount / perPage),
      totalCount: totalCount
    };
    let pagenumber = [];
    for(let i=1;i<=totalPages;i++){
      pagenumber[i] =i;
    }
    
    
    const result = {
      pagination: paginationInfo,
      products: prodData
    };

        const catData =await categories.find({})
        if(prodData.lenth!=0){
          if(prodData[0].isActive){
            prodData.forEach((Pro,index,array)=>{
              array[index].images = Pro.images.splice(0,1);
            })
    
            res.render('shop',{prod:prodData,cat:catData,pagenumber})
          }else{
            res.render('shop')
          }
        }
        else{
          res.render('shop')
        }
        
      } catch (error) {
        console.log(error)
      }
    

}

module.exports = {userLogin,userSignUp,getSignin,getSignup,
  getLanding,getOtp,resendOtp,getHome,logout,getViewProduct,getShop,getCatProduct,
  getFeatured,getUserWallet,getUserProfile,updateUseraddress,UpdateUserProfile,searchproducts,getNextPage}