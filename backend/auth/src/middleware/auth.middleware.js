const jwt = require('jsonwebtoken');
const redisClient = require('../db/redis');

//token base auth for protected routes
const authUser = async (req,res,next)=>{
    try {
        const token = req.cookies.token;
       

         if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No Token , No Entry"
            });
        }
         // CHECK TOKEN IN REDIS
        const isBlacklisted = await redisClient.get(token);

        // token blacklist me hai
        if (isBlacklisted) {

            return res.status(401).json({
                message: 'Token Expired so, Login Again'
            });
        }

        const decoded =  jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
              return res.status(401).json({
                message: "Unauthorized - Token Provided, Login First"
            });
        }

        req.user = decoded;

        next()

    } catch (error) {
        console.log('some error from auth middleware => '+error)
        res.status(500).json({ message: 'Authentication server fail' });
    }
}

module.exports={authUser}