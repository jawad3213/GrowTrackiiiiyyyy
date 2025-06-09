const request = require('supertest');
const express = require('express');
const { validationResult } = require('express-validator');
const { contactUsSchema } = require('../../../validators/ContactUsRules'); // Update this path

// Create a test Express app
const app = express();
app.use(express.json());

// Test endpoint that uses the validation schema
app.post('/test-contact', contactUsSchema, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.status(200).json({ message: 'Validation passed' });
});

describe('Contact Us Validation Schema', () => {
  describe('Valid data', () => {
    test('should pass validation with all valid fields', async () => {
      const validData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '1234567890',
        Message: 'This is a valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(validData);

      // Debug: log the response if it fails
      if (response.status !== 200) {
        console.log('Validation errors:', JSON.stringify(response.body.errors, null, 2));
      }

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Validation passed');
    });
  });

  describe('Email validation', () => {
    test('should fail when Email is empty', async () => {
      const invalidData = {
        Email: '',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '1234567890',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'Email',
            msg: 'Email is required.'
          })
        ])
      );
    });

    test('should fail when Email is missing', async () => {
      const invalidData = {
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '1234567890',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'Email',
            msg: 'Email is required.'
          })
        ])
      );
    });

    test('should fail when Email format is invalid', async () => {
      const invalidData = {
        Email: 'invalid-email',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '1234567890',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'Email',
            msg: 'Invalide Email.'
          })
        ])
      );
    });

    test('should normalize email correctly', async () => {
      const dataWithUnnormalizedEmail = {
        Email: 'Test.Email+tag@EXAMPLE.COM',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '1234567890',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(dataWithUnnormalizedEmail);

      // Debug: log the response if it fails
      if (response.status !== 200) {
        console.log('Email normalization test errors:', JSON.stringify(response.body.errors, null, 2));
      }

      expect(response.status).toBe(200);
    });
  });

  describe('FirstName validation', () => {
    test('should fail when FirstName is empty', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: '',
        LastName: 'Doe',
        Phone: '1234567890',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'FirstName',
            msg: 'FirstName is required.'
          })
        ])
      );
    });

    test('should fail when FirstName is missing', async () => {
      const invalidData = {
        Email: 'test@example.com',
        LastName: 'Doe',
        Phone: '1234567890',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'FirstName',
            msg: 'FirstName is required.'
          })
        ])
      );
    });

    test('should fail when FirstName is not a string', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 123,
        LastName: 'Doe',
        Phone: '1234567890',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'FirstName',
            msg: 'First name must be a string.'
          })
        ])
      );
    });
  });

  describe('LastName validation', () => {
    test('should fail when LastName is empty', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: '',
        Phone: '+1234567890',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'LastName',
            msg: 'LastName is required.'
          })
        ])
      );
    });

    test('should fail when LastName is missing', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 'John',
        Phone: '+1234567890',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'LastName',
            msg: 'LastName is required.'
          })
        ])
      );
    });

    test('should fail when LastName is not a string', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 123,
        Phone: '+1234567890',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'LastName',
            msg: 'Last name must be a string.'
          })
        ])
      );
    });
  });

  describe('Phone validation', () => {
    test('should fail when Phone is empty', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'Phone',
            msg: 'Phone Number is required'
          })
        ])
      );
    });

    test('should fail when Phone is missing', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'Phone',
            msg: 'Phone Number is required'
          })
        ])
      );
    });

    test('should fail when Phone is not a valid mobile phone', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '123',
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'Phone',
            msg: 'Phone number is too long'
          })
        ])
      );
    });

    test('should fail when Phone is too short', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '123456789', // 9 digits, less than minimum 10
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'Phone',
            msg: 'Invalide phone number'
          })
        ])
      );
    });

    test('should fail when Phone is too long', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '123456789012345678901', // 21 digits, more than maximum 20
        Message: 'Valid message'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'Phone',
            msg: 'Invalide phone number'
          })
        ])
      );
    });
  });

  describe('Message validation', () => {
    test('should fail when Message is empty', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '+1234567890',
        Message: ''
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'Message',
            msg: 'Message is required.'
          })
        ])
      );
    });

    test('should fail when Message is missing', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '+1234567890'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'Message',
            msg: 'Message is required.'
          })
        ])
      );
    });

    test('should fail when Message is too short', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '+1234567890',
        Message: 'A' // 1 character, less than minimum 2
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'Message',
            msg: 'Message is too short'
          })
        ])
      );
    });

    test('should fail when Message is too long', async () => {
      const invalidData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '+1234567890',
        Message: 'A'.repeat(1001) // 1001 characters, more than maximum 1000
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'Message',
            msg: 'Message is too long'
          })
        ])
      );
    });

    test('should pass with minimum valid message length', async () => {
      const validData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '1234567890',
        Message: 'AB' // 2 characters, exactly minimum
      };

      const response = await request(app)
        .post('/test-contact')
        .send(validData);

      // Debug: log the response if it fails
      if (response.status !== 200) {
        console.log('Minimum message test errors:', JSON.stringify(response.body.errors, null, 2));
      }

      expect(response.status).toBe(200);
    });

    test('should pass with maximum valid message length', async () => {
      const validData = {
        Email: 'test@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Phone: '1234567890',
        Message: 'A'.repeat(1000) // 1000 characters, exactly maximum
      };

      const response = await request(app)
        .post('/test-contact')
        .send(validData);

      // Debug: log the response if it fails
      if (response.status !== 200) {
        console.log('Maximum message test errors:', JSON.stringify(response.body.errors, null, 2));
      }

      expect(response.status).toBe(200);
    });
  });

  describe('Multiple validation errors', () => {
    test('should return multiple errors when multiple fields are invalid', async () => {
      const invalidData = {
        Email: 'invalid-email',
        FirstName: '',
        LastName: 123,
        Phone: '123',
        Message: 'A'
      };

      const response = await request(app)
        .post('/test-contact')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors.length).toBeGreaterThan(1);
      
      // Check that we have errors for multiple fields
      const errorPaths = response.body.errors.map(error => error.path);
      expect(errorPaths).toContain('Email');
      expect(errorPaths).toContain('FirstName');
      expect(errorPaths).toContain('LastName');
      expect(errorPaths).toContain('Phone');
      expect(errorPaths).toContain('Message');
    });
  });
});