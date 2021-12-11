const { ObjectId } = require("bson");
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
            if (req.session.user) {
                islogin = true;
            }
            if (req.session.error) {
                let error = req.session.error;
                req.session.error = undefined;
                res.render("allrecipes", {
                    recipeList, title: "All Recipes", islogin, error
                });
            }
            else {
                res.render("allrecipes", { recipeList, title: "All Recipes", islogin, message });
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
    // let islogin = false;
    // if (req.session.user) {
    //   islogin = true;
    // }
    // res.render("searchresults", { resArray, title: "Search Results", islogin });
    console.log(resArray);
    res.send(resArray);
});

router.get("/:id", async (req, res) => {
    let id = xss(req.params.id.trim());
    let errors = [];
    if (id == null) {
        errors.push('Id must be provided');
    } else if (typeof (id) != 'string') {
        errors.push('Id must be of type string');
    } else if (id == "") {
        errors.push('Id can not be empty string');
    }
    if (errors.length != 0) {
        res.render('errors/error', { title: 'Errors', errors: errors });
    } else {
        try {
            const username = req.session.user;
            const recipe = await recipeData.getRecipeById(id);
            if (username) {
                const userInfo = await userData.getUserByUsername(username);
                const userId = ObjectId(userInfo._id);
                let likeflag = false;
                recipe.likes.forEach(likeId => {
                    if (userId.toString() == likeId.toString()) {
                        likeflag = true;
                    }
                });
                res.render('recipe/single', { title: recipe.name, recipeData: recipe, like: likeflag, userData: userInfo });
            } else {
                res.render('recipe/single',{title:recipe.name,recipeData:recipe,like:false})
            }

        } catch (e) {
            errors.push(e);
            res.render('errors/error', { title: 'Errors', errors: errors });
        }
    }
});

router.post('/like/:rid', async function (req, res) {
    const rid = xss(req.params.rid.trim());
    try {
        const recipe = await recipeData.getRecipeById(rid);
        let likeflag = false;
        const username=req.session.user;
        const userInfo=await userData.getUserByUsername(username);
        recipe.likes.forEach(likeId => {
            if (userInfo._id.toString() == likeId.toString()) {
                likeflag = true;
            }
        });
        const updateInfo = await recipeData.likeDislikeRecipe(rid,userInfo._id, !likeflag);
        if (updateInfo.updated) {
            res.status(200).json({
                success: true,
                like:likeflag
            });
        }
    } catch (e) {
        res.json({
            errors:e
        });
    }
});

router.get("/", (req, res) => {
    recipeData
        .getAllRecipes()
        .then((recipeList) => {
            //console.log(recipeList);
            let islogin = false;
            let message = req.session.message;
            if (req.session.user) {
                islogin = true;
            }
            if (req.session.error) {
                let error = req.session.error;
                req.session.error = undefined;
                res.render("allrecipes", {
                    recipeList, title: "All Recipes", islogin, error
                });
            }
            else {
                res.render("allrecipes", { recipeList, title: "All Recipes", islogin, message });
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
