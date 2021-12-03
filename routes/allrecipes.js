const express = require('express');
const router = express.Router();
const data = require('../data');
const recipeData = data.recipes;
router.get('/', (req, res) => {
    recipeData.getAllRecipes().then((recipeList) => {
        res.render('allrecipes', { recipeList });
    }).catch((error) => {
        res.status(500).json({ error: error });
    });
});
module.exports = router;
