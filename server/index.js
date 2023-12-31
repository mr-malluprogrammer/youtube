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

app.post('/sendEmail', (req, res) => {
    const { email, name } = req.body
    var val = Math.floor(1000 + Math.random() * 9000);
    if (tempStore.email === email) {
        tempStore.code = val

    }
    else {
        tempStore.email = email
        tempStore.code = val
    }

    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "mrmalluprogrammer@gmail.com",
            pass: process.env.EMAIL_PASS
        }
    });
    const mailConfigurations = {
        from: 'mrmalluprogrammer@gmail.com',
        to: email,
        subject: 'Mr. MalluProgrammer Pin Code : ' + val,
        html: `<html>
        <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Passion+One:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <style>
          
            body {
                background-color: antiquewhite;
                align-items: center;
                text-align: center;
                justify-content: center;
                display: grid;
                
            }
        
            .card {
                /* Add shadows to create the "card" effect */
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                transition: 0.3s;
                background-color: aliceblue;
            }
        
            footer {
                position: fixed;
                left: 0;
                bottom: 0;
                padding: 10px;
                width: 100%;
                background-color: rgb(0, 0, 0);
                color: white;
                text-align: center;
            }
        </style>
        
        <body style="font-family: cursive;">
        <center>
            <div class="card"
                style="display: grid; align-items: center; justify-content: center; width: 650px; height: 550px;">
                <h1>${name ? ('Hey ' + name) : ('Hello')}, Thanks for creating an account with us</h1>
                <p>Verify your account</p>
                <span style="font-size: 100px;">${val}</span>
                <p>This code is active for only 5 minutes</p>
            </div>
        
            </center>
        
        </body>
        <footer>Copyright © 2012 - 2023 Mr. Mallu Programmer®. All rights reserved.</footer>
        
        </html>`
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);
        res.send({ "message": "Email sent successfully!" });
        console.log(info);
    });

    setTimeout(function () { tempStore = { email: '', code: '' }; console.log("I ran 5 minutes check"); }, 300000);

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
                console.log(email)
                console.log('User exist')
                res.send({ "message": "Valid Email", status: false })
            }
            else {
                console.log(email)
                console.log('User dont exist')
                res.send({ "message": "Email already exist in our database.", status: true })
            }
        })
        .catch(() => {
            res.json({ "message": "Sorry error connecting the server", status: false }).status(400) //error in mongodb
        })
})

app.post('/signup', async (req, res) => {

    const { userData, pin } = req.body

    console.log(userData)
    console.log(pin)
    console.log(tempStore.code)

    try {
        if (pin === String(tempStore.code)) {
            console.log('Hii')
            let { firstName, lastName, username, email, password } = userData
            password = jwt.sign(password, process.env.JWT_SECRET)
            console.log(firstName)

            User.insertMany({ firstName, lastName, username, email, password }).then((val) => { console.log(val); res.json({ "message": "success" }) }).catch((err) => console.log(err))

        }

        else {
            res.json({ "message": "expired" })
        }

    }
    catch {
        res.json({ "message": "Sorry error connecting the server", status: false }) //error in mongodb
    }



})

app.post('/forgetPass', async (req, res) => {

    const { userData, pin } = req.body

    console.log(userData)
    console.log(pin)
    console.log(tempStore.code)

    try {
        if (pin === String(tempStore.code)) {
            console.log('Hii')
            let { email } = userData
            User.findOne({ "email": email })
                .then((user) => {
                    if (user) {
                        res.json({ "email": user.email, "firstName": user.firstName, "codeStatus": true })
                    }
                    else {
                        console.log(email)
                        console.log('User dont exist')
                        res.json({ "message": "User dont exist!", "codeStatus": true })
                    }
                })
                .catch(() => {
                    res.json({ "message": "Sorry error connecting the server", "codeStatus": false }) //error in mongodb
                })
        }

        else {
            res.json({ "message": "Code Exipired!", "codeStatus": false })
        }

    }
    catch {
        res.json({ "message": "Sorry error connecting the server", status: false }) //error in mongodb
    }



})
app.listen(5000)