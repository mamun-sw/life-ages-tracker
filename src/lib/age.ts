import type { AgeResult, CalendarMode } from '../types'

/**
 * Calculate age between a start date and today in Gregorian calendar.
 */
function calcGregorianAge(startDate: Date, today: Date): AgeResult {
  let years = today.getFullYear() - startDate.getFullYear()
  let months = today.getMonth() - startDate.getMonth()
  let days = today.getDate() - startDate.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  const totalDays = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  return buildResult(years, months, days, totalDays)
}

/**
 * Calculate age in Hijri calendar using the Intl API (no external library).
 */
function calcHijriAge(startDate: Date, today: Date): AgeResult {
  const toHijri = (d: Date) => {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).formatToParts(d)

    const get = (type: string) =>
      parseInt(parts.find(p => p.type === type)?.value ?? '0', 10)

    return { year: get('year'), month: get('month'), day: get('day') }
  }

  const start = toHijri(startDate)
  const end = toHijri(today)

  let years = end.year - start.year
  let months = end.month - start.month
  let days = end.day - start.day

  if (days < 0) {
    months -= 1
    // Hijri months are 29 or 30 days; approximate with 29
    days += 29
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  const totalDays = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  return buildResult(years, months, days, totalDays)
}

function buildResult(
  years: number,
  months: number,
  days: number,
  totalDays: number
): AgeResult {
  const parts: string[] = []
  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`)
  if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`)
  if (days > 0 || parts.length === 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`)

  const shortParts: string[] = []
  if (years > 0) shortParts.push(`${years}y`)
  if (months > 0) shortParts.push(`${months}m`)
  shortParts.push(`${days}d`)

  return {
    years,
    months,
    days,
    totalDays,
    label: parts.join(', '),
    shortLabel: shortParts.join(' '),
  }
}

export function calculateAge(
  isoDate: string,
  mode: CalendarMode = 'gregorian'
): AgeResult {
  const startDate = new Date(isoDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  startDate.setHours(0, 0, 0, 0)

  if (startDate > today) {
    return buildResult(0, 0, 0, 0)
  }

  return mode === 'hijri'
    ? calcHijriAge(startDate, today)
    : calcGregorianAge(startDate, today)
}

/**
 * Format a Gregorian ISO date string for display.
 * e.g. "2016-03-14" → "14 March 2016"
 */
export function formatDate(isoDate: string): string {
  const d = new Date(isoDate)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Check if an item's anniversary is within the next 7 days (birthday alert).
 */
export function isUpcomingAnniversary(isoDate: string): boolean {
  const start = new Date(isoDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const nextAnniversary = new Date(
    today.getFullYear(),
    start.getMonth(),
    start.getDate()
  )
  if (nextAnniversary < today) {
    nextAnniversary.setFullYear(today.getFullYear() + 1)
  }

  const diffDays = Math.floor(
    (nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )
  return diffDays <= 7
}
