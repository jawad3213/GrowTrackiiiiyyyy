import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ForgetPassword from '../../src/components/forgotPassword.vue'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'

describe('ForgetPassword.vue', () => {
  let router

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/check', component: { template: '<div>Check</div>' } }
      ]
    })
  })

  it('renders the title and subtitle', () => {
    const wrapper = mount(ForgetPassword, {
      global: {
        plugins: [createTestingPinia({
            createSpy: vi.fn
          })
          , router]
      }
    })

    expect(wrapper.text()).toContain('Forgotten your password?')
    expect(wrapper.text()).toContain('There is nothing to worry about')
  })

  it('updates emailres when typing', async () => {
    const wrapper = mount(ForgetPassword, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
    const input = wrapper.find('input[type="email"]')
    await input.setValue('test@example.com')
    expect(input.element.value).toBe('test@example.com')
  })

  it('calls forgotPassword and redirects if no error', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn
    })

    const useAuthStore = (await import('../../src/stores/auth')).useAuthStore
    const storeInstance = useAuthStore(pinia)
    storeInstance.forgotPassword = vi.fn(() => Promise.resolve())
    storeInstance.errorMsg = null

    const wrapper = mount(ForgetPassword, {
      global: {
        plugins: [pinia, router]
      }
    })

    router.push('/')
    await router.isReady()

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(storeInstance.forgotPassword).toHaveBeenCalled()
    expect(router.currentRoute.value.path).toBe('/check')
  })

  it('shows error message if errorMsg is set', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn
    })
    const useAuthStore = (await import('../../src/stores/auth')).useAuthStore
    const storeInstance = useAuthStore(pinia)
    storeInstance.errorMsg = 'Invalid email'

    const wrapper = mount(ForgetPassword, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('Invalid email')
  })

  it('redirects to home if authenticated on mount', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const useAuthStore = (await import('../../src/stores/auth')).useAuthStore
    const storeInstance = useAuthStore(pinia)
    storeInstance.isAuthenticated = true

    router.push('/somepage')
    await router.isReady()

    const wrapper = mount(ForgetPassword, {
      global: {
        plugins: [pinia, router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/')
  })

  it('calls Clearstatus on mount', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn
    })
    const useAuthStore = (await import('../../src/stores/auth')).useAuthStore
    const storeInstance = useAuthStore(pinia)

    mount(ForgetPassword, {
      global: {
        plugins: [pinia, router]
      }
    })

    expect(storeInstance.Clearstatus).toHaveBeenCalled()
  })
})
