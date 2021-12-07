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
    for (let i = 0; i < time.length; i++) {
        if (!time[i].match(/[0-9]/)) {
            throw `${valueName} just allow number`
        }
    }
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
    if (key1 === "") throw `${valueName} can't be just special letters`;
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
    if (value1 === "")`${valueName}'s value can't be just special letters`;
    for (let i = 0; i < value.length; i++) {
        if (!value[i].match(/[!(){};'"0-9a-zA-Z,.-\s/]/)) {
            //console.log(value[i])
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

function isCheckId(valueName, id) {
    if (!id) throw `You must provide ${valueName}`;
    if (typeof id !== 'string' && typeof id !== 'object') {
        throw `error ${valueName}, please input right data`;
    }
    if (!ObjectId.isValid(id)) throw `error ${valueName} id`;
}

function isCheckText(valueName, text) {
    if (!text) throw `You must provide ${valueName}`;
    if (typeof text !== 'string') throw `type of ${valueName} must be string`;
    if (text.trim() === "") throw `${valueName} cannot be empty or only spaces`;
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
            preparationTime= parseInt(preparationTime);
            isCheckTime("cookTime", cookTime);
            cookTime= parseInt(cookTime);
            isCheckRecipeType(recipeType);
            isCheckSeason(season);
            for (let i = 0; i <= foodGroupID; i++) {
                let foodGroupID = '#foodGroup' + i;
                isCheckValue("food group", $(foodGroupID).val())
                foodGroup.push($(foodGroupID).val());
            }

            isCheckArray("foodGroup", foodGroup);
            // console.log(1111)
            // console.log(foodGroup);
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
            errorDiv.show();
            errorDiv.html(e);
            ingredients = {};
            foodGroup = [];
            nutritionDetails = {};
            recipeSteps = [];
        }

    })

    var ingredientID = 0;
    addIngredient.on('click', function (event) {
        event.preventDefault();
        ingredientID++;
        ingredientsList.append(
            `<label for="ingredientName` + ingredientID + `" class="ingredient" id="ingredientNameLabel` + ingredientID + `">Please input ingredient name:
            <br>
            <input type="text" name="ingredientName" class="ingredientName" id="ingredientName`+ ingredientID + `">
            <br>
            </label>
            <label for="ingredientAmount`+ ingredientID + `" class="ingredient" id="ingredientAmountLabel` + ingredientID + `">Please enter the amount of ingredient
            <br>
            <input type="text" name="ingredientAmount" class="ingredientAmount" id="ingredientAmount`+ ingredientID + `">
            <br>
            </label>`
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
            `<label for="foodGroup0" class="foodGroup" id="foodGroupLabel` + foodGroupID + `">Please input food group name:
            <br>
            <input type="text" name="foodGroup" class="foodGroup" id="foodGroup`+ foodGroupID + `">
            <br>
            </label>`
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
            `<label for="nutritionDetailName` + nutritionDetailID + `" class="nutritionDetail" id="nutritionDetailNameLabel` + nutritionDetailID + `">Please input nutrition name:
            <br>
            <input type="text" name="nutritionDetailName" class="nutritionDetailName" id="nutritionDetailName`+ nutritionDetailID + `">
            <br>
            </label>
            <label for="nutritionDetailAmount`+ nutritionDetailID + `" class="nutritionDetail" id="nutritionDetailAmountLabel` + nutritionDetailID + `">Please enter the amount of nutrition
            <br>
            <input type="text" name="nutritionDetailAmount" class="nutritionDetailAmount" id="nutritionDetailAmount`+ nutritionDetailID + `">
            <br>
            </label>`
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
            `<label for="recipeSteps` + recipeStepID + `" class="recipeSteps" id="recipeStepsLabel` + recipeStepID + `">Please input recipe step:
            <br>
            <input type="text" name="recipeSteps" class="recipeSteps" id="recipeSteps`+ recipeStepID + `">
            <br>
            </label>`
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