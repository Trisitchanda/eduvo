const request = require('supertest');
const app = require('../index');
const { sequelize, User, DemoRequest } = require('../models');

let token;
let salesToken;
let createdRequestId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Create admin
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@eduvo.com',
    password: await require('bcrypt').hash('password', 10),
    role: 'ADMIN'
  });
  // Create sales
  const sales = await User.create({
    name: 'Sales',
    email: 'sales@eduvo.com',
    password: await require('bcrypt').hash('password', 10),
    role: 'SALES_EXECUTIVE'
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'admin@eduvo.com',
    password: 'password'
  });
  token = res.body.token;

  const res2 = await request(app).post('/api/auth/login').send({
    email: 'sales@eduvo.com',
    password: 'password'
  });
  salesToken = res2.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Eduvo CRM API Tests', () => {
  
  it('1. Create request successfully', async () => {
    const res = await request(app).post('/api/demo-requests').send({
      contact_name: 'John Doe',
      email: 'john@school.edu',
      phone: '1234567890',
      institution_name: 'Springfield High',
      preferred_demo_datetime: new Date(new Date().getTime() + 86400000).toISOString() // Tomorrow
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    createdRequestId = res.body.id;
  });

  it('2. Reject duplicate request', async () => {
    const res = await request(app).post('/api/demo-requests').send({
      contact_name: 'Jane Doe',
      email: 'john@school.edu', // Duplicate email
      phone: '0987654321',
      institution_name: 'Other High',
      preferred_demo_datetime: new Date(new Date().getTime() + 86400000).toISOString()
    });
    expect(res.statusCode).toEqual(400);
  });

  it('3. Reject past demo date (Schedule Demo)', async () => {
    const res = await request(app)
      .patch(`/api/demo-requests/${createdRequestId}/schedule`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        datetime: new Date(new Date().getTime() - 86400000).toISOString() // Yesterday
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toMatch(/Cannot schedule demo in the past/);
  });

  it('4. Reject unauthorized access', async () => {
    const res = await request(app)
      .patch(`/api/demo-requests/${createdRequestId}/assign`)
      .set('Authorization', `Bearer ${salesToken}`) // Sales cannot assign
      .send({
        assigned_to: 2 // Assign to self
      });
    expect(res.statusCode).toEqual(403);
  });

  it('5. Reject invalid status transition', async () => {
    const res = await request(app)
      .patch(`/api/demo-requests/${createdRequestId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'Converted' // New -> Converted is invalid
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toMatch(/Invalid status transition/);
  });
});
