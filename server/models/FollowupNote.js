const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FollowupNote = sequelize.define('FollowupNote', {
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
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = FollowupNote;
