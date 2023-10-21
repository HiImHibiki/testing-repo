"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Upload extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Upload.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        targetKey: "id",
      });
    }
  }
  Upload.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      file_name: DataTypes.STRING,
      file_type: DataTypes.STRING,
      file_path: DataTypes.STRING,
      user_id: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Upload",
    }
  );
  return Upload;
};
