require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models');

// Routes
const authRoutes = require('./routes/authRoutes');
const demoRequestRoutes = require('./routes/demoRequestRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/demo-requests', demoRequestRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    // In a real app we'd use migrations, but for this demo sync works:
    await sequelize.sync(); 
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app; // For testing
