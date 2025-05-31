const { validate } = require('../../middlewares/validate');
const { validationResult } = require('express-validator');

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('validate middleware', () => {
  let req, res, next, mockRule1, mockRule2;

  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();

    mockRule1 = { run: jest.fn().mockResolvedValue() };
    mockRule2 = { run: jest.fn().mockResolvedValue() };

    validationResult.mockReset();
  });

  it('should run all validation rules', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });

    const middleware = validate([mockRule1, mockRule2]);
    await middleware(req, res, next);

    expect(mockRule1.run).toHaveBeenCalledWith(req);
    expect(mockRule2.run).toHaveBeenCalledWith(req);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 with errors if validation fails', async () => {
    const errorsArray = [{ msg: 'Invalid field' }];
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => errorsArray
    });

    const middleware = validate([mockRule1]);
    await middleware(req, res, next);

    expect(mockRule1.run).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: errorsArray });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle empty rules array', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });

    const middleware = validate([]);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
