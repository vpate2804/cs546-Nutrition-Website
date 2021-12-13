const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const recipes = data.recipes;
const comments = data.comments;
const users = data.users;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  try {
    const firstuser = await users.createUser(
      "Vishala",
      "Patel",
      "vishalapatel@gmail.com",
      "vishalapatel",
      "vishala1234"
    );
    const seconduser = await users.createUser(
      "Mihir",
      "Joshi",
      "mihirjoshi@gmail.com",
      "mihir",
      "123456"
    );
    const thirduser = await users.createUser(
      "Oukan",
      "Xu",
      "oukanxu@gmail.com",
      "oukanxu",
      "oukan584"
    );
    const fourthuser = await users.createUser(
      "Jiakang",
      "Liang",
      "jiakangliang@gmail.com",
      "jiakangliang",
      "jk5647"
    );
    await recipes.createRecipe(
      "Walnut Rugelach",
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
        "confectioners' sugar, ore more as needed": "1 tablespoon",
      },
      30,
      15,
      "Dinner",
      ["Nuts"],
      "Spring",
      {
        calories: "62",
        protein: "1.1g",
        carbohydrates: "8.1g",
        fat: "3g",
        cholesterol: "9.6mg",
        sodium: "25.1mg",
      },
      [
        "Sift flour, baking powder, and salt together onto a sheet of waxed paper.",
        "Beat 1/4 cup white sugar, butter, and cream cheese together in a bowl with an electric mixer until creamy. Beat in egg yolk and vanilla.",
        "Stir flour mixture into butter mixture until dough is just combined. Divide dough into 3 equal portions; shape each portion into a disk, wrap disks in plastic wrap, and refrigerate for at least 4 hours or overnight.",
        "Beat egg white in a bowl with an electric mixture until frothy. Mix walnuts and 1/2 cup white sugar into egg white.",
        "Preheat oven to 350 degrees F (175 degrees C).",
        "Remove dough from plastic wrap and roll each disk out into a 7-inch circle. Spread 1/3 the egg white mixture onto each dough circle, leaving a 1/4-inch border around the edge of each circle. Cut each circle into 12 wedges. Roll up each wedge from the edge to the point and place, point-side down, on a baking sheet.",
        "Bake in the preheated oven until lightly browned, 12 to 14 minutes. Transfer to wire racks to cool and dust with confectioners' sugar.",
      ],
      firstuser.id.toString()
    );
    //console.log('Done seeding database');

    await recipes.createRecipe(
      "Braised pork",
      {
        "Pork Belly": "300 grams",
        "Quail eggs": "15 pcs",
        "Ginger": "3 slices",
        "Leek": "About 10 cm",
        "Garlic": "5 cloves",
        "Sichuan Pepper": "Abt 20 pcs",
        "Star Anise": "2 pcs",
        "Cinnamon": "1 stick",
        "Cumin Seeds": "1 teaspoon",
        "Dried Chillies": "3 small pcs",
        "Rock sugar": "	Abt 20 grams",
        "Chinese cooking wine": "3 tablespoons",
        "Light Soya Sauce": "3 tablespoons",
        "Dark Soya Sauce": "1 tablespoons",
        "Chinese vinegar": "	1-2 teaspoons",
        "Oil": "1 tablespoon",
        "Salt": "To Taste",
      },
      60,
      30,
      "Lunch",
      ["Pork"],
      "Summer",
      {
        calories: "62",
        protein: "1.1g",
        fat: "3g",
      },
      [
        "Choose a pork belly with fat and lean ratio of about 3 and 7. Cut pork belly into pieces",
        "Boil water in a small pot, put in the pork belly, 1 slice of ginger, 1 tablespoon of Chinese cooking wine. After bringing the water to boil, cook for another 5 mins.",
        "Take out the pork belly, rinse well and drained. Discard the ginger slice.",
        "Prepare all the spices, rock sugar and ginger, garlic and leek.",
        "Heat a frying pan, put 1 tablespoon of oil, put in the rock sugar and stir fry it until it melts and turns golden.",
        "Put in the pork belly and stir fry it until brown, fully coated with caramelized sugar.",
        "Put in the spices and stir fry.",
        "Put in the ginger, garlic and leek and stir fry until fragrant. Then sprinkle 1 tablespoon of Chinese cooking wine.",
        "Put in the soya sauce and Chinese vinegar, stir fry.",
        "Add water until about 3 cm above the pork, bring it to boil, and then reduce to low heat and stew for 1 hour.",
        "Boil the quail eggs and peel off the shell.",
        "After stewing the pork for 1 hour, add in the cooked quail eggs, continue to stew it with medium heat for about 30 mins.",
        "Until sauce thickens, add some salt if needed. Ready to serve.",
      ],
      fourthuser.id.toString()
    );
    await recipes.createRecipe(
      "Fried Egg",
      {
        Egg: "2",
        Oil: "1 tablespoon",
        Salt: "To Taste",
      },
      1,
      5,
      "Breakfast",
      ["Egg"],
      "Fall",
      {
        calories: "62",
        protein: "1.1g",
      },
      [
        "Add oil to the pot and heat it up.",
        "Break the egg shell and then pour the egg.",
        "Fry for a minute and a half, add some salt, and turn it over.",
        "Fry for another minute and then take it out of the pan.",
      ],
      seconduser.id.toString()
    );
    await recipes.createRecipe(
      "Tomato scrambled eggs",
      {
        Egg: "3-4",
        Oil: "1 tablespoon",
        Salt: "To Taste",
        Tomatoe: "2",
        Pepper: "To Taste",
      },
      1,
      5,
      "Dinner",
      ["Egg"],
      "Winter",
      {
        calories: "62k",
        protein: "3g",
        Vitamins: "30mg",
      },
      [
        "Scramble the eggs and slice the tomatoes (some peel them, but I think it is too much trouble)",
        "Heat your pan, then heat 2 tbs oil. Add the eggs and cook done, then remove from pan.",
        "Add a bit more oil if needed, then the tomateos, cook the tomatoes til they are soft and fragrant.",
        "Add the eggs to the tomatoes and stir everything together, then add salt and pepper.",
      ],
      seconduser.id.toString()
    );
    await recipes.createRecipe(
      "Creme Caramel",
      {
        "Caster sugar": "150 g",
        water: "50 m",
        "whole milk": "250 ml ",
        vanilla: "1 teaspoon ",
        egg: "2",
      },
      10,
      50,
      "Snacks",
      ["Egg", "Milk"],
      "All",
      {
        calories: "62k",
        protein: "3g",
        calcium: "5mg",
      },
      [
        "Put sugar and water in a saucepan, heating up until the syrup becomes golden brown. Stir occasionally. ",
        "When you pour the syrup into ice water it should form a ball, indicating the correct consistency.",
        "Pour the caramelized syrup evenly into moulds and then let it cool.",
        "Preheat the oven 150c",
        "Add the milk and vanilla into a saucepan and bring it to simmer.",
        "In a large bowl, whisk the eggs, sugar, and vanilla extract. Pour the warm milk into egg mixture slowly and stir constantly.",
        "Strain the custard immediately, pour custard evenly into moulds.",
        "Bake the creme caramel in a water bath to keep the oven moisture high and the heat gentle. Bake for 25-35 minutes. When the surface of creme caramel solidifies, it is done.",
      ],
      firstuser.id.toString()
    );

    await recipes.createRecipe('Christmas terrine',
      {
        "Caster sugar": "150 g",
        "juice": "50 m",
        "whole milk": "250 ml ",
        "vanilla": "1 teaspoon ",
        "egg": "2"
      }, 10, 40, "Snacks", ["Beef", "Milk"], "All",
      {
        "calories": "62k",
        "protein": "3g",
        "calcium": "5mg"
      },
      [
        "Preheat the oven to gas 4. Line a 2lb loaf tin with 2 large sheets of clingfilm, one across and one lengthways, with plenty overhanging the sides. Taking 2 x 84g packs of prosciutto, use a third of the prosciutto to line the base and one side of the tin, leaving enough overhang to cover the top later. Use the plastic sheets from the prosciutto packet to press it down, then repeat with the remaining prosciutto to cover the other side and ends of the tin, using spare pieces to patch any holes. ",
        "When you pour the syrup into ice water it should form a ball, indicating the correct consistency.",
        "Put a third of the filling in the base of the lined loaf tin. Add 150g diced chicken, followed by another third of the filling, another 150g diced chicken, and finally the last of the filling. Fold the prosciutto over the top.",
        "Preheat the oven 150c",
        "Add the milk and vanilla into a saucepan and bring it to simmer.",
        "Once the terrine is cooked, remove the loaf tin from the bain-marie and transfer to a large plate. If you have another loaf tin the same size, place this on top, or cut a piece of cardboard to fit. Top with heavy weights (such as a few tins of beans) and leave to cool to room temperature. Transfer to the fridge and leave overnight with the weights still on top.",
        "Strain the custard immediately, pour custard evenly into moulds.",
        "Bake the creme caramel in a water bath to keep the oven moisture high and the heat gentle. Bake for 25-35 minutes. When the surface of creme caramel solidifies, it is done."
      ], fourthuser.id.toString());

    await recipes.createRecipe('Boiled Egg',
      {
        "Egg": "2",
        "Oil": "1 tablespoon",
        "Salt": "To Taste"
      }, 1, 10, "Breakfast", ["Egg"], "All",
      {
        "calories": "62",
        "protein": "1.1g",
      },
      [
        "Heat a bottle of water",
        "Put eggs into boiled water and wait for 10 minutes"
      ], fourthuser.id.toString());
    await recipes.createRecipe('Pepper scrambled eggs',
      {
        "Egg": "3-4",
        "Oil": "1 tablespoon",
        "Salt": "To Taste",
        "Potato": "2",
        "Pepper": "To Taste"
      }, 1, 5, "Dinner", ["Egg"], "All",
      {
        "calories": "62k",
        "protein": "3g",
        "Vitamins": "30mg"
      },
      [
        "scramble the eggs and slice the Potatoes (some peel them, but I think it is too much trouble)",
        "Heat your pan, then heat 2 tbs oil. Add the eggs and cook done, then remove from pan.",
        "Add a bit more oil if needed, then the Potatoes, cook the tomatoes til they are soft and fragrant.",
        "Add the eggs to the Potatoes and stir everything together, then add salt and pepper."
      ], fourthuser.id.toString());

    await recipes.createRecipe('Potato scrambled eggs',
      {
        "Egg": "3-4",
        "Oil": "1 tablespoon",
        "Salt": "To Taste",
        "Pepper": "To Taste"
      }, 1, 5, "Dinner", ["Egg"], "All",
      {
        "calories": "62k",
        "protein": "3g",
        "Vitamins": "30mg"
      },
      [
        "scramble the eggs",
        "Heat your pan, then heat 2 tbs oil. Add the eggs and cook done, then remove from pan.",
        "Add a bit more oil if needed, cook the tomatoes til they are soft and fragrant.",
        "Add the eggs and stir everything together, then add salt and pepper."
      ], fourthuser.id.toString());
    await recipes.createRecipe('Cheese Fritters',
      {
        "drained cottage cheese": "1 cup",
        "egg": "1",
        "half-and-half": "1/4 cup",
        "all-purpose flour": "1 cup",
        "baking powder": "1 3/4 teaspoons",
        "salt": "1/4 teaspoon",
        "white sugar": "2 tablespoons",
        "ground nutmeg": "1 teaspoon",
        "vegetable oil for frying": "4 cups",
        "confectioners' sugar": "3 tablespoons"
      }, 15, 10, "Breakfast", ["Carbs", "Eggs"], "Winter",
      {
        "calories": "883",
        "protein": "4.9g",
        "carbohydrates": "15.7g",
        "fat": "90.4g",
        "cholesterol": "24.2mg",
        "sodium": "244.4mg"
      },
      [
        "In a medium bowl, beat the cottage cheese and egg together. Stir in the half-and-half, flour, baking powder, salt, sugar and nutmeg. Mix until just combined.",
        "Fill a deep pot to the 2-inch mark with oil. Heat to 375 degrees F (190 degrees C).",
        "Drop batter by rounded tablespoons into the hot oil. Fry until golden brown on all sides, about 3 to 4 minutes.",
        "Drain on paper towels and sprinkle with confectioners' sugar. Serve hot!"
      ], firstuser.id.toString());
      await recipes.createRecipe('Peanut Butter',{
        "peanut":"2 cups"
      },15,5,"Breakfast",["Protein"],"All",
      {
        "protein":"7g",
        "calories":"299",
        "cholestrol":"25.4mg"
      },[
        "Roast the peanut in baking tray",
        "Cool it down to room temprature",
        "Churn it into food processor"
      ],firstuser.id.toString());
    await db.serverConfig.close();
  }
  catch (e) {
    console.log(e);
  }
}

main();