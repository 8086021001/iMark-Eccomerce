const product = require('../model/product')
const User = require('../model/user')






// Adding products
const addProduct = async (req, res) =>{
    try {
      const existing = await product.find({name: req.body.product_name})
      const images = [];  
      for(key in req.files){
        const imPath = req.files[key].path
        const path = imPath.substring(imPath.lastIndexOf("\\")-8);
        images.push(path);
      }
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
          req.session.message = "Upload atleast 4 image files"         
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
        req.session.message = "Product already exists" 
        return res.redirect('/admin/products/add')
      }
  } catch (error) {
      console.log(error);
  }
  }


  
//Edit Product
const editProduct = async(req,res) =>{
    console.log('Hello');
    const id = req.params._id
    const Product = await product.findById(id).populate('category')
    // const images = [];
    // for(key in req.files){
    //   console.log(req.files[key].path);
    //   const imPath = req.files[key].path
    //   const path = imPath.substring(imPath.lastIndexOf("\\")-8);
    //   images.push(path);
    
    // }
    /////
    try {
      await product.findOneAndUpdate({_id:id}, {
        $set: {
          name:req.params.name,
          category:req.params.category,
          highlights:req.params.highlights,
          price:req.params.price,
          size:req.params.size,
          inventory:req.params.inventory,
          description:req.params.description,
        }})
        return res.json({
          redirect:"/admin/products"
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
    
        try{
        await product.findByIdAndRemove(id)     
        .then((product)=>{        
          if(product){          
            return res.status(200).json({redirect:"/admin/products"})
          }else{
            return res.status(404).json({redirect:"/admin/products"})
          }
        }).catch(err=>{
          return res.status(400).json({redirect:"/admin/products"})
        })
        
      } catch (error) {
        console.log(error)
      }    
    }


    //remove product
    const removeProduct = async(req,res)=>{
      const id = req.params._id
      const Product = await product.findById(id)
      try{
        if(Product.isActive==true){
          console.log('in true case')
          await product.findByIdAndUpdate({_id:id},{
            isActive:false
          }) 
         
        }else{
          console.log('in false case')
          await product.findByIdAndUpdate({_id:id},{
            isActive:true
          }  )
        }
        return res.status(200).json({redirect:"/admin/products"})
        
      }catch (error) {
        console.log(error)
      }  
    
    }


    module.exports = {addProduct,editProduct,deleteProduct,removeProduct}
    