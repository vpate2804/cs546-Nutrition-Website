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



let myForm = document.getElementById('signup-form');
let firstname = document.getElementById('firstname');
let lastname = document.getElementById('lastname');
let email = document.getElementById('email');
let username = document.getElementById('username');
let password = document.getElementById('password');

if(myForm){
    myForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if(username.value.trim() || password.value.trim() || firstname.value.trim() || lastname.value.trim() || email.value.trim()){
            error.hidden = true;
            try {
                checkUsername(username.value);
                checkPassword(password.value);
                checkVariable('First name', firstname.value, 'string');
                checkVariable('Last name', lastname.value, 'string');
                checkVariable('Email', email.value, 'string');


            } catch (e) {
                errorDiv.hidden = false;
                errorDiv.innerHTML = e;
                
            }

        }else{
            username.value = '';
            password.value = '';
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter each input!';
        }
        $.post('/signup',{firstname:firstname.value, lastname:lastname.value, email:email.value,username:username.value,password:password.value}).then(res => {
            location.replace('/login')
        });
    });

}