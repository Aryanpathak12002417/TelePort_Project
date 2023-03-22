const express=require('express')
const router =express.Router();
const jwt=require('jsonwebtoken')
const auth=require('../Authentication/auth')
const db=require('../database');

/*
    1. Create post -- Give me the email
    2. Update Post  --Give me the post_id
    3. Delete Post  --Give me the post_id
    4. See all Post.  --Give me the email

*/


//Creating the Post
router.post('/createPost',auth,(req,res)=>{


    let token=req.cookies.Token || req.body.Token;
    const {title,content}=req.body;
    console.log(title," ",content)
    console.log(token);
    token=jwt.verify(token,'Hi_user_aryan')
    const user_email=token.id;

    //Nested db calls
    db.execute('SELECT user_id FROM users WHERE email=?',[user_email]).then((data)=>{
        let result=data[0];
        console.log(result[0].user_id);
        db.execute('INSERT INTO POSTS VALUES (0,?,?,?)',[title,content,result[0].user_id]).then((data)=>{
            console.log('The post was succcesfullty saved');
            res.status(200).json({testChange:"Tester post is created successfully"})
        }).catch((err)=>{
            console.log(err);
            res.status(403).json({testChange:"Not able to create a post for you"})
        })
    }).catch((err)=>{
        console.log('Error in the first db call')
        console.log(err)
        res.status(403).send('Not able to create successfully');
    })

})


//Updating Posts
router.post('/updatePost',auth,(req,res)=>{

    const{postId,title,content}=req.body;
    console.log(postId)
    db.execute('UPDATE posts SET title=?,content=? WHERE post_id=?',[title,content,postId]).then((data)=>{
        
        console.log('The post is updated Succesfully')
        res.status(200).send('The post was successfully updated')

    }).catch((err)=>{
        console.log(err);
        res.status(403).send('Your Post cannot be successfully updated')
    })
    
    


})


//Deleting Posts
router.post('/deletePost',auth,(req,res)=>{

    const {postId}=req.body;
    db.execute('DELETE FROM posts WHERE post_id=?',[postId]).then((data)=>{
        res.status(200).send('Your Post was successfully delete')
    }).catch((err)=>{
        console.log(err)
        res.status(403).send('Cannot Delete the post. Sorry for inconvences')
    })

})


//This will give a post id
router.get('/getPost',auth,(req,res)=>{
    const {postId}=req.body;
    db.execute('SELECT * FROM POSTS WHERE post_id=?',[postId]).then((data)=>{
        const result=data[0];
        res.status(200).json({data:result})
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).json({testChange:false});
    })
    
})

//Show All the posts
router.get('/showAllPosts',auth,(req,res)=>{

    let token=req.cookies.Token || req.body.Token;
    const {title,content}=req.body;
    console.log(title," ",content)
    console.log(token);
    token=jwt.verify(token,'Hi_user_aryan')
    const user_email=token.id;
    db.execute('SELECT user_id FROM users WHERE email=?',[user_email]).then((data)=>{
        let result=data[0];
        result=result[0];
        
        //Nested Db Calls
        db.execute('SELECT * FROM POSTS WHERE user_id=?',[result.user_id]).then((data)=>{
            let result=data[0];
            console.log(result)
            result=result
            res.status(200).json({result});
        }).catch((err)=>{
            console.log(err)
            res.status(403).send('Inner db message: Post not available')
        })
        
    })
    .catch((err)=>{
        console.log(err);
        res.status(403).send('Post not available write now');
    })

})


module.exports=router

