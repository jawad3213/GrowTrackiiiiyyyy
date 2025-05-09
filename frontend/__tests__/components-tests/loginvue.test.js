import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock the router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Properly mock the assets with default exports
vi.mock('@/assets/logo.png', () => ({
  default: 'mocked-logo-path'
}))

vi.mock('@/assets/Sign in-amico.svg', () => ({
  default: 'mocked-svg-path'
}))

// Mock the auth store
const mockLogin = vi.fn()
const mockClearstatus = vi.fn()
let mockIsAuthenticated = false
let mockErrorMsg = ''
let mockLoad = false

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    Login: mockLogin,
    Clearstatus: mockClearstatus,
    isAuthenticated: mockIsAuthenticated,
    errorMsg: mockErrorMsg,
    load: mockLoad
  }))
}))

// Import the mocked store function
import { useAuthStore } from '@/stores/auth'

// Import the component after mocking dependencies
import LoginView from '@/components/Login.vue'

describe('LoginView', () => {
  let wrapper

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    mockPush.mockReset()
    mockLogin.mockReset()
    mockClearstatus.mockReset()
    mockIsAuthenticated = false
    mockErrorMsg = ''
    mockLoad = false
    
    // Mount component
    wrapper = mount(LoginView, {
      global: {
        stubs: {
          'router-link': true
        }
      }
    })
  })

  it('renders the login form correctly', () => {
    expect(wrapper.find('h2').text()).toBe('Log In')
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Sign In')
  })

  it('toggles password visibility when the eye icon is clicked', async () => {
    // Password should be hidden by default
    expect(wrapper.find('input[placeholder="Password"]').attributes('type')).toBe('password')
    
    // Click the toggle button
    await wrapper.find('.absolute.inset-y-0.right-3').trigger('click')
    
    // Password should now be visible
    expect(wrapper.find('input[placeholder="Password"]').attributes('type')).toBe('text')
    
    // Click again to hide
    await wrapper.find('.absolute.inset-y-0.right-3').trigger('click')
    
    // Password should be hidden again
    expect(wrapper.find('input[placeholder="Password"]').attributes('type')).toBe('password')
  })

  it('shows loading state when store.load is true', async () => {
    // Initially, loading message should not be shown
    expect(wrapper.find('.text-gray-500.text-center').exists()).toBe(false)
    
    // Get the store object from our component
    const store = wrapper.vm.store
    
    // Update the store's load property
    store.load = true
    
    // Force a re-render
    await nextTick()
    
    // Loading message should now be shown
    expect(wrapper.find('.text-gray-500.text-center').exists()).toBe(true)
    expect(wrapper.find('.text-gray-500.text-center').text()).toBe('Loading...')
  })

  it('shows error message when store.errorMsg is set', async () => {
    // Initially, no error message should be shown
    expect(wrapper.find('.bg-red-200').exists()).toBe(false)
    
    // Get the store object from our component
    const store = wrapper.vm.store
    
    // Set an error message
    store.errorMsg = 'Invalid credentials'
    
    // Force a re-render
    await nextTick()
    
    // Error message should now be shown
    expect(wrapper.find('.bg-red-200').exists()).toBe(true)
    expect(wrapper.find('.text-red-800').text()).toBe('Invalid credentials')
  })

  it('redirects to dashboard if user is already authenticated', async () => {
    // Unmount the previously mounted component
    wrapper.unmount()
    
    // Update the mock value before mounting the component
    mockIsAuthenticated = true
    
    // Remount the component to trigger onMounted hook
    wrapper = mount(LoginView, {
      global: {
        stubs: {
          'router-link': true
        }
      }
    })
    
    // Wait for nextTick to ensure hooks have run
    await nextTick()
    
    // Check if router.push was called with '/dashboard'
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('calls Clearstatus on mount', async () => {
    // Verify the call (already mounted in beforeEach)
    expect(mockClearstatus).toHaveBeenCalled()
  })

  it('submits the form and logs in successfully', async () => {
    // Mock the Login method to resolve successfully
    mockLogin.mockImplementation(async () => {
      mockErrorMsg = '' // Ensure no error message
      return Promise.resolve()
    })
    
    // Set form values
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[placeholder="Password"]').setValue('password123')
    
    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    
    // Wait for promises to resolve
    await flushPromises()
    
    // Check if Login was called with correct credentials
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    
    // Check if router.push was called with '/dashboard'
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('does not redirect when login fails', async () => {
    // Set up store to return an error
    mockLogin.mockImplementation(async () => {
      // This is the store instance in the component
      const store = wrapper.vm.store
      store.errorMsg = 'Invalid credentials'
      return Promise.resolve()
    })
    
    // Set form values
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[placeholder="Password"]').setValue('wrongpassword')
    
    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    
    // Wait for promises to resolve
    await flushPromises()
    await nextTick() // Wait for the UI to update
    
    // Error message should be shown
    expect(wrapper.find('.bg-red-200').exists()).toBe(true)
    expect(wrapper.find('.text-red-800').text()).toBe('Invalid credentials')
    
    // Router should not navigate
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('handles login exception properly', async () => {
    // Mock console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock the Login method to throw an error
    mockLogin.mockRejectedValue(new Error('Network error'))
    
    // Set form values
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[placeholder="Password"]').setValue('password123')
    
    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    
    // Wait for promises to resolve
    await flushPromises()
    
    // Check if error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur lors de la connexion :', expect.any(Error))
    
    // Restore console.error
    consoleErrorSpy.mockRestore()
  })
})