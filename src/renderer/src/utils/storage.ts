export const saveToStorage = (key: string, value): void => {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export const getFromStorage = (key: string): object | null => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

export const removeFromStorage = (key: string): void => {
  sessionStorage.removeItem(key)
}
