const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//User model
const User = require('../models/User');

//Login Page
router.get('/login',(req,res) => res.render('login'));

//Register Page
router.get('/register',(req,res) => res.render('register'));


//When we submit registration form
router.post('/register',(req,res) =>{
    const {name,email,password,password2} = req.body;

    //Validation
    let errors = [];

    //Check required fileds
    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill in all fields'});
    }

    //Check passwords match
    if(password !== password2){
        errors.push({msg:'Passwords do not match'});
    }

    //Check lenght of pass
    if(password.length < 6){
        errors.push({msg:'Passwords should be at least 6 characters'});
    }

    //
    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //Validation passed
        User.findOne({ email:email })//return promise
        .then(user => {
            if(user){
                //user exist
                errors.push({msg: 'Email is already refistered'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                });

                console.log(newUser);

                //Hash Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;
                      //Set passwrod Hashed
                      newUser.password = hash;
                      //Save User
                      newUser
                        .save()//return promise
                        .then(user => {
                          req.flash(
                            'success_msg',
                            'You are now registered and can log in'
                          );
                          res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    })
                });
            } 
        });
    }

});

//Login Handle
router.post('/login' , (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

//Logout Handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});


module.exports = router;