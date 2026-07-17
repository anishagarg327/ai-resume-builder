import { useState, useMemo } from 'react'
import { MONTHS } from '../constants/dates'

export const useDatePicker = ({ updateExperience, updateEducation, updateProject }) => {
  const [activeDatePicker, setActiveDatePicker] = useState(null)
  const [startMonth, setStartMonth] = useState('Jan')
  const [startYear, setStartYear] = useState('2024')
  const [endMonth, setEndMonth] = useState('Jan')
  const [endYear, setEndYear] = useState('2024')
  const [isPresent, setIsPresent] = useState(false)
  const [isYearOnly, setIsYearOnly] = useState(false)

  const openDatePicker = (type, index, currentValue) => {
    setStartMonth('Jan')
    setStartYear(new Date().getFullYear().toString())
    setEndMonth('Jan')
    setEndYear(new Date().getFullYear().toString())
    setIsPresent(false)
    setIsYearOnly(type === 'education')

    if (currentValue && currentValue.trim()) {
      const parts = currentValue.split('-').map((p) => p.trim())
      if (parts.length === 2) {
        const start = parts[0]
        const end = parts[1]

        const isYearOnlyFormat = /^\d{4}$/.test(start) && /^\d{4}$/.test(end)
        if (isYearOnlyFormat) {
          setIsYearOnly(true)
          setStartYear(start)
          setEndYear(end)
        } else {
          const startParts = start.split(' ')
          if (startParts.length === 2) {
            setStartMonth(startParts[0])
            setStartYear(startParts[1])
          }

          if (end === 'Present') {
            setIsPresent(true)
          } else {
            const endParts = end.split(' ')
            if (endParts.length === 2) {
              setEndMonth(endParts[0])
              setEndYear(endParts[1])
            }
          }
        }
      } else if (/^\d{4}$/.test(currentValue.trim())) {
        setIsYearOnly(true)
        setStartYear(currentValue.trim())
        setEndYear(currentValue.trim())
      }
    }

    setActiveDatePicker({ type, index })
  }

  const applySelectedDate = () => {
    const dateStr = isYearOnly
      ? startYear === endYear ? startYear : `${startYear} - ${endYear}`
      : `${startMonth} ${startYear} - ${isPresent ? 'Present' : `${endMonth} ${endYear}`}`

    const { type, index } = activeDatePicker
    if (type === 'experience') {
      updateExperience(index, 'duration', dateStr)
    } else if (type === 'education') {
      updateEducation(index, 'duration', dateStr)
    } else if (type === 'projects') {
      updateProject(index, 'duration', dateStr)
    }

    setActiveDatePicker(null)
  }

  const clearSelectedDate = () => {
    const { type, index } = activeDatePicker
    if (type === 'experience') {
      updateExperience(index, 'duration', '')
    } else if (type === 'education') {
      updateEducation(index, 'duration', '')
    } else if (type === 'projects') {
      updateProject(index, 'duration', '')
    }
    setActiveDatePicker(null)
  }

  const isInvalidDateRange = useMemo(() => {
    if (!activeDatePicker) return false
    if (isYearOnly) {
      return parseInt(startYear) > parseInt(endYear)
    } else {
      if (isPresent) return false
      const startIndex = MONTHS.indexOf(startMonth)
      const endIndex = MONTHS.indexOf(endMonth)
      return (parseInt(startYear) * 12 + startIndex) > (parseInt(endYear) * 12 + endIndex)
    }
  }, [activeDatePicker, isYearOnly, isPresent, startMonth, startYear, endMonth, endYear])

  return {
    activeDatePicker,
    setActiveDatePicker,
    startMonth,
    setStartMonth,
    startYear,
    setStartYear,
    endMonth,
    setEndMonth,
    endYear,
    setEndYear,
    isPresent,
    setIsPresent,
    isYearOnly,
    setIsYearOnly,
    openDatePicker,
    applySelectedDate,
    clearSelectedDate,
    isInvalidDateRange,
  }
}
