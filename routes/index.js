const userRoutes = require('./log');
const allRoutes = require("./allrecipes");
const path = require('path');

const constructorMethod = (app) => {
    app.use('/', userRoutes);
    app.use('/all', allRoutes);
  
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Not found'});
    });
  };
  
  module.exports = constructorMethod;