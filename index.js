import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import studentRouter from "./routers/studentRouter.js"
import userRouter from "./routers/userRouter.js"
import jwt from "jsonwebtoken"

const app = express();


app.use(bodyParser.json())

app.use(
    (res,req,next )=>{
        const value=req.header("Authorization")
        if(value !=null){
            const token=value.replace("Bearer ","")
            jwt.verify
                (token,
                "cbc-6503",
                (err,decoded)=>{
                    if(decoded==null){
                        res.statusCode(403).json({
                            message:"unauthorized"
                        })
                    }else{
                        req.user=decoded
                        next()
                    }

                }
            )
        

        }else {
        next()


        
        }
    }
)







const connectionString = "mongodb+srv://waruni:1234@cluster0.tlnouk6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

//.then use to if database correctly connected then give console log output
mongoose.connect(connectionString).then(
()=>{
    console.log("database connected")
}) 
.catch(
    ()=>{

        console.log("Failed to connect database")
    }
)

//connect router to main code / we can use any any name behalf of "students" its not matter
app.use("/students",studentRouter)
app.use("/user", userRouter)

//5000 is port number(we can use 3000  5000 8080 they are not recevied port numbers /started 0-65000)
app.listen(5000,  ()=>{

    console.log("Server started....")
})



