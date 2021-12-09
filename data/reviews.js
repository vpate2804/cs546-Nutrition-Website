const mongoCollections = require('../config/mongoCollections');
const recipes = require('./recipes');
let { ObjectId } = require('mongodb');
const recipesCo =  mongoCollections.recipes;
const checkFunction = require('./verify');

const create = async function create(recipeId, userId, rating) {
  console.log("Create called");
  console.log(recipeId+"  "+userId+"  "+rating);
  if(arguments.length!=3) throw "error number of arguments";
  let newId = new ObjectId();
  checkFunction.isCheckId('Recipe Id',recipeId);
  checkFunction.isCheckId('User Id',userId);
  if (rating == undefined)
    throw "Enter value for rating";
  if (typeof rating !== "number")
    throw "Invalid type of rating";
  const recipeThatReview = await recipes.getRecipeById(recipeId);

  const newRatingForRecipe = {
      _id: newId,
      userId:ObjectId(userId.trim()),
      rating:rating
  };
  recipeThatReview.ratings.push(newRatingForRecipe);
  
  let arr = recipeThatReview.ratings;

  const recipeCollection = await recipesCo();
  const updaterecipe = {
      ratings: arr
  };
  const updatedInfo = await recipeCollection.updateOne(
      {_id: ObjectId(recipeId)},
      {$set: updaterecipe}
  );
  if(updatedInfo.modifiedCount === 0){
      throw 'Could not update recipe successfully';
  }
};
module.exports = {
  create
};
