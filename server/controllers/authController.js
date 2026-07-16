const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// Get users list (admin only, optionally filtered by role)
const getUsers = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.role) {
      where.role = req.query.role;
    }

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'role'],
      order: [['name', 'ASC']],
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getUsers };
