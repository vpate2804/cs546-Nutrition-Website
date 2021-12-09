const mongoCollections = require('../config/mongoCollections')
const recipes = require('./recipes');
let { ObjectId } = require('mongodb');
const recipesCo =  mongoCollections.recipes;
const checkFunction = require('./verify');
const usersCo = mongoCollections.users;
const users = require('./users');

async function createComment(recipeId,userId,text){
    if(arguments.length!=3) throw "error number of arguments";
    let newId = new ObjectId();
    checkFunction.isCheckId('Recipe Id',recipeId);
    checkFunction.isCheckId('User Id',userId);
    checkFunction.isCheckText('Comment text',text);
    const recipeThatComment = await recipes.getRecipeById(recipeId);

    const newCommentForRecipe = {
        _id: newId,
        userId:ObjectId(userId.trim()),
        text:text.trim()
    };
    recipeThatComment.comments.push(newCommentForRecipe);
    
    let arr = recipeThatComment.comments;

    const recipeCollection = await recipesCo();
    const updaterecipe = {
        comments: arr
    };
    const updatedInfo = await recipeCollection.updateOne(
        {_id: ObjectId(recipeId)},
        {$set: updaterecipe}
    );
    if(updatedInfo.modifiedCount === 0){
        throw 'Could not update recipe successfully';
    }

    const newCommentByUser = {
        _id: newId,
        recipeId:ObjectId(recipeId.trim()),
        text:text.trim()
    };
    const userThatComment = await users.getUserById(userId.toString());
    userThatComment.comments.push(newCommentByUser);
    let arr_user = userThatComment.comments;
    const userCollection = await usersCo();
    const updateuser = {
        comments: arr_user
    }
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        {$set: updateuser}
    );
    if(updateInfo.modifiedCount === 0){
        throw 'Could not update user successfully';
    }
    return await recipes.getRecipeById(recipeId);
}

async function getAllCommentsByRecipeId(recipeId){
    if(arguments.length!=1) throw "error number of arguments";
    checkFunction.isCheckId('Recipe Id',recipeId)
    let result = [];
    let recipe = await recipes.getRecipeById(recipeId);
    result = recipe.comments;
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

async function getCommentById(commentId){
    if(arguments.length!=1) throw "error number of arguments";
    checkFunction.isCheckId('Comment Id',commentId);

    let allRecipes = await recipes.getAllRecipes();
    let comment = {};
    for(let i = 0; i < allRecipes.length; i++){
        for(let j in allRecipes[i]){
            if(j == 'comments'){
                for(let k = 0; k < allRecipes[i][j].length; k++){
                    for(let l in allRecipes[i][j][k]){
                        if(l == '_id' && allRecipes[i][j][k][l] == commentId){
                            comment = allRecipes[i][j][k];
                            comment._id=comment._id.toString();
                        }
                    }
                }
            }
        }
    }
    return comment;
}

async function removeComment(commentId){
    if(arguments.length!=1) throw "error number of arguments";
    let comments=[];
    let recipeId,i;
    let allRecipes = await recipes.getAllRecipes();
    checkFunction.isCheckId('Comment Id',commentId);
    // for(let i = 0; i < allRecipes.length; i++){
    //     for(let j in allRecipes[i]){
    //         if(j == 'comments'){
    //             for(let k = 0; k < allRecipes[i][j].length; k++){
    //                 for(let l in allRecipes[i][j][k]){
    //                     if(l == '_id' && allRecipes[i][j][k][l] == commentId){
    //                         let z = allRecipes[i];
    //                         recipeId = z._id;//get recipeId
    //                         comments = allRecipes[i][j];
    //                         comments.splice(k,1);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    allRecipes.forEach((recipe)=>{
        i=0;
        recipe.comments.forEach((comment)=>{
            if(comment._id.toString()==commentId){
                recipeId=recipe._id;
                comments=recipe.comments;
                comments.splice(i,1);
            }
            i++;
        });
    });

    if(comments.length==0 && !recipeId){
        throw 'Could not find comment with specified Id in recipe collection';
    }else{
        for(let i = 0; i < comments.length; i++){
            for(let j in comments[i]){
                if(j == '_id'){
                    comments[i][j] = ObjectId(comments[i][j]);
                }
            }
        }
    }

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


    const allUsers=await users.getAllUsers();
    let userId,newComments=[];
    allUsers.forEach((user)=>{
        i=0;
        user.comments.forEach((comment)=>{
            if(comment._id.toString()==commentId){
                userId=user._id;
                newComments=user.comments;
                newComments.splice(i,1);
            }
            i++;
        });
    });
    if(newComments.length==0 && !userId){
        throw 'Could not find comment with specified Id in user collection';
    }
    newComments.forEach((comment)=>{
        comment._id=ObjectId(comment._id);
    });
    const usersCollection = await usersCo();
    const updateUser = {
        comments:newComments
    }
    userId = ObjectId(userId);
    const updatedUserInfo = await usersCollection.updateOne(
        {_id: userId},
        {$set: updateUser}
    );
    if(updatedUserInfo.modifiedCount === 0){
        throw 'Could not update user successfully';
    }

    return true;
}

async function getCommentsByUserId(userId){
    if(arguments.length!=1) throw "error number of arguments";
    checkFunction.isCheckId('User Id',userId);
    let result = [];
    let user = await users.getUserById(userId);
    result = user.comments;
    result.forEach((comment)=>{
        comment._id=comment._id.toString();
    });
    return result;
}

module.exports = {
    createComment,
    getAllCommentsByRecipeId,
    getCommentById,
    removeComment,
    getCommentsByUserId
}