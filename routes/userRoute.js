const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

const router = require('express').Router()
const cryptojs = require('crypto-js')
const User = require('../models/User')

//route to update
router.put('/:id', verifyTokenAndAuthorization , async (req, res)=>{
    if(req.body.password){
        req.body.password = cryptojs.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString()

    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:req.body
        },
        {
            new:true
        });
        res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err);
    }
})


router.delete('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User have been deleted!');

    }catch(err){
        res.status(500).json(err);
    }
})


router.get('/find/:id', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;

        res.status(200).json(others);

    }catch(err){
        res.status(500).json(err);
    }
})

router.get('/findall', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const users = await User.find();
        console.log(users)
        !users && res.status(500).json('No users found');

        const {password, ...others} = users
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err)
    }
})

router.get('/stats', verifyTokenAndAdmin, async (req, res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));

    try{
        const data = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: lastYear
                    }
                }
            },
            {
                $project:{
                    month:{ 
                        $month:'$createdAt'
                    },
                },
            },
            {
                $group:{
                    _id:'$month',
                    total: {$sum:1}
                },
            },
        ]);
        res.status(200).json(data)
    }catch(err){
        res.status(200).json(err)
    }
})

module.exports = router