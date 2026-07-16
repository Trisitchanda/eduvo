const sequelize = require('../config/database');
const User = require('./User');
const DemoRequest = require('./DemoRequest');
const FollowupNote = require('./FollowupNote');
const ActivityLog = require('./ActivityLog');

// Relationships

// User <-> DemoRequest (Assignee)
User.hasMany(DemoRequest, { foreignKey: 'assigned_to', as: 'assignedRequests' });
DemoRequest.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

// DemoRequest <-> FollowupNote
DemoRequest.hasMany(FollowupNote, { foreignKey: 'demo_request_id', as: 'notes' });
FollowupNote.belongsTo(DemoRequest, { foreignKey: 'demo_request_id', as: 'request' });

// User <-> FollowupNote
User.hasMany(FollowupNote, { foreignKey: 'user_id', as: 'authoredNotes' });
FollowupNote.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// DemoRequest <-> ActivityLog
DemoRequest.hasMany(ActivityLog, { foreignKey: 'demo_request_id', as: 'activities' });
ActivityLog.belongsTo(DemoRequest, { foreignKey: 'demo_request_id', as: 'request' });

// User <-> ActivityLog
User.hasMany(ActivityLog, { foreignKey: 'user_id', as: 'activities' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  DemoRequest,
  FollowupNote,
  ActivityLog,
};
