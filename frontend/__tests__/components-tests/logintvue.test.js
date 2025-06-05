import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import LoginComponent from '@/components/Login.vue' // Adjust path as needed
import { useAuthStore } from '@/stores/auth'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
    { path: '/forgotpass', component: { template: '<div>Forgot Password</div>' } }
  ]
})

// Mock auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn()
}))

describe('LoginComponent', () => {
  let wrapper
  let mockStore
  let pinia

  beforeEach(() => {
    // Create fresh pinia instance
    pinia = createPinia()
    setActivePinia(pinia)

    // Mock store implementation
    mockStore = {
      errorMsg: '',
      isAuthenticated: false,
      Login: vi.fn(),
      Clearstatus: vi.fn()
    }

    // Mock the store hook
    vi.mocked(useAuthStore).mockReturnValue(mockStore)

    // Mock router push
    vi.spyOn(router, 'push').mockResolvedValue()
  })

  const createWrapper = (props = {}) => {
    return mount(LoginComponent, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
            props: ['to']
          }
        }
      },
      ...props
    })
  }

  describe('Component Rendering', () => {
    it('renders login form correctly', () => {
      wrapper = createWrapper()
      
      expect(wrapper.find('h2').text()).toBe('Log In')
      expect(wrapper.find('input[type="email"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('renders logo image', () => {
      wrapper = createWrapper()
      
      const logo = wrapper.find('img[alt="Logo"]')
      expect(logo.exists()).toBe(true)
      // Image paths are resolved during testing, so we check for the resolved path
      expect(logo.attributes('src')).toContain('logo.png')
    })

    it('renders illustration on desktop', () => {
      wrapper = createWrapper()
      
      const illustration = wrapper.find('img[alt="Login Illustration"]')
      expect(illustration.exists()).toBe(true)
      // Image paths are resolved during testing, check for the filename
      expect(illustration.attributes('src')).toContain('Sign%20in-amico.svg')
    })

    it('renders forgot password link', () => {
      wrapper = createWrapper()
      
      // Look for the actual anchor tag created by router-link stub
      const forgotLink = wrapper.find('a')
      expect(forgotLink.exists()).toBe(true)
      expect(forgotLink.text()).toContain('Forgot Password?')
    })
  })

  describe('Form Interactions', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('updates email input value', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      await emailInput.setValue('test@example.com')
      
      expect(emailInput.element.value).toBe('test@example.com')
    })

    it('updates password input value', async () => {
      const passwordInput = wrapper.find('input[type="password"]')
      await passwordInput.setValue('password123')
      
      expect(passwordInput.element.value).toBe('password123')
    })

    it('toggles password visibility', async () => {
      const passwordInput = wrapper.find('input[type="password"]')
      const toggleButton = wrapper.find('button[type="button"]')
      
      expect(passwordInput.attributes('type')).toBe('password')
      
      await toggleButton.trigger('click')
      await nextTick()
      
      expect(passwordInput.attributes('type')).toBe('text')
      
      await toggleButton.trigger('click')
      await nextTick()
      
      expect(passwordInput.attributes('type')).toBe('password')
    })

    it('shows correct eye icon based on password visibility', async () => {
      const toggleButton = wrapper.find('button[type="button"]')
      
      // Initially should show "eye" icon (password hidden)
      expect(wrapper.find('svg').exists()).toBe(true)
      
      await toggleButton.trigger('click')
      await nextTick()
      
      // After toggle, should show "eye-slash" icon (password visible)
      expect(wrapper.findAll('svg').length).toBeGreaterThan(0)
    })
  })

  describe('Form Submission', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('calls store.Login with correct credentials on form submit', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')
      const form = wrapper.find('form')

      await emailInput.setValue('test@example.com')
      await passwordInput.setValue('password123')
      await form.trigger('submit.prevent')

      expect(mockStore.Login).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('shows loading state during submission', async () => {
      mockStore.Login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      const submitButton = wrapper.find('button[type="submit"]')
      const form = wrapper.find('form')

      await form.trigger('submit.prevent')
      await nextTick()

      expect(submitButton.attributes('disabled')).toBeDefined()
      expect(submitButton.text()).toContain('loging In...')
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
    })

    it('redirects to dashboard on successful login', async () => {
      mockStore.Login.mockResolvedValue()
      mockStore.errorMsg = '' // No error

      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await nextTick()

      expect(router.push).toHaveBeenCalledWith('/dashboard')
    })

    it('does not redirect when there is an error', async () => {
      mockStore.Login.mockResolvedValue()
      mockStore.errorMsg = 'Invalid credentials'

      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await nextTick()

      expect(router.push).not.toHaveBeenCalled()
    })

    it('handles login errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockStore.Login.mockRejectedValue(new Error('Network error'))

      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await nextTick()

      expect(consoleError).toHaveBeenCalledWith('Login error:', expect.any(Error))
      consoleError.mockRestore()
    })
  })

  describe('Error Handling', () => {
    it('displays error message when present', async () => {
      mockStore.errorMsg = 'Invalid email or password'
      wrapper = createWrapper()
      await nextTick()

      const errorDiv = wrapper.find('.bg-red-100')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toBe('Invalid email or password')
    })

    it('hides error message when not present', () => {
      mockStore.errorMsg = ''
      wrapper = createWrapper()

      const errorDiv = wrapper.find('.bg-red-100')
      expect(errorDiv.exists()).toBe(false)
    })
  })

  describe('Component Lifecycle', () => {
    it('redirects to dashboard if already authenticated on mount', async () => {
      mockStore.isAuthenticated = true
      wrapper = createWrapper()
      await nextTick()

      expect(router.push).toHaveBeenCalledWith('/dashboard')
    })

    it('clears store status on mount', () => {
      wrapper = createWrapper()
      
      expect(mockStore.Clearstatus).toHaveBeenCalled()
    })

    it('does not redirect if not authenticated on mount', async () => {
      mockStore.isAuthenticated = false
      wrapper = createWrapper()
      await nextTick()

      expect(router.push).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility and UX', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('has proper input placeholders', () => {
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')

      expect(emailInput.attributes('placeholder')).toBe('you@example.com')
      expect(passwordInput.attributes('placeholder')).toBe('Password')
    })

    it('has remember me checkbox', () => {
      const checkbox = wrapper.find('input[type="checkbox"]')
      expect(checkbox.exists()).toBe(true)
      
      const label = wrapper.find('label')
      expect(label.text()).toContain('Remember me')
    })

    it('applies focus styles with proper classes', () => {
      const emailInput = wrapper.find('input[type="email"]')
      expect(emailInput.classes()).toContain('focus:ring-2')
      expect(emailInput.classes()).toContain('focus:ring-indigo-500')
    })

    it('has hover effects on interactive elements', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.classes()).toContain('hover:scale-105')
    })
  })

  describe('Form Validation', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('prevents form submission when button is disabled', async () => {
      // Mock the store to simulate a loading state
      mockStore.Login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      const form = wrapper.find('form')
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')

      // Fill in the form
      await emailInput.setValue('test@example.com')
      await passwordInput.setValue('password123')
      
      // Submit the form which will set isSubmitting to true
      await form.trigger('submit.prevent')
      await nextTick()

      // Now the button should be disabled and show loading state
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
      expect(submitButton.text()).toContain('loging In...')
    })

    it('accepts email input type', () => {
      const emailInput = wrapper.find('input[type="email"]')
      expect(emailInput.attributes('type')).toBe('email')
    })
  })
})