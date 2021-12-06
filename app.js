const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const session = require('express-session')

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}));



app.use('/private', (req, res, next) => {
  if (!req.session.user) {
    let title = "Error";
    let message = "You are not log in";
    res.status(403);
    res.render('error', { title: title, error: message });
  } else {
    next();
  }
});

// app.use(async(req,res,next) => {
//   let time = new Date().toUTCString();
//   let method = req.method;
//   let route = req.originalUrl;
//   if(req.session.user){
//     let message = "Authenticated User";
//     console.log(time+' '+method+' '+route+' '+message);
//   }else{
//     let message = "Non-Authenticated User";
//     console.log(time+' '+method+' '+route+' '+message);
//   }
//   next();
// });

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

// const comments = require('./data/comments');
// const recipes = require('./data/recipes');
// const connection = require('./config/mongoConnection');
// const main = async () => {
//   // let newcomments = await comments.createComment("6191957bb65f99424157cdc2", "61a29092e57721791c4758e7", "test")
//   // console.log(newcomments);
//   // name, ingredients, preparationTime, cookTime, recipeType,
//   //   foodGroup, season, nutritionDetails, recipeSteps
//   let newRecipes = await recipes.createRecipe("sadasd", { eggs: "2" }, 5, 10, "lunch", ["onn"], "spring",
//     { calories: "288" }, ["1sda", "2das"]);
//   //console.log(newRecipes);
//   const db = await connection();
//   await db.serverConfig.close();
//   console.log('Done!');

// }

// main().catch((error) => {
//   console.log(error);
// });