// components/__tests__/Login.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import Login from '../../src/components/Login.vue'
import { useAuthStore } from '../../src/stores/auth'

// Mock the auth store
vi.mock('../../src/stores/auth')

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Login Component', () => {
  let wrapper
  let mockAuthStore
  let mockRouter
  let router

  beforeEach(async () => {
    // Setup Pinia
    setActivePinia(createPinia())
    
    // Create router for testing
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/login', component: { template: '<div>Login</div>' } },
        { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
        { path: '/dashstud', component: { template: '<div>Student Dashboard</div>' } },
        { path: '/dashSupervisor', component: { template: '<div>Supervisor Dashboard</div>' } },
        { path: '/DashboardProf', component: { template: '<div>Professor Dashboard</div>' } },
        { path: '/forgotpass', component: { template: '<div>Forgot Password</div>' } }
      ]
    })

    // Mock the auth store
    mockAuthStore = {
      Login: vi.fn(),
      checkAuth: vi.fn(),
      Clearstatus: vi.fn(),
      isAuthenticated: false,
      errorMsg: null,
      Role: null
    }
    
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
    
    // Clear localStorage mock
    localStorageMock.getItem.mockReturnValue(null)
    
    // Mount component
    wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    })

    await router.isReady()
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render login form correctly', () => {
      expect(wrapper.find('h2').text()).toBe('Log In')
      expect(wrapper.find('input[type="email"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('should render logo image', () => {
      const logo = wrapper.find('img[alt="Logo"]')
      expect(logo.exists()).toBe(true)
      expect(logo.attributes('src')).toBe('/src/assets/logo.png')
    })

    it('should render illustration on larger screens', () => {
      const illustration = wrapper.find('img[alt="Login Illustration"]')
      expect(illustration.exists()).toBe(true)
      expect(illustration.attributes('src')).toBe('/src/assets/Sign%20in-amico.svg')
    })

    it('should have forgot password link', () => {
      const forgotLink = wrapper.find('a[href="/forgotpass"]')
      expect(forgotLink.exists()).toBe(true)
      expect(forgotLink.text()).toBe('Forgot Password?')
    })
  })

  describe('Form Interactions', () => {
    it('should update email when input changes', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      await emailInput.setValue('test@example.com')
      
      expect(emailInput.element.value).toBe('test@example.com')
    })

    it('should update password when input changes', async () => {
      const passwordInput = wrapper.find('input[type="password"]')
      await passwordInput.setValue('password123')
      
      expect(passwordInput.element.value).toBe('password123')
    })

    it('should toggle password visibility', async () => {
      const toggleButton = wrapper.find('button[type="button"]')
      
      // Initially password input should exist
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
      
      await toggleButton.trigger('click')
      await nextTick()
      
      // After toggle, the password input should become text type
      const passwordField = wrapper.find('input[placeholder="Password"]')
      expect(passwordField.attributes('type')).toBe('text')
      
      await toggleButton.trigger('click')
      await nextTick()
      
      // After second toggle, should be back to password
      expect(passwordField.attributes('type')).toBe('password')
    })

    it('should handle remember me checkbox', async () => {
      const checkbox = wrapper.find('input[type="checkbox"]')
      await checkbox.setChecked(true)
      
      expect(checkbox.element.checked).toBe(true)
    })
  })

  describe('Form Submission', () => {
    it('should call store.Login with correct parameters on form submit', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')
      const checkbox = wrapper.find('input[type="checkbox"]')
      const form = wrapper.find('form')

      await emailInput.setValue('test@example.com')
      await passwordInput.setValue('password123')
      await checkbox.setChecked(true)

      mockAuthStore.Login.mockResolvedValue()
      mockAuthStore.errorMsg = null

      await form.trigger('submit.prevent')

      expect(mockAuthStore.Login).toHaveBeenCalledWith('test@example.com', 'password123', true)
    })

    it('should show loading state during submission', async () => {
      const form = wrapper.find('form')
      const submitButton = wrapper.find('button[type="submit"]')

      // Mock a delayed login
      let resolveLogin
      mockAuthStore.Login.mockImplementation(() => new Promise(resolve => {
        resolveLogin = resolve
      }))

      const submitPromise = form.trigger('submit.prevent')
      await nextTick()

      expect(submitButton.attributes('disabled')).toBeDefined()
      expect(submitButton.text()).toContain('loging In...')
      expect(wrapper.find('.animate-spin').exists()).toBe(true)

      // Resolve the promise
      resolveLogin()
      await submitPromise
      await nextTick()

      expect(submitButton.attributes('disabled')).toBe(undefined)
      expect(submitButton.text()).toBe('Log In')
    })

    it('should handle login error', async () => {
      const form = wrapper.find('form')
      
      mockAuthStore.Login.mockRejectedValue(new Error('Login failed'))
      
      // Set error message on the store
      await form.trigger('submit.prevent')
      
      // Manually set the error message since we're mocking the store
      mockAuthStore.errorMsg = 'Invalid credentials'
      await wrapper.vm.$forceUpdate()
      await nextTick()

      expect(wrapper.find('.bg-red-100').exists()).toBe(true)
      expect(wrapper.find('.bg-red-100').text()).toBe('Invalid credentials')
    })
  })

  describe('Navigation Based on Role', () => {
    it('should redirect admin to dashboard after login', async () => {
      const routerPush = vi.spyOn(router, 'push')
      const form = wrapper.find('form')

      mockAuthStore.Login.mockResolvedValue()
      mockAuthStore.errorMsg = null
      mockAuthStore.Role = 'admin'

      await form.trigger('submit.prevent')
      await nextTick()

      expect(routerPush).toHaveBeenCalledWith('/dashboard')
    })

    it('should redirect student to student dashboard after login', async () => {
      const routerPush = vi.spyOn(router, 'push')
      const form = wrapper.find('form')

      mockAuthStore.Login.mockResolvedValue()
      mockAuthStore.errorMsg = null
      mockAuthStore.Role = 'student'

      await form.trigger('submit.prevent')
      await nextTick()

      expect(routerPush).toHaveBeenCalledWith('/dashstud')
    })

    it('should redirect supervisor to supervisor dashboard after login', async () => {
      const routerPush = vi.spyOn(router, 'push')
      const form = wrapper.find('form')

      mockAuthStore.Login.mockResolvedValue()
      mockAuthStore.errorMsg = null
      mockAuthStore.Role = 'supervisor'

      await form.trigger('submit.prevent')
      await nextTick()

      expect(routerPush).toHaveBeenCalledWith('/dashSupervisor')
    })

    it('should redirect professor to professor dashboard after login', async () => {
      const routerPush = vi.spyOn(router, 'push')
      const form = wrapper.find('form')

      mockAuthStore.Login.mockResolvedValue()
      mockAuthStore.errorMsg = null
      mockAuthStore.Role = 'Professor'

      await form.trigger('submit.prevent')
      await nextTick()

      expect(routerPush).toHaveBeenCalledWith('/DashboardProf')
    })

    it('should redirect to login for unknown role', async () => {
      const routerPush = vi.spyOn(router, 'push')
      const form = wrapper.find('form')

      mockAuthStore.Login.mockResolvedValue()
      mockAuthStore.errorMsg = null
      mockAuthStore.Role = 'unknown'

      await form.trigger('submit.prevent')
      await nextTick()

      expect(routerPush).toHaveBeenCalledWith('/login')
    })
  })

  describe('Component Lifecycle', () => {
    it('should redirect authenticated users on mount', async () => {
      const routerPush = vi.spyOn(router, 'push')
      
      mockAuthStore.isAuthenticated = true
      mockAuthStore.Role = 'admin'

      // Remount component to trigger onMounted
      wrapper.unmount()
      wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      })

      await nextTick()

      expect(routerPush).toHaveBeenCalledWith('/dashboard')
    })

    it('should check auth if not authenticated on mount', async () => {
      mockAuthStore.isAuthenticated = false

      // Remount component to trigger onMounted
      wrapper.unmount()
      wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      })

      await nextTick()

      expect(mockAuthStore.checkAuth).toHaveBeenCalled()
    })

    it('should clear status on mount', async () => {
      // Remount component to trigger onMounted
      wrapper.unmount()
      wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      })

      await nextTick()

      expect(mockAuthStore.Clearstatus).toHaveBeenCalled()
    })
  })

  describe('LocalStorage Integration', () => {
    it('should initialize RememberMe from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('true')

      wrapper.unmount()
      wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      })

      expect(localStorageMock.getItem).toHaveBeenCalledWith('remember_me')
    })

    it('should handle null localStorage value', () => {
      localStorageMock.getItem.mockReturnValue(null)

      wrapper.unmount()
      wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      })

      expect(localStorageMock.getItem).toHaveBeenCalledWith('remember_me')
      // Component should still work normally
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })
  })

  describe('Error Display', () => {
    it('should show error message when store has error', async () => {
      // Create a new wrapper with error state
      wrapper.unmount()
      
      const errorStore = {
        ...mockAuthStore,
        errorMsg: 'Invalid email or password'
      }
      
      vi.mocked(useAuthStore).mockReturnValue(errorStore)
      
      wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      })
      
      await nextTick()

      const errorDiv = wrapper.find('.bg-red-100')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toBe('Invalid email or password')
    })

    it('should hide error message when no error', async () => {
      mockAuthStore.errorMsg = null
      
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.bg-red-100').exists()).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels and structure', () => {
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')
      
      expect(emailInput.attributes('placeholder')).toBe('you@example.com')
      expect(passwordInput.attributes('placeholder')).toBe('Password')
    })

    it('should have proper button states', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('type')).toBe('submit')
    })
  })

  describe('Styling and Animations', () => {
    it('should have correct CSS classes for styling', () => {
      expect(wrapper.find('.animate-fade-in').exists()).toBe(true)
      expect(wrapper.find('.animate-slide-in-right').exists()).toBe(true)
      expect(wrapper.find('.bg-gradient-to-r').exists()).toBe(true)
    })

    it('should have hover effects on interactive elements', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.classes()).toContain('hover:scale-105')
      
      const inputs = wrapper.findAll('input[type="email"], input[type="password"]')
      inputs.forEach(input => {
        expect(input.classes()).toContain('hover:scale-[1.01]')
      })
    })
  })
})