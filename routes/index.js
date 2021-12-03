const userRoutes = require('./log');
const userInfo = require('./user')
//const path = require('path');

const constructorMethod = (app) => {
    app.use('/', userRoutes);
    app.use('/user', userInfo);
  
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Not found'});
    });
  };
  
  module.exports = constructorMethod;