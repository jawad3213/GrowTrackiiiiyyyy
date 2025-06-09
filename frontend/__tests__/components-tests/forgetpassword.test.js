import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ForgotPassword from '../../src/components/forgotPassword.vue' // Adjust path as needed

// Mock router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock the stores
const mockAuthStore = {
  errorMsg: null,
  load: false,
  forgotPassword: vi.fn(),
  Clearstatus: vi.fn()
}

const mockFormStore = {
  sanitizeInputs: vi.fn((input) => input),
  clearStatus: vi.fn()
}

vi.mock('../../src/stores/auth', () => ({
  useAuthStore: () => mockAuthStore
}))

vi.mock('@/stores/form', () => ({
  useFormStore: () => mockFormStore
}))

describe('ForgotPassword Component', () => {
  let wrapper

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
    
    // Reset store state
    mockAuthStore.errorMsg = null
    mockAuthStore.load = false
    mockFormStore.sanitizeInputs.mockImplementation((input) => input)
    
    // Create Pinia instance
    const pinia = createPinia()
    setActivePinia(pinia)
    
    // Mount component
    wrapper = mount(ForgotPassword, {
      global: {
        plugins: [pinia]
      }
    })
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('Component Rendering', () => {
    it('renders the component correctly', () => {
      expect(wrapper.find('h1').text()).toBe('Forgotten your password?')
      expect(wrapper.find('p').text()).toContain('There is nothing to worry about')
      expect(wrapper.find('input[type="email"]').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('displays correct labels and placeholders', () => {
      const emailInput = wrapper.find('input[type="email"]')
      const emailLabel = wrapper.find('label')
      
      expect(emailLabel.text()).toBe('Email address')
      expect(emailInput.attributes('placeholder')).toBe('Enter your email address')
    })

    it('has required attribute on email input', () => {
      const emailInput = wrapper.find('input[type="email"]')
      expect(emailInput.attributes('required')).toBeDefined()
    })
  })

  describe('Form Interaction', () => {
    it('updates email value when user types', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      
      await emailInput.setValue('test@example.com')
      
      expect(wrapper.vm.emailres).toBe('test@example.com')
    })

    it('calls store methods on form submit', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      const form = wrapper.find('form')
      
      await emailInput.setValue('test@example.com')
      await form.trigger('submit')
      
      // Wait for async operations
      await wrapper.vm.$nextTick()
      
      expect(mockFormStore.sanitizeInputs).toHaveBeenCalledWith({
        email: 'test@example.com'
      })
      expect(mockAuthStore.forgotPassword).toHaveBeenCalled()
    })

    it('prevents default form submission', async () => {
      const form = wrapper.find('form')
      const preventDefault = vi.fn()
      
      await form.trigger('submit', { preventDefault })
      
      // The @submit.prevent should handle this, but we can't directly test preventDefault
      // Instead, we test that our store methods are called
      expect(mockAuthStore.forgotPassword).toHaveBeenCalled()
    })
  })

  describe('Forgot Password Functionality', () => {
    it('calls sanitizeInputs and forgotPassword on form submission', async () => {
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      
      const form = wrapper.find('form')
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      expect(mockFormStore.sanitizeInputs).toHaveBeenCalledWith({
        email: 'test@example.com'
      })
      expect(mockAuthStore.forgotPassword).toHaveBeenCalledWith('test@example.com')
    })

    it('navigates to /check when no error occurs', async () => {
      mockAuthStore.errorMsg = null
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      
      const form = wrapper.find('form')
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      expect(mockFormStore.clearStatus).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/check')
    })

    it('does not navigate when error occurs', async () => {
      mockAuthStore.errorMsg = 'Email not found'
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      
      const form = wrapper.find('form')
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      expect(mockFormStore.clearStatus).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('handles errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockAuthStore.forgotPassword.mockRejectedValue(new Error('Network error'))
      
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      
      const form = wrapper.find('form')
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'An Error occured while trying to send the email, Please retry :',
        expect.any(Error)
      )
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('Error Display', () => {
    it('shows error message when store.errorMsg is set', async () => {
      mockAuthStore.errorMsg = 'Invalid email address'
      
      // Force reactivity update
      await wrapper.vm.$forceUpdate()
      await wrapper.vm.$nextTick()
      
      const errorElement = wrapper.find('.text-red-600')
      expect(errorElement.exists()).toBe(true)
      expect(errorElement.text()).toBe('Invalid email address')
    })

    it('hides error message when store.errorMsg is null', async () => {
      mockAuthStore.errorMsg = null
      
      await wrapper.vm.$nextTick()
      
      const errorElement = wrapper.find('.text-red-600')
      expect(errorElement.exists()).toBe(false)
    })

    it('applies fade-in animation class to error message', async () => {
      mockAuthStore.errorMsg = 'Some error'
      
      // Force reactivity update
      await wrapper.vm.$forceUpdate()
      await wrapper.vm.$nextTick()
      
      const errorElement = wrapper.find('.text-red-600')
      expect(errorElement.exists()).toBe(true)
      expect(errorElement.classes()).toContain('animate-fade-in')
    })
  })

  describe('Loading State', () => {
    it('shows "Sending..." when loading', async () => {
      mockAuthStore.load = true
      
      // Force reactivity update
      await wrapper.vm.$forceUpdate()
      await wrapper.vm.$nextTick()
      
      const button = wrapper.find('button[type="submit"]')
      expect(button.text()).toBe('Sending...')
    })

    it('shows "Send Reset Link" when not loading', async () => {
      mockAuthStore.load = false
      
      await wrapper.vm.$nextTick()
      
      const button = wrapper.find('button[type="submit"]')
      expect(button.text()).toBe('Send Reset Link')
    })

    it('disables button when loading', async () => {
      mockAuthStore.load = true
      
      // Force reactivity update
      await wrapper.vm.$forceUpdate()
      await wrapper.vm.$nextTick()
      
      const button = wrapper.find('button[type="submit"]')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('enables button when not loading', async () => {
      mockAuthStore.load = false
      
      await wrapper.vm.$nextTick()
      
      const button = wrapper.find('button[type="submit"]')
      expect(button.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Lifecycle Hooks', () => {
    it('calls store.Clearstatus on mount', () => {
      expect(mockAuthStore.Clearstatus).toHaveBeenCalled()
    })
  })

  describe('Styling and CSS Classes', () => {
    it('applies correct CSS classes to main container', () => {
      const mainDiv = wrapper.find('.min-h-screen')
      expect(mainDiv.classes()).toContain('flex')
      expect(mainDiv.classes()).toContain('items-center')
      expect(mainDiv.classes()).toContain('justify-center')
      expect(mainDiv.classes()).toContain('bg-gradient-to-r')
    })

    it('applies correct CSS classes to form card', () => {
      const card = wrapper.find('.bg-white')
      expect(card.classes()).toContain('rounded-xl')
      expect(card.classes()).toContain('shadow-lg')
      expect(card.classes()).toContain('max-w-md')
    })

    it('applies correct CSS classes to submit button', () => {
      const button = wrapper.find('button[type="submit"]')
      expect(button.classes()).toContain('bg-gradient-to-r')
      expect(button.classes()).toContain('from-purple-600')
      expect(button.classes()).toContain('to-orange-400')
    })
  })

  describe('Integration Tests', () => {
    it('completes full form submission flow successfully', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      const form = wrapper.find('form')
      
      // User enters email
      await emailInput.setValue('user@example.com')
      
      // User submits form
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      // Verify the store methods were called
      expect(mockFormStore.sanitizeInputs).toHaveBeenCalledWith({
        email: 'user@example.com'
      })
      expect(mockAuthStore.forgotPassword).toHaveBeenCalled()
    })

    it('handles sanitized input from form store', async () => {
      const sanitizedEmail = 'sanitized@example.com'
      mockFormStore.sanitizeInputs.mockReturnValue({ email: sanitizedEmail })
      
      await wrapper.find('input[type="email"]').setValue('  dirty@example.com  ')
      
      const form = wrapper.find('form')
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      expect(mockAuthStore.forgotPassword).toHaveBeenCalledWith(sanitizedEmail)
    })
  })
})