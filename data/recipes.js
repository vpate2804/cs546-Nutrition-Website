const mongoCollections = require('../config/mongoCollections');
const ObjectId = require('mongodb').ObjectId;
const recipes = mongoCollections.recipes;
const checkFunction = require('./verify');
module.exports = {
    async createRecipe(name, ingredients, preparationTime, cookTime, recipeType,
        foodGroup, season, nutritionDetails, recipeSteps) {
        if (arguments.length !== 9) throw "error number of arguments in createRecipe";
        checkFunction.isCheckString(name);
        checkFunction.isCheckObject(ingredients);
        checkFunction.isCheckTime(preparationTime);
        checkFunction.isCheckTime(cookTime);
        checkFunction.isCheckString(recipeType);
        checkFunction.isCheckString(season);
        checkFunction.isCheckArray(foodGroup);
        checkFunction.isCheckObject(nutritionDetails);
        checkFunction.isCheckArray(recipeSteps);
        let recipesCollection = await recipes();
        let newRecipes = {
            name: name,
            ingredients: ingredients,
            preparationTime: preparationTime,
            cookTime: cookTime,
            recipeType: recipeType,
            foodGroup: foodGroup,
            season: season,
            nutritionDetails: nutritionDetails,
            rating: 0,
            recipeSteps: recipeSteps,
            comments: [],
            likes: []
        }
        const insertInfo = await recipesCollection.insertOne(newRecipes);

        if (insertInfo.insertCount == 0) throw 'Could not create a new recipe';
        const newId = insertInfo.insertedId;
        //console.log(insertInfo);
        return await this.getRecipeById(newId);
    },

    async getRecipeById(id) {
        if (arguments.length != 1) throw "error number of arguments in getRecipeById";
        if (typeof id === 'object') {
            id = id.toString();
        }
        checkFunction.isCheckId(id);
        const recipesCollection = await recipes();
        const recipeInfo = await recipesCollection.findOne({ _id: ObjectId(id) });
        if (recipeInfo == null) throw "error id"
        recipeInfo._id = recipeInfo._id.toString();
        return recipeInfo;
    },

    async getAllRecipes() {
        if (arguments.length > 0) throw "error number of arguments in getAllRecipes";
        let recipesCollection = await recipes();
        let recipeList = await recipesCollection.find({}).toArray();
        for (let i = 0; i < recipeList.length; i++) {
            recipeList[i]._id = recipeList[i]._id.toString();
        }
        return recipeList;
    },

    async updateRecipe(id, name, ingredients, preparationTime,
        cookTime, recipeType, foodGroup, season, nutritionDetails, recipeSteps) {
        if (arguments.length != 10) throw "error number of arguments in updateRecipe";
        if (typeof id === 'object') {
            id = id.toString();
        }
        checkFunction.isCheckId(id);
        const recipesCollection = await recipes();
        await this.getRecipeById(id);
        checkFunction.isCheckString(name);
        checkFunction.isCheckObject(ingredients);
        checkFunction.isCheckTime(preparationTime);
        checkFunction.isCheckTime(cookTime);
        checkFunction.isCheckString(recipeType);
        checkFunction.isCheckString(season);
        checkFunction.isCheckArray(foodGroup);
        checkFunction.isCheckObject(nutritionDetails);
        checkFunction.isCheckArray(recipeSteps);
        const updateRecipe = {
            name: name,
            ingredients: ingredients,
            preparationTime: preparationTime,
            cookTime: cookTime,
            recipeType: recipeType,
            foodGroup: foodGroup,
            season: season,
            nutritionDetails: nutritionDetails,
            recipeSteps: recipeSteps
        };

        let parsedId = ObjectId(id);
        const updateInfo = await recipesCollection.updateOne(
            { _id: parsedId },
            { $set: updateRecipe }
        );

        if (updateInfo.modifiedCount === 0) {
            throw 'Could not update Recipe successfully!';
        }
        return this.getRecipeById(id);
    },

    async removeRecipe(id) {
        if(arguments.length!=1) throw "error number of arguments in removeRecipe";
        const recipesCollection = await recipes();
        checkFunction.isCheckId(id);
        let parsedId = ObjectId(id);
        const recipeInfo = await this.getRecipeById(id);
        const deletionInfo = await recipesCollection.deleteOne({ _id: parsedId });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete recipe with id of ${id}`;
        }
        return `${recipeInfo.name} has been successfully deleted!`;
    }
}