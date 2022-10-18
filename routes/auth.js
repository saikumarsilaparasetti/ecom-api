
const router = require('express').Router()
const User = require('../models/User')
const cryptojs = require('crypto-js')
const jwt = require('jsonwebtoken')




router.post('/register', async (req, res)=>{
    const newUser = new User({
        userName:req.body.userName,
        email: req.body.email,
        password: cryptojs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    });
    try{
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
        // console.log(savedUser)
    }catch(err){    
        res.status(500).json(err)
    }


})


router.post('/login', async (req, res)=>{
    
    try{
        const user = await User.findOne({
            userName:req.body.userName
        })
        
        !user && res.status(401).json('wrong credentials');
        const hashPassword = cryptojs.AES.decrypt(user.password, process.env.PASS_SEC);
        // console.log('Called login', hashPassword)
        const pwd = hashPassword.toString(cryptojs.enc.Utf8);
        console.log(pwd)
        pwd !== req.body.password && res.status(401).json('Wrong credentials');
        const {password, ...others} = user._doc;

        const accessToken = jwt.sign({
            id:user._id,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SEC,
        {
            expiresIn:"3d"
        }
        )
        res.status(200).json({...others, accessToken})
    }catch(err){
        // res.status(500).json(err)
    }
})


module.exports = router