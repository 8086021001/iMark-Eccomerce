

const userAuthenticated = (req,res,next)=>{
    try {
        if(req.session.userId){
            next()
        }else{
            res.redirect('/signin')
        }
    } catch (error) {
         res.send('404')
    }
}
const userLoggedOut = (req,res,next)=>{
    try {
        if(req.session.userId){
            next()
        }else{
            res.redirect('/signin')
        }
    } catch (error) {
        console.log(error)
    }
}
   




module.exports = {userAuthenticated}