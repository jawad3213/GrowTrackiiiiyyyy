import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import RejectionModal from '@/components/Rejected.vue'

// Mock dependencies
vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn()
  }
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {
      signalTd: 'test-signal-id'
    }
  })
}))

vi.mock('@/routers', () => ({
  default: {
    back: vi.fn(),
    push: vi.fn()
  }
}))

// Mock window.alert
global.alert = vi.fn()

describe('RejectionModal', () => {
  let wrapper
  let mockApiPost
  let mockRouterBack

  beforeEach(async () => {
    // Get the mocked functions
    const api = await import('@/services/api')
    const router = await import('@/routers')
    
    mockApiPost = api.default.post
    mockRouterBack = router.default.back
    
    // Reset all mocks before each test
    vi.clearAllMocks()
    
    wrapper = mount(RejectionModal, {
      global: {
        stubs: {
          // Stub any child components if needed
        }
      }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Component Initialization', () => {
    it('should render the modal when isOpen is true', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
      expect(wrapper.find('h2').text()).toBe('Rejection Reason')
    })

    it('should initialize with correct default values', () => {
      const vm = wrapper.vm
      expect(vm.isOpen).toBe(true)
      expect(vm.loading).toBe(false)
      expect(vm.errorApi).toBe(null)
      expect(vm.monitoring.details).toBe('')
      expect(vm.monitoring.Id).toBe('test-signal-id')
      expect(vm.errors).toEqual({})
    })

    it('should get signalTd from route query parameters', () => {
      expect(wrapper.vm.monitoring.Id).toBe('test-signal-id')
    })
  })

  describe('Modal Closing', () => {
    it('should close modal when X button is clicked', async () => {
      const closeButton = wrapper.find('button[class*="text-gray-500"]')
      await closeButton.trigger('click')
      
      expect(wrapper.vm.isOpen).toBe(false)
      expect(mockRouterBack).toHaveBeenCalledOnce()
    })

    it('should close modal when Cancel button is clicked', async () => {
      const cancelButton = wrapper.find('button[type="button"]')
      await cancelButton.trigger('click')
      
      expect(wrapper.vm.isOpen).toBe(false)
      expect(mockRouterBack).toHaveBeenCalledOnce()
    })

    it('should call closeModal method correctly', () => {
      const spy = vi.spyOn(wrapper.vm, 'closeModal')
      wrapper.vm.closeModal()
      
      expect(spy).toHaveBeenCalled()
      expect(wrapper.vm.isOpen).toBe(false)
      expect(mockRouterBack).toHaveBeenCalledOnce()
    })
  })

  describe('Form Validation', () => {
    it('should show validation error when details field is empty', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      expect(wrapper.vm.errors.details).toBe('This field is required.')
      expect(wrapper.find('.text-red-500.text-xs').text()).toBe('This field is required.')
    })

    it('should not show validation error when details field has content', async () => {
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Some rejection reason')
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      expect(wrapper.vm.errors.details).toBeUndefined()
    })

    it('should clear previous errors when form is submitted', async () => {
      // First, trigger validation error
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      expect(wrapper.vm.errors.details).toBe('This field is required.')
      
      // Then add content and submit again
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Valid reason')
      await form.trigger('submit.prevent')
      
      expect(wrapper.vm.errors.details).toBeUndefined()
    })
  })

  describe('Form Submission', () => {
    let mockApiPost

    beforeEach(async () => {
      const api = await import('@/services/api')
      mockApiPost = api.default.post
      mockApiPost.mockResolvedValue({ data: { success: true } })
    })

    it('should submit form with correct data when validation passes', async () => {
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Test rejection reason')
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      await nextTick()
      
      expect(mockApiPost).toHaveBeenCalledWith('/monitoring', {
        details: 'Test rejection reason',
        Id: 'test-signal-id'
      })
    })

    it('should show loading state during form submission', async () => {
      let resolvePromise
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockApiPost.mockReturnValue(promise)
      
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Test reason')
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      await nextTick()
      
      expect(wrapper.vm.loading).toBe(true)
      expect(wrapper.find('button[type="submit"]').text()).toBe('Sending...')
      expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
      
      // Resolve the promise to finish loading
      resolvePromise({ data: { success: true } })
      await nextTick()
      
      expect(wrapper.vm.loading).toBe(false)
    })

    it('should show success message and close modal on successful submission', async () => {
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Test reason')
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      await nextTick()
      
      expect(global.alert).toHaveBeenCalledWith('Notification sent successfully!')
      expect(wrapper.vm.isOpen).toBe(false)
      expect(mockRouterBack).toHaveBeenCalled()
    })

    it('should handle API error with message', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'Server error occurred'
          }
        }
      }
      mockApiPost.mockRejectedValue(errorResponse)
      
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Test reason')
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      await nextTick()
      
      expect(wrapper.vm.errorApi).toBe('Server error occurred')
      expect(wrapper.find('.text-red-500.text-sm').text()).toBe('Server error occurred')
      expect(wrapper.vm.loading).toBe(false)
    })

    it('should handle API error without specific message', async () => {
      const errorResponse = {
        response: {}
      }
      mockApiPost.mockRejectedValue(errorResponse)
      
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Test reason')
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      await nextTick()
      
      expect(wrapper.vm.errorApi).toBe('An error occurred while sending. Please try again.')
      expect(wrapper.vm.loading).toBe(false)
    })

    it('should handle network error', async () => {
      mockApiPost.mockRejectedValue(new Error('Network error'))
      
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Test reason')
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      await nextTick()
      
      expect(wrapper.vm.errorApi).toBe('An error occurred while sending. Please try again.')
      expect(wrapper.vm.loading).toBe(false)
    })

    it('should clear API error when form is resubmitted', async () => {
      // First submission with error
      mockApiPost.mockRejectedValue(new Error('Network error'))
      
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Test reason')
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      await nextTick()
      expect(wrapper.vm.errorApi).toBeTruthy()
      
      // Second submission should clear the error initially
      mockApiPost.mockResolvedValue({ data: { success: true } })
      await form.trigger('submit.prevent')
      
      expect(wrapper.vm.errorApi).toBe(null)
    })
  })

  describe('UI Interactions', () => {
    it('should update textarea value correctly', async () => {
      const textarea = wrapper.find('textarea')
      await textarea.setValue('New rejection reason')
      
      expect(wrapper.vm.monitoring.details).toBe('New rejection reason')
    })

    it('should show error message with animation class', async () => {
      mockApiPost.mockRejectedValue(new Error('Test error'))
      
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Test reason')
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      await nextTick()
      
      const errorElement = wrapper.find('.text-red-500.text-sm')
      expect(errorElement.exists()).toBe(true)
      expect(errorElement.classes()).toContain('animate-pulse')
    })

    it('should hide modal when isOpen is false', async () => {
      wrapper.vm.isOpen = false
      await nextTick()
      
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle route query parameters correctly', () => {
      // Test that the component properly reads the signalTd from route
      expect(wrapper.vm.monitoring.Id).toBe('test-signal-id')
      
      // Test that the Id is included in the monitoring object
      expect(wrapper.vm.monitoring).toHaveProperty('Id')
      expect(wrapper.vm.monitoring).toHaveProperty('details')
    })

    it('should handle form submission when already loading', async () => {
      wrapper.vm.loading = true
      await nextTick()
      
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Test reason')
      
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('should prevent form submission when validation fails', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      expect(mockApiPost).not.toHaveBeenCalled()
      expect(wrapper.vm.errors.details).toBe('This field is required.')
    })
  })
})