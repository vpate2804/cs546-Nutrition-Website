const recipes = require('./data/recipes');
//const connect = require('./config/mongoConnection')
const connection = require('./config/mongoConnection')
const comments = require('./data/comments')
const main = async () => {
    // let newOne = await recipes.updateRecipe("619175c82777e6387f6d3a1f","Test2",{egg:2,suger:"1/4 cups"},10,5,"Breakfast",["Grains","meat"],"summer",{calories:"288",protein:"9.9g",carbohydrates:"28.4g",fat:"15.8g",cholesterol:"64.4g",sodium:"393mg"},["1.ssa","2.sss","3.ddd"]);
    // console.log(newOne);
    //let getOne = await recipes.removeRecipe('61917554145a353857b3b968');
    // try {
    //     let newOne = await recipes.createRecipe("text", {egg: "2", suger: "1/4 cups" }, 10, 5, "Breakfast", ["Grains"], "summer", { calories: "288", protein: "9.9g", carbohydrates: "28.4g", fat: "15.8g", cholesterol: "64.4g", sodium: "393mg" }, ["1.ssa", "2.sss", "3.ddd"]);
    //     console.log(newOne);
    // } catch(e) {
    //     console.log(e)
    // }
    // try {
    //     let newOne = await recipes.getRecipeById("619193560f50e8419abb312f");
    //     console.log(newOne);
    // } catch (error) {
    //     console.log(error)
    // }
    // try {
    //     let newOne = await recipes.updateRecipe("619193560f50e8419abb312f","textB", {egg: "2", suger: "1/4 cups" }, 10, 5, "Breakfast", ["Grains"], "summer", { calories: "288", protein: "9.9g", carbohydrates: "28.4g", fat: "15.8g", cholesterol: "64.4g", sodium: "393mg" }, ["1.ssa", "2.sss", "3.ddd"]);
    //     console.log(newOne);
    // } catch (error) {
    //     console.log(error)
    // }
    // try {
    //     let newOne = await recipes.updateRecipe("619193560f50e8419abb312f","textB", {egg: "2", suger: "1/4 cups" }, 10, 5, "Breakfast", ["Grains"], "summer", { calories: "288", protein: "9.9g", carbohydrates: "28.4g", fat: "15.8g", cholesterol: "64.4g", sodium: "393mg" }, ["1.ssa", "2.sss", "3.ddd"]);
    //     console.log(newOne);
    // } catch (error) {
    //     console.log(error)
    // }
    // try {
    //     let newOne = await recipes.removeRecipe("619193560f50e8419abb312f");
    //     console.log(newOne);
    // } catch (error) {
    //     console.log(error)
    // }
    //let getAll = await recipes.getAllRecipes()
    //console.log(getOne);
    // try {
    //     let newOne = await comments.createComment("6191957bb65f99424157cdc2","6191957bb65f99424157cdc3","123zxc");
        
    //     console.log(newOne);
    // } catch (error) {
    //     console.log(error)
    // }
    // try {
    //     let newOne = await comments.getAllCommentsByRecipeId("6191957bb65f99424157cdc2");
        
    //     console.log(newOne);
    // } catch (error) {
    //     console.log(error)
    // }
    // try {
    //     let newOne = await comments.getCommentById("61919a4d99656343e4f3cf55");
        
    //     console.log(newOne);
    // } catch (error) {
    //     console.log(error)
    // }
    try {
        let newOne = await comments.removeComment("61919a4d99656343e4f3cf55");
        
        console.log(newOne);
    } catch (error) {
        console.log(error)
    }
    const db = await connection();
    await db.serverConfig.close();
    console.log('Done!');
}

main().catch((error) => {
    console.log(error);
})