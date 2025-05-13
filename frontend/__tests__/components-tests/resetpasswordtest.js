// tests/ResetPassword.spec.ts
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import ResetPassword from '../../src/components/resetPassword.vue'

describe('ResetPassword.vue', () => {
  let router
  let pinia
  let store

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/check', name: 'check', component: { template: '<div>Check</div>' } }
      ]
    })

    pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false // so we can manually mock them
    })

    // Import the store from actual file (or mock it manually)
    const { useAuthStore } = await import('../../src/stores/auth')
    store = useAuthStore(pinia)

    router.push('/reset-password?token=1234')
    await router.isReady()
  })

  it('redirects to home if authenticated on mount', async () => {
    store.isAuthenticated = true

    mount(ResetPassword, {
      global: {
        plugins: [pinia, router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/')
  })

  it('calls store.Clearstatus on mount', async () => {
    const clearStatusSpy = vi.spyOn(store, 'Clearstatus')

    mount(ResetPassword, {
      global: { plugins: [pinia, router] }
    })

    expect(clearStatusSpy).toHaveBeenCalled()
  })

  it('shows error message if passwords do not match', async () => {
    const wrapper = mount(ResetPassword, {
      global: { plugins: [pinia, router] }
    })

    await wrapper.find('input[type="password"]').setValue('password1')
    await wrapper.findAll('input[type="password"]')[1].setValue('password2')

    await wrapper.find('button').trigger('click')

    expect(store.errorMsg).toBe('Passwords do not match')
    expect(wrapper.text()).toContain('Passwords do not match')
  })

  it('calls resetPassword with correct params when passwords match', async () => {
    const resetPasswordSpy = vi.spyOn(store, 'resetPassword').mockResolvedValue()

    const wrapper = mount(ResetPassword, {
      global: { plugins: [pinia, router] }
    })

    await wrapper.find('input[type="password"]').setValue('mysecurepassword')
    await wrapper.findAll('input[type="password"]')[1].setValue('mysecurepassword')

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(resetPasswordSpy).toHaveBeenCalledWith('mysecurepassword', '1234')
  })

  it('redirects to /check if resetPassword succeeds and no errorMsg', async () => {
    store.errorMsg = ''
    vi.spyOn(store, 'resetPassword').mockImplementation(async () => { })

    const wrapper = mount(ResetPassword, {
      global: { plugins: [pinia, router] }
    })

    await wrapper.find('input[type="password"]').setValue('securepass')
    await wrapper.findAll('input[type="password"]')[1].setValue('securepass')

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/check')
  })

  it('displays "Loading..." when store.load is true', () => {
    store.load = true

    const wrapper = mount(ResetPassword, {
      global: { plugins: [pinia, router] }
    })

    expect(wrapper.text()).toContain('Loading...')
  })
})
