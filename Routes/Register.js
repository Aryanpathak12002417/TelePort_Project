const express=require('express')
const db=require('../database')
const router=express.Router()
const cookieParser = require('cookie-parser') 
const jwt=require('jsonwebtoken')
const auth=require('../Authentication/auth');


//MiddleWare
router.use(express.json());
router.use(express.urlencoded({extended:true}));
router.use(cookieParser());

//Authentication Function




//Routers
router.get('/testingRoutes',(req,res)=>{
    console.log('Test Successfull')
    res.send(`<h1>My name is aryan</h1>`)
})


//Login Route
router.post('/loginUser',async (req,res)=>{
    const {email,password}=req.body;
    console.log(email,password);
    db.execute('SELECT user_password from users where email=?',[email]).then((data)=>{
        const result=data[0];
        if(data[0].length<1){
            res.status(200).json({testChange:"Please Enter a Valid Email"})
        }
        else{
            console.log(result[0].user_password)
            if(result[0].user_password==password){
                const token= jwt.sign({id:email},'Hi_user_aryan');
                res.cookie('Token',token)
                res.status(200).json({testChange:"Welcome to codeSpace"})
            }
            else{
                res.status(200).json({testChange:"Please Enter the correct password"})
            }
        }
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).json({testChange:"Error in database"})
    })
})


//register route
router.post('/registerUser',(req,res)=>{

    const {firstName,lastName,userHandle,phoneNumber,email,country,gender,password}=req.body;
    db.execute('INSERT INTO users VALUES (0,?,?,?,?,?,?,?,?)',[firstName,lastName,userHandle,phoneNumber,email,password,country,gender]).then((data)=>{
        console.log(data)
        console.log('Working Here')
        const token= jwt.sign({id:email},'Hi_user_aryan');
        res.cookie('Token',token)
        res.status(200).json({testChange:"User Registered"})
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({testerChange:"Error in database"});
    })

})

//checking email for password update
router.get('/checkemail',(req,res)=>{
    const {email}=req.query
    db.execute('SELECT user_id FROM users WHERE email=?',[email]).then((data)=>{
        if(data[0].length>=1){
            res.status(200).json({testChange:"found"})
        }
        else{
            res.status(200).json({testChange:"not Found"})
        }
    }).catch((err)=>{
        res.status(400).json({testChange:"error in database"})
    })
})

//reset passwod

router.post('/resetPassword',(req,res)=>{

    const {email,password}=req.body;
    db.execute('UPDATE users SET user_password=? WHERE email=?',[password,email]).then((data)=>{
        console.log(data);
        res.status(200).json({testChange:"Your password was successfully updated"});
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({testChange:"error in database"});
    })
    
})

//update Details.
router.post('/updateDetails',auth,async (req,res)=>{

    //we will send details with it
    const token= req.cookies.Token || req.body.Token
    let user_id;
    try{
        const tokenDetails=await jwt.verify(token,'Hi_user_aryan')
        user_id=tokenDetails.id;
    }catch(err){
        console.log(err)
        return res.status(400).json({testerChange:"Please login before updating details"})
    }
    
    const {firstName,lastName,userHandle,phoneNumber,email,country,gender,password}=req.body;
    db.execute('UPDATE users SET first_name=?,last_name=?,user_handle=?,phone_number=?,email=?,user_password=?,country=?,gender=? where email=?',[firstName,lastName,userHandle,phoneNumber,email,password,country,gender,email]).then((data)=>{
        res.status(400).json({testerChange:'successfull'});
    }).catch((err)=>{
        console.log(err);
    })

})

//Show all the details 
router.get('/showDetails',auth,async (req,res)=>{

    let token=req.cookies.Token || req.body.Token;
    token =await jwt.verify(token,'Hi_user_aryan');
    const userEmail=token.id
    console.log(userEmail)
    db.execute('SELECT * FROM USERS WHERE email=?',[userEmail]).then((data)=>{
        const result=data[0]
        res.status(200).json({data:result});
    }).catch((err)=>{
        console.log(err);
        res.status(403).json({testChange:'Please Try again Later'})
    })


})














module.exports=router;
