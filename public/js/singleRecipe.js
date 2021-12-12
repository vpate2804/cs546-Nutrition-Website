(function ($) {
    const likebtn = $('#likebtn');
    likebtn.on('click', function (event) {
        event.preventDefault();
        var recipeId = likebtn.data('rid');
        var like = likebtn.data('like');
        var requestConfig = {
            method: "POST",
            url: '/all/like/' + recipeId,
            contentType: 'application/json'
        };
        $.ajax(requestConfig).then(function (response) {
            if(!response.errors){
                if (response.like) {
                    $('#likes').text(parseInt($('#likes').text())-1);
                    likebtn.html('false');
                    likebtn.removeClass('like');
                    likebtn.addClass('dislike');
                } else {
                    $('#likes').text(parseInt($('#likes').text())+1);
                    likebtn.html('true');
                    likebtn.removeClass('dislike');
                    likebtn.addClass('like');
                }
            }else{
                $('#likeerror').text(response.errors);
                $('#likeerror').show();
            }
        });
    });

    const commentbtn=$('#addcommentbtn');
    commentbtn.on('click',function (event) {
            event.preventDefault();
            let errors=[];
            let commentText = $('#comment').val().trim();
            let recipeId = $('#addcommentbtn').data('rid');
            let hasErrors=false;

            if (!commentText) {
                errors.push('Comment can not be empty string');
                hasErrors=true;
            }

            if(!recipeId.trim()){
                errors.push('Could not find recipe Id');
                hasErrors=true;
            }

            if (!hasErrors) {
                let requestConfig = {
                    method: 'POST',
                    url: '/comment/addcomment/'+recipeId,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        text: commentText
                    })
                }

                $.ajax(requestConfig).then((response) => {
                    $('#commentList').append('<li>'+commentText+'</li>'); 
                    $('#comments').text(parseInt($('#comments').text())+1);
                });
            }
            else{
                $("#commentError").text(errors.join('\n')).show();
            }

            $('#comment').val('');
        });

        const ratignbtn=$('#addrating');
    ratignbtn.on('click',function (event) {
            event.preventDefault();
            let errors=[];
            let rating = parseFloat($('#rating').val().trim());
            let recipeId = $('#addrating').data('rid');
            let hasErrors=false;

            if (!rating) {
                errors.push('Rating can not be empty');
                hasErrors=true;
            }

            if(!recipeId.trim()){
                errors.push('Could not find recipe Id');
                hasErrors=true;
            }

            if (!hasErrors) {
                let requestConfig = {
                    method: 'POST',
                    url: '/rating/addrating/'+recipeId,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        rating: rating
                    })
                }

                $.ajax(requestConfig).then((response) => {
                    $('#overallrating').text(response.overallrating);
                    $('#rating').val('');
                });
            }
        });
})(window.jQuery);