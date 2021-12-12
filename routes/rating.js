const express = require('express');
const router = express.Router();
const ratingData=require('../data/reviews');
const recipeData = require('../data/recipes');
const xss = require('xss');
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

router.get('/addrating/:rid', async (req, res) => {
    if (!req.session.user) {
        req.session.previousRoute = req.originalUrl;
        res.redirect('/login');
        return;
    }

    let errors = [];
    let recipeId = xss(req.params.rid.trim());
    checkId(recipeId, errors);
    if (errors.length != 0) {
        res.render('errors/error', {
            title: 'Errors',
            errors: errors
        });
        return;
    }

    try {
        const username=req.session.user;
        const recipe = await recipeData.getRecipeById(recipeId);
        const userInfo = await userData.getUserByUsername(username);
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

router.post('/addrating/:rid', async (req, res) => {
    if(req.session.user){
        let errors = [];
    let recipeId = xss(req.params.rid.trim());
    checkId(recipeId, errors);
    const rating=parseFloat(xss(req.body.rating));
    if (!req.session.user) errors.push('User is not logged in!');
    if (rating == null) {
        errors.push('Rating must be provided');
    } else if (typeof (rating) != 'number') {
        errors.push('Rating Text must be of type number');
    } else if(rating<0 || rating>5){
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
        const username=req.session.user;
        const userInfo = await userData.getUserByUsername(username);
        const recipe = await ratingData.create(recipeId,userInfo._id,rating);
        let likeflag = false;
        recipe.likes.forEach(likeId => {
            if (userInfo._id.toString() == likeId.toString()) {
                likeflag = true;
            }
        });
        res.send({overallrating:recipe.overallrating});
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
    }
});

module.exports = router;