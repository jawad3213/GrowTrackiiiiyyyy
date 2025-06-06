const { check, validationResult } = require('express-validator');
const { id_evaluation, type } = require('../../../validators/adminInputsRules'); // Adjust the path as needed

describe('ID Evaluation Validator', () => {
  it('should return an error if id_evaluation is missing', async () => {
    const req = { body: {} };
    const res = {};
    const next = jest.fn();

    await id_evaluation[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('ID is required.');
  });

  it('should return an error if id_evaluation is empty string', async () => {
    const req = { body: { id_evaluation: '' } };
    const res = {};
    const next = jest.fn();

    await id_evaluation[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('ID is required.');
  });

  it('should return an error if id_evaluation is not an integer', async () => {
    const req = { body: { id_evaluation: 'not-a-number' } };
    const res = {};
    const next = jest.fn();

    await id_evaluation[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Must be a positive integer.');
  });

  it('should return an error if id_evaluation is a float', async () => {
    const req = { body: { id_evaluation: '123.45' } };
    const res = {};
    const next = jest.fn();

    await id_evaluation[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Must be a positive integer.');
  });

  it('should return an error if id_evaluation is negative', async () => {
    const req = { body: { id_evaluation: '-1' } };
    const res = {};
    const next = jest.fn();

    await id_evaluation[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Must be a positive integer.');
  });

  it('should pass with a valid positive integer', async () => {
    const req = { body: { id_evaluation: '123' } };
    const res = {};
    const next = jest.fn();

    await id_evaluation[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should pass with zero', async () => {
    const req = { body: { id_evaluation: '0' } };
    const res = {};
    const next = jest.fn();

    await id_evaluation[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should pass with integer as number type', async () => {
    const req = { body: { id_evaluation: 456 } };
    const res = {};
    const next = jest.fn();

    await id_evaluation[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });
});

describe('Type Validator', () => {
  it('should return an error if type is missing', async () => {
    const req = { body: {} };
    const res = {};
    const next = jest.fn();

    await type[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Type is required.');
  });

  it('should return an error if type is empty string', async () => {
    const req = { body: { type: '' } };
    const res = {};
    const next = jest.fn();

    await type[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Type is required.');
  });

  it('should return an error if type is invalid', async () => {
    const req = { body: { type: 'invalid-type' } };
    const res = {};
    const next = jest.fn();

    await type[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Evaluation type is invalide');
  });

  it('should pass with valid type "pair"', async () => {
    const req = { body: { type: 'pair' } };
    const res = {};
    const next = jest.fn();

    await type[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should pass with valid type "self"', async () => {
    const req = { body: { type: 'self' } };
    const res = {};
    const next = jest.fn();

    await type[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should pass with valid type "supervisor"', async () => {
    const req = { body: { type: 'supervisor' } };
    const res = {};
    const next = jest.fn();

    await type[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should pass with valid type "professor"', async () => {
    const req = { body: { type: 'professor' } };
    const res = {};
    const next = jest.fn();

    await type[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should pass with uppercase type (case insensitive)', async () => {
    const req = { body: { type: 'PAIR' } };
    const res = {};
    const next = jest.fn();

    await type[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should pass with mixed case type', async () => {
    const req = { body: { type: 'Supervisor' } };
    const res = {};
    const next = jest.fn();

    await type[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should return an error for partial match', async () => {
    const req = { body: { type: 'sup' } };
    const res = {};
    const next = jest.fn();

    await type[0](req, res, next);
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toBe('Evaluation type is invalide');
  });
});

describe('Combined Validation Tests', () => {
  it('should pass with both valid id_evaluation and type', async () => {
    const req = { body: { id_evaluation: '123', type: 'pair' } };
    const res = {};
    const next = jest.fn();

    // Test both validators
    await id_evaluation[0](req, res, next);
    await type[0](req, res, next);
    
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should return errors for both invalid id_evaluation and type', async () => {
    const req = { body: { id_evaluation: 'invalid', type: 'invalid-type' } };
    const res = {};
    const next = jest.fn();

    // Test both validators
    await id_evaluation[0](req, res, next);
    await type[0](req, res, next);
    
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(2);
    expect(errors.array()[0].msg).toBe('Must be a positive integer.');
    expect(errors.array()[1].msg).toBe('Evaluation type is invalide');
  });
});