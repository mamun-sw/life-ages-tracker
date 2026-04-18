import { calculateAge, formatDate, isUpcomingAnniversary } from '../lib/age'
import type { TrackerItem, Category, CalendarMode } from '../types'

interface ItemCardProps {
  item: TrackerItem
  category: Category | undefined
  calendarMode: CalendarMode
  onDelete: (id: string) => void
}

export function ItemCard({ item, category, calendarMode, onDelete }: ItemCardProps) {
  const age = calculateAge(item.startDate, calendarMode)
  const upcoming = isUpcomingAnniversary(item.startDate)

  return (
    <div className="group bg-white border border-stone-200 rounded-2xl px-5 py-4 hover:border-stone-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Emoji avatar */}
        <div className="w-11 h-11 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-xl flex-shrink-0 mt-0.5">
          {category?.emoji ?? '📌'}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-stone-900 text-[15px] leading-tight">{item.name}</h3>
            {upcoming && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                🎉 Anniversary soon
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {category && (
              <span className="text-[11px] text-stone-400">{category.label}</span>
            )}
            <span className="text-[11px] text-stone-300">·</span>
            <span className="text-[11px] text-stone-400">since {formatDate(item.startDate)}</span>
          </div>
          {item.notes && (
            <p className="text-xs text-stone-400 mt-1 truncate">{item.notes}</p>
          )}
        </div>

        {/* Age display */}
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-light text-stone-800 leading-tight">
            {age.years > 0 ? `${age.years}` : age.months > 0 ? `${age.months}` : `${age.days}`}
          </div>
          <div className="text-[11px] text-stone-400 leading-tight">
            {age.years > 0 ? (age.years === 1 ? 'year' : 'years') : age.months > 0 ? (age.months === 1 ? 'month' : 'months') : (age.days === 1 ? 'day' : 'days')}
          </div>
          <div className="text-[10px] text-stone-300 mt-0.5">
            {calendarMode === 'hijri' ? '🌙' : '📅'} {age.shortLabel}
          </div>
        </div>
      </div>

      {/* Delete — visible on hover */}
      <div className="mt-3 pt-3 border-t border-stone-50 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onDelete(item.id)}
          className="text-[11px] text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
