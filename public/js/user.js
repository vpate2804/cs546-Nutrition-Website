function isCheckString(valueName, string) {
    if (!string) throw `You must provide a ${valueName}`;
    if (typeof string !== 'string') throw `${valueName}'s type must be string`;
    if (string.trim() === "") throw `${valueName} don't empty or spaces`;
    string = string.replace(/\s*/g, "");
    if (string.length < 3) throw `Input of ${valueName} must be at least 3 characters`;
    for (let i = 0; i < string.length; i++) {
        if (!string[i].match(/[a-zA-Z]/)) {
            throw `${valueName} just allow letters`
        }
    }
}

function isCheckEmail(email) {
    // Email according to RFC2822
    if (!email) throw "don't allow to input empty email";
    if (typeof email !== "string")
        throw "email's typy must be string";
    if (email.length === 0 || email.trim().length === 0)
        throw "don't allow to input empty email or spaces";
    const emailRegex = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
    );
    if (!emailRegex.test(email)) {
        throw "email format error";
    }
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
        let newFistname;
        let newLastname;
        let newEmail;
        try {
            newFistname = $('#firstname').val();
            newLastname = $('#lastname').val();
            newEmail = $('#email').val();
            isCheckString("first name",newFistname);
            isCheckString("last name",newLastname);
            isCheckEmail(newEmail);
        } catch (e) {
            errorDiv.show();
            errorDiv.html(e);
            return;
        }
        try {
            edit.show();
            finish.hide();
            favoriteRecipesNameDelete.hide();
            errorDiv.hide();
            firstname.attr("disabled", 'disabled');
            lastname.attr("disabled", 'disabled');
            email.attr("disabled", 'disabled');
            //try {
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
    })
    addNewRecipe.on('click', function (event) {
        event.preventDefault();
        location.replace('/user/addNEWRecipe')
    })
})(window.jQuery);