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
    // in summary,
    //1.we are checking if the user already exists in the database using the email provided in the request body
    //2.if the user already exists then we are sending a response with status code 400 and message "User already exists"
    //3.if the user does not exist then we are hashing the password using bcrypt.hash() method and saving the user in the database
    //4.if the user is saved successfully then we are sending a response with status code 201 and message "User registered successfully"
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

    // in summary,
    //1.we are checking if the email and password are provided in the request body
    //2.we are finding the user in the database using the email provided in the request body
    //3.if the user is not found then we are sending a response with status code 400 and message "Invalid email or password"
    //4.if the user is found then we are comparing the password provided in the request body with the hashed password stored in the database using bcrypt.compare() method
    //5.if the password is not matched then we are sending a response with status code 400 and message "Invalid email or password"
    //6.if the password is matched then we are generating a token using the generateToken() function and sending a response with status code 200 and message "Login successful" along with the token

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
    // in summary,
    //1.we are finding the user in the database using the user id that we got from the token and set it in req.body.user.id in auth middleware
    //2.if the user is not found then we are sending a response with status code 404 and message "User not found"
    //3.if the user is found then we are sending a response with status code 200 and message "Profile found" along with the user data excluding the password field
}


//in summary,
//1.we have defined three functions register, login and findProfile in auth.controller.js file
//2.register function is used to register a new user in the database, it checks if the user already exists, if not then it hashes the password and saves the user in the database
//3.login function is used to login a user, it checks if the email and password are provided, then it finds the user in the database, if the user is found then it compares the password with the hashed password stored in the database, if the password is matched then it generates a token and sends it in the response
//4.findProfile function is used to find the user profile, it uses the user id that we got from the token and set it in req.body.user.id in auth middleware to find the user in the database and sends the user data excluding the password field in the response



//import points to note because its first auth project
//1.we are importing the User model from the models folder to interact with the user collection in the database
//2.we are importing the generateToken function from the utils folder to generate a token for the user when they login successfully



//step wise flow of authentication process in this codebase
//1.when the user sends a POST request to /api/auth/register endpoint with name, email and password in the request body, the register function is called
//2.in the register function, we are checking if the user already exists in the database using the email provided in the request body, if the user already exists then we are sending a response with status code 400 and message "User already exists"
//3.if the user does not exist then we are hashing the password using bcrypt.hash() method and saving the user in the database, if the user is saved successfully then we are sending a response with status code 201 and message "User registered successfully"
//4.when the user sends a POST request to /api/auth/login endpoint with email and password in the request body, the login function is called
//5.in the login function, we are checking if the email and password are provided in the request body, if not then we are sending a response with status code 400 and message "Email and password are required"
//6.we are finding the user in the database using the email provided in the request body, if the user is not found then we are sending a response with status code 400 and message "Invalid email or password"
//7.if the user is found then we are comparing the password provided in the request body with the hashed password stored in the database using bcrypt.compare() method, if
// the password is not matched then we are sending a response with status code 400 and message "Invalid email or password"
//8.if the password is matched then we are generating a token using the generateToken() function and sending a response with status code 200 and message "Login successful" along with the token
//9.when the user sends a GET request to /api/auth/profile endpoint with the token in the Authorization header, the findProfile function is called
//10.in the findProfile function, we are finding the user in the database using the user id that we got from the token and set it in req.body.user.id in auth middleware, if the user is not found then we are sending a response with status code 404 and message "User not found"
//11.if the user is found then we are sending a response with status code 200 and message "Profile found" along with the user data excluding the password field



// step wise flow of token generation and verification process in this codebase
//1.when the user logs in successfully, we are generating a token using the generateToken() function and sending it in the response
//2.the generateToken() function takes a payload as an argument and uses jwt.sign() method to generate a token, the payload contains the user id and email, we are also setting an expiration time of 2 hours for the token using the expiresIn option  
//3.when the user sends a request to a protected route (like /api/auth/profile) with the token in the Authorization header, the auth middleware is called
//4.in the auth middleware, we are extracting the token from the Authorization header, if the token is not present then we are sending a response with status code 401 and message "Unauthorized"
//5.if the token is present then we are verifying the token using jwt.verify() method and getting the user id from the token payload and setting it in req.body.user.id so that we can use it in the future to find the user profile and other operations that require user id


// step wise guide to create a new authentication project using this codebase as a reference
//1.create a new folder for your project and navigate to it in the terminal
//2.run npm init -y to initialize a new Node.js project init create a new file named server.js and copy the code from the server.js file in this codebase
//3.create a new folder named config and inside it create a new file named db.js and copy the code from the db.js file in this codebase
//4.create a new folder named models and inside it create a new file named User.model.js and copy the code from the User.model.js file in this codebase 
//5.create a new folder named routes and inside it create a new file named auth.routes.js and copy the code from the auth.routes.js file in this codebase
//6.create a new folder named controllers and inside it create a new file named auth.controller.js and copy the code from the auth.controller.js file in this codebase
//7.create a new folder named middleware and inside it create a new file named auth.middleware.js and copy the code from the auth.middleware.js file in this codebase   
//8.create a new folder named utils and inside it create a new file named token.utils.js and copy the code from the token.utils.js file in this codebase
//9.install the required dependencies using npm install express mongoose bcrypt jsonwebtoken dotenv
//10.create a .env file in the root of your project and add the following environment variables
// MONGO_URI=your_mongodb_connection_string
// JWT_SECRET=your_jwt_secret   
//11.start the server using node server.js and you should see the message "Server is Listening..." in the terminal
//12.you can now test the API endpoints using a tool like Postman or Insomnia, you can register a new user, login with the registered user and get the user profile using the token received in the login response
//13.you can also add more features to the authentication system like password reset, email verification, role-based access control etc. by following the same structure and flow as in this codebase