const Sequelise = require('sequelize')
const config = require('config')

module.exports = new Sequelise(
    config.get('mysql.database'),
    config.get('mysql.user'),
    config.get('mysql.password'),
    {
        host: config.get('mysql.host'),
        dialect: 'mysql'
    }
)