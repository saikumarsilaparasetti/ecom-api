const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/auth')
const productsRoute = require('./routes/productRoute')
const cartRoute = require('./routes/cartRoute')
const orderRoute = require('./routes/orderRoute')


dotenv.config()

mongoose.connect('mongodb://localhost:27017/ecom-api');

mongoose.connection.on('connected', ()=>{
    console.log('Connected to database')
})

mongoose.connection.on('error', ()=>{
    console.log('Error connecting to database')
})

const app = express()

app.use(express.json())


app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/products', productsRoute)
app.use('/api/orders', orderRoute)
app.use('/api/cart', cartRoute)

app.get('/api/test', ()=>{
    console.log('Test success')
})




app.listen(3000, ()=>{
    console.log('App is runnig on port: ', 3000)
})