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

    let deleteIngredient = $('#deleteIngredient');
    let deleteFoodGroup = $('#deleteFoodGroup');
    let deleteNutritionDetail = $('#deleteNutritionDetail');
    let deleteRecipeSteps = $('#deleteRecipeSteps');

    let ingredients = {};
    let foodGroup = [];
    let nutritionDetails = {};
    let recipeSteps = [];

    finished.on('click', function (event) {
        event.preventDefault();
        try {
            errorDiv.hide();
            name = $('#name').val();
            preparationTime = $('#preparationTime').val();
            cookTime = $('#cookTime').val();
            recipeType = $('#recipeType').val();
            season = $('#season').val();
            isCheckString("recipe name", name);
            for (let i = 0; i <= ingredientID; i++) {
                let ingredientNameID = '#ingredientName' + i;
                let ingredientAmountID = '#ingredientAmount' + i;
                isCheckKey("ingredient name", $(ingredientNameID).val());
                isCheckValue("ingredient value", $(ingredientAmountID).val());
                ingredients[$(ingredientNameID).val()] = $(ingredientAmountID).val();
            }
            isCheckObject("ingredients", ingredients);
            isCheckTime("preparationTime", preparationTime);
            preparationTime = parseInt(preparationTime);
            isCheckTime("cookTime", cookTime);
            cookTime = parseInt(cookTime);
            isCheckRecipeType(recipeType);
            isCheckSeason(season);
            for (let i = 0; i <= foodGroupID; i++) {
                let foodGroupID = '#foodGroup' + i;
                isCheckValue("food group", $(foodGroupID).val())
                foodGroup.push($(foodGroupID).val());
            }

            isCheckArray("foodGroup", foodGroup);
            for (let i = 0; i <= nutritionDetailID; i++) {
                let nutritionDetailNameID = '#nutritionDetailName' + i;
                let nutritionDetailAmountID = '#nutritionDetailAmount' + i;
                isCheckKey("nutrition detail", $(nutritionDetailNameID).val());
                isCheckValue("nutrition detail", $(nutritionDetailAmountID).val());
                nutritionDetails[$(nutritionDetailNameID).val()] = $(nutritionDetailAmountID).val();
            }
            isCheckObject("nutritionDetails", nutritionDetails);
            for (let i = 0; i <= recipeStepID; i++) {
                let recipeStepID = '#recipeSteps' + i;
                isCheckValue("recipe step", $(recipeStepID).val())
                recipeSteps.push($(recipeStepID).val());
            }
            isCheckArray("recipeSteps", recipeSteps);
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
            console.log(e);
            errorDiv.show();
            errorDiv.html(e);
            ingredients = {};
            foodGroup = [];
            nutritionDetails = {};
            recipeSteps = [];
        }
    });

    var ingredientID = 0;
    addIngredient.on('click', function (event) {
        event.preventDefault();
        ingredientID++;
        ingredientsList.append(
            `<br><label class="form-label ingredient" for="ingredientName`+ ingredientID + `"
                id="ingredientNameLabel`+ ingredientID + `">Ingredient Name:</label>
            <br>
            <input class="form-control ingredientName" type="text" name="ingredientName"
                id="ingredientName`+ ingredientID + `">
            <label class="form-label ingredient" for="ingredientAmount`+ ingredientID + `"
                id="ingredientAmountLabel`+ ingredientID + `">Amount:</label>
            <br>
            <input class="form-control ingredientAmount" type="text" name="ingredientAmount"
                id="ingredientAmount`+ ingredientID + `">`
        )
        if (ingredientID >= 1) {
            deleteIngredient.show();
        } else {
            deleteIngredient.hide();
        }
    })
    deleteIngredient.on('click', function (event) {
        event.preventDefault();
        let ingredientNameLabelID = '#ingredientNameLabel' + ingredientID;
        let ingredientAmountLabelID = '#ingredientAmountLabel' + ingredientID;
        $(ingredientNameLabelID).remove();
        $(ingredientAmountLabelID).remove();
        ingredientID--;
        if (ingredientID >= 1) {
            deleteIngredient.show();
        } else {
            deleteIngredient.hide();
        }
    })


    var foodGroupID = 0;
    addFoodGroup.on('click', function (event) {
        event.preventDefault();
        foodGroupID++;
        foodGroupList.append(
            `<br><label class="form-label foodGroup" for="foodGroup0" id="foodGroupLabel`+ foodGroupID + `">Food GroupName:</label>
            <br>
            <input class="form-control foodGroup" type="text" class="foodGroup" id="foodGroup`+ foodGroupID + `">`
        )
        if (foodGroupID >= 1) {
            deleteFoodGroup.show();
        } else {
            deleteFoodGroup.hide();
        }
    })
    deleteFoodGroup.on('click', function (event) {
        event.preventDefault();
        let foodGroupLabelID = '#foodGroupLabel' + foodGroupID;
        $(foodGroupLabelID).remove();
        foodGroupID--;
        if (foodGroupID >= 1) {
            deleteFoodGroup.show();
        } else {
            deleteFoodGroup.hide();
        }
    })

    var nutritionDetailID = 0;
    addNutritionDetail.on('click', function (event) {
        event.preventDefault();
        nutritionDetailID++;
        nutritionDetailList.append(
            `<br><label class="form-label nutritionDetail" for="nutritionDetailName`+ nutritionDetailID + `"id="nutritionDetailNameLabel`+ nutritionDetailID + `">NutritionName:</label>
            <br>
            <input class="form-control nutritionDetailName" type="text" name="nutritionDetailName" id="nutritionDetailName`+ nutritionDetailID + `">
            <label class="form-label nutritionDetail" for="nutritionDetailAmount`+ nutritionDetailID + `" id="nutritionDetailAmountLabel`+ nutritionDetailID + `">Amount:</label>
            <br>
            <input class="form-control nutritionDetailAmount" type="text" name="nutritionDetailAmount" id="nutritionDetailAmount`+ nutritionDetailID + `">`
        )
        if (nutritionDetailID >= 1) {
            deleteNutritionDetail.show();
        } else {
            deleteNutritionDetail.hide();
        }
    })
    deleteNutritionDetail.on('click', function (event) {
        event.preventDefault();
        let nutritionDetailNameLabelID = '#nutritionDetailNameLabel' + nutritionDetailID;
        let nutritionDetailAmountLabeID = '#nutritionDetailAmountLabel' + nutritionDetailID;
        $(nutritionDetailNameLabelID).remove();
        $(nutritionDetailAmountLabeID).remove();
        nutritionDetailID--;
        if (nutritionDetailID >= 1) {
            deleteNutritionDetail.show();
        } else {
            deleteNutritionDetail.hide();
        }
    })

    var recipeStepID = 0;
    addRecipeSteps.on('click', function (event) {
        event.preventDefault();
        recipeStepID++;
        recipeStepsList.append(
            `<br><label class="form-label recipeSteps" for="recipeSteps0" id="recipeStepsLabel`+ recipeStepID + `">RecipeStep:</label>
            <br>
            <input class="form-control recipeSteps" type="text" name="recipeSteps" id="recipeSteps`+ recipeStepID + `">`
        )
        if (recipeStepID >= 1) {
            deleteRecipeSteps.show();
        } else {
            deleteRecipeSteps.hide();
        }
    })
    deleteRecipeSteps.on('click', function (event) {
        event.preventDefault();
        let recipeStepsLabelID = '#recipeStepsLabel' + recipeStepID;
        $(recipeStepsLabelID).remove();
        recipeStepID--;
        if (recipeStepID >= 1) {
            deleteRecipeSteps.show();
        } else {
            deleteRecipeSteps.hide();
        }
    })
})(window.jQuery);