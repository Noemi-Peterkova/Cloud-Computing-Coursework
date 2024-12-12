const { send } = require('express/lib/response')
const jsonwebtoken = require('jsonwebtoken') //import the jsonwebtoken library 


/** 
 * the function below checks if users have a valid token in their request
 * if a valid token is found, then verify it and attach it to the user "req" object.
 * otherwise deny access
 */
function auth(req,res,next){
    const token = req.header('auth-token')
    if(!token){
        return res.status(401).send({message:'Access denied'}) // if no token, give 401 error
    }
    try{
        const verified = jsonwebtoken.verify(token,process.env.TOKEN_SECRET)
        req.user=verified //verify token 
        next()
    }catch(err){
        return res.status(401).send({message:'Invalid token'}) // if token verification fails, send a 401 error
    }
}

module.exports=auth // export the auth function 