const admin = require('../model/myadmin')
const user = require('../model/user')
const product = require('../model/product')
const category = require('../model/categories');

const getAdmin = (req, res) => {
    res.render('admin-signin')
}
const adminLogout = (req, res) => {
    console.log(req.session.adminId)
    req.session.adminId = null;
    res.render('admin-signin')
}
const getAdminHome = (req, res) => {
    if (req.session.adminId) {
        res.render('admin-home')
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



const getAddProducts = async (req, res) => {
    try {
        const catData = await category.find({})
        res.render('admin-addProducts', {category: catData})

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
            return res.render('admin-signin', {errMessage: `Invalid Password`})
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
    console.log(id)
    console.log(User)
    if (User.Action) {
        try {
            await user.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    Action: false
                }
            })
            return res.json({redirect: "http://localhost:4000/admin/users"})
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
            return res.json({redirect: "http://localhost:4000/admin/users"})
        } catch (error) {}
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
    getEditProducts
}
