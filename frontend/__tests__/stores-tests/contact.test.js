// test/contactStore.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useContactStore } from '@/stores/contact'
import api from '@/services/api'

vi.mock('@/services/api')

describe('Contact Store', () => {
  let contactStore

  beforeEach(() => {
    // Set up Pinia for testing
    setActivePinia(createPinia())
    contactStore = useContactStore()
  })

  it('should initialize with correct default values', () => {
    expect(contactStore.errormsg).toBe(null)
    expect(contactStore.successmsg).toBe(null)
    expect(contactStore.isSending).toBe(false)
  })

  it('should send a message successfully and update success message', async () => {
    // Arrange: Mock the API call to return a success response
    const mockResponse = { data: 'Message sent' }
    api.post.mockResolvedValue(mockResponse)

    const payload = { name: 'Test', message: 'Hello!' }

    // Act: Call the sendMsg function
    await contactStore.sendMsg(payload)

    // Assert: Check that success message is set correctly
    expect(contactStore.successmsg).toBe('Message sent successfully!')
    expect(contactStore.errormsg).toBe(null)
    expect(contactStore.isSending).toBe(false)
  })

  it('should handle API error and set error message', async () => {
    // Arrange: Mock the API call to return an error response
    const errorMessage = 'Error while sending. Please try again.'
    api.post.mockRejectedValue({ response: { data: { message: errorMessage } } })

    const payload = { name: 'Test', message: 'Hello!' }

    // Act: Call the sendMsg function
    await contactStore.sendMsg(payload)

    // Assert: Check that error message is set correctly
    expect(contactStore.successmsg).toBe(null)
    expect(contactStore.errormsg).toBe(errorMessage)
    expect(contactStore.isSending).toBe(false)
  })

  it('should handle general error and set default error message', async () => {
    // Arrange: Mock the API call to throw a general error
    api.post.mockRejectedValue({ response: null })

    const payload = { name: 'Test', message: 'Hello!' }

    // Act: Call the sendMsg function
    await contactStore.sendMsg(payload)

    // Assert: Check that default error message is set
    expect(contactStore.successmsg).toBe(null)
    expect(contactStore.errormsg).toBe('Error while sending. Please try again.')
    expect(contactStore.isSending).toBe(false)
  })

  it('should correctly update sending state', async () => {
    // Arrange: Mock API call
    const mockResponse = { data: 'Message sent' }
    api.post.mockResolvedValue(mockResponse)

    const payload = { name: 'Test', message: 'Hello!' }

    // Act: Call the sendMsg function
    const sendPromise = contactStore.sendMsg(payload)

    // Assert: Check that sending state is true while sending
    expect(contactStore.isSending).toBe(true)

    // Wait for the send to complete
    await sendPromise

    // Assert: Check that sending state is false after the request completes
    expect(contactStore.isSending).toBe(false)
  })
})
