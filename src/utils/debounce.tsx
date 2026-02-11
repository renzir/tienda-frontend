import { useRef, useState, useEffect } from 'react'

export function useDebounce(value: string, delay: number = 300) {
  const [valor, setValor] = useState('')

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      setValor(value)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, delay]) // 

  return valor
}
