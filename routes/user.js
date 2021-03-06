const express = require("express");
const router = express.Router();
const data = require("../data");
const ObjectId = require("mongodb").ObjectId;
const userData = data.users;
const recipesData = data.recipes;
const xss = require("xss");
const checkFunction = require("../data/verify");

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
    let recipeInfo = [];
    for (let i = 0; i < userInfo.recipes.length; i++) {
      let recipe = await recipesData.getRecipeById(
        userInfo.recipes[i].toString()
      );
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
    let userRecipeIds = userInfo.recipes;
    let userRecipes = [];
    for (let i = 0; i < userRecipeIds.length; i++) {
      let userRecipeIdInfo = await recipesData.getRecipeById(userRecipeIds[i]);
      userRecipes[i] = {
        name: userRecipeIdInfo.name,
        id: userRecipeIds[i],
      };
    }

    res.render("private", {
      userName: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      favoriteRecipesName: favoriteRecipesName,
      userRecipes: userRecipes,
      title: title,
      islogin: islogin,
      username: username,
      recipes: recipeInfo,
    });
  } else {
    res.redirect("/login");
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
    let recipeInfo = [];
    for (let i = 0; i < userInfo.recipes.length; i++) {
      let recipe = await recipesData.getRecipeById(
        userInfo.recipes[i].toString()
      );
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
      recipes: userInfoUpdate.recipes,
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
    res.render("addNewRecipe", {
      title: title,
      islogin: islogin,
      username: username,
    });
    return;
  } else {
    res.redirect("/login");
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
      newNutritionDetails[xss(Object.keys(nutritionDetails)[i])] = xss(
        Object.values(nutritionDetails)[i]
      );
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
    req.session.message = "Please login first!";
    res.redirect("/login");
  }
});

router.get("/update/:rid", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    let flag = false;
    let recipe = await recipesData.getRecipeById(req.params.rid);
    let userinfo = await userData.getUserByUsername(req.session.user);
    let userID = userinfo._id;
    let userRecipes = await userData.getRecipesByUserId(userID);
    console.log(userRecipes);
    console.log(req.params.rid);
    let temp = req.params.rid;
    console.log(temp);
    userRecipes.forEach((element) => {
      if (element.toString() == temp) {
        flag = true;
      }
    });
    if (flag) {
      res.status(200).render("recipe/update", {
        title: recipe.name,
        recipeData: recipe,
        islogin: true,
        nutritionslength: Object.keys(recipe.nutritionDetails).length,
        ingredientslength: Object.keys(recipe.ingredients).length,
        recipesteplength: recipe.recipeSteps.length,
        foodgrouplength: recipe.foodGroup.length,
        islogin: true,
        username: req.session.user,
      });
    } else {
      res.redirect("/private");
    }
  }
});

router.post("/edit", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else if (!req.body.id) {
    res.status(400).redirect("/private");
  } else {
    let id = xss(req.body.id);
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
      newNutritionDetails[xss(Object.keys(nutritionDetails)[i])] = xss(
        Object.values(nutritionDetails)[i]
      );
    }
    checkFunction.isCheckId("Recipe Id", id);
    checkFunction.isCheckString("recipe name", name);
    checkFunction.isCheckObject("ingredients", newIngredients);
    checkFunction.isCheckTime("preparationTime", preparationTime);
    checkFunction.isCheckTime("cookTime", cookTime);
    checkFunction.isCheckRecipeType(recipeType);
    checkFunction.isCheckSeason(season);
    checkFunction.isCheckArray("foodGroup", newFoodGroup);
    checkFunction.isCheckObject("nutritionDetails", newNutritionDetails);
    checkFunction.isCheckArray("recipeSteps", newRecipeSteps);
    console.log("ID : " + id);
    console.log("name : " + name);
    console.log("ingre : " + newIngredients);
    console.log("prep: " + preparationTime);
    console.log("cook : " + cookTime);
    console.log("type : " + recipeType);
    console.log("food gro: " + newFoodGroup);
    console.log("season: " + season);
    console.log("nutririon : " + newNutritionDetails);
    console.log("recipe steps : " + newRecipeSteps);
    try {
      const updateInfo = await recipesData.updateRecipe(
        id,
        name,
        newIngredients,
        preparationTime,
        cookTime,
        recipeType,
        newFoodGroup,
        season,
        newNutritionDetails,
        newRecipeSteps
      );
      console.log(updateInfo);
    } catch (e) {
      console.log(e);
    }
    //res.redirect("/private");
  }
});

router.post("/delete", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else if (!req.body.recipeId) {
    res.status(400).redirect("/private");
  } else {
    let recipeId = xss(req.body.recipeId);
    const username = req.session.user;
    const userInfo = await userData.getUserByUsername(username);
    checkFunction.isCheckId("Recipe Id", recipeId);
    try {
      const updateInfo = await recipesData.removeRecipe(
        recipeId,
        ObjectId(userInfo._id)
      );
      errors.push("Could not delete the recipe");
      res.render("errors/error", { title: "Errors", errors: errors });
    } catch (e) {
      let errors = [];
      errors.push(e);
      res.render("errors/error", { title: "Errors", errors: errors });
    }
  }
});

module.exports = router;
