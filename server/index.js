// Calling Packages
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const app = express();

// Using Packages
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors())

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/user', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Define a schema for your data
const itemSchema = new mongoose.Schema({
    name: String,
    password: String,
});

// Create a model based on the schema
const User = mongoose.model('user-collection', itemSchema);



app.post('/login', function (req, res) {
    console.log(req.body)
    if (req.body.name === "mrmalluprogrammer") {
       
        User.findOne({"name": req.body.name})
            .then((item) => {
                if (item) {
                    console.log('GOT RESULT FROM MONGO DB - ',item.name)
                } else {
                    console.log({ error: 'Item not found' });
                }
            })
            .catch((error) => {
                console.log({ error: 'Error retrieving item' });
            });
        return res.json({ "message": "Backend connected successfully" })
    }
    else {
        return res.json({ "message": "Sorry user need to register" })
    }
})





app.listen(5000)