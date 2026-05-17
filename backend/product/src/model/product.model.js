const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        amount:{
            type:Number,
            required:true   },
        currency:{
            type:String,
            required:true,
            enum:["USD","INR"]
        }
    },
    category:{
        type:String,
        required:true
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    images:{
        url:{
            type:String,
            required:true
        },
        thumbnailUrl:{
            type:String,
            required:true
        }
    }
    
}, { timestamps: true })

productSchema.index({ title: 'text', description: 'text' });

const ProductModel = mongoose.model("Product",productSchema);

module.exports = ProductModel;