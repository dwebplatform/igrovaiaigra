module.exports = (sequelize, Sequelize) => {
    const Trener = sequelize.define("treners", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
          },
          name: {
              type: Sequelize.STRING,
          },
          price:{
            type: Sequelize.INTEGER,
          },
          avatar:{
            type:Sequelize.STRING,
          },
          rating:{
            type:Sequelize.INTEGER,
          },
          password:{
            type: Sequelize.STRING,
          },
          email:{
              type: Sequelize.STRING
          },
        },{
          scopes:{
            protected:{
              attributes: {
                exclude:['password']
              }
            }
          }
        });
    return Trener;
  };