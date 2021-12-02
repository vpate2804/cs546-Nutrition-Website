const mongoCollections = require('../config/mongoCollections')
const recipes = require('./recipes');
let { ObjectId } = require('mongodb');
const recipesCo =  mongoCollections.recipes;
const checkFunction = require('./verify');

const usersCo = mongoCollections.users;

//not finished still need change in user collection
async function createComment(recipeId,userId,text){
    if(arguments.length!=3) throw "error number of arguments";
    let newId = new ObjectId();
    checkFunction.isCheckId(recipeId);
    checkFunction.isCheckId(userId);
    checkFunction.isCheckText(text);
    const recipeThatComment = await recipes.getRecipeById(recipeId);
    
    const newComment = {
        _id: newId,
        recipeId:recipeId,
        userId:userId,
        text:text
    };
    //in this part I push comment into recipes collection 
    //and we still need to do this in user collection
    recipeThatComment.comments.push(newComment);
    
    //change String Id in comments into Object Id
    let arr = recipeThatComment.comments;
    

    for(let i = 0; i < arr.length; i++){
        for(let j in arr[i]){
            if(j == '_id'){
                arr[i][j] = ObjectId(arr[i][j]);
            }
        }
    }

    //update in recipe collection
    // still need update in user collection
    const recipeCollection = await recipesCo();
    const updaterecipe = {
        comments: arr
    };
    const updatedInfo = await recipeCollection.updateOne(
        {_id: ObjectId(recipeId)},
        {$set: updaterecipe}
    );
    if(updatedInfo.modifiedCount === 0){
        throw 'Could not update recipe successfully'
    }

    //update user
    const userCollection = await usersCo();
    const updateuser = {
        comments: arr
    }
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        {$set: updateInfo}
    );
    if(updateInfo.modifiedCount === 0){
        throw 'Could not update recipe successfully'
    }
    //update user finished
    //update recipe finished
    return await recipes.getRecipeById(recipeId);
}

//finished
async function getAllCommentsByRecipeId(recipeId){
    if(arguments.length!=1) throw "error number of arguments";
    checkFunction.isCheckId(recipeId)
    let result = [];
    let recipe = await recipes.getRecipeById(recipeId);
    result = recipe.comments;
    console.log(result);
    for(let i = 0; i < result.length; i++){
        for(let j in result[i]){
            if(j == '_id'){
                let temp = result[i][j].toString();
                result[i][j] = temp;
            }
        }
    }
    return result;
}

//finished
async function getCommentById(commentId){
    if(arguments.length!=1) throw "error number of arguments";
    checkFunction.isCheckId(commentId)

    let allRecipes = await recipes.getAllRecipes();
    let comment = {};
    for(let i = 0; i < allRecipes.length; i++){
        for(let j in allRecipes[i]){
            if(j == 'comments'){
                for(let k = 0; k < allRecipes[i][j].length; k++){
                    for(let l in allRecipes[i][j][k]){
                        if(l == '_id' && allRecipes[i][j][k][l] == commentId){
                            comment = allRecipes[i][j][k];
                        }
                    }
                }
            }
        }
    }
    return comment;
}

//not finished still need change in user collection
async function removeComment(commentId){
    if(arguments.length!=1) throw "error number of arguments";
    let comments;
    let recipeId;
    let allRecipes = await recipes.getAllRecipes();
    checkFunction.isCheckId(commentId)
    for(let i = 0; i < allRecipes.length; i++){
        for(let j in allRecipes[i]){
            if(j == 'comments'){
                for(let k = 0; k < allRecipes[i][j].length; k++){
                    for(let l in allRecipes[i][j][k]){
                        if(l == '_id' && allRecipes[i][j][k][l] == commentId){
                            let z = allRecipes[i];
                            recipeId = z._id;//get recipeId
                            comments = allRecipes[i][j];
                            comments.splice(k,1);
                        }
                    }
                }
            }
        }
    }

    for(let i = 0; i < comments.length; i++){
        for(let j in comments[i]){
            if(j == '_id'){
                comments[i][j] = ObjectId(comments[i][j]);
            }
        }
    }

    //change recipe collection
    // and we still need to change user collection
    const recipeCollection = await recipesCo();
    const updaterecipe = {
        comments:comments
    }
    let parsedId = ObjectId(recipeId);
    const updatedInfo = await recipeCollection.updateOne(
        {_id: parsedId},
        {$set: updaterecipe}
    );
    if(updatedInfo.modifiedCount === 0){
        throw 'Could not update recipes successfully';
    }


    return true;

}

//we still need a function called getAllCommentsByUserId()

module.exports = {
    createComment,
    getAllCommentsByRecipeId,
    getCommentById,
    removeComment
}