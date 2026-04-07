import dotenv from "dotenv"
import express from "express"
dotenv.config()

import authRoutes from "./routes/auth.routes.js"
import {connectDB} from "./config/db.js"

connectDB();

const app= express();
app.use(express.json())// if you dont use this then you will not be able to access the req.body in your 


app.use("/api/auth",authRoutes)
app.listen(process.env.PORT||3000,()=>{
    console.log("Server is Listening...")
})