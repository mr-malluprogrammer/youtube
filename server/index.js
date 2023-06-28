// Calling Packages
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
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
.then(()=>{
    console.log("CONNECTED TO MONGO DB")
})
.catch(() => {
    console.log("Error Connecting Database!")
})

// Defining a Schema
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String
})

// Creating a model base on schema
const User = mongoose.model('login-info', userSchema)


app.post('/login', function (req, res) {

    User.findOne({"username": req.body.username, "password": req.body.password})
    .then((user) => {
        if(user){
            let message = "Welcome "+ user.name
            res.json({ "message": message })
        }
        else{
            res.json({ "message": "Sorry user need to register" })
        }
    })
    .catch(() => {
        res.json({"message":"Sorry error connecting the server"}) //error in mongodb
    })

})

app.listen(5000)