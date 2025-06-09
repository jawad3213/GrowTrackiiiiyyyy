const request = require('supertest');
const express = require('express');
const { validations, validate_student, validate } = require('../../../validations/adminValidation');

// Create Express app for testing
const app = express();
app.use(express.json());

// Test routes
app.post('/test-user', validations, validate, (req, res) => {
  res.status(200).json({ success: true });
});

app.post('/test-student', validate_student, validate, (req, res) => {
  res.status(200).json({ success: true });
});

describe('User Validation Tests', () => {
  
  const validUserData = {
    cin: 'AB123456',
    phone: '+212612345678',
    password: 'ValidPass456',
    role: 'student',
    full_name: 'John Doe',
    email: 'john.doe@example.com'
  };

  describe('Valid Data', () => {
    test('should accept completely valid user data', async () => {
      const response = await request(app)
        .post('/test-user')
        .send(validUserData);
      expect(response.status).toBe(200);
    });

    test('should accept valid data with optional image', async () => {
      const response = await request(app)
        .post('/test-user')
        .send({ ...validUserData, image: 'https://example.com/image.jpg' });
      expect(response.status).toBe(200);
    });

    test('should accept different valid roles', async () => {
      const response = await request(app)
        .post('/test-user')
        .send({ ...validUserData, role: 'admin' });
      expect(response.status).toBe(200);
    });
  });

  describe('Invalid Data', () => {
    test('should reject empty required fields', async () => {
      const response = await request(app)
        .post('/test-user')
        .send({ ...validUserData, cin: '', email: '' });
      expect(response.status).toBe(400);
      expect(response.body.error.length).toBeGreaterThanOrEqual(2);
    });

    test('should reject invalid CIN format', async () => {
      const response = await request(app)
        .post('/test-user')
        .send({ ...validUserData, cin: 'AB123@56' });
      expect(response.status).toBe(400);
    });

    test('should reject invalid phone format', async () => {
      const response = await request(app)
        .post('/test-user')
        .send({ ...validUserData, phone: '123456789' });
      expect(response.status).toBe(400);
    });

    test('should reject weak password', async () => {
      const response = await request(app)
        .post('/test-user')
        .send({ ...validUserData, password: 'azertyui' });
      expect(response.status).toBe(400);
    });

    test('should reject invalid role', async () => {
      const response = await request(app)
        .post('/test-user')
        .send({ ...validUserData, role: 'manager' });
      expect(response.status).toBe(400);
    });

    test('should reject invalid email', async () => {
      const response = await request(app)
        .post('/test-user')
        .send({ ...validUserData, email: 'invalid-email' });
      expect(response.status).toBe(400);
    });
  });
});

describe('Student Validation Tests', () => {
  
  const validStudentData = {
    name: 'Ahmed Benali',
    cin: 'CD789012',
    cne: 'G123456789',
    email: 'ahmed@student.ma',
    pass: 'StudentPass123',
    filier: 'Informatique',
    group: 'A1'
  };

  describe('Valid Data', () => {
    test('should accept completely valid student data', async () => {
      const response = await request(app)
        .post('/test-student')
        .send(validStudentData);
      expect(response.status).toBe(200);
    });

    test('should accept valid data with optional note', async () => {
      const response = await request(app)
        .post('/test-student')
        .send({ ...validStudentData, note: 'Excellent student' });
      expect(response.status).toBe(200);
    });

    test('should accept names with accents and hyphens', async () => {
      const response = await request(app)
        .post('/test-student')
        .send({ ...validStudentData, name: 'Jean-François Müller' });
      expect(response.status).toBe(200);
    });
  });

  describe('Invalid Data', () => {
    test('should reject empty required fields', async () => {
      const response = await request(app)
        .post('/test-student')
        .send({ ...validStudentData, name: '', cin: '', cne: '' });
      expect(response.status).toBe(400);
      expect(response.body.error.length).toBeGreaterThanOrEqual(3);
    });

    test('should reject invalid CNE length', async () => {
      const response = await request(app)
        .post('/test-student')
        .send({ ...validStudentData, cne: 'G12345678' });
      expect(response.status).toBe(400);
    });

    test('should reject weak password', async () => {
      const response = await request(app)
        .post('/test-student')
        .send({ ...validStudentData, pass: 'weak' });
      expect(response.status).toBe(400);
    });

    test('should reject invalid group format', async () => {
      const response = await request(app)
        .post('/test-student')
        .send({ ...validStudentData, group: 'A1@' });
      expect(response.status).toBe(400);
    });

    test('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/test-student')
        .send({ ...validStudentData, email: 'not-an-email' });
      expect(response.status).toBe(400);
    });

    test('should reject note too long', async () => {
      const response = await request(app)
        .post('/test-student')
        .send({ ...validStudentData, note: 'A'.repeat(256) });
      expect(response.status).toBe(400);
    });
  });

  describe('Edge Cases', () => {
    test('should handle multiple validation errors', async () => {
      const response = await request(app)
        .post('/test-student')
        .send({
          name: '',
          cin: '123',
          cne: 'short',
          email: 'invalid',
          pass: 'weak',
          filier: '',
          group: ''
        });
      expect(response.status).toBe(400);
      expect(response.body.error.length).toBeGreaterThan(3);
    });

    test('should accept boundary values', async () => {
      const response = await request(app)
        .post('/test-student')
        .send({
          ...validStudentData,
          cin: '123456', // minimum length
          group: 'A', // minimum length
          note: 'A'.repeat(255) // maximum length
        });
      expect(response.status).toBe(200);
    });
  });
});