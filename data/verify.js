const ObjectId = require('mongodb').ObjectId;

function isCheckString(valueName,string) {
    if (!string) throw `You must provide a ${valueName}`;
    if (typeof string !== 'string') throw `${valueName}'s type must be string`;
    if (string.trim() === "") throw `${valueName} don't empty spaces`;
    string = string.replace(/\s*/g, "");
    if (string.length < 3) throw `Input of ${valueName} must be at least 3 characters`;
    for (let i = 0; i < string.length; i++) {
        if (!string[i].match(/[a-zA-Z]/)) {
            throw `${valueName} just allow letters`
        }
    }
}

function isCheckTime(valueName,time) {
    if (!time) throw `You must provide ${valueName}`;
    if (typeof time !== 'number') throw `${valueName}'s type must be number`;
    if (time < 0 || time > 1440) throw `the ${valueName}'s range must be 0-1440`;
}

function isCheckObject(valueName,obj) {
    if (!obj) throw `You must provide ${valueName}`;
    if (Object.keys(obj).length === 0) throw `Don't allow empty ${valueName}`;
    if (typeof obj !== 'object') throw `${valueName}'s type must be object`;
    for (let i = 0; i < Object.keys(obj).length; i++) {
        isCheckKey(valueName,Object.keys(obj)[i]);
        isCheckValue(valueName,Object.values(obj)[i])
    }
}

function isCheckKey(valueName,key) {
    if (!key) throw `You must provide a key for ${valueName}`;
    if (typeof key !== 'string') throw `${valueName}'s key must be string`;
    if (key.trim() === "") throw `${valueName} don't empty spaces`;
    let key1 = key.replace(/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g, "")
    if (key1 === "") throw `${valueName}'s key can't be just special letters`;
    if (key.length < 3) throw `Input of ${valueName} must be at least 3 characters`;
    for (let i = 0; i < key.length; i++) {
        if (!key[i].match(/['a-zA-Z,-\s]/)) {
            throw `${valueName}'s name must only contain letters, space, single quotes, commas and dashes`;
        }
    }
}

function isCheckValue(valueName,value) {
    if (!value) throw `You must provide a value for ${valueName}`;
    if (typeof value !== 'string') throw `${valueName}'s value must be string`;
    if (value.trim() === "") throw `${valueName} don't empty spaces`;
    let value1 = value.replace(/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g, "")
    if (value1 === "") `${valueName}'s value can't be just special letters`;
    for (let i = 0; i < value.length; i++) {
        if (!value[i].match(/[!(){};'"0-9a-zA-Z,.-\s/]/)) {
            //console.log(value[i])
            throw `${valueName}'s value must only contain numbers, letters, space and special letters such as ( ' , " , ! , - , () , {} , ; , .)`;
        }
    }
}

function isCheckRecipeType(recipeType) {
    if (!recipeType) throw "You must provide a recipeType for recipe";
    if (typeof recipeType !== 'string') throw "recipeType must be string";
    if (recipeType.trim() === "") throw `recipe type don't allow empty or empty spaces`;
    recipeType = recipeType.replace(/\s*/g, "");
    let rightType = ["Breakfast","Lunch","Dinner","Snacks"]
    let flag = 1;
    for(let i = 0;i < rightType.length; i++){
        if(rightType[i].toLocaleLowerCase() == recipeType.toLocaleLowerCase()){
            flag = 0;
            break;
        }
    }
    if(flag === 1){
        throw "recipe type can just be one of Breakfast, Lunch, Dinner, Snacks";
    }
}

function isCheckSeason(season) {
    if (!season) throw "You must provide a season for recipe";
    if (typeof season !== 'string') throw "season must be string";
    if (season.trim() === "") throw `season don't allow empty or empty spaces`;
    season = season.replace(/\s*/g, "");
    let rightType = ["All","Spring","Summer","Fall","Winter"]
    let flag = 1;
    for(let i = 0;i < rightType.length; i++){
        if(rightType[i].toLocaleLowerCase() == season.toLocaleLowerCase()){
            flag = 0;
            break;
        }
    }
    if(flag === 1){
        throw "season type can just be one of All, Spring, Summer, Fall, Winter";
    }
}

function isCheckArray(valueName,arr) {
    if (!arr) throw `You must provide ${valueName}`;
    if (!Array.isArray(arr)) throw `${valueName}'s type shoule be array'`;
    if (arr.length === 0) throw `${valueName} cannot be empty`;
    for (let i = 0; i < arr.length; i++) {
        isCheckValue(valueName,arr[i]);
    }

}

function isCheckId(valueName,id) {
    if (!id) throw `You must provide ${valueName}`;
    if (typeof id !== 'string' && typeof id !== 'object') {
        throw `error ${valueName}, please input right data`;
    }
    id = id.toString();
    if (!ObjectId.isValid(id)) throw `error ${valueName} id`;
}

function isCheckText(valueName,text) {
    if (!text) throw `You must provide ${valueName}`;
    if (typeof text !== 'string') throw `type of ${valueName} must be string`;
    if (text.trim() === "") throw `${valueName} cannot be empty or only spaces`;
}
function isCheckEmail(email) {
    // Email according to RFC2822
    if (!email) throw "error email1";
    if (typeof email !== "string")
        throw "email type must be string";
    if (email.length === 0 || email.trim().length === 0)
        throw "email don't allow empty string or spaces";
    const emailRegex = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
    );
    if (!emailRegex.test(email)) {
        throw "email has error letters";
    }
};

module.exports = {
    isCheckString,
    isCheckTime,
    isCheckObject,
    isCheckRecipeType,
    isCheckId,
    isCheckArray,
    isCheckText,
    isCheckSeason,
    isCheckEmail
}