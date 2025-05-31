import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import { nextTick } from 'vue'

// Mock the auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    Login: vi.fn(),
    Clearstatus: vi.fn(),
    load: false,
    errorMsg: '',
    isAuthenticated: false
  }))
}))

// Mock the router
const mockRouter = {
  push: vi.fn(),
  currentRoute: { value: { path: '/login' } }
}

// Mock the assets
vi.mock('@/assets/logo.png', () => ({}))
vi.mock('@/assets/Sign in-amico.svg', () => ({}))

describe('Login.vue', () => {
  let wrapper
  let store
  
  beforeEach(async () => {
    // Create a fresh pinia and router for each test
    setActivePinia(createPinia())
    
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/login', component: Login },
        { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
        { path: '/forgotpass', component: { template: '<div>Forgot Password</div>' } }
      ]
    })
    
    // Reset all mocks
    vi.resetAllMocks()
    
    // Import the actual store after resetting mocks
    const authStoreModule = await import('@/stores/auth')
    store = authStoreModule.useAuthStore()
    
    // Mount the component
    wrapper = mount(Login, {
      global: {
        plugins: [router],
        mocks: {
          $router: mockRouter
        }
      }
    })
  })
  
  it('renders the login form correctly', () => {
    expect(wrapper.find('h2').text()).toBe('Log In')
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Sign In')
  })
  
  it('toggles password visibility', async () => {
    const passwordInput = wrapper.find('input[type="password"]')
    const toggleButton = wrapper.find('button[type="button"]')
    
    expect(passwordInput.attributes('type')).toBe('password')
    
    await toggleButton.trigger('click')
    expect(passwordInput.attributes('type')).toBe('text')
    
    await toggleButton.trigger('click')
    expect(passwordInput.attributes('type')).toBe('password')
  })
  
  it('validates email and password fields', async () => {
    const form = wrapper.find('form')
    
    // Test empty submission
    await form.trigger('submit')
    await nextTick()
    
    expect(wrapper.vm.errors.email).toBe('Email is required')
    expect(wrapper.vm.errors.password).toBe('Password is required')
    
    // Test invalid email
    await wrapper.find('input[type="email"]').setValue('invalid')
    await wrapper.find('input[type="password"]').setValue('short')
    await form.trigger('submit')
    await nextTick()
    
    expect(wrapper.vm.errors.email).toBe('Invalid email')
    expect(wrapper.vm.errors.password).toBe('Password must be at least 8 characters')
  })
  
  it('submits the form with valid data', async () => {
    const safeEmail = 'test@example.com'
    const safePassword = 'validpassword123'
    
    // Set valid form data
    await wrapper.find('input[type="email"]').setValue(safeEmail)
    await wrapper.find('input[type="password"]').setValue(safePassword)
    
    // Mock successful login
    store.Login.mockResolvedValue(true)
    store.errorMsg = ''
    
    await wrapper.find('form').trigger('submit')
    await nextTick()
    
    expect(store.Login).toHaveBeenCalledWith(safeEmail, safePassword)
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
  })
  
  it('shows error message when login fails', async () => {
    const errorMessage = 'Invalid credentials'
    
    // Set valid form data
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('validpassword123')
    
    // Mock failed login
    store.errorMsg = errorMessage
    
    await wrapper.find('form').trigger('submit')
    await nextTick()
    
    expect(wrapper.find('.bg-red-200').text()).toContain(errorMessage)
  })
  
  it('redirects to dashboard if already authenticated', async () => {
    // Set authenticated state
    store.isAuthenticated = true
    
    // Re-mount the component
    wrapper = mount(Login, {
      global: {
        plugins: [mockRouter]
      }
    })
    
    await nextTick()
    
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
  })
  
  it('sanitizes input values', async () => {
    const maliciousInput = '<script>alert("xss")</script>'
    const safeInput = 'alert("xss")'
    
    await wrapper.find('input[type="email"]').setValue(maliciousInput)
    await wrapper.find('input[type="password"]').setValue(maliciousInput)
    
    await wrapper.find('form').trigger('submit')
    await nextTick()
    
    expect(store.Login).toHaveBeenCalledWith(safeInput, safeInput)
  })
  
  it('shows loading state when store.load is true', async () => {
    store.load = true
    await nextTick()
    
    expect(wrapper.find('.text-gray-500').text()).toBe('Loading...')
  })
})