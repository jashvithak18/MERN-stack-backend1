//create min-express app(seperate route)
import exp from 'express'
import {hash,compare} from 'bcryptjs'
import {UserModel} from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import {verifyToken} from '../middlewares/verifyToken.js'
const {sign}=jwt
export const userApp=exp.Router()//creates special route not instance of http 
//define user rest api routes

//user login
userApp.post('/auth',async(req,res)=>{
    //get user cred obj from client
    const {email,password}=req.body;
    //verify email
    const user=await UserModel.findOne({email:email})
    //if email not existed
    if(!user){
        return res.status(404).json({message:"Invaild email"})
    }
    //compare passwords
    let result=await compare(password,user.password)
    //if passwords not matched
    if(!result){
        return res.status(400).json({message:"Invalid password"})
    }
    //if passwords are matched
    //create token (jsonwebtoken-jwt-jaat)
   const signedToken= sign({email:user.email},"abcdef",{expiresIn:"1h"})//"10"-ms,10-sec,"10d"-10 days,"10w"-10 weeks
    //store token as httpOnly cookie
    res.cookie("token",signedToken,{
    httpOnly:true, //**prevent cross side scripting  
    sameSite:"lax",//lax->realxed restriction,strict->no communcation btwn application,none->tokens accessible by everyone
    secure:false
})
//send res
res.status(200).json({message:"Login success",payload:user})
})
//create new user
userApp.post("/users",async(req,res)=>{
    //get new user obj from req
    const newUser=req.body
    //hash the password
  const hashedPassword=await hash(newUser.password,10)
  //replace plain password with hashed password
  newUser.password=hashedPassword
    //create new user document
const newUserDocument=new UserModel(newUser)
//save
const result=await newUserDocument.save()
console.log("result:",result)
//send res
res.status(201).json({message:"User created"})
})
//read all users(protected route)
userApp.get("/users",verifyToken,async(req,res)=>{
    //read all users from db
   let usersList=await UserModel.find()
    //send res
    res.status(200).json({message:"users",payload:usersList})
})

//read a user by object id
userApp.get("/users/:id",verifyToken,async(req,res)=>{
    //read obj id from req params
    const uid=req.params.id
    //find user by id
    const userObj=await UserModel.findById(uid)
    if(!userObj){
        res.status(404).json({message:"User not found"})
    }
    //send res
    res.status(200).json({message:"users",payload:userObj})

})
//use findOne method to read a document with non object id fields
//use findBy Id to read document with object id

//update user by id
userApp.put("/users/:id",verifyToken,async(req,res)=>{
    //get modified user from req
    const modifiedUser=req.body
    const uid=req.params.id
    //find user by id
  const updatedUser= await UserModel.findByIdAndUpdate(uid,{$set:{...modifiedUser}},{new:true,runValidators:true})
  //send res
res.status(200).json({message:"user modified",payload:updatedUser})
})

//delete userby id
userApp.delete("/users/:id",async(req,res)=>{
    const uid=req.params.id
    const deletedUser=await UserModel.findByIdAndDelete(uid)
    if(!deletedUser){
        return res.status(404).json({message:"User not found"})
    }
    res.status(200).json({message:"deleted",payload:deletedUser})
})

//handling unavailable resources
//validators during update
//hashing password(bcryptjs)
//unique files
//refined version of error handling middleware

//app.use(verifyToken->every req)
//userApp.get(path,verifyToken(middleware),req-handler)