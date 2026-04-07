import mongoose from "mongoose";

export const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL) 
        console.log("Connected to MongoDB successfully");  

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with an error code
    }
}