const express = require("express");
const router = express.Router();
const data = require("../data");
const recipeData = data.recipes;
router.get("/", (req, res) => {
  recipeData
    .getAllRecipes()
    .then((recipeList) => {
      //console.log(recipeList);
      let islogin=false;
      if (req.session.user) {
        islogin = true;
      }
      res.render("allrecipes", { recipeList, title: "All Recipes", islogin });
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
  console.log(reslist);
  reslist.forEach((rec) => {
    let rname = rec.name.toLowerCase();
    if (rname.includes(name)) {
      resArray.push(rec);
    }
  });
  res.render("searchresults", { resArray, title: "Search Results", islogin });
});
module.exports = router;
