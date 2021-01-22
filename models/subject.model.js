module.exports = (sequelize, Sequelize) => {
    const Subject = sequelize.define("subjects", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
          },
          name:{
              type: Sequelize.STRING,
          },
          record:{
            type: Sequelize.INTEGER
          }
        });
    return Subject;
  };