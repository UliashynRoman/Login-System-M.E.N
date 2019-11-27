const express = require('express');
const expressLayouts = require('express-ejs-layouts');
//mongoose
const mongoose = require('mongoose');
//Flashing
const flash = require('connect-flash');
//Session
const session = require('express-session');
// Passport
const passport = require('passport');

//connect to our dataBase
const db = require('./config/keys').MongoURI;

//Connect to Mongo,this would return the promise, so then.
mongoose.connect(db,{useNewUrlParser:true})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


//do a basic express server
const app = express();

require('./config/passport')(passport);

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Bodyparser
app.use(express.urlencoded({extended: false}));

//Express  Session midleware 
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passpoer midleware
app.use(passport.initialize());
app.use(passport.session());


//Connect flash
app.use(flash());


//Global vars
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server started on port ${PORT}`));