const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { ObjectId } = require('mongodb');

function checkVariable(variableName, value, variableType) {
    if (value == null) {
        throw `You must provide ${variableName}`;
    }
    if (typeof (value) != variableType) {
        throw `${variableName} needs to be ${variableType}, can not be ${value}`;
    }
    if (variableType == 'string') {
        if (value.trim() == '') {
            throw `${variableName} can not be empty string`;
        }

    }
}

function checkUserInfo(username, password) {
    checkVariable('Username', username, 'string');
    if (username.length < 4) {
        throw 'Username must be at least 4 characters long';
    }
    if ((/^[ ]+$/g).test(username)) {
        throw 'Username can not have white space';
    }
    if (!(/^[a-zA-Z0-9]+$/g).test(username)) {
        throw 'Username must have only alphanumeric characters';
    }
    checkVariable('Password', password, 'string');
    if (password.length < 6) {
        throw 'Password must be at least 6 characters long';
    }
    if ((/^[ ]+$/g).test(password)) {
        throw 'Password can not have white space';
    }
}

const createUser = async function createUser(firstname, lastname, email, username, password) {
    checkUserInfo(username, password);
    checkVariable('First name', firstname, 'string');
    checkVariable('Last name', lastname, 'string');
    checkVariable('Email', email, 'string');
    if ((/^[ ]+$/g).test(email.trim())) {
        throw 'Email can not have white space';
    }
    if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g).test(email.trim())) {
        throw 'Email must be in proper format';
    }
    const usersCollection = await users();
    const allUsernames = await usersCollection.find({}, { projection: { _id: 0, username: 1 } }).toArray();
    allUsernames.forEach(usernames => {
        usernames = usernames.username.toLowerCase();
        if (username.toLowerCase().trim() == usernames) {
            throw 'There is already a user with that username';
        }
    });
    const allEmails = await usersCollection.find({}, { projection: { _id: 0, email: 1 } }).toArray();
    allEmails.forEach(emails => {
        emails = emails.email.toLowerCase();
        if (email.toLowerCase().trim() == emails) {
            throw 'There is already a user with that email';
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
        comments: []
    };

    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw 'Can not add the user';

    return { userInserted: true };
}

const getUserById = async function getUserById(userId) {
    checkVariable('User ID', userId, 'string');
    const usersCollection = await users();
    userId = ObjectId(userId.trim());
    const user = await usersCollection.findOne({ _id: userId });
    if (user === null) throw 'No user with provided Id';
    user._id = user._id.toString();
    return user;
}

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

const updateUser = async function updateUser(id, userData) {
    checkVariable('Id', id, 'string');
    const usersCollection = await users();

    const updatedUserData = {};

    if (userData.firstName) {
        checkVariable('First name', userData,firstName, 'string');
        updatedUserData.firstName = userData.firstName.trirm();
    }

    if (userData.lastName) {
        checkVariable('Last name', userData.lastName, 'string');
        updatedUserData.lastName = userData.lastName.trim();
    }

    if (userData.email) {
        checkVariable('Email', userData.email, 'string');
        if ((/^[ ]+$/g).test(userData.email.trim())) {
            throw 'Email can not have white space';
        }
        if ((/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g).test(userData.email.trim())) {
            throw 'Email must be in proper format';
        }
        updatedUserData.email = userData.email.trim();
    }

    id=ObjectId(id.trim());
    const updatedUserInfo = await usersCollection.updateOne({ _id: id }, { $set: updatedUserData });
    if (updatedUserInfo.modifiedCount === 0) throw "Can not update user";

    return await this.getUserById(id);
}

const addToFavorite=async function(userId,recipeId){
    checkVariable('User Id', userId, 'string');
    checkVariable('Recipe Id',recipeId,'string');
    const usersCollection = await users();
    userId=ObjectId(userId.trim());
    recipeId=ObjectId(recipeId.trim());
    const updatedUserInfo=await usersCollection.updateOne({_id:userId},{$addToSet:{"favoriteRecipes":recipeId}})
    if (updatedUserInfo.modifiedCount === 0) throw "Can not update user";

    return await this.getUserById(id);
}

module.exports = {
    createUser,
    checkUser,
    getUserById,
    updateUser
};