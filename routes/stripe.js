const router = require('express').Router()

const stripe = require('stripe')(process.env.STRIPE_KEY)


router.post('/payment', (req, res)=>{
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency:'usd'
    }, (err, response)=>{
        if(err){
            res.status(500).json(err)

        }else{
            res.status(200).json(response)
        }
    })
})

module.exports = router

