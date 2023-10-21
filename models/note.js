"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Note.belongsTo(models.User, {
        as: "user", // note.user
        foreignKey: "user_id",
        targetKey: "id",
      });
    }
  }
  Note.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      title: DataTypes.STRING,
      note: DataTypes.STRING,
      checklist: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      user_id: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Note",
    }
  );
  return Note;
};
