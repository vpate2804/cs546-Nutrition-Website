(function ($) {
    // function updateLikesOnPage(btn, responseMessage){
    //     var likes = btn.closest('.container').find('.likes');
    //     var dislikes = btn.closest('.container').find('.dislikes');
        
    //     //update likes on page
    //     likes.html(responseMessage.likeNum);
    //     dislikes.html(responseMessage.dislikeNum);
    // }
    // function showLikeError(btn){
    //     var error = btn.closest('.container').find('.error');
    //     error.html("You must be logged in to like/dislike");
    //     error.removeAttr('hidden');
    // }

    const likebtn=$('#likebtn');
    likebtn.on('click', function(event){
        event.preventDefault();
        var userId = likebtn.data('uid');
        var recipeId=likebtn.data('rid');
        var like =likebtn.data('like');

        if (userId){
            var requestConfig = {
                method: "POST",
                url: '/all/like/' + recipeId + '/' + userId,
                contentType: 'application/json',
                data: JSON.stringify({
                    rid: recipeId,
                    uid: userId
                })
            };
            $.ajax(requestConfig).then(function(responseMessage){
                updateLikesOnPage(btn, responseMessage);
                if(like){
                    likebtn.removeClass('like');
                    likebtn.addClass('dislike');
                }else{
                    likebtn.removeClass('dislike');
                    likebtn.addClass('like');
                }
            })
        }else{
            showLikeError(btn);
        }
        
    })   

    /*
        AJAX for adding a comment
    */ 
    // let commentForms = $('.comment-form');
    // if (commentForms.length > 0) {
    //     commentForms.each((index) => {
    //         let currentForm = $(commentForms[index]);
    //         currentForm.submit((event) => {
    //             event.preventDefault();

    //             let commentInput = currentForm.find('.form-group').find('input');
    //             commentInput.removeClass('is-invalid is-valid');

    //             let commentText = commentInput.val().trim();
    //             let reviewId = currentForm.data('review');
    //             let hasErrors = false;
                
    //             if (!commentText) {
    //                 commentInput.addClass('is-invalid');
    //                 hasErrors = true;
    //             }
                
    //             if (!hasErrors) {
    //                 let requestConfig = {
    //                     method: 'POST',
    //                     url: '/api/comment/new',
    //                     contentType: 'application/json',
    //                     data: JSON.stringify({
    //                         reviewId: currentForm.data('review'),
    //                         text: commentText
    //                     })
    //                 }
                    
    //                 $.ajax(requestConfig).then((response) => {
    //                     let commentList = $(`#comment-list-${reviewId}`);
    //                     commentList.append(response);
    //                 });
    //             }
    //             commentInput.val('');
    //         });
    //     });
    // }
})(window.jQuery);