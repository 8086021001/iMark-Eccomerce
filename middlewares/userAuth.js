

const userAuthenticated = (req,res,next)=>{
    try {
        let session = req.session;
        if(req.session.userId){
            next()
        }else{
            res.redirect('/signin')
        }
    } catch (error) {
         res.send('404')
    }
   
}

const adminAuthenticated = (req,res,next)=>{
    try {
        let session =req.session
        if(req.session.adminId){
            next()
        }else{
            res.redirect('/')
        }
        
    } catch (error) {
        
    }
}

module.exports = {userAuthenticated,adminAuthenticated}