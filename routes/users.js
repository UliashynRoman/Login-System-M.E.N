const express = require('express');
const router = express.Router();

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
        res.send('pass');
    }

});

module.exports = router;