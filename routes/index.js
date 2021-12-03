const userRoutes = require('./log');
const path = require('path');

const constructorMethod = (app) => {
    app.use('/', userRoutes);
    
  
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Not found'});
    });
  };
  
  module.exports = constructorMethod;