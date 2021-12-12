const { ObjectId } = require("bson");
const e = require("express");
const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require("../data");
const recipeData = data.recipes;
const userData = data.users;

router.get("/", (req, res) => {
  recipeData
    .getAllRecipes()
    .then((recipeList) => {
      //console.log(recipeList);
      let islogin = false;
      let message = req.session.message;
      let username;
      if (req.session.user) {
        islogin = true;
        username = req.session.user;
        console.log(username);
      }
      if (req.session.error) {
        let error = req.session.error;
        req.session.error = undefined;
        res.render("allrecipes", {
          recipeList,
          title: "All Recipes",
          islogin,
          error,
          username,
        });
      } else {
        res.render("allrecipes", {
          recipeList,
          title: "All Recipes",
          islogin,
          message,
          username,
        });
      }
      req.session.message = undefined;
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

router.get("/search", async (req, res) => {
  let name = req.query.search;
  name = name.toLowerCase();
  console.log(name);
  let resArray = [];
  let reslist = await recipeData.getAllRecipes();
  //console.log(reslist);
  reslist.forEach((rec) => {
    let rname = rec.name.toLowerCase();
    if (rname.includes(name)) {
      resArray.push(rec);
    }
  });
  res.send(resArray);
});

router.get("/:id", async (req, res) => {
  let id = xss(req.params.id.trim());
  let errors = [];
  if (id == null) {
    errors.push("Id must be provided");
  } else if (typeof id != "string") {
    errors.push("Id must be of type string");
  } else if (id == "") {
    errors.push("Id can not be empty string");
  }
  if (req.session.user) {
    let islogin = true;
    const username = req.session.user;
    if (errors.length != 0) {
      res.render("errors/error", { title: "Errors", errors: errors });
    } else {
      try {
        const recipe = await recipeData.getRecipeById(id);
        const userInfo = await userData.getUserByUsername(username);
        const userId = ObjectId(userInfo._id);
        let likeflag = false;
        recipe.likes.forEach((likeId) => {
          if (userId.toString() == likeId.toString()) {
            likeflag = true;
          }
        });
        res.render("recipe/single", {
          title: recipe.name,
          recipeData: recipe,
          like: likeflag,
          userData: userInfo,
          islogin: islogin,
          username: userInfo.username,
        });
      } catch (e) {
        errors.push(e);
        res.render("errors/error", { title: "Errors", errors: errors });
      }
    }
  } else {
    if (errors.length != 0) {
      res.render("errors/error", { title: "Errors", errors: errors });
    } else {
      try {
        const recipe = await recipeData.getRecipeById(id);
        res.render("recipe/single", {
          title: recipe.name,
          recipeData: recipe,
          like: false,
        });
      } catch (e) {
        errors.push(e);
        res.render("errors/error", { title: "Errors", errors: errors });
      }
    }
  }
});

router.post("/like/:rid", async function (req, res) {
  if (req.session.user) {
    {
      const rid = xss(req.params.rid.trim());
      try {
        const username = req.session.user;
        const recipe = await recipeData.getRecipeById(id);
        let islogin = false;
        if (username) {
          islogin = true;
          const userInfo = await userData.getUserByUsername(username);
          let likeflag = false;
          recipe.likes.forEach((likeId) => {
            if (userInfo._id.toString() == likeId.toString()) {
              likeflag = true;
            }
          });
          const updateInfo = await recipeData.likeDislikeRecipe(
            rid,
            userInfo._id,
            !likeflag
          );
          if (updateInfo.updated) {
            res.status(200).json({
              success: true,
              like: likeflag,
            });
          }
        } else {
          res.render("recipe/single", {
            title: recipe.name,
            recipeData: recipe,
            like: false,
            islogin: islogin,
          });
          //res.redirect("/login");
        }
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }
  } else {
    console.log("not logged in");
    res.redirect("/login");
  }
});

router.get("/search", async (req, res) => {
  let name = req.query.search;
  name = name.toLowerCase();
  console.log(name);
  let resArray = [];
  let reslist = await recipeData.getAllRecipes();
  console.log(reslist);
  reslist.forEach((rec) => {
    let rname = rec.name.toLowerCase();
    if (rname.includes(name)) {
      resArray.push(rec);
    }
  });
  let islogin = false;
  if (req.session.user) {
    islogin = true;
  }
  res.render("searchresults", { resArray, title: "Search Results", islogin });
});

module.exports = router;
