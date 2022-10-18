const router = require('express').Router()
const Product = require('../models/Product')

const {verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken} = require('./verifyToken')

router.post('/', async (req, res)=>{
    try{
        const newProduct = new Product(req.body)
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err);
    }
})
//update product
router.put('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
        {new : true}
        );
        res.status(200).json(updatedProduct)
    }catch(err){
        res.status(200).json(err)
    }
})

//delete product by id

router.delete('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try{
        await Product.findByIdAndDelete(req.parsms.id);
        res.status(200).json('Deleted product successfully')
    }catch(err){
        res.status(500).json(err);
    }
})

router.get('', (req, res)=>{

})

//get product 

router.get('/find/:id', verifyToken, async (req, res)=>{
    try{
        const product =  await Product.findById(req.params.id);
        res.status(200).json(product)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all products

router.get('/all', async (req, res)=>{
    const newQuery = req.query.new;
    const qCategory = req.query.category;
    try{
        let products;
        if(newQuery){
            products = await Product.find().sort({createdAt:-1}).limit(5);
        }else if(qCategory){
            products = await Product.find({
                categories:{
                    $in:[qCategory]
                }
            });
        }else{
            products = await Product.find()
        }
        res.status(200).json(products)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router