const express =require('express')
const router = express.Router()
const session = require('express-session');
const {upload} = require('../multer/multer')
const {getAdmin,adminLogin,adminLogout,adminUsers,
       getAdminHome,getProducts
       ,getAddProducts,blockUser
       ,getEditProducts,updateBanner,
       getOrderDetails,getProductData,editBanner,downloadReport,
        getSalesReport,downloadProductReport,
        getProductSalesReport,downloadProductSalesExcel,
        downloadPerdaySalesExcel,orderDetails,deliverOrder,categoryOffer,
        applyCatoffer,viewOrder,approveReturnOrder} = require('../controller/admin-controller')

const {addProduct,editProduct,deleteProduct,removeProduct} = require('../controller/product-controller')
const {getCategory,getAddCategories,addCategory,deleteCategory} = require('../controller/category-controller')

const {adminAuthenticated,adminLogedout} = require('../middlewares/adminAuth')
const {getCoupon,getaddCoupon,addCoupon} = require('../controller/coupon_controller')

router.get('/',adminLogedout,getAdmin)
router.get('/adminLogout',adminAuthenticated,adminLogout)
router.get('/users',adminAuthenticated,adminUsers)
router.get('/admin-home',adminAuthenticated,getAdminHome)
router.get('/products',adminAuthenticated,getProducts)
router.get('/category',adminAuthenticated,getCategory)
router.get('/addCategories',adminAuthenticated,getAddCategories)
router.get('/products/add',adminAuthenticated,getAddProducts)
router.get('/products/getEdit/:id',adminAuthenticated,getEditProducts);
router.get('/update/banner',adminAuthenticated,updateBanner)
router.get('/order-details',adminAuthenticated,getOrderDetails)
router.get('/product-data',adminAuthenticated,getProductData)
router.get('/coupon',adminAuthenticated,getCoupon)
router.get('/getAddCoupon',adminAuthenticated,getaddCoupon)
router.get('/getSalesReport',getSalesReport)
router.get('/downloadSalesReport',downloadReport)
router.get('/downloadProductSalesReport',downloadProductReport)
router.get('/getProductSalesReport',getProductSalesReport)
router.get('/downloadProductSalesExcel',downloadProductSalesExcel)
router.get('/downloadPerdaySalesExcel',downloadPerdaySalesExcel)
router.get('/orderDetails',orderDetails)
router.get('/categoryOffer/:_id',categoryOffer)
router.get('/viewOrder/:_id',viewOrder)

//-----
router.route('/login').post(adminLogin);
router.route('/category/add').post(upload.array('file',1),adminAuthenticated,addCategory);
router.route('/products/addProducts').post(upload.array('file',4),adminAuthenticated,addProduct);
router.post('/bannerControl',upload.array("banner",3),adminAuthenticated,editBanner)
router.post('/addCoupon',adminAuthenticated,addCoupon)
router.post('/apply-Catoffer/:_id',applyCatoffer)

//----
router.put('/users/block/:_id',adminAuthenticated,blockUser);
router.delete('/category/delete/:_id',adminAuthenticated,deleteCategory);
router.delete('/product/delete/:_id',adminAuthenticated,deleteProduct);
router.put('/product/edit/:_id',adminAuthenticated,editProduct);
router.patch('/product/remove/:_id',adminAuthenticated,removeProduct)
router.put('/order/deliver/:_id',deliverOrder)

router.put('/approveReturn/:_id',approveReturnOrder)






module.exports = router