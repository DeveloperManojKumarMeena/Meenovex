const imagekit = require("imagekit");
const { v4: uuidv4 } = require('uuid');

const imagekitInstance = new imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        imagekitInstance.upload({
            file: file.buffer,
            fileName:uuidv4() ,
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