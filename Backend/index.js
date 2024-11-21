const express=require("express");
const app=express();
const{connection}=require("./Config/db");
require("dotenv").config();
const cors=require("cors")
const{router}=require("./Routers/user.router");
const cookieParser = require("cookie-parser");

app.use(cors({ origin: "https://trifit-bankingsystem-frontend.netlify.app", credentials: true, }))
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("welcome to Banking System")
});

app.use(cookieParser());
app.use('/user',router);

const Port=4567;
app.listen(Port,async()=>{
    try {
       await connection; 
       console.log("Successfully connected with MongoDB.")
    } catch (error) {
        console.log(error);
    
    }

    console.log(`app is running at port ${Port}...`)
})
