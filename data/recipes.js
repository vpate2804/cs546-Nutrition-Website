const mongoCollections = require('../config/mongoCollections');
const ObjectId = require('mongodb').ObjectId;
const recipes = mongoCollections.recipes;
const checkFunction = require("./verify");
module.exports = {
  async createRecipe(
    name,
    ingredients,
    preparationTime,
    cookTime,
    recipeType,
    foodGroup,
    season,
    nutritionDetails,
    recipeSteps
  ) {
    if (arguments.length !== 9)
      throw "error number of arguments in createRecipe";
    checkFunction.isCheckString("recipe name", name);
    checkFunction.isCheckObject("ingredients", ingredients);
    checkFunction.isCheckTime("preparationTime", preparationTime);
    checkFunction.isCheckTime("cookTime", cookTime);
    checkFunction.isCheckRecipeType(recipeType);
    checkFunction.isCheckSeason(season);
    checkFunction.isCheckArray("foodGroup", foodGroup);
    checkFunction.isCheckObject("nutritionDetails", nutritionDetails);
    checkFunction.isCheckArray("recipeSteps", recipeSteps);
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
      likes: [],
    };
    const insertInfo = await recipesCollection.insertOne(newRecipes);

    if (insertInfo.insertCount == 0) throw "Could not create a new recipe";
    const newId = insertInfo.insertedId;
    return await this.getRecipeById(newId);
  },

  async getRecipeById(id) {
    if (arguments.length != 1)
      throw "error number of arguments in getRecipeById";
    if (typeof id === "object") {
      id = id.toString();
    }
    checkFunction.isCheckId("recipeId", id);
    const recipesCollection = await recipes();
    const recipeInfo = await recipesCollection.findOne({ _id: ObjectId(id) });
    if (recipeInfo == null) throw "error id";
    recipeInfo._id = recipeInfo._id.toString();
    return recipeInfo;
  },

    async getRecipeById(id) {
        if (arguments.length != 1) throw "error number of arguments in getRecipeById";
        if (typeof id === 'object') {
            id = id.toString();
        }
        checkFunction.isCheckId("recipeId", id);
        const recipesCollection = await recipes();
        const recipeInfo = await recipesCollection.findOne({ _id: ObjectId(id) });
        if (recipeInfo == null) throw "error id"
        recipeInfo._id = recipeInfo._id.toString();
        return recipeInfo;
    },

    async likeDislikeRecipe(rid,uid,like){
        checkFunction.isCheckId('Recipe Id',rid.trim());
        checkFunction.isCheckId('User Id',uid.trim());
        const recipeId=ObjectId(rid);
        const userId=ObjectId(uid);
        const recipesCollection=await recipes();
        if(like){
            const updateInfo = await recipesCollection.updateOne({_id: recipeId},{$addToSet: {likes: userId}});
		    if (!updateInfo.modifiedCount) return {updated: false};
            return {updated:true};      
        }else{
            const updateInfo = await recipesCollection.updateOne({_id: recipeId},{$pull: {likes: userId}});
		    if (!updateInfo.modifiedCount) return {updated: false};
            return {updated:true};      
        }
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
        checkFunction.isCheckId("recipeId",id);
        const recipesCollection = await recipes();
        await this.getRecipeById(id);
        checkFunction.isCheckString("recipe name",name);
        checkFunction.isCheckObject("ingredients",ingredients);
        checkFunction.isCheckTime("preparationTime",preparationTime);
        checkFunction.isCheckTime("cookTime",cookTime);
        checkFunction.isCheckRecipeType(recipeType);
        checkFunction.isCheckSeason(season);
        checkFunction.isCheckArray("foodGroup",foodGroup);
        checkFunction.isCheckObject("nutritionDetails",nutritionDetails);
        checkFunction.isCheckArray("recipeSteps",recipeSteps);
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
        if (arguments.length != 1) throw "error number of arguments in removeRecipe";
        const recipesCollection = await recipes();
        checkFunction.isCheckId("recipeID",id);
        let parsedId = ObjectId(id);
        const recipeInfo = await this.getRecipeById(id);
        const deletionInfo = await recipesCollection.deleteOne({ _id: parsedId });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete recipe with id of ${id}`;
        }
        return `${recipeInfo.name} has been successfully deleted!`;
    }
}
// async function main() {
//     try {
//         await module.exports.createRecipe('Walnut Rugelach',
//             {
//                 "all-purpose flour": "1 1/4 cups",
//                 "baking powder": "1/4 teaspoon",
//                 "salt": "1/4 teaspoon",
//                 "white sugar": "1/4 cups",
//                 "unsalted butter": "3 tablespoons",
//                 "cream cheese, softened": "3 tablespoons",
//                 "egg yolk": "1",
//                 "vaniila extract": "1/2 teaspoon",
//                 "egg white": "1",
//                 "ground walnuts": "1 cup",
//                 "white sugar": "1/2 cup",
//                 "confectioners' sugar, ore more as needed": "1 tablespoon"
//             },
//             30,
//             15,
//             "Dinner",
//             ["Nuts"],
//             "Spring",
//             {
//                 "calories": "62",
//                 "protein": "1.1g",
//                 "carbohydrates": "8.1g",
//                 "fat": "3g",
//                 "cholesterol": "9.6mg",
//                 "sodium": "25.1mg"
//             },
//             ["Sift flour, baking powder, and salt together onto a sheet of waxed paper.",
//                 "Beat 1/4 cup white sugar, butter, and cream cheese together in a bowl with an electric mixer until creamy. Beat in egg yolk and vanilla.",
//                 "Stir flour mixture into butter mixture until dough is just combined. Divide dough into 3 equal portions; shape each portion into a disk, wrap disks in plastic wrap, and refrigerate for at least 4 hours or overnight.",
//                 "Beat egg white in a bowl with an electric mixture until frothy. Mix walnuts and 1/2 cup white sugar into egg white.", "Preheat oven to 350 degrees F (175 degrees C).",
//                 "Remove dough from plastic wrap and roll each disk out into a 7-inch circle. Spread 1/3 the egg white mixture onto each dough circle, leaving a 1/4-inch border around the edge of each circle. Cut each circle into 12 wedges. Roll up each wedge from the edge to the point and place, point-side down, on a baking sheet.",
//                 "Bake in the preheated oven until lightly browned, 12 to 14 minutes. Transfer to wire racks to cool and dust with confectioners' sugar."]);
//         //await module.exports.createRecipe('Cheese Fritters',{"drained cottage cheese":"1 cup","egg":"1","half-and-half":"1/4 cup","all-purpose flour":"1 cup","baking powder":"1 3/4 teaspoons","salt":"1/4 teaspoon","white sugar":"2 tablespoons","ground nutmeg":"1 teaspoon","vegetable oil for frying":"4 cups","confectioners' sugar":"3 tablespoons"},"15 mins","10 mins","Breakfast","Vegetables","Fall",{"calories":"883","protein":"4.9g","carbohydrates":"15.7g","fat":"90.4g","cholesterol":"24.2mg","sodium":"244.4,g"},["In a medium bowl, beat the cottage cheese and egg together. Stir in the half-and-half, flour, baking powder, salt, sugar and nutmeg. Mix until just combined.","Fill a deep pot to the 2-inch mark with oil. Heat to 375 degrees F (190 degrees C). Drop batter by rounded tablespoons into the hot oil. Fry until golden brown on all sides, about 3 to 4 minutes. Drain on paper towels and sprinkle with confectioners' sugar. Serve hot!"]);
//         //await module.exports.createRecipe('Peanut Butter',{"peanut":"2 cups"},"15","5","snacks",["protein"],"all",{"protein":"7g","calories":"299","cholestrol":"25.4mg"},["Roast the peanut in baking tray","Cool it down to room temprature","Churn it into food processor"]);
//     } catch (e) {
//         console.log(e);
//     }
// }

// main();