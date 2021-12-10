const express = require('express');
const router = express.Router();
const ratingData=require('../data/reviews');
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

router.get('/addrating/:rid/:uid', async (req, res) => {
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

router.post('/addrating/:rid/:uid', async (req, res) => {
    let errors = [];
    let recipeId = xss(req.params.rid.trim());
    let userId = xss(req.params.uid.trim());
    checkId(recipeId, errors);
    checkId(userId, errors);
    const rating=xss(req.body.rating.trim());
    if (!req.session.user) errors.push('User is not logged in!');
    if (rating == null) {
        errors.push('Rating must be provided');
    } else if (typeof (rating) != 'number') {
        errors.push('Rating Text must be of type string');
    } else if (rating.trim() == "") {
        errors.push('Rating Text can not be empty');
    }else if(rating<0 || rating>5){
        errors.push('Rating should be between 0 to 5');
    }

    if (errors.length != 0) {
        res.render('errors/error', {
            title: 'Errors',
            errors: errors
        });
        return;
    }

    try {
        // const userInfo = await userData.getUserById(userId);
        const recipe = await ratingData.create(recipeId,userId,rating);
        let likeflag = false;
        recipe.likes.forEach(likeId => {
            if (userInfo._id.toString() == likeId.toString()) {
                likeflag = true;
            }
        });
        // res.redirect('recipe/single', {
        //     title: recipe.name,
        //     authenticated: req.session.user ? true : false,
        //     user: req.session.user,
        //     recipeData: recipe,
        //     like:likeflag,
        //     userData:userInfo
        // });
        res.render('partials/comment');
    } catch (e) {
        console.log(e);
        errors.push(e);
        res.status(500).render('errors/error', {
            title: 'Errors',
            errors: errors
        });
    }
});

module.exports = router;