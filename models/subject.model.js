module.exports = (sequelize, Sequelize) => {
    const Trener = sequelize.define("subjects", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
          },
          name:{
              type: Sequelize.STRING,
          },
        });
    return Trener;
  };