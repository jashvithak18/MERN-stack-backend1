import {Schema,model} from 'mongoose'
//create product schema(productId,productName,price,brand)
const productSchema=new Schema({
    //structure of product resource
    productId:{
        type:Number,
        required:[true,"Product Id is required"]
    },
    productName:{
        type:String,
        required:[true,"Product name required"]
    },
    price:{
        type:Number,
        required:[true,"Price is required"],
        minLength:[10000,"Min  price should be 10000"],
        maxLength:[50000,"Max price should be 50000"]
    },
    brand:{
        type:String,
        required:[true,"Brand name required"]
    }
},{
    versionKey:false,
    timestamps:true
})
//generate product model
export const ProductModel=model("product",productSchema)
