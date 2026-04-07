export const authMidddleware = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    //why split(" ")[1] ? because the token is sent in the format "Bearer token" so we need to  
    // split the string and get the token part which is at index 1
    // if the token is not present then we are sending a response with status code 401 and message "Unauthorized"
    // if the token is present then we are verifying the token using jwt.verify() method 
    // and getting the user id from the token payload and setting it in req.body.user.id so that we can
    //  use it in the future to find the user profile and other operations that require user id
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.user.id = decoded.userId;
    next();
}