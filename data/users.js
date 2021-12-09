const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const bcrypt = require("bcryptjs");
const saltRounds = 16;
const { ObjectId } = require("mongodb");
const { mainModule } = require("process");

function checkVariable(variableName, value, variableType) {
  if (value == null) {
    throw `You must provide ${variableName}`;
  }
  if (typeof value != variableType) {
    throw `${variableName} needs to be ${variableType}, can not be ${value}`;
  }
  if (variableType == "string") {
    if (value.trim() == "") {
      throw `${variableName} can not be empty string`;
    }
  }
}

function checkUserInfo(username, password) {
  checkVariable("Username", username, "string");
  if (username.length < 4) {
    throw "Username must be at least 4 characters long";
  }
  if (/^[ ]+$/g.test(username)) {
    throw "Username can not have white space";
  }
  if (!/^[a-zA-Z0-9]+$/g.test(username)) {
    throw "Username must have only alphanumeric characters";
  }
  checkVariable("Password", password, "string");
  if (password.length < 6) {
    throw "Password must be at least 6 characters long";
  }
  if (/^[ ]+$/g.test(password)) {
    throw "Password can not have white space";
  }
}

const createUser = async function createUser(
  firstname,
  lastname,
  email,
  username,
  password
) {
  checkUserInfo(username, password);
  checkVariable("First name", firstname, "string");
  checkVariable("Last name", lastname, "string");
  checkVariable("Email", email, "string");
  if (/^[ ]+$/g.test(email.trim())) {
    throw "Email can not have white space";
  }
  if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(
      email.trim()
    )
  ) {
    throw "Email must be in proper format";
  }
  const usersCollection = await users();
  const allUsernames = await usersCollection
    .find({}, { projection: { _id: 0, username: 1 } })
    .toArray();
  allUsernames.forEach((usernames) => {
    usernames = usernames.username.toLowerCase();
    if (username.toLowerCase().trim() == usernames) {
      throw "There is already a user with that username";
    }
  });
  const allEmails = await usersCollection
    .find({}, { projection: { _id: 0, email: 1 } })
    .toArray();
  allEmails.forEach((emails) => {
    emails = emails.email.toLowerCase();
    if (email.toLowerCase().trim() == emails) {
      throw "There is already a user with that email";
    }
  });
  const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);
  let newUser = {
    firstname: firstname.trim(),
    lastname: lastname.trim(),
    email: email.trim(),
    username: username.trim(),
    hashedPassword: hashedPassword,
    favoriteRecipes: [],
    reviews: [],
    comments: [],
  };

  const insertInfo = await usersCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Can not add the user";

  return { userInserted: true };
};

const getUserById = async function getUserById(userId) {
    checkVariable('User ID', userId, 'string');
    const usersCollection = await users();
    userId = ObjectId(userId.trim());
    const user = await usersCollection.findOne({ _id: userId });
    if (user === null) throw 'No user with provided Id';
    user._id=user._id.toString();
    return user;
}

const getUserByUsername = async function getUserByUsername(userName) {
  checkVariable("Username", userName, "string");
  if (userName.length < 4) {
    throw "Username must be at least 4 characters long";
  }
  if (/^[ ]+$/g.test(userName)) {
    throw "Username can not have white space";
  }
  if (!/^[a-zA-Z0-9]+$/g.test(userName)) {
    throw "Username must have only alphanumeric characters";
  }
  const usersCollection = await users();
  const user = await usersCollection.findOne({ username: userName });
  if (user === null) throw "No user with provided username";
  user._id = user._id.toString();
  return user;
};

const checkUser = async function checkUser(username, password) {
    checkUserInfo(username, password);
    const usersCollection = await users();
    const allUsers = await usersCollection.find().toArray();
    let userData = {};
    allUsers.forEach(user => {
        if (user.username.toLowerCase() == username.toLowerCase()) {
            userData = user;
        }
    });
    if (Object.keys(userData) == 0) {
        throw 'Either the username or password is invalid';
    }
    const match = await bcrypt.compare(password, userData.hashedPassword);
    if (!match) {
        throw 'Either the username or password is invalid';
    }
    return { authenticated: true, username: userData.username };
}

function isCheckString(string) {
  if (!string) throw "You must provide a value";
  if (typeof string !== "string") throw "error string1";
  if (string.trim() === "") {
    throw "error string2";
  }
  if (string.length === 0) throw "empty value";
  string = string.replace(/\s*/g, "");
  for (let i = 0; i < string.length; i++) {
    if (!string[i].match(/[a-zA-Z]/)) {
      throw "error string3";
    }
  }
}

function isCheckEmail(email) {
  // Email according to RFC2822
  if (!email) throw "error email1";
  if (typeof email !== "string") throw "error email2";
  if (email.length === 0 || email.trim().length === 0) throw "error email3";
  const emailRegex = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );
  if (!emailRegex.test(email)) {
    throw "error email4";
  }
  // return { isValid: true };
}
// const updateUser = async function updateUser(id, userData) {
//   checkVariable("Id", id, "string");
//   const usersCollection = await users();

//   const updatedUserData = {};
//   isCheckString(userData.firstname);
//   isCheckString(userData.lastname);
//   isCheckEmail(userData.email);

//   updatedUserData.firstname = userData.firstname.trim();
//   updatedUserData.lastname = userData.lastname.trim();
//   updatedUserData.email = userData.email.trim();
//   let oldInfo = await getUserById(id.toString());

//   if (
//     oldInfo.firstname !== updatedUserData.firstname ||
//     oldInfo.lastname !== updatedUserData.lastname ||
//     oldInfo.email !== updatedUserData.email
//   ) {
//     id = ObjectId(id.trim());
//     const updatedUserInfo = await usersCollection.updateOne(
//       { _id: id },
//       { $set: updatedUserData }
//     );
//     if (updatedUserInfo.modifiedCount === 0) throw "Can not update user";
//   }
//   return await getUserById(id.toString());
// };

const getAllUsers=async function(){
    const usersCollection=await users();
    let allUsers = await usersCollection.find({}).toArray();
    allUsers.forEach((user)=>{
        user._id=user._id.toString();
        for(let i=0;i<user.favoriteRecipes.length;i++){
            user.favoriteRecipes[i]=user.favoriteRecipes[i].toString();
        }
        user.comments.forEach((comment)=>{
            comment._id=comment._id.toString();
        });
    });
    return allUsers;
}

const addToFavorite = async function (userId, recipeId) {
  checkVariable("User Id", userId, "string");
  checkVariable("Recipe Id", recipeId, "string");
  const usersCollection = await users();
  userId = ObjectId(userId.trim());
  recipeId = ObjectId(recipeId.trim());

  const updatedUserInfo = await usersCollection.updateOne(
    { _id: userId },
    { $addToSet: { favoriteRecipes: recipeId } }
  );
  if (updatedUserInfo.modifiedCount === 0) throw "Can not update user";

  return await getUserById(userId.toString());
};

const deleteToFavorite = async function (userId, recipeId) {
  checkVariable("User Id", userId, "string");
  checkVariable("Recipe Id", recipeId, "string");
  const usersCollection = await users();
  userId = ObjectId(userId.trim());
  recipeId = ObjectId(recipeId.trim());
  const updatedUserInfo = await usersCollection.updateOne(
    { _id: userId },
    { $pull: { favoriteRecipes: recipeId } }
  );
  if (updatedUserInfo.modifiedCount === 0) throw "Can not update user me";
  return await getUserById(userId.toString());
};

module.exports = {
    createUser,
    checkUser,
    getUserById,
    getUserByUsername,
    updateUser,
    addToFavorite,
    deleteToFavorite,
    getAllUsers
};
