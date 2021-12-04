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

        let newFistname = firstname.val();
        let newLastname = lastname.val();
        let newEmail = email.val();

        try {
            if (newFistname) {
                checkVariable('First name', newFistname, 'string');
                newFistname = newFistname.trim();
            }

            if (newLastname) {
                checkVariable('Last name', newLastname, 'string');
                newLastname = newLastname.trim();
            }

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

        } catch (e) {
            errorDiv.hidden = false;
            errorDiv.innerHTML = e;
        }
        $.post('/user/private', {
            firstname: newFistname,
            lastname: newLastname,
            email: newEmail,
            favoriteRecipesNameDeleteID: favoriteRecipesNameDeleteID
        }).then(res => {
            location.replace('/user/private')
        });
    })

    addNewRecipe.on('click', function (event) {
        event.preventDefault();
        location.replace('/user/addNEWRecipe')
    })
})(window.jQuery);
