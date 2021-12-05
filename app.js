const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
//const multer = require("multer");

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  },
  partialsDir: ['views/partials/']
});


app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

const session = require('express-session')

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}));


app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/private', (req,res,next) => {
  if(!req.session.user){
    let title = "Error";
    let message = "You are not log in";
    res.status(403);
    res.render("error", { title: title, error: message });
  } else {
    next();
  }
});

app.use(async (req, res, next) => {
  let time = new Date().toUTCString();
  let method = req.method;
  let route = req.originalUrl;
  if (req.session.user) {
    let message = "Authenticated User";
    console.log(time + " " + method + " " + route + " " + message);
  } else {
    let message = "Non-Authenticated User";
    console.log(time + " " + method + " " + route + " " + message);
  }
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
