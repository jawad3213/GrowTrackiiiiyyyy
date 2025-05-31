import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import api from '../../src/services/api';  // adjust the path to your api.js

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a mock instance of axios
const mock = new MockAdapter(axios);

beforeEach(() => {
  // Reset mock adapter before each test
  mock.reset();
});

// Test: Should return response as-is for a status 200
test('should return response as-is for status 200', async () => {
  // Mock the successful response (200 OK)
  mock.onGet('/test').reply(200, { message: 'ok' });

  const response = await axios.get('/test');

  // Check if the status and response message are correct
  expect(response.status).toBe(200);
  expect(response.data.message).toBe('ok');
});

// Test: Should refresh token and retry original request on 401 TOKEN_EXPIRED
test('should refresh token and retry original request on 401 TOKEN_EXPIRED', async () => {
  // Mock the first request failing with 401 (TOKEN_EXPIRED)
  mock.onGet('/protected').replyOnce(401, { error: 'TOKEN_EXPIRED' });

  // Mock the second request, which should retry and succeed with 200 OK
  mock.onGet('/protected').replyOnce(200, { message: 'retried success' });

  const response = await axios.get('/protected');

  // Check if the retry was successful
  expect(response.status).toBe(200);
  expect(response.data.message).toBe('retried success');
});

// Test: Should redirect to /login if refresh token fails
test('should redirect to /login if refresh fails', async () => {
  // Spy on the window.location object to capture redirects
  const locationSpy = jest.spyOn(window, 'location', 'get').mockImplementation(() => ({
    href: '',
    assign: jest.fn(),
  }));

  // Mock the first request failing with 401 (TOKEN_EXPIRED)
  mock.onGet('/protected').replyOnce(401, { error: 'TOKEN_EXPIRED' });

  // Simulate the refresh failure and trigger the redirect
  try {
    await axios.get('/protected');
  } catch (error) {
    // Check if the redirect to /login occurred
    expect(locationSpy.assign).toHaveBeenCalledWith('/login');
  }

  // Restore the spy to avoid affecting other tests
  locationSpy.mockRestore();
});
