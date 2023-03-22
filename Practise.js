const express=require('express')
const app=express();
const jwt=require('jsonwebtoken')
var cookieParser = require('cookie-parser')

const db=require('../backenedChecking/database');

//testing the result

app.use(cookieParser())


//Successful connction creation
app.get('/',async( req,res)=>{
    if(!req.cookies.Token || req.cookies.Token==""){
      res.write('Please Login Or Register before statring')
      res.end();
    }
    const token =await jwt.sign({ foo: 'bar' }, 'shhhhh');
    console.log(token);
    res.cookie('Token',token).send('Your are Registred')

})


app.get('/register',async( req,res)=>{

  const token =await jwt.sign({ foo: 'bar' }, 'shhhhh');
  console.log(token);
  res.cookie('Token',token).send('Your are Registred')

})

app.get('/login',async( req,res)=>{

  const token =await jwt.sign({ foo: 'bar' }, 'shhhhh');
  console.log(token);
  res.cookie('Token',token).send('Your are logged in')

})



app.get('/signout',async( req,res)=>{

  res.cookie('Token',"").send('Your Have successFully logged out')

})


//Testing authentication from jwt


app.get('/auth',async (req,res)=>{
    console.log(req.cookies);
    if(!req.cookies.Token || req.cookies.Token==""){
      res.write('Please Login Or Register before statring')
      res.end();
    }
    try{
      
      var verifyUser=await jwt.verify(req.cookies.Token,'shhhhh')

      console.log(verifyUser);
      res.send('You are a user')
    }
    catch(err){
      res.send('You are not a user')
    }
})

app.listen(4000,(req,res)=>{
    console.log('Hi the server is up and running on port 4000')
})