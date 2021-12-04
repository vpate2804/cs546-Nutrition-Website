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
function isCheckString(string) {
    if (!string) throw "You must provide a value";
    if (typeof string !== 'string') throw "error string1";
    if (string.trim() === "") {
        throw "error string2";
    }
    if (string.length === 0) throw "empty value"
    string = string.replace(/\s*/g, "");
    for (let i = 0; i < string.length; i++) {
        if (!string[i].match(/[a-zA-Z]/)) {
            throw "error string3"
        }
    }
}
(function ($) {
    let myForm = $('#user_form');
    let firstname = $('#firstname');
    let lastname = $('#lastname');
    let email = $('#email');
    let edit = $('#edit');
    let finish = $('#finish');
    let favoriteRecipesName = $('.favoriteRecipesName');
    let favoriteRecipesNameDelete = $('.favoriteRecipesNameDelete');
    let addNewRecipe = $('#addNewRecipe');
    let errorDiv = $('#error');

    edit.on('click', function (event) {
        event.preventDefault();
        edit.hide();
        finish.show();
        favoriteRecipesNameDelete.show();
        firstname.removeAttr('disabled');
        lastname.removeAttr('disabled');
        email.removeAttr('disabled');
    })

    let favoriteRecipesNameDeleteID = [];
    favoriteRecipesNameDelete.on('click', function (event) {
        event.preventDefault();
        favoriteRecipesNameDeleteID.push($(this).attr("id"));
        $(this).attr("disabled", 'disabled');
    })

    finish.on('click', function (event) {
        event.preventDefault();
        edit.show();
        finish.hide();
        favoriteRecipesNameDelete.hide();
        firstname.attr("disabled", 'disabled');
        lastname.attr("disabled", 'disabled');
        email.attr("disabled", 'disabled');
        let newFistname;
        let newLastname;
        let newEmail;
        try {
            errorDiv.hide();
            newFistname = firstname.val();
            newLastname = lastname.val();
            newEmail = email.val();
            // console.log(1)
            // console.log(newFistname.length)
            isCheckString(newFistname);
            isCheckString(newLastname);
            if (newEmail) {
                checkVariable('Email', newEmail, 'string');
                if ((/^[ ]+$/g).test(newEmail.trim())) {
                    throw 'Email can not have white space';
                }

                if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g).test(userData.email.trim())) {
                    throw 'Email must be in proper format';
                }
                newEmail = newEmail.trim();
            }
            try {
                $.post('/user/private', {
                    firstname: newFistname,
                    lastname: newLastname,
                    email: newEmail,
                    favoriteRecipesNameDeleteID: favoriteRecipesNameDeleteID
                }).then(res => {
                    location.replace('/user/private')
                });
            } catch (e) {
                errorDiv.show();
                errorDiv.html(e.message);
            }
        } catch (e) {
            //location.replace('/user/private')
            errorDiv.show();
            errorDiv.html(e);
        }




    })

    addNewRecipe.on('click', function (event) {
        event.preventDefault();
        location.replace('/user/addNEWRecipe')
    })
})(window.jQuery);
