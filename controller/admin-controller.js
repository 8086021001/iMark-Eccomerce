const admin = require('../model/myadmin')
const user = require('../model/user')
const product = require('../model/product')
const category = require('../model/categories');
const Order = require('../model/order')
const banner = require('../model/banner')
const puppeteer = require('puppeteer');
const XLSX = require('xlsx');





const getAdmin = (req, res) => {
    res.render('admin-signin')
}
const adminLogout = (req, res) => {
    console.log(req.session.adminId)
    req.session.adminId = null;
    res.render('admin-signin')
}
const getAdminHome = async(req, res) => {
    if (req.session.adminId) {
        let users = await user.find()
        let userCount = users.length
        let products = await product.find()
        let productCount  = products.length
        res.render('admin-home',{userCount,productCount})
    } else {
        res.render('admin-signin')
    }

}
const adminUsers = async (req, res, next) => {
    try {
        const userData = await user.find({})
        res.render('admin-user', {user: userData})
    } catch (error) {
        return res.status(500).send(error)
    }
}

const getProducts = async (req, res) => {
    try {
        const proData = await product.find({})
        if (proData.length != 0) {
            proData.forEach((product, index, array) => {
                array[index].images = product.images.splice(0, 1);
            })
            res.render('admin-product', {product: proData})
        } else {
            res.render('admin-product', {product: proData})
        }

    } catch (error) {
        return res.status(500).send(error)
    }
}

const updateBanner = async (req,res)=>{
    try {
        res.render('addBanner')
    } catch (error) {
        console.log(error)
    }
}

const getAddProducts = async (req, res) => {
    try {
        const catData = await category.find({})
        let message = req.session.message
        req.session.message = null
        res.render('admin-addProducts', {category: catData,message})

    } catch (error) {
        return res.status(500).send(error)
    }
}
const getEditProducts = async (req, res) => {
    try {
        const id = req.params.id;

        const prodData = await product.find({_id: id}).populate('category');
        const Category = await category.find({});
        // console.log(prodData.populate("category"));
        let images = prodData[0].images
        let objects = [];
        for (let i = 0; i < prodData[0].images.length; i++) {
            objects[i] = {
                image: images[i],
            };
        }

        let data = {
            objects: objects
        };
        console.log(123, Category)
        res.render('updateproduct', {
            prodData: prodData[0],
            Category,
            objects
        });
    } catch (error) {
        return res.status(500).send(error)
    }
}




// post
const adminLogin = async (req, res) => {

    console.log(req.body)
    let adminUser = new admin(req.body)
    console.log(adminUser)
    const admindata = await admin.find({email: req.body.email})
    console.log(admindata)
    if (admindata != 0) {
        req.session.adminId = admindata[0]._id;
        let pass = admindata[0].password
        if (req.body.password === pass) {
            res.redirect('/admin/admin-home')
        } else {
             res.render('admin-signin', {errMessage: `Invalid Password`})
        }
    } else {
        res.render('admin-signin', {errMessage: `Invalid Credentials`})
    }
}

// Block user

const blockUser = async (req, res) => {
    console.log("Blocking user")
    const id = req.params._id
    const User = await user.findById(id)
    if (User.Action) {
        try {
            await user.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    Action: false
                }
            })
            req.session.userId = null
            return res.json({redirect: "/admin/users"})
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            const User = await user.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    Action: true
                }
            })
            return res.json({redirect: "/admin/users"})
        } catch (error) {}
    }
}

//order details for pdf
const getOrderDetails = async(req,res)=>{
    try {
        const productSale = await Order.aggregate(
            [
                {
                    $match:{
                        isCancelled:false
                    }
                },
                {
                    $group:{
                        _id:{$dayOfYear: '$createdAt'},
                        date: {$first: '$createdAt'},
                        totalAmount:{
                            $sum:'$totalAmount'
                        }
                    }
                },
                {
                  $sort: {
                    date: 1
                  }
                }
            ]
    
        )
        return res.json({ productSale: productSale })
    } catch (error) {
        console.log(error)
    }

}
const getProductData = async(req,res)=>{
    try {
        let productData = await Order.aggregate(
            [
                {
                    '$match': {
                        'isCancelled': false
                      }
                },
                {
                $lookup:
                {
                    from: "products",
                    localField: "orderItems.proId",
                    foreignField: "_id",
                    as: "product_info"
                }
                },
                {
                    $unwind:{
                        path:"$product_info"
                    } 
                 },
                 {
                    $group:
                    {
                       _id: "$orderItems.proId",
                       product_name: { $first: "$product_info.name" },
                       total_orders: { $sum: 1 }
                    }
                 },
                 {
                    $sort: { total_orders: -1 }
                 }
            ]
        )
        return res.json(productData)
    } catch (error) {
        console.log(error)
    }
}

//edit banner
const editBanner = async(req,res)=>{
    const banners = await banner.find()
    console.log(banners)
    const images = req.files.map(file => file.filename);
    const caption = req.body.caption;
    if(!banners){
        let bannerModel = new banner({ caption: caption,images: images });
        await bannerModel.save()
        res.redirect('/admin/admin-home')
    }else{
        await banner.deleteMany()
        let bannerModel = new banner({ caption: caption,images: images });
        await bannerModel.save()
        res.redirect('/admin/admin-home')

    }


}

//pdf html page
const getSalesReport = async (req,res)=>{
    try {
        let orderPerDay = await Order.aggregate(
            [
                {
                    $match:{
                        isCancelled:false
                    }
                },
                {
                    $group:{
                        _id:{$dayOfYear: '$createdAt'},
                        date: {$first: '$createdAt'},
                        totalAmount:{
                            $sum:'$totalAmount'
                        }
                    }
                },
                {
                  $sort: {
                    date: 1
                  }
                }
            ]
        )
        res.render('sales-report',{order:orderPerDay})

    } catch (error) {
        console.log(error)
    }
}

//puppeteer configuration to download pdf
const downloadReport = async (req,res)=>{
    try {
        // Create a browser instance
const browser = await puppeteer.launch();

// Create a new page
const page = await browser.newPage();

// Website URL to export as pdf
const website_url = '/admin/getSalesReport';

// Open URL in current page
await page.goto(website_url, { waitUntil: 'networkidle0' });
//To reflect CSS used for screens instead of print
await page.emulateMediaType('screen');

// Downlaod the PDF
const pdf = await page.pdf({
    path: 'result.pdf',
    margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
    printBackground: true,
    format: 'A4',
  });

  res.download('result.pdf')
  // Close the browser instance
await browser.close();

        
    } catch (error) {
        console.log(error)
    }
}
//puppeteer configuration to download pdf

const downloadProductReport = async (req,res)=>{
    try {
const browser = await puppeteer.launch();

const page = await browser.newPage();

const website_url = '/admin/getProductSalesReport';

// Open URL in current page
await page.goto(website_url, { waitUntil: 'networkidle0' });
//To reflect CSS used for screens instead of print
await page.emulateMediaType('screen');

// Downlaod the PDF
const pdf = await page.pdf({
    path: 'result.pdf',
    margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
    printBackground: true,
    format: 'A4',
  });

  res.download('result.pdf')
  // Close the browser instance
await browser.close();
        
    } catch (error) {
        console.log(error)
    }
}
//pdf html page

const getProductSalesReport = async (req,res)=>{
    try {
        let productData = await Order.aggregate(
            [
                {
                    '$match': {
                        'isCancelled': false
                      }
                },
                {
                $lookup:
                {
                    from: "products",
                    localField: "orderItems.proId",
                    foreignField: "_id",
                    as: "product_info"
                }
                },
                {
                    $unwind:{
                        path:"$product_info"
                    } 
                 },
                 {
                    $group:
                    {
                       _id: "$orderItems.proId",
                       product_name: { $first: "$product_info.name" },
                       total_orders: { $sum: 1 }
                    }
                 },
                 {
                    $sort: { total_orders: -1 }
                 }
            ]
        )
        console.log(productData)
        res.render('productSales-report',{productData})
        
    } catch (error) {
        console.log(error)
        
    }
    
}


//excel product sale report
const downloadProductSalesExcel = async (req,res)=>{
    try {
        let productData = await Order.aggregate(
            [
                {
                    '$match': {
                        'isCancelled': false
                      }
                },
                {
                $lookup:
                {
                    from: "products",
                    localField: "orderItems.proId",
                    foreignField: "_id",
                    as: "product_info"
                }
                },
                {
                    $unwind:{
                        path:"$product_info"
                    } 
                 },
                 {

                    $lookup:{
                        from:"categories",
                        localField: "product_info.category",
                        foreignField: "_id",
                        as: "result"
                      }

                 },
                 {
                    $unwind:{
                        path:"$result"
                    }

                 },
                 {
                    $group:
                    {
                       _id: "$orderItems.proId",
                       product_name: { $first: "$product_info.name" },
                       total_orders: { $sum: 1 },
                       product_category:{$first:"$result.name"},                     
                       
                    }
                 },
                 {
                    $sort: { total_orders: -1 }
                 }
            ]
        )        
      const workSheet = XLSX.utils.json_to_sheet(productData);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Product wise sheet');
      XLSX.writeFile(workBook, 'sampleproduct.xlsx');

      res.download('sampleproduct.xlsx')

    } catch (error) {
        console.log(error)
        
    }



}


const downloadPerdaySalesExcel = async (req,res)=>{
    try {
        let orderPerDay = await Order.aggregate(
            [
                {
                    $match:{
                        isCancelled:false
                    }
                },
                {
                    $group:{
                        _id:{$dayOfYear: '$createdAt'},
                        date: {$first: '$createdAt'},
                        totalAmount:{
                            $sum:'$totalAmount'
                        }
                    }
                },
                {
                  $sort: {
                    date: 1
                  }
                }
            ]
        )
        const workSheet = XLSX.utils.json_to_sheet(orderPerDay);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Product wise sheet');
        XLSX.writeFile(workBook, 'sampleproduct.xlsx');
  
        res.download('sampleproduct.xlsx')

        
    } catch (error) {
        
    }
}

//order details
const orderDetails = async(req,res)=>{
    try {
        let orderDetails = await Order.find({isCancelled:false}).populate('user')        
        res.render('admin_orderDetails',{order:orderDetails})     
    } catch (error) {
        console.log(error)
        
    }
}

//deliver order by admin
const deliverOrder = async (req,res)=>{
    try {
        let id = req.params._id
        let order =await Order.find({_id:id})
        if(order[0].isShipped){
            order[0].isDelivered = true;
            order[0].deliveredAt = Date.now();
            order[0].save();
            res.json({redirect:"/admin/orderDetails"})
        }else{
            let msg = 'Order not yet shipped'
            res.json({messag:msg})
        }


    } catch (error) {
        console.log(error)
    }

}

//category offer

const categoryOffer = async (req,res)=>{
    try {
        let id = req.params._id
        let Category = await category.find({_id:id})

        res.render('categoryOffer',{cat:Category})
    } catch (error) {
        console.log(error)
        
    }
}

const applyCatoffer = async (req,res)=>{
    try {
        let id = req.params._id
        let Cname = req.body.name
        let Offer =req.body.offer
        console.log(Cname,Offer)
        let catoffer = await category.findOneAndUpdate({name:Cname},{$set:{offer:Offer}})
        let Products = await product.find({category:id})
        Products.forEach((item)=>{
            item.Poffer = item.price*(1-(Offer/100))
            item.save()
        })
        console.log(Products)
        res.redirect('/admin/category')

    } catch (error) {
        console.log(error)
    }
}

//view order for admin
const viewOrder =async (req,res)=>{
    try {
        let id = req.params._id
        console.log(id)
        let order = await Order.aggregate([
            {
            $match:{
                _id: ObjectId(id)
            }
        },{
            $unwind:{
                path: '$orderItems' 
        }

        },
        {
           $lookup: {
                from: 'products',
                localField: 'orderItems.proId',
                foreignField: '_id',
                as: 'result'
              }
        },
        {
           $unwind: {
                path: '$result',
              
              }
        },
        {
           $group: {
                _id:{
                          resultId: "$result._id",
                      productName: "$result.name",
                      productPrice:"$result.price",
                      image:"$result.images",
                      totalAmount: "$totalAmount",
                      quantity: "$orderItems.quantity"
                }
              
              }
        }
        ])
        console.log(order)
        res.render('admin-ViewOrderDetails',{Order:order,id})
        


    } catch (error) {
        
    }
}

//approve return order
 const approveReturnOrder = async(req,res)=>{
    try {
        let id = req.params._id
        let order = await Order.find({_id:id})
        let User = await user.find({_id:req.session.userId})
        if(order[0].inReturn){
            order[0].returned = true;
            order[0].save()
            let productUpdate = async function(proId,quantity){
                const Product = await product.find({_id: proId});
                Product[0].inventory = Product[0].inventory + quantity;
                await Product[0].save();
           }
           order[0].orderItems.forEach((item)=> {
               productUpdate(item.proId,item.quantity)
           })
 
            const transaction = {
                order: order[0]._id,
                 };
            let balanceAmount = order[0].totalAmount;
            User[0].wallet.balance += balanceAmount
             User[0].wallet.transactions.push(transaction);
             await User[0].save();
           res.json({redirect:"/admin/orderDetails"})
        }else{
            let msg = 'Unable to accept return'
            res.json({redirect:"/admin/orderDetails",message:msg})
        }




    } catch (error) {
        console.log(error)
    }
 }

 //set order status by admin

 const setOrderStatus =async(req,res)=>{

    try {
        console.log(req.body)
        let id = req.body.id
        let status = req.body.stat
        console.log(id);
        console.log(status);
        let order = await Order.find({_id:id})
        if(status=='Shipped'){
            order[0].isShipped = true,
            order[0].orderStatus = "Shipped"
            order[0].save();
            console.log(`${order[0].isShipped}`,`${order[0].orderStatus}`)
            res.json({redirect:'/admin/orderDetails'})
        }else if(status=='Arriving Today'){
            if(order[0].isShipped){
                order[0].orderStatus = "Arriving Today";
                order[0].save();
                res.json({redirect:'/admin/orderDetails'})

            }else{
                let msg = 'Order not shipped, please ship Order!!'
                res.json({redirect:'/admin/orderDetails',message:msg})
            }


        }else if(status=='Confirmed'){
            if(!order[0].isShipped){
                order[0].orderStatus = "Confirmed";
                order[0].save();
                res.json({redirect:'/admin/orderDetails'})
            }else{
                let msg = 'Order shipped!!!'
                res.json({redirect:'/admin/orderDetails',message:msg})
            }

        }else{
            let msg = 'Un authorised request!'
            res.json({redirect:'/admin/orderDetails',message:msg})
        }

    
    } catch (error) {
        console.log(error)
        
    }
 }




module.exports = {
    getAdmin,
    adminLogin,
    adminLogout,
    adminUsers,
    getAdminHome,
    getProducts,
    getAddProducts,
    blockUser,
    getEditProducts,
    updateBanner,
    getOrderDetails,
    getProductData,
    editBanner,
    getSalesReport,
    downloadReport,
    downloadProductReport,
    getProductSalesReport,
    downloadProductSalesExcel,
    downloadPerdaySalesExcel,
    orderDetails,
    deliverOrder,
    categoryOffer,
    applyCatoffer,
    viewOrder,
    approveReturnOrder,
    setOrderStatus
    
    
}
