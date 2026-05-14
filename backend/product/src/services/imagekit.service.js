const imagekit = require("imagekit");

const imagekitInstance = new imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        imagekitInstance.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: "products"
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });}

    module.exports = {
        uploadImage
    };