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

function isCheckEmail(email) {
    // Email according to RFC2822
    if (!email) throw "error email1";
    if (typeof email !== "string")
        throw "error email2";
    if (email.length === 0 || email.trim().length === 0)
        throw "error email3";
    const emailRegex = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
    );
    if (!emailRegex.test(email)) {
        throw "error email4";
    }
    // return { isValid: true };
};
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
            isCheckString(newFistname);
            isCheckString(newLastname);
            isCheckEmail(newEmail);
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
