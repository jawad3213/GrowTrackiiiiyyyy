// auth.test.js
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock the API service
vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}))
import api from '@/services/api'

describe('Auth Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAuthStore()
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    expect(store.user).toBe(null)
    expect(store.errorMsg).toBe(null)
    expect(store.load).toBe(false)
    expect(store.isAuthenticated).toBe(null)
  })

  it('successful login sets user to true and clears error', async () => {
    api.post.mockResolvedValueOnce({ status: 200 })  // mock success response

    await store.Login('test@example.com', 'password')

    expect(store.user).toBe(true)
    expect(store.errorMsg).toBe(null)
    expect(store.load).toBe(false)
    expect(api.post).toHaveBeenCalledWith('/api/auth/login', { email: 'test@example.com', password: 'password' })
  })

  it('failed login sets error message and clears user', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    })

    await store.Login('test@example.com', 'wrongpass')

    expect(store.user).toBe(null)
    expect(store.errorMsg).toBe('Invalid credentials')
    expect(store.load).toBe(false)
    expect(api.post).toHaveBeenCalledWith('/api/auth/login', { email: 'test@example.com', password: 'wrongpass' })
  })

  it('forgotPassword sets error on failure', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid email' } }
    })

    await store.forgotPassword('invalid@example.com')

    expect(store.errorMsg).toBe('Invalid email')
    expect(store.load).toBe(false)
    expect(api.post).toHaveBeenCalledWith('/api/auth/reset-password', { email: 'invalid@example.com' })
  })

  it('resetPassword sets error on failure', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Reset password failed' } }
    })

    await store.resetPassword('newpass', 'token123')

    expect(store.errorMsg).toBe('Reset password failed')
    expect(store.load).toBe(false)
    expect(api.post).toHaveBeenCalledWith('/api/resetpass?token=token123', { password: 'newpass' })
  })

  it('logout resets user and error on success', async () => {
    api.post.mockResolvedValueOnce({})

    await store.logout()

    expect(store.user).toBe(null)
    expect(store.errorMsg).toBe(null)
    expect(store.load).toBe(false)
    expect(api.post).toHaveBeenCalledWith('/api/auth/logout')
  })

  it('Clearstatus clears error and loading', () => {
    store.error = 'Some error';   // ✅ assign to ref
    store.loading = true;         // ✅ assign to ref
  
    store.Clearstatus();
  
    expect(store.errorMsg).toBe(null);
    expect(store.load).toBe(false);
  });  
})
