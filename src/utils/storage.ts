const prefix = 'web_admin_'

export const storage = {
  get<T = string>(key: string): T | null {
    try {
      const value = localStorage.getItem(prefix + key)
      if (value === null) return null
      return JSON.parse(value) as T
    } catch {
      return localStorage.getItem(prefix + key) as T | null
    }
  },

  set(key: string, value: unknown): void {
    localStorage.setItem(prefix + key, JSON.stringify(value))
  },

  remove(key: string): void {
    localStorage.removeItem(prefix + key)
  },

  clear(): void {
    localStorage.clear()
  },
}
