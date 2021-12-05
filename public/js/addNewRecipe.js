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
// const xss = require('xss');
(function ($) {
    let name = $('#name');
    let preparationTime = $('#preparationTime');
    let cookTime = $('#cookTime');
    let recipeType = $('#recipeType');
    let ingredientsList = $('#ingredientsList');
    let addIngredient = $('#addIngredient');
    let finished = $('#addFinished');
    let season = $('#season');
    let addFoodGroup = $('#addFoodGroup');
    let foodGroupList = $('#foodGroupList');
    let nutritionDetailList = $('#nutritionDetailList');
    let addNutritionDetail = $('#addNutritionDetail');
    let recipeStepsList = $('#recipeStepsList');
    let addRecipeSteps = $('#addRecipeSteps');
    let errorDiv = $('#error');

    let ingredients = {};
    let foodGroup = [];
    let nutritionDetails = {};
    let recipeSteps = [];
    finished.on('click', function (event) {
        event.preventDefault();
        try {
            errorDiv.hide();
            name = $('#name').val();
            preparationTime = parseInt($('#preparationTime').val());
            cookTime = parseInt($('#cookTime').val());
            recipeType = recipeType.val();
            season = season.val();
            for (let i = 0; i <= ingredientID; i++) {
                let ingredientNameID = '#ingredientName' + i;
                let ingredientAmountID = '#ingredientAmount' + i;
                ingredients[$(ingredientNameID).val()] = $(ingredientAmountID).val();
            }
            for (let i = 0; i <= foodGroupID; i++) {
                let foodGroupID = '#foodGroup' + i;
                foodGroup.push($(foodGroupID).val());
            }
            for (let i = 0; i <= nutritionDetailID; i++) {
                let nutritionDetailNameID = '#nutritionDetailName' + i;
                let nutritionDetailAmountID = '#nutritionDetailAmount' + i;
                nutritionDetails[$(nutritionDetailNameID).val()] = $(nutritionDetailAmountID).val();
            }
            for (let i = 0; i <= recipeStepID; i++) {
                let recipeStepID = '#recipeSteps' + i;
                recipeSteps.push($(recipeStepID).val());
            }
            isCheckString(name);
            isCheckObject(ingredients);
            isCheckTime(preparationTime);
            isCheckTime(cookTime);
            isCheckString(recipeType);
            isCheckString(season);
            isCheckArray(foodGroup);
            isCheckObject(nutritionDetails);
            isCheckArray(recipeSteps);
            $.post('/user/addNewRecipe', {
                name: name,
                ingredients: ingredients,
                preparationTime: preparationTime,
                cookTime: cookTime,
                recipeType: recipeType,
                foodGroup: foodGroup,
                season: season,
                nutritionDetails: nutritionDetails,
                recipeSteps: recipeSteps,
            }).then(res => {
                location.replace('/user/private')
            });
        } catch (e) {
            //location.replace('/user/addNewRecipe')
            errorDiv.show();
            errorDiv.html(e);
        }

    })

    var ingredientID = 0;
    addIngredient.on('click', function (event) {
        event.preventDefault();
        ingredientID++;
        ingredientsList.append(
            `<label for="ingredientName` + ingredientID + `" class="ingredient">Please input ingredient name:</label>
            </br>
            <input type="text" name="ingredientName" class="ingredientName" id="ingredientName`+ ingredientID + `"></input>
            </br>
            <label for="ingredientAmount`+ ingredientID + `" class="ingredient">Please enter the amount of ingredient</label>
            </br>
            <input type="text" name="ingredientAmount" class="ingredientAmount" id="ingredientAmount`+ ingredientID + `"></input>
            </br>`
        )
    })

    var foodGroupID = 0;
    addFoodGroup.on('click', function (event) {
        event.preventDefault();
        foodGroupID++;
        foodGroupList.append(
            `<label for="foodGroup0" class="foodGroup">Please input food group name:</label>
            </br>
            <input type="text" name="foodGroup" class="foodGroup" id="foodGroup`+ foodGroupID + `"></input>
            </br>`
        )
    })

    var nutritionDetailID = 0;
    addNutritionDetail.on('click', function (event) {
        event.preventDefault();
        nutritionDetailID++;
        nutritionDetailList.append(
            `<label for="nutritionDetailName` + nutritionDetailID + `" class="nutritionDetail">Please input nutrition name:</label>
            </br>
            <input type="text" name="nutritionDetailName" class="nutritionDetailName" id="nutritionDetailName`+ nutritionDetailID + `"></input>
            </br>
            <label for="nutritionDetailAmount`+ nutritionDetailID + `" class="nutritionDetail">Please enter the amount of nutrition</label>
            </br>
            <input type="text" name="nutritionDetailAmount" class="nutritionDetailAmount" id="nutritionDetailAmount`+ nutritionDetailID + `"></input>
            </br>`
        )
    })

    var recipeStepID = 0;
    addRecipeSteps.on('click', function (event) {
        event.preventDefault();
        recipeStepID++;
        recipeStepsList.append(
            `<label for="recipeSteps` + recipeStepID + `" class="recipeSteps">Please input recipe step:</label>
            </br>
            <input type="text" name="recipeSteps" class="recipeSteps" id="recipeSteps`+ recipeStepID + `"></input>
            </br>`
        )
    })

})(window.jQuery);