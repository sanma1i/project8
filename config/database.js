const Sequelize = require('sequelize');
module.export = new Sequelize({
    host: 'localhost',
    dialect: 'sqlite',
    storage: './library.db'
});