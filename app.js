//import the modules required
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv/config')

// routes
const authRoute = require('./routes/auth')
const interactionRoute = require('./routes/interactions')
const postRoute = require('./routes/posts')

// middleware
app.use(bodyParser.json())
app.use('/api/user',authRoute)
app.use('/api/posts', postRoute);
app.use('/api/interactions', interactionRoute);

// default route
app.get('/', (req,res) =>{
    res.send('Homepage')
})

// connect to MongoDB
mongoose.connect(process.env.DB_CONNECTOR).then(()=>{
    console.log('Your mongoDB connector is on...')
})

app.listen(3000, ()=>{
    console.log('Server is up and running...')
})