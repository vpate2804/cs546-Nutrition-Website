const userRoutes = require('./log');
const userInfo = require('./user')
const allRoutes = require("./allrecipes");
const commentRoutes=require('./comment');

const constructorMethod = (app) => {
    app.use('/', userRoutes);
    app.use('/user', userInfo);
    app.use('/all', allRoutes);
    app.use('/comment',commentRoutes);
  
    app.use('*', (req, res) => {
      res.status(404).render('404'); 
    });
  };
  
  module.exports = constructorMethod;