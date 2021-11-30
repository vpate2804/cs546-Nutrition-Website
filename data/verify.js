
const ObjectId = require('mongodb').ObjectId;

function isCheckString(string) {
    if (!string) throw "You must provide a value";
    if (typeof string !== 'string') throw "error string1";
    if (string.trim() === "") throw "error string2";
    string = string.replace(/\s*/g, "");
    for (let i = 0; i < string.length; i++) {
        if (!string[i].match(/[a-zA-Z]/)) {
            throw "error string3"
        }
    }
}
function isCheckTime(time) {
    if (!time) throw "You must provide a time for recipe";
    if (typeof time !== 'number') throw "error time";
    if (time < 0 || time > 1440) throw "error time";
}

function isCheckObject(obj) {
    if (!obj) throw "You must provide a list of object";

    if (Object.keys(obj).length === 0) throw "error object";
    if (typeof obj !== 'object') throw "error object";
    for (let i = 0; i < Object.keys(obj).length; i++) {
        isCheckKey(Object.keys(obj)[i]);
        isCheckValue(Object.values(obj)[i])
    }

}

function isCheckKey(key) {
    if (!key) throw "You must provide a key for recipe";
    if (typeof key !== 'string') throw "error key";
    let key1 = key.replace(/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g, "")
    if (key1 === "") throw "error key";
    if (key.length < 3) throw "error key";
    for (let i = 0; i < key.length; i++) {
        //if(key[i]>='0'&&key[i]<='9') throw "error key";
        if (!key[i].match(/[a-zA-Z,-\s]/)) {
            throw "error name"
        }
    }
}

function isCheckValue(value) {
    if (!value) throw "You must provide a value for recipe";
    if (typeof value !== 'string') throw "error value1";
    let value1 = value.replace(/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g, "")
    if (value1 === "") throw "error value2";
    //if (value.length < 3) throw "error value3";
    for (let i = 0; i < value.length; i++) {
        //if(key[i]>='0'&&key[i]<='9') throw "error key";
        if (!value[i].match(/[0-9a-zA-Z,.-\s/]/)) {
            console.log(value[i])
            throw "error value4"
        }
    }
}

function isCheckRecipeType(recipeType) {
    if (!recipeType) throw "You must provide a recipeType for recipe";
    if (typeof recipeType !== 'string') throw "error recipeType";
    if (recipeType.trim() === "") throw "error recipeType";
    recipeType = recipeType.replace(/\s*/g, "");
    for (let i = 0; i < recipeType.length; i++) {
        if (!recipeType[i].match(/[a-zA-Z]/)) {
            throw "error recipeType"
        }
    }
}

function isCheckArray(arr) {
    if (!arr) throw "You must provide some data for array";
    if (!Array.isArray(arr)) throw "error array";
    if (arr.length === 0) throw "error array"
    for (let i = 0; i < arr.length; i++) {
        isCheckValue(arr[i]);
    }

}

function isCheckId(id) {
    if (!id) throw "You must provide an ID"
    if (typeof id !== 'string' && typeof id !== 'object') {
        throw 'error id, please input right data'
    }
    if (!ObjectId.isValid(id)) throw "error id";
}

function isCheckText(text) {
    if (!text) throw "You must provide a text";
    if (typeof text !== 'string') throw "error text"
    if (text.trim() === "") throw "error"

}

module.exports = {
    isCheckString,
    isCheckTime,
    isCheckObject,
    isCheckRecipeType,
    isCheckId,
    isCheckArray,
    isCheckText
}
