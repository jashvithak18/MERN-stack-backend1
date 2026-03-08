import {Schema,model} from 'mongoose'

//create user schema(username,password,email,age)
const userSchema=new Schema({
    //structure of user resource
    username:{
        type:String,
        required:[true,"Username is required"],
        minLength:[5,"Minimum length of username is 5 characters"],
        maxLength:[6,"Length of username cannot exceed 6 characters"]
    },
    password:{
        type:String,
        required:[true,"Password required"]
    },
    email:{
        type:String,
        required:[true,"email required"],
        //unique:[true,"email already exists"]-collection must be empty to use unique
    },
    age:{
        type:Number
    }
},{
    versionKey:false,
    timestamps:true
})
//generate user model
export const UserModel=model("user",userSchema)