import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SkillModal from '@/components/Addskill.vue'

// Mock dependencies
const mockRouterPush = vi.fn()
const mockFormStore = {
  errors: {},
  error: null,
  success: null,
  loading: false,
  SelectedSkill: {
    skill_name: 'Test Skill',
    question1: 'Test Question 1',
    question2: 'Test Question 2', 
    question3: 'Test Question 3',
    description_skill: 'Test Description'
  },
  sanitizeInputs: vi.fn((data) => data),
  validateWithSchema: vi.fn().mockResolvedValue(true),
  submitForm: vi.fn().mockResolvedValue(true),
  Update: vi.fn().mockResolvedValue(true),
  clearStatus: vi.fn()
}

const mockAuthStore = {
  ID: 'test-admin-id'
}

vi.mock('@/stores/form', () => ({
  useFormStore: () => mockFormStore
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => mockAuthStore
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush
  }),
  useRoute: () => ({
    params: {} // Default to create mode
  })
}))

vi.mock('@/schemas/CreateSkill.schema', () => ({
  default: {
    pick: vi.fn().mockReturnValue({})
  }
}))

describe('SkillModal', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset form store state
    mockFormStore.errors = {}
    mockFormStore.error = null
    mockFormStore.success = null
    mockFormStore.loading = false
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Create Mode', () => {
    beforeEach(() => {
      wrapper = mount(SkillModal)
    })

    it('should render in create mode when no skill_name param', () => {
      expect(wrapper.find('h2').text()).toBe('Add Skill')
      expect(wrapper.find('p').text()).toBe('Fill in the skill and its indicators below')
    })

    it('should initialize with empty form data in create mode', () => {
      const vm = wrapper.vm
      expect(vm.skill.skill_name).toBe('')
      expect(vm.skill.question1).toBe('')
      expect(vm.skill.question2).toBe('')
      expect(vm.skill.question3).toBe('')
      expect(vm.skill.description_skill).toBe('')
      expect(vm.skill.id_admin).toBe('test-admin-id')
    })

    it('should not have readonly skill name input in create mode', () => {
      const skillNameInput = wrapper.find('input[placeholder="Skill name"]')
      expect(skillNameInput.attributes('readonly')).toBeUndefined()
      expect(skillNameInput.classes()).not.toContain('bg-gray-100')
    })

    it('should submit form for creation', async () => {
      // Fill out the form
      await wrapper.find('input[placeholder="Skill name"]').setValue('New Skill')
      await wrapper.find('input[placeholder="First indicator"]').setValue('Indicator 1')
      await wrapper.find('input[placeholder="Second indicator"]').setValue('Indicator 2') 
      await wrapper.find('input[placeholder="Third indicator"]').setValue('Indicator 3')
      await wrapper.find('textarea').setValue('Skill description')

      // Submit form
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()

      expect(mockFormStore.sanitizeInputs).toHaveBeenCalled()
      expect(mockFormStore.validateWithSchema).toHaveBeenCalled()
      expect(mockFormStore.submitForm).toHaveBeenCalledWith(
        '/admin/skills/create',
        expect.objectContaining({
          skill_name: 'New Skill',
          question1: 'Indicator 1',
          question2: 'Indicator 2',
          question3: 'Indicator 3',
          description_skill: 'Skill description',
          id_admin: 'test-admin-id'
        }),
        expect.any(Function)
      )
    })

    it('should handle validation errors in create mode', async () => {
      mockFormStore.validateWithSchema.mockResolvedValue(false)
      
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()

      expect(mockFormStore.submitForm).not.toHaveBeenCalled()
    })

    it('should handle form submission errors in create mode', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      mockFormStore.submitForm.mockRejectedValue(new Error('API Error'))

      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()

      expect(consoleLogSpy).toHaveBeenCalledWith('Error while trying to add the skill:', expect.any(Error))
      consoleLogSpy.mockRestore()
    })
  })

  describe('Edit Mode', () => {
    beforeEach(() => {
      // Mock route to have skill_name parameter for edit mode
      vi.mocked(vi.importActual('vue-router')).useRoute = () => ({
        params: { skill_name: 'existing-skill' }
      })

      wrapper = mount(SkillModal)
    })

    it('should render in edit mode when skill_name param exists', () => {
      expect(wrapper.find('h2').text()).toBe('Edit Skill')
    })

    it('should load existing skill data in edit mode', () => {
      const vm = wrapper.vm
      expect(vm.skill.skill_name).toBe('Test Skill')
      expect(vm.skill.question1).toBe('Test Question 1')
      expect(vm.skill.question2).toBe('Test Question 2')
      expect(vm.skill.question3).toBe('Test Question 3')
      expect(vm.skill.description_skill).toBe('Test Description')
    })

    it('should have readonly skill name input in edit mode', () => {
      const skillNameInput = wrapper.find('input[placeholder="Skill name"]')
      expect(skillNameInput.attributes('readonly')).toBeDefined()
      expect(skillNameInput.classes()).toContain('bg-gray-100')
      expect(skillNameInput.classes()).toContain('cursor-not-allowed')
    })

    it('should only update changed fields in edit mode', async () => {
      // Change only one field
      await wrapper.find('input[placeholder="First indicator"]').setValue('Updated Indicator 1')
      
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()

      expect(mockFormStore.sanitizeInputs).toHaveBeenCalledWith({
        question1: 'Updated Indicator 1'
      })
      expect(mockFormStore.Update).toHaveBeenCalledWith(
        '/admin/skills/Test Skill',
        { question1: 'Updated Indicator 1' }
      )
    })

    it('should not submit if no changes made in edit mode', async () => {
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()

      expect(mockFormStore.Update).not.toHaveBeenCalled()
      expect(mockRouterPush).toHaveBeenCalledWith('/Skills')
    })

    it('should handle update errors in edit mode', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      mockFormStore.Update.mockRejectedValue(new Error('Update Error'))

      await wrapper.find('input[placeholder="First indicator"]').setValue('Updated')
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()

      expect(consoleLogSpy).toHaveBeenCalledWith('Error during update:', expect.any(Error))
      consoleLogSpy.mockRestore()
    })
  })

  describe('Modal Functionality', () => {
    beforeEach(() => {
      wrapper = mount(SkillModal)
    })

    it('should render modal when isOpen is true', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
      expect(wrapper.vm.isOpen).toBe(true)
    })

    it('should close modal when close button is clicked', async () => {
      const closeButton = wrapper.find('button[class*="absolute top-4 right-4"]')
      await closeButton.trigger('click')

      expect(wrapper.vm.isOpen).toBe(false)
      expect(mockRouterPush).toHaveBeenCalledWith('/Skills')
    })

    it('should close modal when backdrop is clicked', async () => {
      const backdrop = wrapper.find('.fixed.inset-0.bg-gray-400\\/30')
      await backdrop.trigger('click')

      expect(wrapper.vm.isOpen).toBe(false)
      expect(mockRouterPush).toHaveBeenCalledWith('/Skills')
    })

    it('should close modal when cancel button is clicked', async () => {
      const cancelButton = wrapper.find('button[type="button"]')
      await cancelButton.trigger('click')

      expect(wrapper.vm.isOpen).toBe(false)
      expect(mockRouterPush).toHaveBeenCalledWith('/Skills')
    })

    it('should hide modal when isOpen is false', async () => {
      wrapper.vm.isOpen = false
      await nextTick()

      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })
  })

  describe('Form Validation and Errors', () => {
    beforeEach(() => {
      wrapper = mount(SkillModal)
    })

    it('should display form field errors', async () => {
      mockFormStore.errors = {
        skill_name: 'Skill name is required',
        question1: 'Question 1 is required',
        question2: 'Question 2 is required',
        question3: 'Question 3 is required'
      }

      await nextTick()

      const errorSpans = wrapper.findAll('.text-red-500.text-sm')
      expect(errorSpans[0].text()).toBe('Skill name is required')
      expect(errorSpans[1].text()).toBe('Question 1 is required')
      expect(errorSpans[2].text()).toBe('Question 2 is required')
      expect(errorSpans[3].text()).toBe('Question 3 is required')
    })

    it('should display API error message', async () => {
      mockFormStore.error = 'Server error occurred'
      await nextTick()

      const errorMessage = wrapper.find('.text-red-500.text-sm.animate-pulse')
      expect(errorMessage.text()).toBe('Server error occurred')
    })

    it('should display success message', async () => {
      mockFormStore.success = 'Skill saved successfully'
      await nextTick()

      const successMessage = wrapper.find('.text-green-500.text-sm.animate-pulse')
      expect(successMessage.text()).toBe('Skill saved successfully')
    })
  })

  describe('Loading States', () => {
    beforeEach(() => {
      wrapper = mount(SkillModal)
    })

    it('should show loading state on submit button', async () => {
      mockFormStore.loading = true
      await nextTick()

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.text()).toBe('Saving...')
      expect(submitButton.attributes('disabled')).toBeDefined()
      expect(submitButton.classes()).toContain('disabled:opacity-50')
    })

    it('should show normal state when not loading', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.text()).toBe('Save')
      expect(submitButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Form Input Interactions', () => {
    beforeEach(() => {
      wrapper = mount(SkillModal)
    })

    it('should update skill data when inputs change', async () => {
      const skillNameInput = wrapper.find('input[placeholder="Skill name"]')
      const question1Input = wrapper.find('input[placeholder="First indicator"]')
      const question2Input = wrapper.find('input[placeholder="Second indicator"]')
      const question3Input = wrapper.find('input[placeholder="Third indicator"]')
      const descriptionTextarea = wrapper.find('textarea')

      await skillNameInput.setValue('Test Skill Name')
      await question1Input.setValue('Test Question 1')
      await question2Input.setValue('Test Question 2')
      await question3Input.setValue('Test Question 3')
      await descriptionTextarea.setValue('Test Description')

      expect(wrapper.vm.skill.skill_name).toBe('Test Skill Name')
      expect(wrapper.vm.skill.question1).toBe('Test Question 1')
      expect(wrapper.vm.skill.question2).toBe('Test Question 2')
      expect(wrapper.vm.skill.question3).toBe('Test Question 3')
      expect(wrapper.vm.skill.description_skill).toBe('Test Description')
    })

    it('should have proper focus styles on inputs', () => {
      const inputs = wrapper.findAll('input, textarea')
      inputs.forEach(input => {
        expect(input.classes()).toContain('focus:ring-2')
        expect(input.classes()).toContain('focus:ring-purple-500')
      })
    })
  })

  describe('Component Lifecycle', () => {
    it('should clear form status on mount', () => {
      mount(SkillModal)
      expect(mockFormStore.clearStatus).toHaveBeenCalled()
    })

    it('should handle successful form submission callback', async () => {
      wrapper = mount(SkillModal)
      
      // Simulate successful form submission with callback
      await wrapper.find('form').trigger('submit.prevent')
      
      // Get the callback function passed to submitForm
      const submitFormCall = mockFormStore.submitForm.mock.calls[0]
      const callback = submitFormCall[2]
      
      // Execute the callback
      callback()
      
      expect(wrapper.vm.isOpen).toBe(false)
    })

    it('should navigate to Skills page after successful operations', async () => {
      wrapper = mount(SkillModal)
      mockFormStore.errors = {}
      
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()

      expect(mockFormStore.clearStatus).toHaveBeenCalled()
      expect(mockRouterPush).toHaveBeenCalledWith('/Skills')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing SelectedSkill in edit mode', () => {
      mockFormStore.SelectedSkill = null
      
      vi.mocked(vi.importActual('vue-router')).useRoute = () => ({
        params: { skill_name: 'existing-skill' }
      })

      const wrapperWithNoSkill = mount(SkillModal)
      expect(wrapperWithNoSkill.vm.skill).toBeDefined()
      wrapperWithNoSkill.unmount()
    })

    it('should handle partial schema creation in edit mode', async () => {
      const mockSchema = { pick: vi.fn().mockReturnValue({}) }
      vi.mocked(vi.importActual('@/schemas/CreateSkill.schema')).default = mockSchema

      vi.mocked(vi.importActual('vue-router')).useRoute = () => ({
        params: { skill_name: 'existing-skill' }
      })

      wrapper = mount(SkillModal)
      
      await wrapper.find('input[placeholder="First indicator"]').setValue('Updated')
      await wrapper.find('form').trigger('submit.prevent')
      
      expect(mockSchema.pick).toHaveBeenCalledWith(['question1'])
    })
  })
})