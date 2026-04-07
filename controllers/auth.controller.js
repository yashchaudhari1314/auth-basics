import { User } from "../models/User.model.js";
import { generateToken } from "../utils/token.utils.js";



export const register=async(req,res)=>{
    const {name,email,password}=req.body;

    try {
        const checkUser=await User.findOne({email});
        if(checkUser){
            return res.status(400).json({message:"User already exists"})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=new User({
            name:name,
            email:email,
            password:hashedPassword
        })
        await user.save();
        res.status(201).json({message:"User registered successfully"})

    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body;
    try {
        if(!email || !password){
            return res.status(400).json({message:"Email and password are required"})
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"})
        }
        const token=generateToken({
            userId:user._id,
            //why _id ? because in mongoose we have _id field which is the unique identifier 
            // for each document in the collection and we can use it to identify the user and we 
            // can use it to generate the token and we can use it to find the user profile in the future
            // when we decode the token, moreover we are also adding email in the token payload because we can
            // use it to display the user email in the client side without having to query the database again to get 
            //the user email, so it is a good practice to add some basic information about the user in the token payload 
            //so that we can use it in the client side without having to query the database again
            email:user.email
        })
        res.status(200).json({message:"Login successful",token})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

export const findProfile=async(req,res)=>{
    
    try {
        const user=await User.findById(req.body.user.id).select("-password");
        // how can we get the user id in req.body.user.id ? we can get it from the token that we
        //  generated in login function and we can decode the token to get the user id and we can set it
        //  in req.body.user.id in auth middleware and we can use it in this function to find the user profile, 
        // moreover we are using select("-password") to exclude the password field from the response
        //  because we dont want to send the password to the client

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({message:"Profile found",user})


    } catch (error) {
        res.status(500).json({message:"Internal server error"}) 
    }
}