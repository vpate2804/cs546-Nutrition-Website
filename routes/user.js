const express = require('express');
const router = express.Router();
const data = require('../data')
const ObjectId = require('mongodb').ObjectId;
const userData = data.users;
const recipesData = data.recipes;

router.get('/private', async (req, res) => {
    if (req.session.user) {
        let islogin = true;
        let username = req.session.user;
        let title = "Private";

        let userInfo = await userData.getUserByUsername(username);
        let firstName = userInfo.firstname;
        let lastName = userInfo.lastname;
        let email = userInfo.email;
        let favoriteRecipesId = userInfo.favoriteRecipes;
        let favoriteRecipesName = []
        for (let i = 0; i < favoriteRecipesId.length; i++) {
            let favoriteRecipesIdInfo = await recipesData.getRecipeById(favoriteRecipesId[i]);
            favoriteRecipesName[i] = {
                name: favoriteRecipesIdInfo.name,
                id: favoriteRecipesId[i]
            }
        }

        res.render('private', {
            userName: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            favoriteRecipesName: favoriteRecipesName,
            title: title,
            islogin: islogin
        });
    }
});
router.post('/private', async (req, res) => {
    if (req.session.user) {
        let username = req.session.user;
        let userInfo = await userData.getUserByUsername(username);
        let firstName = req.body.firstname;
        let lastName = req.body.lastname;
        let email = req.body.email;
        let userId = userInfo._id.toString();
        let deleteFavoritesRecipesId = req.body.favoriteRecipesNameDeleteID;
        let updateInfo = {
            firstname: firstName,
            lastname: lastName,
            email: email
        }
        try {
            let updateResult = await userData.updateUser(userId, updateInfo);
        } catch (e) {

        }
        try {
            for (let i = 0; i < deleteFavoritesRecipesId.length; i++) {
                let deleteFavoritesRecipes = await userData.deleteToFavorite(userId, deleteFavoritesRecipesId[i]);
            }
        } catch (e) {

        }

        let userInfoUpdate = await userData.getUserByUsername(username);
        let favoriteRecipesId = userInfoUpdate.favoriteRecipes;
        let favoriteRecipesName = []
        for (let i = 0; i < favoriteRecipesId.length; i++) {
            let favoriteRecipesIdInfo = await recipesData.getRecipeById(favoriteRecipesId[i]);
            favoriteRecipesName[i] = {
                name: favoriteRecipesIdInfo.name,
                id: favoriteRecipesId[i]
            }
        }
        let islogin = true;
        let title = "Private";
        res.render('private', {
            userName: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            favoriteRecipesName: favoriteRecipesName,
            title: title,
            islogin: islogin
        });

    }
})

router.get('/addNewRecipe', async (req, res) => {
    if (req.session.user) {
        let title = "Signup";
        let islogin = true;
        res.render('addNewRecipe', { title: title, islogin: islogin });
        // return;
    }
})

router.post('/addNewRecipe', async (req, res) => {
    if (req.session.user) {
        console.log(req.body);
        let name = req.body.name;
        let ingredients = req.body.ingredients;
        let preparationTime = parseInt(req.body.preparationTime);
        let cookTime = parseInt(req.body.cookTime);
        let recipeType = req.body.recipeType;
        let foodGroup = req.body.foodGroup;
        let season = req.body.season;
        let nutritionDetails = req.body.nutritionDetails;
        let recipeSteps = req.body.recipeSteps;
        try {
            let createRecipe = await recipesData.createRecipe(name, ingredients,preparationTime,cookTime,recipeType,foodGroup, season,nutritionDetails,recipeSteps)
            let islogin = true;
            let title = "Private";
            console.log(createRecipe)
            res.render('private', {
                title: title,
                islogin: islogin
            });
        }catch (e) {
            console.log(e)
        }
    }
})



module.exports = router;