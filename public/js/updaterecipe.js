function isCheckString(valueName, string) {
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

function isCheckTime(valueName, time) {
    if (!time) throw `You must provide ${valueName}`;
    if (typeof time !== 'string') throw `${valueName}'s type is wrong`;
    if (time[0] == '-') throw `${valueName} doesn't allow negative numbers`;
    for (let i = 0; i < time.length; i++) {
        if (!time[i].match(/[0-9]/)) {
            throw `${valueName} just allow number`
        }
    }
    time = parseInt(time);
    if (time < 0 || time > 1440) throw `the ${valueName}'s range must be 0-1440`;
}

function isCheckObject(valueName, obj) {
    if (!obj) throw `You must provide ${valueName}`;
    if (Object.keys(obj).length === 0) throw `Don't allow empty ${valueName}`;
    if (typeof obj !== 'object') throw `${valueName}'s type must be object`;
    for (let i = 0; i < Object.keys(obj).length; i++) {
        isCheckKey(valueName, Object.keys(obj)[i]);
        isCheckValue(valueName, Object.values(obj)[i])
    }
}

function isCheckKey(valueName, key) {
    if (!key) throw `You must provide a name for ${valueName}`;
    if (typeof key !== 'string') throw `${valueName}'s name must be string`;
    if (key.trim() === "") throw `${valueName} doesn't empty spaces`;
    let key1 = key.replace(/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g, "")
    if (key1.length === 0) throw `${valueName} can't be just special letters`;
    if (key.length < 3) throw `Input of ${valueName} must be at least 3 characters`;
    for (let i = 0; i < key.length; i++) {
        if (!key[i].match(/['a-zA-Z,-\s]/)) {
            throw `${valueName}'s only contains letters, space, single quotes, commas and dashes`;
        }
    }
}

function isCheckValue(valueName, value) {
    if (!value) throw `You must provide a value for ${valueName}`;
    if (typeof value !== 'string') throw `${valueName}'s value must be string`;
    if (value.trim() === "") throw `${valueName} doesn't empty spaces`;
    let value1 = value.replace(/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g, "")
    if (value1.length === 0) throw `${valueName}'s value can't be just special letters`;
    for (let i = 0; i < value.length; i++) {
        if (!value[i].match(/[!(){};'"0-9a-zA-Z,.-\s/]/)) {
            throw `${valueName}'s value only contains numbers, letters, space and special letters such as ( ' , " , ! , - , () , {} , ; , .)`;
        }
    }
}

function isCheckRecipeType(recipeType) {
    if (!recipeType) throw "You must provide a recipeType for recipe";
    if (typeof recipeType !== 'string') throw "recipeType must be string";
    if (recipeType.trim() === "") throw `recipe type doesn't allow empty or empty spaces`;
    recipeType = recipeType.replace(/\s*/g, "");
    let rightType = ["Breakfast", "Lunch", "Dinner", "Snacks"]
    let flag = 1;
    for (let i = 0; i < rightType.length; i++) {
        if (rightType[i].toLocaleLowerCase() == recipeType.toLocaleLowerCase()) {
            flag = 0;
            break;
        }
    }
    if (flag === 1) {
        throw "recipe type can just be one of Breakfast, Lunch, Dinner, Snacks";
    }
}

function isCheckSeason(season) {
    if (!season) throw "You must provide a season for recipe";
    if (typeof season !== 'string') throw "season must be string";
    if (season.trim() === "") throw `season don't allow empty or empty spaces`;
    season = season.replace(/\s*/g, "");
    let rightType = ["All", "Spring", "Summer", "Fall", "Winter"]
    let flag = 1;
    for (let i = 0; i < rightType.length; i++) {
        if (rightType[i].toLocaleLowerCase() == season.toLocaleLowerCase()) {
            flag = 0;
            break;
        }
    }
    if (flag === 1) {
        throw "season type can just be one of All, Spring, Summer, Fall, Winter";
    }
}

function isCheckArray(valueName, arr) {
    if (!arr) throw `You must provide ${valueName}`;
    if (!Array.isArray(arr)) throw `${valueName}'s type shoule be array'`;
    if (arr.length === 0) throw `${valueName} cannot be empty`;
    for (let i = 0; i < arr.length; i++) {
        isCheckValue(valueName, arr[i]);
    }
}
(function ($) {
    $('#deleterecipe').on('click', function (event) {
        event.preventDefault();
        let requestConfig = {
            method: 'POST',
            url: '/user/delete/',
            contentType: 'application/json',
            data: JSON.stringify({
                recipeId: $('#id').val()
            })
        }
        $.ajax(requestConfig).then((response) => {
            location.replace('/user/private');
        });
    });

    var ingredientID = 0;
    $('#addIngredient').on('click', function (event) {
        event.preventDefault();
        console.log("Ingredient");
        ingredientID++;
        $('#ingredientsList').append(`<br>
        <label class="form-label ingredient" for="ingredientName`+ ingredientID + `"
            id="ingredientNameLabel0">Ingredient Name:</label>
        <br>
        <input class="form-control ingredientName" type="text" name="ingredientName"
            id="ingredientName`+ ingredientID + `">

        <label class="form-label ingredient" for="ingredientAmount`+ ingredientID + `"
            id="ingredientAmountLabel0">Amount:</label>
        <br>
        <input class="form-control ingredientAmount" type="text" name="ingredientAmount"
            id="ingredientAmount`+ ingredientID + `">`
        );
        if (ingredientID >= 1) {
            deleteIngredient.show();
        } else {
            deleteIngredient.hide();
        }
    });

    var foodGroupID = 0;
    $('#addFoodGroup').on('click', function (event) {
        event.preventDefault();
        foodGroupID++;
        $('#foodGroupList').append(
            `<br>
            <label class="form-label" for="foodGroup0" class="foodGroup" id="foodGroupLabel`+ foodGroupID + `">Food Group
                Name:</label>
            <br>
            <input class="form-control" type="text" name="foodGroup" class="foodGroup" id="foodGroup`+ foodGroupID + `">`
        )
        if (foodGroupID >= 1) {
            deleteFoodGroup.show();
        } else {
            deleteFoodGroup.hide();
        }
    });

    var nutritionDetailID = 0;
    $('#addNutritionDetail').on('click', function (event) {
        event.preventDefault();
        nutritionDetailID++;
        $('#nutritionDetailList').append(
            `<br>
<label class="form-label" for="nutritionDetailName`+ nutritionDetailID + `" class="nutritionDetail"
    id="nutritionDetailNameLabel`+ nutritionDetailID + `">Nutrition
    Name:</label>
<br>
<input class="form-control" type="text" name="nutritionDetailName" class="nutritionDetailName"
    id="nutritionDetailName`+ nutritionDetailID + `">

<label class="form-label" for="nutritionDetailAmount`+ nutritionDetailID + `" class="nutritionDetail"
    id="nutritionDetailAmountLabel`+ nutritionDetailID + `">Amount:</label>
<br>
<input class="form-control" type="text" name="nutritionDetailAmount" class="nutritionDetailAmount"
    id="nutritionDetailAmount`+ nutritionDetailID + `">`
        )
        if (nutritionDetailID >= 1) {
            deleteNutritionDetail.show();
        } else {
            deleteNutritionDetail.hide();
        }
    });

    var recipeStepID = 0;
    $('#addRecipeSteps').on('click', function (event) {
        event.preventDefault();
        recipeStepID++;
        $('#recipeStepsList').append(
            `<label class="form-label" for="recipeSteps` + recipeStepID + `" class="recipeSteps" id="recipeStepsLabel` + recipeStepID + `">Recipe
Step:</label>
<br>
<input class="form-control" type="text" name="recipeSteps" class="recipeSteps" id="recipeSteps`+ recipeStepID + `">
<br>`
        )
        if (recipeStepID >= 1) {
            deleteRecipeSteps.show();
        } else {
            deleteRecipeSteps.hide();
        }
    })
})(window.jQuery);