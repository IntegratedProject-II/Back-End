const express = require('express')
const cors = require('cors')
const verifyToken = require('./middlewares/auth')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

let port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})


app.use('/api/krathong', require("./router/krathong"))
app.use('/api/person', require("./router/person"))
app.use('/api/place', require("./router/place"))
app.use('/api/history', require("./router/history"))
app.use('/api/country', require("./router/country"))
app.use('/api/krathongType', require("./router/krathongType"))
app.use('/api/placeType', require("./router/placeType"))
app.use('/api/image', require("./router/image"))
app.use('/api/token',verifyToken, require("./router/token"))
// app.use('/api/token', require("./router/token"))
