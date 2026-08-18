const STORAGE_PREFIX = 'arcoiris.'

export function storageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(storageKey(key))
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(storageKey(key), JSON.stringify(value))
  } catch {
    // Almacenamiento no disponible: la app continúa funcionando en memoria.
  }
}

export function removeFromStorage(key: string): void {
  try {
    window.localStorage.removeItem(storageKey(key))
  } catch {
    // Almacenamiento no disponible.
  }
}