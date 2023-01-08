const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const morgon = require("morgan");
const { default: helmet } = require("helmet");

const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
// keys
dotenv.config();

 //middleware
 app.use(express.json());
 app.use(helmet());
 app.use(morgon("common"));


 // routes
 app.use("/api/user", userRoute);
 app.use("/api/auth", authRoute);
 app.use("/api/posts", postRoute);

 app.get("/",(req,res)=>{
  res.send("Hello")
 })
 
// port
app.listen(8800,()=>{
    console.log("Backend server is running");
})

// DB connection

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser : true, useUnifiedTopology : true},)
    .then(()=>{
      console.log("DATABASE CONNECTED");
    }).catch((err) =>{
      console.log({mesaage : err});
    })




 