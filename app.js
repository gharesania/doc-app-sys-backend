const express = require('express')
require('dotenv').config()
const userRoutes = require('./routes/userRoutes.js')
const appointmentRoutes = require('./routes/appointmentRoutes.js')
const cors = require('cors')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

const {testConnection} =require('./config/db.js')
testConnection();


app.use(express.json())
app.use(cors())

app.use('/api/user', userRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/uploads/', express.static(path.join(__dirname + 'uploads')));

// app.use('/api/doctor', doctorRoutes);
// app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
    res.send("Hello World !!!")
})

app.listen(port, ()=> {
    console.log(`Server is runnig on port ${port}`)
})