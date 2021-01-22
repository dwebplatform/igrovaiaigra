
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
          },
          password: {
            type: Sequelize.STRING,
          },
          email: {
              type: Sequelize.STRING
          },
          role:{
            type: Sequelize.STRING,
            defaultValue:'user'
          }
        });
    return User;
  };