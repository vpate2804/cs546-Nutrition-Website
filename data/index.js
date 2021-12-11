const userData = require('./users');
const verifyData = require('./verify');
const recipeData = require('./recipes');
const commentsData=require('./comments')
const { comments } = require('../config/mongoCollections');

module.exports = {
    users: userData,
    verify: verifyData,
    recipes: recipeData,
    comments:commentsData
};
