/**
 * Seeder — run with: node server/config/seed.js
 * Creates default admin and sales user accounts.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcrypt');
const { sequelize, User } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Models synced.');

    // Admin user
    const adminExists = await User.findOne({ where: { email: 'admin@eduvo.com' } });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@eduvo.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
      });
      console.log('✓ Admin user created: admin@eduvo.com / admin123');
    } else {
      console.log('⏭  Admin user already exists');
    }

    // Sales user
    const salesExists = await User.findOne({ where: { email: 'sales@eduvo.com' } });
    if (!salesExists) {
      await User.create({
        name: 'Sales',
        email: 'sales@eduvo.com',
        password: await bcrypt.hash('sales123', 10),
        role: 'SALES_EXECUTIVE',
      });
      console.log('✓ Sales user created: sales@eduvo.com / sales123');
    } else {
      console.log('⏭  Sales user already exists');
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('\nLogin credentials:');
    console.log('  Admin:  admin@eduvo.com  / admin123');
    console.log('  Sales:  sales@eduvo.com  / sales123');

    await sequelize.close();
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
