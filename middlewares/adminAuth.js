const adminAuthenticated = (req,res,next)=>{
    try {
        if(req.session.adminId){
            next()
        }else{
            res.render('admin-signin')
        }
        
    } catch (error) {
        res.send('404')
    }
}

const adminLogedout = (req,res,next)=>{
    try {
        if(!req.session.adminId){
            res.render('admin-signin')
        }else{
            console.log("want to go back to home")
            res.redirect('/admin/admin-home')
        }
    } catch (error) {
        
    }
}

module.exports = {adminAuthenticated,adminLogedout}