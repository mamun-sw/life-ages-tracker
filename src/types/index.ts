export type CalendarMode = 'gregorian' | 'hijri'

export type PresetCategory = 'people' | 'gadgets' | 'events'

export interface Category {
  id: string
  label: string
  emoji: string
  isPreset: boolean
}

export interface TrackerItem {
  id: string
  name: string
  categoryId: string
  startDate: string // ISO date string YYYY-MM-DD (Gregorian input always)
  notes?: string
  createdAt: string
}

export interface AgeResult {
  years: number
  months: number
  days: number
  totalDays: number
  label: string // e.g. "8 years, 3 months, 12 days"
  shortLabel: string // e.g. "8y 3m 12d"
}

export interface AppUser {
  uid: string
  email: string
  displayName: string
  photoURL: string
}
