const Coupon = require('../model/coupon')



const getCoupon = async (req,res)=>{
    let coupon = await Coupon.find()
    res.render('admin-coupon',{coupon:coupon})
}

const getaddCoupon =  (req,res)=>{
    res.render('admin-addCoupon')
}

const addCoupon = async (req,res)=>{
    try {
        let existing = await Coupon.find({code:req.body.name})

        if(existing.length==0){
            let newCoupon = new Coupon({
                code:req.body.name,
                expiry:req.body.expiry,
                discount:req.body.discount,
                minimum:req.body.minimum,
            })

            await newCoupon.save()
            res.redirect('/admin/coupon')
    
        }else{
            req.session.message = 'Coupon already exists'
            let message = req.session.message;
            req.session.message = null;
            res.render('admin-addCoupon',{message})
    
        }
    } catch (error) {
        console.log(error)
    }



}



module.exports = {getCoupon,getaddCoupon,addCoupon}