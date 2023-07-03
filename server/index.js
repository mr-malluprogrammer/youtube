// Calling Packages
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const app = express();

// Using Packages
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors())

var tempStore = { email: '', code: '' }

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
    username: String,
    email: String,
    firstName: String,
    lastName: String,
    password: String
})

// Creating a model base on schema
const User = mongoose.model('login-info', userSchema)


app.post('/login', async (req, res) => {
    let { username, password } = req.body
    password = jwt.sign(password, process.env.JWT_SECRET)
    User.findOne({ "username": username })
        .then((user) => {
            if (user) {
                if (user.password !== password) {
                    res.json({ "message": "Username or password does not match!", status: false })
                }
                else {
                    const jwtToken = jwt.sign(
                        { id: user._id, username: user.username },
                        process.env.JWT_SECRET, { expiresIn: "1h" }
                    )
                    let message = "Welcome " + user.firstName + ' ' + user.lastName
                    res.json({ "message": message, name: user.firstName + ' ' + user.lastName, token: jwtToken, status: true })

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


app.post('/usernameValidation', (req, res) => {
    const { username } = req.body
    User.findOne({ "username": username })
        .then((user) => {
            if (user) {
                res.send(false)
            }
            else {
                res.send(true)
            }
        })
        .catch(() => {
            res.json({ "message": "Sorry error connecting the server", status: false }) //error in mongodb
        })
})

app.post('/emailValidation', (req, res) => {
    const { email } = req.body
    User.findOne({ "email": email })
        .then((user) => {
            if (user) {
                console.log('Email exist')
                res.send({ "message": "Email already exist in database", status: false })
            }
            else {
                console.log('Email dont exist')
                res.send({ "message": "Email dont exist in our database.", status: true })
            }
        })
        .catch(() => {
            res.json({ "message": "Sorry error connecting the server", status: false })//error in mongodb
        })
}) 

app.listen(5000)