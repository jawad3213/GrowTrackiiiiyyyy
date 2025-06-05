const { body, validationResult } = require('express-validator');
const { Login, Password, Email } = require('../../../validators/authrules'); // Adjust the path as needed

describe('Login Validator', () => {
  it('should return an error if email is missing', async () => {
    const req = { body: { password: 'Password123' } };
    const res = {};
    const next = jest.fn();

    await Login[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Email is required.');
  });

  it('should return an error if email is invalid', async () => {
    const req = { body: { email: 'invalid-email', password: 'Password123' } };
    const res = {};
    const next = jest.fn();

    await Login[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Invalide Email.'); // ⚠️ <- typo? keep if intentional
  });

  it('should return an error if password is missing', async () => {
    const req = { body: { email: 'test@example.com' } };
    const res = {};
    const next = jest.fn();

    await Login[1](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Password is required.');
  });

  it('should pass with valid email and password', async () => {
    const req = { body: { email: 'test@example.com', password: 'Password123' } };
    const res = {};
    const next = jest.fn();

    await Login[0](req, res, next);
    await Login[1](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });
});

describe('Password Validator', () => {
  it('should return an error for a weak password', async () => {
    const req = { body: { password: 'password' } };
    const res = {};
    const next = jest.fn();

    await Password[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('The password is weak.');
  });

  it('should return an error if password is too short', async () => {
    const req = { body: { password: 'short' } };
    const res = {};
    const next = jest.fn();

    await Password[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('The password must have at least 8 characters');
  });

  it('should return an error if password does not contain uppercase letter and number', async () => {
    const req = { body: { password: 'lowercase123' } };
    const res = {};
    const next = jest.fn();

    await Password[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('The password must contain at least one uppercase letter and one number.');
  });

  it('should pass with a valid password', async () => {
    const req = { body: { password: 'Password123' } };
    const res = {};
    const next = jest.fn();

    await Password[0](req, res, next);
    const errors = validationResult(req);
    console.log(errors.array());
    expect(errors.isEmpty()).toBe(true);
  });
});

describe('Email Validator', () => {
  it('should return an error if email is missing', async () => {
    const req = { body: {} };
    const res = {};
    const next = jest.fn();

    await Email[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Email is required.');
  });

  it('should return an error if email is invalid', async () => {
    const req = { body: { email: 'invalid-email' } };
    const res = {};
    const next = jest.fn();

    await Email[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Invalide Email.'); // ⚠️ <- typo? keep if intentional
  });

  it('should pass with a valid email', async () => {
    const req = { body: { email: 'test@example.com' } };
    const res = {};
    const next = jest.fn();

    await Email[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });
});
