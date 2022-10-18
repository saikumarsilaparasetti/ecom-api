const router = require('express').Router()
const Cart = require('../models/Cart')

const {verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken} = require('./verifyToken')

//create new cart
router.post('/', verifyToken, async (req, res)=>{
    try{
        const newCart = new Cart(req.body)
        const savedCart = await newCart.save()
        res.status(200).json(savedCart);
    }catch(err){
        res.status(500).json(err);
    }
})
//update cart
router.put('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
        {new : true}
        );
        res.status(200).json(updatedCart)
    }catch(err){
        res.status(200).json(err)
    }
})

//delete cart by id

router.delete('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try{
        await Cart.findByIdAndDelete(req.parsms.id);
        res.status(200).json('Deleted cart successfully')
    }catch(err){
        res.status(500).json(err);
    }
})


//get cart 

router.get('/find/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const cart =  await Cart.findOne({userId:req.params.id});
        res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all carts
router.get('/', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const carts = Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router