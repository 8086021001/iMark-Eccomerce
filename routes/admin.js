const express =require('express')
const router = express.Router()
const session = require('express-session');
const {upload} = require('../multer/multer')
const {getAdmin,adminLogin,adminLogout,adminUsers,
       getAdminHome,getProducts
       ,getAddProducts,blockUser
       ,getEditProducts} = require('../controller/admin-controller')

const {addProduct,editProduct,deleteProduct} = require('../controller/product-controller')
const {getCategory,getAddCategories,addCategory,deleteCategory} = require('../controller/category-controller')

const {adminAuthenticated,adminLogedout} = require('../middlewares/adminAuth')

router.get('/',adminLogedout,getAdmin)
router.get('/adminLogout',adminAuthenticated,adminLogout)
router.get('/users',adminAuthenticated,adminUsers)
router.get('/admin-home',adminAuthenticated,getAdminHome)
router.get('/products',adminAuthenticated,getProducts)
router.get('/category',adminAuthenticated,getCategory)
router.get('/addCategories',adminAuthenticated,getAddCategories)
router.get('/products/add',adminAuthenticated,getAddProducts)
router.get('/products/getEdit/:id',adminAuthenticated,getEditProducts);
//-----
router.route('/login').post(adminLogin);
router.route('/category/add').post(upload.array('file',1),addCategory);
router.route('/products/addProducts').post(upload.array('file',4),addProduct);
//----
router.put('/users/block/:_id',blockUser);
router.delete('/category/delete/:_id',deleteCategory);
router.delete('/product/delete/:_id',deleteProduct);
router.put('/product/edit/:_id',editProduct);






module.exports = router