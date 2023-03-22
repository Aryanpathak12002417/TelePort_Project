const jwt=require('jsonwebtoken')



const auth =(req,res,next)=>{
    const token= req.cookies.Token ||
    req.body.Token


    if(!token){
        return res.status(403).send('Please Login To Access The Features');
    }
    try{
        
        const decode=jwt.verify(token,'Hi_user_aryan')
        console.log(decode)

    }catch(error){
        return res.status(402).send('Invalid token is send')
    }
    next()
}

module.exports=auth