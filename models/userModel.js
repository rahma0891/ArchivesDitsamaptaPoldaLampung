const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../utils/database');

const User = sequelize.define(
  'User',
  {
    // make id uuid
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

User.prototype.checkPassword = async function (enteredPassword) {
  console.log(this.password, enteredPassword);
  return await bcrypt.compare(enteredPassword, this.password);
};

const DEFAULT_SALT_ROUNDS = 10;

User.addHook('beforeCreate', async (user) => {
  const encryptedPassword = await bcrypt.hash(
    user.password,
    DEFAULT_SALT_ROUNDS
  );
  user.password = encryptedPassword;
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const encryptedPassword = await bcrypt.hash(
      user.password,
      DEFAULT_SALT_ROUNDS
    );
    user.password = encryptedPassword;
  }
});

module.exports = User;
