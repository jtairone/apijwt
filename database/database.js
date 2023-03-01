const Sequelize = require('sequelize')
const connection = new Sequelize({
    dialect: 'sqlite',
    storage: './database/database.sqlite',
    logging: false //não ficar mostrando as execuções no terminal
})

module.exports = connection