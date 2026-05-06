const {Redis}=require('ioredis');

const redisClient=new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

redisClient.on('connect', () => {
    console.log('✅ Connected to Redis successfully');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports=redisClient;