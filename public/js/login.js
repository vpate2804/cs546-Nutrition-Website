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

let myForm = document.getElementById('login-form');
let username = document.getElementById('username');
let password = document.getElementById('password');
let errorDiv = document.getElementById('error');

if(myForm){
    myForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if(username.value.trim() || password.value.trim()){
            error.hidden = true;
            try {
                checkUsername(username.value);
                checkPassword(password.value);
                $.post('/login',{username: username.value,password:password.value}).then(res => {
                    //console.log(res);
                    if(res.code == 400){
                        alert(res.error);
                    }else{
                        location.replace('/user/private')
                    }
                    //location.replace('/private')
                });
            } catch (e) {
                errorDiv.hidden = false;
                errorDiv.innerHTML = e;
                
            }

        }else{
            username.value = '';
            password.value = '';
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter username and password!';
        }
        // $.post('/login',{username: username.value,password:password.value}).then(res => {
        //     location.replace('/private')
        // })
    });

}