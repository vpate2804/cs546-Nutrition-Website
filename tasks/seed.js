const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const recipes = data.recipes;
const users = data.users;

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
  
    const firstuser=await users.createUser('Vishala','Patel','vishalapatel@gmail.com','vishalapatel','vishala1234');
    const seconduser=await users.createUser('Mihir','Joshi','mihirjoshi@gmail.com','mihirjoshi','mihir567');
    const thirduser=await users.createUser('Oukan','Xu','oukanxu@gmail.com','oukanxu','oukan584');
    const forthuser=await users.createUser('Jiakang','Liang','jiakangliang@gmail.com','jiakangliang','jk5647');
    await recipes.createRecipe('Walnut Rugelach',
                {
                    "all-purpose flour": "1 1/4 cups",
                    "baking powder": "1/4 teaspoon",
                    "salt": "1/4 teaspoon",
                    "white sugar": "1/4 cups",
                    "unsalted butter": "3 tablespoons",
                    "cream cheese, softened": "3 tablespoons",
                    "egg yolk": "1",
                    "vaniila extract": "1/2 teaspoon",
                    "egg white": "1",
                    "ground walnuts": "1 cup",
                    "white sugar": "1/2 cup",
                    "confectioners' sugar, ore more as needed": "1 tablespoon"
                },30,15,"Dinner",["Nuts"],"Spring",
                {
                    "calories": "62",
                    "protein": "1.1g",
                    "carbohydrates": "8.1g",
                    "fat": "3g",
                    "cholesterol": "9.6mg",
                    "sodium": "25.1mg"
                },
                ["Sift flour, baking powder, and salt together onto a sheet of waxed paper.",
                    "Beat 1/4 cup white sugar, butter, and cream cheese together in a bowl with an electric mixer until creamy. Beat in egg yolk and vanilla.",
                    "Stir flour mixture into butter mixture until dough is just combined. Divide dough into 3 equal portions; shape each portion into a disk, wrap disks in plastic wrap, and refrigerate for at least 4 hours or overnight.",
                    "Beat egg white in a bowl with an electric mixture until frothy. Mix walnuts and 1/2 cup white sugar into egg white.", "Preheat oven to 350 degrees F (175 degrees C).",
                    "Remove dough from plastic wrap and roll each disk out into a 7-inch circle. Spread 1/3 the egg white mixture onto each dough circle, leaving a 1/4-inch border around the edge of each circle. Cut each circle into 12 wedges. Roll up each wedge from the edge to the point and place, point-side down, on a baking sheet.",
                    "Bake in the preheated oven until lightly browned, 12 to 14 minutes. Transfer to wire racks to cool and dust with confectioners' sugar."],firstuser._id);
    console.log('Done seeding database');
  
    await db.serverConfig.close();
  }
  
  main();
