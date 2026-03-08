import jwt from 'jsonwebtoken'
const {verify}=jwt
export function verifyToken(req,res,next){
    //token verification logic
  const token= req.cookies?.token
  console.log(token)
  //if req from unauthroized user
  if(!token){
    return res.status(401).json({message:"Please login"})
  }
  try{
  //if token exists
const decodedToken=verify(token,'abcdef')
console.log(decodedToken)
//call next
next()
  }catch(err){
    res.status(401).json({message:"Session expired.Please re-login"})
  }
}