const admin = require('../model/myadmin')
const user = require('../model/user')
const product = require('../model/product')

const getAdmin = (req,res)=>{
    res.render('admin-signin')
}
const adminUsers = async(req,res,next)=>{
    try {
        const userData = await user.find({})
        console.log(userData)
        res.render('admin-user',{user:userData})
    } catch (error) {
        return res.status(500).send(error)
    }
}


const adminLogin = async(req, res)=> {
    try {
        console.log(req.body)
        const admindata = await admin.find({email: req.body.email})
        console.log(admindata)
        if(admindata.length == 0){
            res.render('admin-signin',
            {errMessage : `Invalid login credentials`})
        }else{
            res.render('admin-home')
        }
    } catch (error) {
        return res.status(500).send(error)
    }
  
  }
const getAddProducts = (req,res)=>{
    res.render('admin-addProducts')
}


module.exports = {getAdmin,adminLogin,adminUsers,getAddProducts}