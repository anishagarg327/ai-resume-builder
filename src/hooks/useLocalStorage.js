import { useState, useEffect } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        // If initialValue is not string or item is JSON object/array
        if (typeof initialValue !== 'string') {
          return JSON.parse(item)
        }
        return item
      }
      return initialValue instanceof Function ? initialValue() : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue instanceof Function ? initialValue() : initialValue
    }
  })

  useEffect(() => {
    try {
      const valueToStore = typeof storedValue === 'string' ? storedValue : JSON.stringify(storedValue)
      window.localStorage.setItem(key, valueToStore)
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
