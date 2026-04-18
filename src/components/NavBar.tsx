import type { AppUser, CalendarMode } from '../types'

interface NavBarProps {
  user: AppUser
  calendarMode: CalendarMode
  onToggleCalendar: () => void
  onSignOut: () => void
}

export function NavBar({ user, calendarMode, onToggleCalendar, onSignOut }: NavBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-stone-100">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="font-serif text-xl text-stone-900 tracking-tight">Life Ages</h1>

        <div className="flex items-center gap-2">
          {/* Calendar toggle */}
          <button
            onClick={onToggleCalendar}
            title={`Switch to ${calendarMode === 'gregorian' ? 'Hijri' : 'Gregorian'}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors text-xs font-medium text-stone-700"
          >
            <span>{calendarMode === 'gregorian' ? '📅' : '🌙'}</span>
            <span className="uppercase tracking-wide text-[10px]">
              {calendarMode === 'gregorian' ? 'Gregorian' : 'Hijri'}
            </span>
          </button>

          {/* User avatar + sign out */}
          <div className="relative group">
            <button className="flex items-center gap-2 rounded-full focus:outline-none">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border border-stone-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium text-stone-600">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </button>
            {/* Dropdown */}
            <div className="absolute right-0 top-10 w-44 bg-white border border-stone-200 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50">
              <div className="px-3 py-2.5 border-b border-stone-100">
                <p className="text-xs font-medium text-stone-800 truncate">{user.displayName}</p>
                <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={onSignOut}
                className="w-full text-left px-3 py-2.5 text-xs text-red-600 hover:bg-red-50 rounded-b-xl transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
