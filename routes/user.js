const express = require("express");
const router = express.Router();
const data = require("../data");
const ObjectId = require("mongodb").ObjectId;
const userData = data.users;
const recipesData = data.recipes;
const xss = require("xss");
const checkFunction = require('../data/verify');

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
    let recipeInfo=[];
    for (let i = 0; i < userInfo.recipes.length; i++) {
      let recipe=await recipesData.getRecipeById(userInfo.recipes[i].toString());
      recipeInfo[i] = {
        name: recipe.name,
        id: recipe._id.toString(),
      };
    }
    for (let i = 0; i < favoriteRecipesId.length; i++) {
      let favoriteRecipesIdInfo = await recipesData.getRecipeById(
        favoriteRecipesId[i]
      );
      favoriteRecipesName[i] = {
        name: favoriteRecipesIdInfo.name,
        id: favoriteRecipesId[i],
      };
    }
    res.render("private", {
      userName: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      favoriteRecipesName: favoriteRecipesName,
      title: title,
      islogin: islogin,
      username: username,
      recipes:recipeInfo
    });
  } else {
    let title = "Login";
    res.redirect('/login');
    return;
  }
});

router.post("/private", async (req, res) => {
  try {
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
      email: email,
    };
    checkFunction.isCheckString("firstName", firstName);
    checkFunction.isCheckString("lastName", lastName);
    checkFunction.isCheckEmail(email);
    let updateResult = await userData.updateUser(userId, updateInfo);
    if (deleteFavoritesRecipesId) {
      for (let i = 0; i < deleteFavoritesRecipesId.length; i++) {
        let deleteFavoritesRecipes = await userData.deleteToFavorite(
          userId,
          deleteFavoritesRecipesId[i]
        );
      }
    }
    let userInfoUpdate = await userData.getUserByUsername(username);
    let recipeInfo=[];
    for (let i = 0; i < userInfo.recipes.length; i++) {
      let recipe=await recipesData.getRecipeById(userInfo.recipes[i].toString());
      recipeInfo[i] = {
        name: recipe.name,
        id: recipe._id.toString(),
      };
    }
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
      recipes:userInfoUpdate.recipes
    });
  } catch (e) {
    res.status(500);
    res.render("private", { error: e });
  }
});

router.get("/addNewRecipe", async (req, res) => {
  if (req.session.user) {
    let title = "addNewRecipe";
    let username = req.session.user;
    let islogin = true;
    res.render("addNewRecipe", { title: title, islogin: islogin, username: username });
    return;
  } else {
    res.redirect('/login');
    return;
  }
});

router.post("/addNewRecipe", async (req, res) => {
  try {
    let name = xss(req.body.name);
    let preparationTime = parseInt(xss(req.body.preparationTime));
    let cookTime = parseInt(xss(req.body.cookTime));
    let recipeType = xss(req.body.recipeType);
    let season = xss(req.body.season);

    let ingredients = req.body.ingredients;
    let foodGroup = req.body.foodGroup;
    let nutritionDetails = req.body.nutritionDetails;
    let recipeSteps = req.body.recipeSteps;

    let newFoodGroup = [];
    for (let i = 0; i < foodGroup.length; i++) {
      newFoodGroup.push(xss(foodGroup[i]));
    }
    let newRecipeSteps = [];
    for (let i = 0; i < recipeSteps.length; i++) {
      newRecipeSteps.push(xss(recipeSteps[i]));
    }
    let newIngredients = {};
    for (let i = 0; i < Object.keys(ingredients).length; i++) {
      newIngredients[xss(Object.keys(ingredients)[i])] = xss(
        Object.values(ingredients)[i]
      );
    }
    let newNutritionDetails = {};
    for (let i = 0; i < Object.keys(nutritionDetails).length; i++) {
      newNutritionDetails[xss(Object.keys(nutritionDetails)[i])] = xss(Object.values(nutritionDetails)[i]);
    }
    
    checkFunction.isCheckString("recipe name", name);
    checkFunction.isCheckObject("ingredients", newIngredients);
    checkFunction.isCheckTime("preparationTime", preparationTime);
    checkFunction.isCheckTime("cookTime", cookTime);
    checkFunction.isCheckRecipeType(recipeType);
    checkFunction.isCheckSeason(season);
    checkFunction.isCheckArray("foodGroup", newFoodGroup);
    checkFunction.isCheckObject("nutritionDetails", newNutritionDetails);
    checkFunction.isCheckArray("recipeSteps", newRecipeSteps);
    const username = req.session.user;
    const userInfo = await userData.getUserByUsername(username);
    
    checkFunction.isCheckId("userId", userInfo._id);
    let createRecipe = await recipesData.createRecipe(
      name,
      newIngredients,
      preparationTime,
      cookTime,
      recipeType,
      newFoodGroup,
      season,
      newNutritionDetails,
      newRecipeSteps,
      userInfo._id
    );
    let islogin = true;
    let title = "Private";
    res.render("private", {
      title: title,
      islogin: islogin,
    });
  } catch (e) {
    
    res.status(500);
    res.render("addNewRecipe", { error: e });
    return;
  }
});

router.post("/addfavorite", async (req, res) => {
  if (req.session.user) {
    console.log(req.session);
    let username = req.session.user;
    let userInfo = await userData.getUserByUsername(username);
    let userID = userInfo._id.toString();
    console.log(userID);
    let favid = req.body.recipeId;
    favid = favid.toString();
    console.log(favid);
    try {
      let addFavorite = await userData.addToFavorite(userID, favid);
      let recipeList = await recipesData.getAllRecipes();
      if (addFavorite) {
        req.session.message = "Added to favorite successfully!";
        res.redirect("/all");
      }
    } catch (e) {
      //console.log(e);
      req.session.error =
        "You have already added this recipe to your favorites!";
      res.redirect("/all");
    }
  } else {
    //let recipeList = await recipesData.getAllRecipes();
    res.redirect("/login");
  }
});

module.exports = router;
