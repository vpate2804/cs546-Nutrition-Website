const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const xss = require('xss');

function checkVariable(variableName, value, variableType) {
    if (value == null) {
        throw `You must provide ${variableName}`;
    }
    if (typeof (value) != variableType) {
        throw `${variableName} needs to be ${variableType}, can not be ${value}`;
    }
    if (variableType == 'string') {
        if (value.trim() == '') {
            throw `${variableName} can not be empty string`;
        }

    }
}

function checkemail(email){
    if ((/^[ ]+$/g).test(email.trim())) {
        throw 'Email can not have white space';
    }
    if ((/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g).test(email.trim())) {
        throw 'Email must be in proper format';
    }
}

function checkUsername(username){
    if(!username)throw 'Must provide a username';
    if(typeof username != 'string')throw 'username must be string';
    if(username.trim() == '')throw 'username cannot be empty or just space';
    if(username.length < 4)throw 'username should be at least 4 characters long';
    let reg = /^[0-9a-zA-Z]*$/; 
    if(!reg.test(username))throw 'username only have alphanumeric characters';

}

function checkPassword(password){
    if(!password)throw 'Must provide a password';
    if(typeof password != 'string')throw 'password must be string';
    if(password.trim() == '')throw 'password cannot be empty or just space';
    if(password.length < 6)throw 'password should be at least 6 characters long';
    let reg = /\s/;
    if(reg.test(password))throw 'no empty space should in the password';
}

router.get('/', async(req,res) => {
    if(req.session.user){
        return res.redirect('http://localhost:3000/user/private');
    }else{
        let title = "Login";
        //console.log(1);
        res.render('description',{title:title});
        //console.log(2);
    }
});



router.get('/signup', async(req,res) => {
    if(req.session.user){
        return res.redirect('http://localhost:3000/user/private');
    }else{
        let title = "Signup";
        res.render('signup',{title:title});
        return;
    }
});

router.post('/signup', async(req,res) => {
    try {
        checkVariable('First name', xss(req.body.firstname), 'string');
        checkVariable('Last name', xss(req.body.lastname), 'string');
        checkVariable('Email', xss(req.body.email), 'string');
        //checkemail(req.body.email);
        checkUsername(xss(req.body.username));
        checkPassword(xss(req.body.password));
        let result = await userData.createUser(xss(req.body.firstname),xss(req.body.lastname),xss(req.body.email),xss(req.body.username),xss(req.body.password));
        if(result.userInserted){
            res.status(200).send();
        }else{
            res.status(500);
            let error = "Internal Server Error";
            res.render('signup',{error:error})
        }
    } catch (e) {
        res.status(200).send({code:400,error:e});
        console.log(e)
    }
})

router.get('/login', async(req,res) =>{
    if(req.session.user){
        return res.redirect('http://localhost:3000/user/private');
    }else{
        let title = "Login";
        res.render('login',{title:title});
        return;
    }
})


router.post('/login', async(req,res) => {
    try {
        checkUsername(xss(req.body.username));
        checkPassword(xss(req.body.password));
        let result = await userData.checkUser(xss(req.body.username),xss(req.body.password));
        if(result.authenticated){
            req.session.user = xss(req.body.username.toLowerCase());
            res.status(200).send();
        }
    } catch (e) {
        res.status(200).send({code:400,error:'invalid password or username'});
    }
});


router.get('/logout', async(req,res) => {
    const anHourAgo = new Date();
    anHourAgo.setHours(anHourAgo.getHours() - 1);
    res.cookie('AuthCookie', '', { expires: anHourAgo });
    res.clearCookie('AuthCookie');
    return res.redirect('/');
})


module.exports = router;