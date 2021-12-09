(function ($) {
    const likebtn = $('#likebtn');
    likebtn.on('click', function (event) {
        event.preventDefault();
        var userId = likebtn.data('uid');
        var recipeId = likebtn.data('rid');
        var like = likebtn.data('like');

        if (userId) {
            var requestConfig = {
                method: "POST",
                url: '/all/like/' + recipeId + '/' + userId,
                contentType: 'application/json',
                data: JSON.stringify({
                    rid: recipeId,
                    uid: userId
                })
            };
            $.ajax(requestConfig).then(function (responseMessage) {
                if (like) {
                    likebtn.innerText ='false';
                    likebtn.removeClass('like');
                    likebtn.addClass('dislike');
                } else {
                    likebtn.innerText ='true';
                    likebtn.removeClass('dislike');
                    likebtn.addClass('like');
                }
            })
        } else {
            console.log('error');
        }

    });

    const commentbtn=$('#addcommentbtn');
    commentbtn.on('click',function (event) {
            event.preventDefault();
            let errors=[];
            let commentText = $('#comment').val().trim();
            let recipeId = $('#addcommentbtn').data('rid');
            let userId = $('#addcommentbtn').data('uid');
            let hasErrors=false;

            if (!commentText) {
                errors.push('Comment can not be empty string');
                hasErrors=true;
            }

            if(!recipeId.trim()){
                errors.push('Could not find recipe Id');
                hasErrors=true;
            }

            if(!userId.trim()){
                errors.push('Could not find user Id');
                hasErrors=true;
            }

            if (!hasErrors) {
                let requestConfig = {
                    method: 'POST',
                    url: '/comment/addcomment/'+recipeId+'/'+userId,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        text: commentText
                    })
                }

                $.ajax(requestConfig).then((response) => {
                    $('#commentList').append(commentText); 
                });
            }
            $('#comment').val('');
        });

        const ratignbtn=$('#addrating');
    ratignbtn.on('click',function (event) {
            event.preventDefault();
            let errors=[];
            let rating = $('#rating').val().trim();
            let recipeId = $('#addrating').data('rid');
            let userId = $('#addrating').data('uid');
            let hasErrors=false;

            if (!rating) {
                errors.push('Rating can not be empty');
                hasErrors=true;
            }

            if(!recipeId.trim()){
                errors.push('Could not find recipe Id');
                hasErrors=true;
            }

            if(!userId.trim()){
                errors.push('Could not find user Id');
                hasErrors=true;
            }

            if (!hasErrors) {
                let requestConfig = {
                    method: 'POST',
                    url: '/rating/addrating/'+recipeId+'/'+userId,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        rating: rating
                    })
                }

                $.ajax(requestConfig).then((response) => {
                    console.log('rating added');
                });
            }
            $('#rating').val('');
        });
})(window.jQuery);