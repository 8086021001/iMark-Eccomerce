const category = require('../model/categories')


const getCategory = async (req, res) => {
  try {
      const catData = await category.find({})
      console.log(catData)
      res.render('category', {category: catData})
  } catch (error) {
      return res.status(500).send(error)
  }
}

const getAddCategories = (req, res) => {
  const message = req.session.message
  req.session.message = null
  res.render('addCategory',{ssage:message})
}

//ADD categories
const addCategory = async (req, res) =>{
  try {
    console.log('Hi')
    console.log(req.body.name)
    const existing = await category.find({name: req.body.name})
    let images = []
    for(key in req.files){
      const imPath = req.files[key].path
      const path = imPath.substring(imPath.lastIndexOf("\\")-8);
      images.push(path);
    }
    console.log(existing)

    if(existing[0]==null){
      console.log("Hiiiiii")
      if(images.length==1){
        console.log(images)

        let Category = new category({
          name:req.body.name,
          images:images
        })
        console.log('in category')
        await Category.save();
        res.redirect('/admin/category')
      }else{
        console.log("Hiiiiii")
        req.session.message = "Invalid entry"
        res.redirect('/admin/addCategories')
      }

    }else{
      console.log('Hyyywyw')
      req.session.message = "Invalid entry"
      res.redirect('/admin/addCategories')

    }
  } catch (error) {
    console.log(error)
  }

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


  module.exports = {getCategory,getAddCategories,addCategory,deleteCategory}