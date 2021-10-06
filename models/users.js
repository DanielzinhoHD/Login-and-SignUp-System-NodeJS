const Sequelize = require('sequelize');
const sequelize = new Sequelize('recipeappusers', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.authenticate().then(() => {
    console.log("boa, logou")
}).catch((err) => {
    console.log("deu ruim " + err)
})

const Users = sequelize.define('users', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
})

module.exports = Users