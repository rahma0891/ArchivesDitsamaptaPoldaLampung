const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const SuratMasuk = sequelize.define(
  'SuratMasuk',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pengirim: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggalSurat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggalDiterima: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perihal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = SuratMasuk;
