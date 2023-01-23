const admin = require('../model/myadmin')
const user = require('../model/user')
const product = require('../model/product')
const category = require('../model/categories')
// const { populate } = require('../model/categories')

const getAdmin = (req,res)=>{
    res.render('admin-signin')
}
const getAdminHome = (req,res)=>{
         res.render('admin-home')  
}
const adminUsers = async(req,res,next)=>{
    try {
        const userData = await user.find({})
        res.render('admin-user',{user:userData})
    } catch (error) {
        return res.status(500).send(error)
    }
}
const getProducts = async(req,res)=>{
  try {
    const proData = await product.find({})
    if(proData.length!=0){
      proData.forEach((product, index, array)=>{
            array[index].images = product.images.splice(0,1);
      })
      res.render('admin-product',{product:proData})
    }else{
      res.render('admin-product',{product:proData})
    }

  } catch (error) {
    return res.status(500).send(error)
  }
}

const getCategory = async(req,res)=>{
  try {
    const catData = await category.find({})
    console.log(catData)
    res.render('category',{category:catData})
  } catch (error) {
    return res.status(500).send(error)
  }
}

const getAddCategories = (req,res)=>{
  res.render('addCategory')
}

const getAddProducts = async(req,res)=>{
  try {
    const catData = await category.find({})
    res.render('admin-addProducts',{category:catData})

  } catch (error) {
    return res.status(500).send(error)
  }
}
const getEditProducts = async(req,res)=>{
  try {
    const id = req.params._id;
    console.log(id);
    const catData = await category.find({})

    const prodData = await product.findById(id).populate('category')
    // console.log(prodData.populate("category"));
    res.render('updateproduct',{prodData:prodData,catData})
  } catch (error) {
    return res.status(500).send(error)
  }
}






//post
const adminLogin = async(req, res)=> {
    
        console.log(req.body)
        let adminUser = new admin(req.body)
        console.log(adminUser)
        const admindata = await admin.find({email: req.body.email})
        let session = req.session
        session.adminId = admindata[0];
        console.log(admindata)
        if(admindata.length == 1){
            const pass = admindata[0].password
            if(req.body.password === pass ){
            res.redirect('/admin/admin-home')
        }else{
           return res.render('admin-signin',{errMessage : `Invalid Password`})
        }
        }
        if(admindata.length!=1){
            return res.render('admin-signin',{errMessage : `Invalid login credentials`})
  }
}

//Block user

const blockUser = async(req, res) => {
  console.log("Blocking user")
  const id = req.params._id
  const User = await user.findById(id)
  console.log(id)
  console.log(User)
  if(User.Action){
    try {
      await user.findOneAndUpdate({_id:id}, {
        $set: {
          Action: false
        }
      })
      return res.json({
        redirect:"http://localhost:4000/admin/users"
      })
    } catch (error) {
      console.log(error)
    }
  }else{
    try {
      const User = await user.findOneAndUpdate({_id:id}, {
        $set: {
          Action: true
        }              
      })        
      return res.json({              
        redirect:"http://localhost:4000/admin/users"
      })
    } catch (error) {
    }
  }        
}




//ADD categories
const addCategory = async (req, res) =>{
    let Category = new category({
      name:req.body.name,
    })
    await Category.save();
    if(!Category)
    return res.status(404).send('the category cannot be created!')
    res.redirect('/admin/category')
  }
//delete Category
const deleteCategory = async (req, res) =>{
  console.log('delete Category')
      const id = req.params._id
      const user = await category.findById(id)
      console.log(id)
      console.log(user) 

    try{
    await category.findByIdAndRemove(id)
    .then((category)=>{        
      if(category){
        return res.status(200).json({redirect:"http://localhost:4000/admin/category"})
      }else{
        return res.status(404).json({redirect:"http://localhost:4000/admin/category"})
      }
    }).catch(err=>{
      return res.status(400).json({redirect:"http://localhost:4000/admin/category"})
    })
    
  } catch (error) {
    console.log(error)
  }    

  }


// Adding products
const addProduct = async (req, res) =>{
  try {
    const existing = await product.find({name: req.body.product_name})
    const images = [];

    for(key in req.files){
      const imPath = req.files[key].path
      const path = imPath.substring(imPath.lastIndexOf("\\")-8);
      // images.push(req.files[key].path);
      images.push(path);

    }
    console.log(images);
    let Product = new product({
      name:req.body.product_name,
      category:req.body.category,
      highlights:req.body.highlights,
      price:req.body.price,
      size:req.body.product_size,
      inventory:req.body.inventory,
      description:req.body.description,
      images:images
    }) 
    if(existing.length == 0){
      if(images.length < 3 ){
        return res.redirect('/admin/products/add')
      }else{
        try {
          await Product.save();
          return res.redirect('/admin/products')
        } catch (error) {
          console.log(error)
          return res.redirect('/admin/products/add')
        }  
      }

    }else{
      return res.redirect('/admin/products/add')

    }
} catch (error) {
    console.log(error);
}
}


//Edit Product
const editProduct = async(req,res) =>{

const id = req.params._id
const Product= await product.findById(id).populate('category')
console.log("I m req params")
console.log(req.params)
const images = [];

for(key in req.files){
  console.log(req.files[key].path);
  const imPath = req.files[key].path
  const path = imPath.substring(imPath.lastIndexOf("\\")-8);
  // images.push(req.files[key].path);
  images.push(path);

}
try {
  await user.findOneAndUpdate({_id:id}, {
    $set: {
      name:req.params.name,
      category:req.params.category,
      highlights:req.params.highlights,
      price:req.params.price,
      size:req.params.size,
      inventory:req.params.inventory,
      description:req.params.description,
      images:images
    }})
    return res.json({
      redirect:"http://localhost:4000/admin/products"
    })
} catch (error) {
  console.log(error)
  return res.redirect('/admin/products')
}
}


//Delete Products
const deleteProduct = async (req, res) =>{

      const id = req.params._id
      const Product = await product.findById(id)
      console.log(id)
      console.log(Product) 

    try{
    await product.findByIdAndRemove(id)     
    .then((product)=>{        
      if(product){          
        return res.status(200).json({redirect:"http://localhost:4000/admin/products"})
      }else{
        return res.status(404).json({redirect:"http://localhost:4000/admin/products"})
      }
    }).catch(err=>{
      return res.status(400).json({redirect:"http://localhost:4000/admin/products"})
    })
    
  } catch (error) {
    console.log(error)
  }    
}




module.exports = { getAdmin,adminLogin,adminUsers,getAdminHome,
                 addCategory,deleteCategory,getProducts,getCategory,
                 getAddCategories,getAddProducts,addProduct,deleteProduct,
                 blockUser,editProduct,getEditProducts }