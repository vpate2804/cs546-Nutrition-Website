const express = require("express");
const router = express.Router();
const data = require("../data");
const ObjectId = require("mongodb").ObjectId;
const userData = data.users;
const recipesData = data.recipes;
const xss = require('xss');

router.get("/private", async (req, res) => {
  if (req.session.user) {
    let islogin = true;
    let username = req.session.user;
    let title = "Private";

    let userInfo = await userData.getUserByUsername(username);
    let firstName = userInfo.firstname;
    let lastName = userInfo.lastname;
    let email = userInfo.email;
    let favoriteRecipesId = userInfo.favoriteRecipes;
    let favoriteRecipesName = [];
    for (let i = 0; i < favoriteRecipesId.length; i++) {
      let favoriteRecipesIdInfo = await recipesData.getRecipeById(
        favoriteRecipesId[i]
      );
      favoriteRecipesName[i] = {
        name: favoriteRecipesIdInfo.name,
        id: favoriteRecipesId[i],
      };
    }
}})
router.post('/private', async (req, res) => {
    if (req.session.user) {
        let username = req.session.user;
        let userInfo = await userData.getUserByUsername(username);
        let firstName = xss(req.body.firstname);
        let lastName = xss(req.body.lastname);
        let email = xss(req.body.email);
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

    res.render("private", {
      userName: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      favoriteRecipesName: favoriteRecipesName,
      title: title,
      islogin: islogin,
    });
  }
router.post("/private", async (req, res) => {
  if (req.session.user) {
    let username = req.session.user;
    let userInfo = await userData.getUserByUsername(username);
    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let email = req.body.email;
    let userId = userInfo._id.toString();
    let deleteFavoritesRecipesId = req.body.favoriteRecipesNameDeleteID;
    //TODO each
    let updateInfo = {
      firstname: firstName,
      lastname: lastName,
      email: email,
    };
    try {
      let updateResult = await userData.updateUser(userId, updateInfo);
    } catch (e) {}
    try {
      for (let i = 0; i < deleteFavoritesRecipesId.length; i++) {
        let deleteFavoritesRecipes = await userData.deleteToFavorite(
          userId,
          deleteFavoritesRecipesId[i]
        );
      }
    } catch (e) {}

    let userInfoUpdate = await userData.getUserByUsername(username);
    let favoriteRecipesId = userInfoUpdate.favoriteRecipes;
    let favoriteRecipesName = [];
    for (let i = 0; i < favoriteRecipesId.length; i++) {
      let favoriteRecipesIdInfo = await recipesData.getRecipeById(
        favoriteRecipesId[i]
      );
      favoriteRecipesName[i] = {
        name: favoriteRecipesIdInfo.name,
        id: favoriteRecipesId[i],
      };
    }
    let islogin = true;
    let title = "Private";
    res.render("private", {
      userName: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      favoriteRecipesName: favoriteRecipesName,
      title: title,
      islogin: islogin,
    });
  }
});

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
        let name = xss(req.body.name);
        let ingredients = xss(req.body.ingredients);
        let preparationTime = xss(parseInt(req.body.preparationTime));
        let cookTime = xss(parseInt(req.body.cookTime));
        let recipeType = xss(req.body.recipeType);
        let foodGroup = xss(req.body.foodGroup);
        let season = xss(req.body.season);
        let nutritionDetails = xss(req.body.nutritionDetails);
        let recipeSteps = xss(req.body.recipeSteps);
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
router.post("/addfavorite", async (req, res) => {
    if (req.session.user) {
      console.log(req.session);
      let username=req.session.user;
      let userInfo=await userData.getUserByUsername(username);
      let userID=userInfo._id.toString();
      console.log(userID);
      let favid = req.body.recipeId;
      console.log(favid);
      try {
        let addFavorite = await userData.addToFavorite(userID, favid);
        let recipeList = await recipesData.getAllRecipes();
        if (addFavorite) {
          res.redirect("/all")
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      //let recipeList = await recipesData.getAllRecipes();
      res.redirect("/login");
    }
  });

module.exports = router;
