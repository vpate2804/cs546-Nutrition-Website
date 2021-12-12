const userRoutes = require("./log");
const userInfo = require("./user");
const allRoutes = require("./allrecipes");
const commentRoutes = require("./comment");
const ratingRoutes = require("./rating");
const { is } = require("express/lib/request");

const constructorMethod = (app) => {
  app.use("/", userRoutes);
  app.use("/user", userInfo);
  app.use("/all", allRoutes);
  app.use("/comment", commentRoutes);
  app.use("/rating", ratingRoutes);

  app.use("*", (req, res) => {
    let islogin = false;
    let username;
    if (req.session.user) {
      islogin = true;
      username = req.session.user;
    }
    res.status(404).render("404", { islogin, username });
  });
};

module.exports = constructorMethod;
