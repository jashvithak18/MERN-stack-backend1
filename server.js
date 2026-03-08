//create express app
import exp from 'express'
import {connect} from 'mongoose'
import {userApp} from './APIs/UserApi.js'
import {productApp} from './APIs/ProductApi.js'
import cookieParser from "cookie-parser"
const app=exp()//instance of http server
//add body parser
app.use(exp.json())
//frwd req to UserApp if path starts with /user-api
//add cookie parser middleware
app.use(cookieParser())
app.use("/user-api",userApp)
app.use("/product-api",productApp)
//connect to db server
async function connectDB(){
    try{
    await connect("mongodb://localhost:27017/mydb2")
    console.log("DB connection success")
    //start server
app.listen(4000,()=>console.log("server on port 4000..."))
}catch(err){
    console.log("err in db connection:",err)
}
}
connectDB();

//error handling middleware
app.use((err,req,res,next)=>{
  
     //validation error
    if(err.name==='ValidationError'){
        return res.status(400).json({message:"error occured",error:err.message})
    }
    //cast error
    if(err.name==='CastError'){
        return res.status(400).json({message:"error occured",error:err.message})
    }
    //custom errors
    //send server side error
    res.status(500).json({message:"error occured",error:"Server side error"})
    
})