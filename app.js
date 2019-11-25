const express = require('express');
const expressLayouts = require('express-ejs-layouts');
//mongoose
const mongoose = require('mongoose');

//connect to our dataBase
const db = require('./config/keys').MongoURI;

//Connect to Mongo,this would return the promise, so then.
mongoose.connect(db,{useNewUrlParser:true})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


//do a basic express server
const app = express();
//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Bodyparser
app.use(express.urlencoded({extended: false}));


//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server started on port ${PORT}`));