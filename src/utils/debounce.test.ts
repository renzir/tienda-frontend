import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce } from './debounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debe retornar la cadena con retraso', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'test', delay: 300 },
    })

    expect(result.current).toBe('')

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('test')

    rerender({ value: 'nuevo valor', delay: 300 })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('test')

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe('nuevo valor')
  })
})