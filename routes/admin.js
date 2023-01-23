const express =require('express')
const router = express.Router()
const {getAdmin,adminLogin,adminUsers,addProduct,getCategory,
       getAdminHome,addCategory,deleteCategory,getProducts,
       getAddCategories,getAddProducts,deleteProduct,blockUser,
       editProduct,getEditProducts} = require('../controller/admin-controller')
const {upload} = require('../multer/multer')

router.get('/',getAdmin)
router.get('/users',adminUsers)
router.get('/admin-home',getAdminHome)
router.get('/products',getProducts)
router.get('/category',getCategory)
router.get('/addCategories',getAddCategories)
router.get('/products/add',getAddProducts)
router.get('/products/getEdit/:_id',getEditProducts)
//-----
router.route('/login').post(adminLogin)
router.route('/category/add').post(addCategory)
router.route('/products/addProducts').post(upload.array('file',4),addProduct)
//----
router.put('/users/block/:_id',blockUser)
router.delete('/category/delete/:_id',deleteCategory)
router.delete('/product/delete/:_id',deleteProduct)
router.put('/product/edit/:_id',upload.array('file',4) ,editProduct)






module.exports = router