export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export const generateYears = () => {
  const arr = []
  const currentYear = new Date().getFullYear()
  for (let y = currentYear + 5; y >= currentYear - 40; y--) {
    arr.push(String(y))
  }
  return arr
}

export const YEARS = generateYears()
