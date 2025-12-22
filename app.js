const express = require('express')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    console.log()
})

app.listen(port, ()=> {
    console.log(`Server is runnig on port ${port}`)
})