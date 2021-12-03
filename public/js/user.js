(function ($) {
    let myForm = $('#user_form');
    let firstname = $('#firstname');
    let lastname = $('#lastname');
    let email = $('#email');
    let edit = $('#edit');
    let finish = $('#finish');
    let favoriteRecipesName = $('.favoriteRecipesName');
    let favoriteRecipesNameDelete = $('.favoriteRecipesNameDelete');


    edit.on('click', function (event) {
        event.preventDefault();
        edit.hide();
        finish.show();
        favoriteRecipesNameDelete.show();
        firstname.removeAttr('disabled');
        lastname.removeAttr('disabled');
        email.removeAttr('disabled');
        // $.each(favoriteRecipesName, function (i, obj) {
        //     let id = '#'+obj.id;
        //     $(id).removeAttr('disabled');
        // });
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
        // $.each(favoriteRecipesName, function (i, obj) {
        //     let id = '#'+obj.id;
        //     favoriteRecipesNameArray[i]=obj.value;
        //     $(id).attr("disabled", 'disabled');
        // });
        let newFistname = firstname.val();
        let newLastname = lastname.val();
        let newEmail = email.val();
        $.post('/user/private', {
            firstname: newFistname,
            lastname: newLastname,
            email: newEmail,
            favoriteRecipesNameDeleteID: favoriteRecipesNameDeleteID
        }).then(res => {
            location.replace('/user/private')
        });
    })
})(window.jQuery);
