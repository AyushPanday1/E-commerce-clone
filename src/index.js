const express = require('express');

const mongoose = require('mongoose');

const route = require('./routes/route.js')
const multer = require('multer')

const app = express();
app.use(multer().any())
app.use(express.json())

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://AyushPanday:AyushPan123@cluster0.eixapeq.mongodb.net/?retryWrites=true&w=majority" , {useNewUrlParser:true})
.then(()=>console.log("Mongo db is connected."))
.catch((error)=>console.log(error))


app.use('/', route);

const port = 3000;

app.listen(port , () => console.log("Server running on port 3000"));