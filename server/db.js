const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(
    process.env.DB_NAME,      
    process.env.DB_USER,      
    process.env.DB_PASSWORD,   
    {
        dialect: 'postgres',   
        host: process.env.DB_HOST,  
        port: process.env.DB_PORT,  
        logging: false,        
    }
);


sequelize.authenticate()
    .then(() => {
        console.log('Соединение с базой данных установлено успешно.');
    })
    .catch((err) => {
        console.error('Не удалось подключиться к базе данных:', err);
    });

module.exports = sequelize;
