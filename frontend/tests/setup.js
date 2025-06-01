// frontend/tests/setup.js
import { vi } from 'vitest';
import { config } from '@vue/test-utils';

config.global.stubs = {
  'router-link' : true,
  'apexchart'   : true
};

// Mock axios : expose get/post/put/delete
vi.mock('axios', () => {
  const fn = () => Promise.resolve({ data: {} });
  return {
    default: { create: () => ({ get: fn, post: fn, put: fn, delete: fn }) },
    get: fn, post: fn, put: fn, delete: fn              // au cas où axios est importé sans create()
  };
});
