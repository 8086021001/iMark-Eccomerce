const express =require('express')
const router = express.Router()
const {getAdmin,adminLogin,adminUsers,getAddProducts} = require('../controller/admin-controller')

router.route('/').get(getAdmin)
router.route('/users').get(adminUsers)
router.route('/add').get(getAddProducts)

router.route('/').post(adminLogin)





module.exports = router