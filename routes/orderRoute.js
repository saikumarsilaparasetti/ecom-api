const router = require('express').Router()
const Order = require('../models/Order')

const {verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken} = require('./verifyToken')

//create new order
router.post('/', verifyToken, async (req, res)=>{
    try{
        const newOrder = new Order(req.body)
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder);
    }catch(err){
        res.status(500).json(err);
    }
})
//update order
router.put('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
        {new : true}
        );
        res.status(200).json(updatedOrder)
    }catch(err){
        res.status(200).json(err)
    }
})

//delete Order by id

router.delete('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try{
        await Order.findByIdAndDelete(req.parsms.id);
        res.status(200).json('Deleted Order successfully')
    }catch(err){
        res.status(500).json(err);
    }
})


//get Order 

router.get('/find/:id', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const orders =  await Order.findOne({userId:req.params.id});
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all Orders
router.get('/', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const orders = Order.find();
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err)
    }
})


//get monthrly income

router.get('/income', verifyTokenAndAdmin,  async (req, res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));
    try{
        const income = await Order.aggregate([
            {$match:{createdAt:{$gte:previousMonth}}},
            {
                $project:{
                    month:{$month:'$createdAt'},
                    sales:'$amount'
                }
            },{
                    $group:{
                        _id:'$month',
                        total:{
                            $sum: '$sales'
                        }
                    }
            }
 
        ])
        res.status(200).json(income)
    }catch(err){
        res.status(200).json(err)
    }
})
module.exports = router