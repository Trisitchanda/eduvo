const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  demo_request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'DemoRequests',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be null if system action (though mostly it's by a user or public submission)
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false, // E.g., 'Lead Created', 'Status Changed', 'Note Added'
  },
  old_value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  new_value: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = ActivityLog;
