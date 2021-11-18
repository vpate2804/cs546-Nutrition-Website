const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const { ObjectId } = require("mongodb");
const create = async function create(recipeID, userID, rating, review) {
  //error handling
  if (arguments.length !== 4) throw "Invalid Arguments";
  if (
    recipeID == undefined ||
    userID == undefined ||
    rating == undefined ||
    review == undefined
  )
    throw "Enter All parameters review";
  if (
    typeof recipeID !== "string" ||
    typeof userID !== "string" ||
    typeof review !== "string" ||
    typeof rating !== "number"
  )
    throw "Invalid type";
  if (recipeID.length === 0 || userID.length === 0 || review.length === 0)
    throw "String empty";
  if (!recipeID.trim() || !userID.trim() || !review.trim())
    throw "String contains only spaces";

  recipeID = recipeID.trim();
  userID = userID.trim();
  review = review.trim();
  if (rating < 0) throw "Overall rating invalid";
  if (rating > 5) throw "Overall rating invalid";
  if (!ObjectId.isValid(recipeID)) throw "Invalid Recipe ID";
  if (!ObjectId.isValid(userID)) throw "Invalid User ID";
  const reviewCollection = await reviews();
  const revObj = {
    recipeID: recipeID,
    userID: userID,
    rating: rating,
    review: review,
  };
  const insertInfo = await reviewCollection.insertOne(revObj);
  if (insertInfo.insertedCount === 0) throw "Could not add restaurant";
  return "Review Inserted!";
};
module.exports = {
  create,
};
