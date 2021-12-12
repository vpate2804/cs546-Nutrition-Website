const express = require('express');
const router = express.Router();
const commentsData = require('../data/comments');
const recipeData = require('../data/recipes');
const xss = require('xss');
const { ObjectId } = require('mongodb');
const userData = require('../data/users');

function checkId(id, errors) {
    if (id == null) {
        errors.push('Id must be provided');
    } else if (typeof (id) != 'string') {
        errors.push('Id must be of type string');
    } else if (id == "") {
        errors.push('Id can not be empty string');
    }
}

router.get('/addcomment/:rid', async (req, res) => {
    if (!req.session.user) {
        req.session.previousRoute = req.originalUrl;
        res.redirect('/login');
        return;
    }

    let errors = [];
    let recipeId = xss(req.params.rid.trim());
    let userId = xss(req.params.uid.trim());
    checkId(recipeId, errors);
    checkId(userId, errors);
    if (errors.length != 0) {
        res.render('errors/error', {
            title: 'Errors',
            errors: errors
        });
        return;
    }

    try {
        const recipe = await recipeData.getRecipeById(recipeId);
        const userInfo = await userData.getUserById(userId);
        let likeflag = false;
        recipe.likes.forEach(likeId => {
            if (userInfo._id.toString() == likeId.toString()) {
                likeflag = true;
            }
        });
        res.render('recipe/single', {
            title: recipe.name,
            authenticated: req.session.user ? true : false,
            user: req.session.user,
            recipeData: recipe,
            like:likeflag,
            userData:userInfo
        });
    } catch (e) {
        errors.push(e)
        res.status(500).render('errors/error', {
            title: 'Errors',
            errors: errors
        });
    }
});

router.post('/addcomment/:rid', async (req, res) => {
    if(req.session.user){
        let errors = [];
    let recipeId = xss(req.params.rid.trim());
    checkId(recipeId, errors);
    const commentText=xss(req.body.text.trim());
    if (!req.session.user) errors.push('User is not logged in!');
    if (commentText == null) {
        errors.push('Comment text must be provided');
    } else if (typeof (commentText) != 'string') {
        errors.push('Comment Text must be of type string');
    } else if (commentText.trim() == "") {
        errors.push('Comment Text can not be empty string');
    }

    if (errors.length != 0) {
        res.render('errors/error', {
            title: 'Errors',
            errors: errors
        });
        return;
    }

    try {
        const username=req.session.user;
        const userInfo = await userData.getUserByUsername(username);
        const recipe = await commentsData.createComment(recipeId,userInfo._id,commentText);
        let likeflag = false;
        recipe.likes.forEach(likeId => {
            if (userInfo._id.toString() == likeId.toString()) {
                likeflag = true;
            }
        });
        res.render('partials/comment');
    } catch (e) {
        console.log(e);
        errors.push(e);
        res.status(500).render('errors/error', {
            title: 'Errors',
            errors: errors
        });
    }
    }else{
        req.session.previousRoute = req.originalUrl;
        res.redirect("/login");
        return;
    }    
});

module.exports = router;