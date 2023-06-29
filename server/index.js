// Calling Packages
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = express();

// Using Packages
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors())

// Connect to mongoDB 0.0.0.0
mongoose.connect('mongodb://127.0.0.1:27017/youtube', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("CONNECTED TO MONGO DB")
    })
    .catch(() => {
        console.log("Error Connecting Database!")
    })

// Defining a Schema
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    _id: String
})

// Creating a model base on schema
const User = mongoose.model('login-info', userSchema)


app.post('/login', async (req, res) => {
    const { username, password } = req.body
    User.findOne({ "username": username })
        .then((user) => {
            if (user) {
                if (user.password !== password) {
                    res.json({ "message": "Username or password does not match!", status: false })
                }
                else {
                    const jwtToken = jwt.sign(
                        { id: user._id, username: user.username },
                        "secretkeyappershere", { expiresIn: "1h" }
                    )
                    let message = "Welcome " + user.name
                    res.json({ "message": message, name:user.name, token: jwtToken, status: true })

                }

            }
            else {
                res.json({ "message": "Username or password does not match!", status: false })
            }
        })
        .catch(() => {
            res.json({ "message": "Sorry error connecting the server", status: false }) //error in mongodb
        })

})

app.listen(5000)