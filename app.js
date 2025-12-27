const express = require('express')
require('dotenv').config()
const cors = require('cors')
const userRoutes = require('./routes/userRoutes.js')


const {testConnection} =require('./config.js/db.js')
testConnection();

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use('/api/user', userRoutes)

app.get('/', (req, res) => {
    console.log()
})

app.listen(port, ()=> {
    console.log(`Server is runnig on port ${port}`)
})