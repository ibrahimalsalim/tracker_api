const { Sequelize } = require('sequelize');

const { UserTypeModel } = require('../models/usertype');

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        define: {
            timestamps: false,
            freezeTableName: true
        }
    });


const UserType = UserTypeModel(sequelize);


const testconnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testconnection();


// (async () => {
//   try {
//     await sequelize.sync({ force: true });
//     console.log('Database synchronized successfully.');

//     // await insertInitialData()
//     // console.log('Initial data inserted successfully');

//   } catch (error) {
//     console.error('Error synchronizing database:', error);
//   }
// })();

module.exports = {
    UserType,
}
