const jwt =require("jsonwebtoken")
const redisClient = require('../db/redis');

const authSeller=async(req,res,next)=>{
    const token=req.cookies.token ;
    if(!token){
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
   const blacklistedToken=await redisClient.get('token')

        if (blacklistedToken) {
            return res.status(401).json({ error: 'Token is blocked. Please login & Try again.' });
        }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'seller') {
            return res.status(403).json({ error: 'Access denied. Not a seller profile.' });
        }
        req.seller = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
};


module.exports=authSeller;