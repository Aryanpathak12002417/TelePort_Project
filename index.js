
//                   These are main modules of our application

const express=require('express')    //express
const app=express();
const jwt=require('jsonwebtoken')   //jsonwebtokens for authentication
const cookieParser = require('cookie-parser')  //Cookie parser for transfer and manipulation of cookies
const db=require('../backenedChecking/database');   //Establishing connextion from the database

const register=require('./Routes/Register')//Register Routes
const post=require('./Routes/post')//Post Routes


//Setting up middlewares

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


//Routers
app.use(register)
app.use(post)



app.listen(4000,(req,res)=>{
    console.log('Hi the server is up and running on port 4000')
})