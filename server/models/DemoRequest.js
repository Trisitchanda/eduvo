const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DemoRequest = sequelize.define('DemoRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  contact_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institution_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institution_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  student_count: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interested_features: {
    type: DataTypes.JSON, // Array of strings
    allowNull: true,
  },
  preferred_demo_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(
      'New',
      'Contacted',
      'Demo Scheduled',
      'Demo Completed',
      'Converted',
      'Lost',
      'Cancelled'
    ),
    defaultValue: 'New',
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  next_followup_date: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = DemoRequest;
