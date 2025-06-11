import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import ResetPasswordComponent from '@/components/resetPassword.vue' // Adjust path as needed
import { useAuthStore } from '@/stores/auth'
import { useFormStore } from '@/stores/form'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/check', component: { template: '<div>Check</div>' } }
  ]
})

// Mock stores
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn()
}))

vi.mock('@/stores/form', () => ({
  useFormStore: vi.fn()
}))

// Mock yup validation
vi.mock('yup', () => ({
  object: vi.fn(() => ({
    validate: vi.fn()
  })),
  string: vi.fn(() => ({
    required: vi.fn().mockReturnThis(),
    min: vi.fn().mockReturnThis(),
    max: vi.fn().mockReturnThis(),
    test: vi.fn().mockReturnThis(),
    matches: vi.fn().mockReturnThis()
  }))
}))

describe('ResetPasswordComponent', () => {
  let wrapper
  let mockAuthStore
  let mockFormStore
  let pinia

  beforeEach(() => {
    // Create fresh pinia instance
    pinia = createPinia()
    setActivePinia(pinia)

    // Mock auth store implementation
    mockAuthStore = {
      validtoken: false,
      load: false,
      errorMsg: '',
      isAuthenticated: false,
      error: '',
      CheckResetToken: vi.fn(),
      resetPassword: vi.fn(),
      checkAuth: vi.fn(),
      Clearstatus: vi.fn()
    }

    // Mock form store implementation
    mockFormStore = {
      errors: { newpassword: '' },
      validateWithSchema: vi.fn(),
      clearStatus: vi.fn()
    }

    // Mock the store hooks
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
    vi.mocked(useFormStore).mockReturnValue(mockFormStore)

    // Mock router methods
    vi.spyOn(router, 'push').mockResolvedValue()

    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (queryParams = {}) => {
    // Mock route with query parameters
    const mockRoute = {
      query: { token: 'test-token', ...queryParams }
    }

    return mount(ResetPasswordComponent, {
      global: {
        plugins: [router, pinia],
        mocks: {
          $route: mockRoute
        }
      }
    })
  }

  describe('Component Rendering - Invalid Token', () => {
    beforeEach(() => {
      mockAuthStore.validtoken = false
      wrapper = createWrapper()
    })

    it('renders invalid link message when token is invalid', () => {
      expect(wrapper.find('h1').text()).toBe('The link is invalide')
      expect(wrapper.text()).toContain('Please request another link')
    })

    it('shows loading state when load is true', async () => {
      mockAuthStore.load = true
      await wrapper.vm.$nextTick()
      await nextTick()
      
      expect(wrapper.text()).toContain('Loading...')
    })

    it('does not render password form when token is invalid', () => {
      expect(wrapper.find('input[type="password"]').exists()).toBe(false)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(false)
    })
  })

  describe('Component Rendering - Valid Token', () => {
    beforeEach(() => {
      mockAuthStore.validtoken = true
      wrapper = createWrapper()
    })

    it('renders password reset form when token is valid', () => {
      expect(wrapper.find('h1').text()).toBe('Create new password')
      expect(wrapper.text()).toContain('Your new password must be different from previously used passwords')
    })

    it('renders password input fields', () => {
      const passwordInputs = wrapper.findAll('input[type="password"]')
      expect(passwordInputs).toHaveLength(2)
      
      expect(passwordInputs[0].attributes('placeholder')).toBe('Must be at least 8 characters')
      expect(passwordInputs[1].attributes('placeholder')).toBe('Both passwords must match')
    })

    it('renders labels correctly', () => {
      const labels = wrapper.findAll('label')
      expect(labels[0].text()).toBe('Password')
      expect(labels[1].text()).toBe('Confirm Password')
    })

    it('renders submit button', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.exists()).toBe(true)
      expect(submitButton.text()).toBe('Reset password')
    })

    it('shows loading state when load is true', async () => {
      mockAuthStore.load = true
      await wrapper.vm.$nextTick()
      await nextTick()
      
      expect(wrapper.text()).toContain('Loading...')
    })
  })

  describe('Form Interactions', () => {
    beforeEach(() => {
      mockAuthStore.validtoken = true
      wrapper = createWrapper()
    })

    it('updates password input values', async () => {
      const passwordInputs = wrapper.findAll('input[type="password"]')
      
      await passwordInputs[0].setValue('NewPassword123')
      await passwordInputs[1].setValue('NewPassword123')
      
      expect(passwordInputs[0].element.value).toBe('NewPassword123')
      expect(passwordInputs[1].element.value).toBe('NewPassword123')
    })

    it('displays validation errors from form store', async () => {
      mockFormStore.errors.newpassword = 'Password is too weak'
      await wrapper.vm.$nextTick()
      await nextTick()
      
      expect(wrapper.text()).toContain('Password is too weak')
    })

    it('displays auth store error messages', async () => {
      mockAuthStore.errorMsg = 'Server error occurred'
      await wrapper.vm.$nextTick()
      await nextTick()
      
      expect(wrapper.text()).toContain('Server error occurred')
    })
  })

  describe('Token Validation on Mount', () => {
    it('calls CheckResetToken with token from URL', async () => {
      // Create wrapper with specific token
      const testToken = 'my-test-token'
      wrapper = createWrapper({ token: testToken })
      
      // Wait for the component to mount and the async function to execute
      await nextTick()
      
      expect(mockAuthStore.CheckResetToken).toHaveBeenCalledWith(testToken)
    })

    it('handles missing token from URL', async () => {
      wrapper = createWrapper({ token: '' }) // Empty token in query
      
      // Wait for mount
      await nextTick()
      
      // Should be called with empty string when no token is provided
      expect(mockAuthStore.CheckResetToken).toHaveBeenCalledWith('')
    })

    it('handles CheckResetToken error gracefully', async () => {
      mockAuthStore.CheckResetToken.mockRejectedValue(new Error('Network error'))
      wrapper = createWrapper()
      
      // Wait for the async error handling
      await nextTick()
      
      expect(console.log).toHaveBeenCalledWith('Invalide link')
    })
  })

  describe('Authentication Check on Mount', () => {
    it('calls checkAuth and Clearstatus on mount', () => {
      wrapper = createWrapper()
      
      expect(mockAuthStore.checkAuth).toHaveBeenCalled()
      expect(mockAuthStore.Clearstatus).toHaveBeenCalled()
    })

    it('redirects to home if user is already authenticated', async () => {
      mockAuthStore.isAuthenticated = true
      wrapper = createWrapper()
      await nextTick()
      
      expect(router.push).toHaveBeenCalledWith('/')
    })

    it('does not redirect if user is not authenticated', async () => {
      mockAuthStore.isAuthenticated = false
      wrapper = createWrapper()
      await nextTick()
      
      expect(router.push).not.toHaveBeenCalledWith('/')
    })
  })

  describe('Password Reset Functionality', () => {
    beforeEach(() => {
      mockAuthStore.validtoken = true
    })

    it('validates form with schema before submission', async () => {
      const testToken = 'reset-token'
      wrapper = createWrapper({ token: testToken })
      mockFormStore.validateWithSchema.mockResolvedValue(true)
      
      const passwordInputs = wrapper.findAll('input[type="password"]')
      const submitButton = wrapper.find('button[type="submit"]')
      
      await passwordInputs[0].setValue('ValidPassword123')
      await passwordInputs[1].setValue('ValidPassword123')
      await submitButton.trigger('click')
      
      expect(mockFormStore.validateWithSchema).toHaveBeenCalledWith(
        { newpassword: 'ValidPassword123' },
        expect.any(Object)
      )
    })

    it('calls resetPassword when validation passes and passwords match', async () => {
      const testToken = 'reset-token'
      wrapper = createWrapper({ token: testToken })
      mockFormStore.validateWithSchema.mockResolvedValue(true)
      mockAuthStore.resetPassword.mockResolvedValue()
      
      const passwordInputs = wrapper.findAll('input[type="password"]')
      const submitButton = wrapper.find('button[type="submit"]')
      
      await passwordInputs[0].setValue('ValidPassword123')
      await passwordInputs[1].setValue('ValidPassword123')
      await submitButton.trigger('click')
      
      expect(mockAuthStore.resetPassword).toHaveBeenCalledWith('ValidPassword123', testToken)
    })

    it('redirects to check page on successful password reset', async () => {
      const testToken = 'reset-token'
      wrapper = createWrapper({ token: testToken })
      mockFormStore.validateWithSchema.mockResolvedValue(true)
      mockAuthStore.resetPassword.mockResolvedValue()
      mockAuthStore.errorMsg = '' // No error
      
      const passwordInputs = wrapper.findAll('input[type="password"]')
      const submitButton = wrapper.find('button[type="submit"]')
      
      await passwordInputs[0].setValue('ValidPassword123')
      await passwordInputs[1].setValue('ValidPassword123')
      await submitButton.trigger('click')
      await nextTick()
      
      expect(mockFormStore.clearStatus).toHaveBeenCalled()
      expect(router.push).toHaveBeenCalledWith('/check')
    })

    it('does not redirect when there is an error', async () => {
      const testToken = 'reset-token'
      wrapper = createWrapper({ token: testToken })
      mockFormStore.validateWithSchema.mockResolvedValue(true)
      mockAuthStore.resetPassword.mockResolvedValue()
      mockAuthStore.errorMsg = 'Reset failed'
      
      const passwordInputs = wrapper.findAll('input[type="password"]')
      const submitButton = wrapper.find('button[type="submit"]')
      
      await passwordInputs[0].setValue('ValidPassword123')
      await passwordInputs[1].setValue('ValidPassword123')
      await submitButton.trigger('click')
      await nextTick()
      
      expect(router.push).not.toHaveBeenCalledWith('/check')
    })

    it('handles password mismatch', async () => {
      const testToken = 'reset-token'
      wrapper = createWrapper({ token: testToken })
      mockFormStore.validateWithSchema.mockResolvedValue(true)
      
      const passwordInputs = wrapper.findAll('input[type="password"]')
      const submitButton = wrapper.find('button[type="submit"]')
      
      await passwordInputs[0].setValue('ValidPassword123')
      await passwordInputs[1].setValue('DifferentPassword456')
      await submitButton.trigger('click')
      await nextTick()
      
      expect(mockAuthStore.error).toBe('Passwords do not match')
      expect(mockAuthStore.resetPassword).not.toHaveBeenCalled()
    })

    it('clears confirm password field on mismatch', async () => {
      const testToken = 'reset-token'
      wrapper = createWrapper({ token: testToken })
      mockFormStore.validateWithSchema.mockResolvedValue(true)
      
      const passwordInputs = wrapper.findAll('input[type="password"]')
      const submitButton = wrapper.find('button[type="submit"]')
      
      await passwordInputs[0].setValue('ValidPassword123')
      await passwordInputs[1].setValue('DifferentPassword456')
      await submitButton.trigger('click')
      await nextTick()
      
      expect(passwordInputs[1].element.value).toBe('')
    })

    it('does not proceed if validation fails', async () => {
      const testToken = 'reset-token'
      wrapper = createWrapper({ token: testToken })
      mockFormStore.validateWithSchema.mockResolvedValue(false)
      
      const passwordInputs = wrapper.findAll('input[type="password"]')
      const submitButton = wrapper.find('button[type="submit"]')
      
      await passwordInputs[0].setValue('weak')
      await passwordInputs[1].setValue('weak')
      await submitButton.trigger('click')
      
      expect(mockAuthStore.resetPassword).not.toHaveBeenCalled()
    })

    it('handles submission errors gracefully', async () => {
      const testToken = 'reset-token'
      wrapper = createWrapper({ token: testToken })
      mockFormStore.validateWithSchema.mockRejectedValue(new Error('Validation error'))
      
      const passwordInputs = wrapper.findAll('input[type="password"]')
      const submitButton = wrapper.find('button[type="submit"]')
      
      await passwordInputs[0].setValue('ValidPassword123')
      await passwordInputs[1].setValue('ValidPassword123')
      await submitButton.trigger('click')
      
      expect(console.error).toHaveBeenCalledWith(
        'An Error occured while submiting the password, Please Try again',
        expect.any(Error)
      )
    })
  })

  describe('UI States and Classes', () => {
    beforeEach(() => {
      mockAuthStore.validtoken = true
      wrapper = createWrapper()
    })

    it('applies correct CSS classes to inputs', () => {
      const passwordInputs = wrapper.findAll('input[type="password"]')
      
      passwordInputs.forEach(input => {
        expect(input.classes()).toContain('w-full')
        expect(input.classes()).toContain('border-2')
        expect(input.classes()).toContain('focus:border-purple-500')
      })
    })

    it('applies correct CSS classes to submit button', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      
      expect(submitButton.classes()).toContain('w-full')
      expect(submitButton.classes()).toContain('bg-purple-600')
      expect(submitButton.classes()).toContain('hover:bg-purple-700')
    })

    it('has proper form structure with required attributes', () => {
      const passwordInputs = wrapper.findAll('input[type="password"]')
      
      passwordInputs.forEach(input => {
        expect(input.attributes('required')).toBeDefined()
      })
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      mockAuthStore.validtoken = true
      wrapper = createWrapper()
    })

    it('has proper label associations', () => {
      const labels = wrapper.findAll('label')
      const inputs = wrapper.findAll('input[type="password"]')
      
      expect(labels).toHaveLength(2)
      expect(inputs).toHaveLength(2)
      
      // Check that labels exist for both inputs
      expect(labels[0].text()).toBe('Password')
      expect(labels[1].text()).toBe('Confirm Password')
    })

    it('has descriptive placeholders', () => {
      const passwordInputs = wrapper.findAll('input[type="password"]')
      
      expect(passwordInputs[0].attributes('placeholder')).toBe('Must be at least 8 characters')
      expect(passwordInputs[1].attributes('placeholder')).toBe('Both passwords must match')
    })
  })
})