const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const {getToken} = require("../utils/helpers")

router.post('/register',async (req,res)=>{
    //req.body {email,password,firstname,lastame,username}
    const {email, firstName, lastName, username} = req.body;
    var  {password}  = req.body;
    const user = await User.findOne({email:email})
    if(user){ //if user exist throw error 
        return res
                .status(403)
                .json({error:"A user with this email already exists"})
    }
    password = await bcrypt.hash(password,10)
                            .then(hash => {
                                password = hash
                                return password
                            }
                                )
                            .catch(err => console.log(err));  
    const newUserData = {
        email,
        password, 
        firstName, 
        lastName, 
        user
    };
    const newUser = await User.create(newUserData); //create new user in db and we do not store password in plain text. we convert it into hash
    //create token
    const token = await getToken(email,newUser);
    const userToReturn = {...newUser.toJSON(),token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn)
})

router.post('/login',async (req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email:email});

    if(!user){
        return res.status.apply(403).json({err:"Invalid credentials"})
    }
    //it compares both passwords hash valu which we will get from out db
    const isPasswordValid = bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(403).json({err:'Invalid credentials'});
    }
    
    const token = await getToken(user.email,user);
    const userToReturn = {...user.toJSON(),token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn)

})

module.exports = router;