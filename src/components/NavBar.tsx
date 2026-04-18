import { SunIcon, MoonIcon } from 'lucide-react'
import { Icon } from './ui/Icon'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu'
import { useTheme } from '../lib/theme'
import type { AppUser, CalendarMode } from '../types'

interface NavBarProps {
  user: AppUser
  calendarMode: CalendarMode
  onToggleCalendar: () => void
  onSignOut: () => void
}

export function NavBar({ user, calendarMode, onToggleCalendar, onSignOut }: NavBarProps) {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="font-serif text-xl text-foreground tracking-tight">Life Ages</h1>

        <div className="flex items-center gap-1.5">
          {/* Calendar toggle — icon only on mobile, icon + label on sm+ */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleCalendar}
            title={`Switch to ${calendarMode === 'gregorian' ? 'Hijri' : 'Gregorian'}`}
            className="gap-1.5 rounded-lg text-foreground/70 hover:text-foreground px-2 sm:px-3"
          >
            <Icon name={calendarMode === 'gregorian' ? 'calendar' : 'moon'} className="text-sm" />
            <span className="hidden sm:inline uppercase tracking-wide text-[10px] font-semibold">
              {calendarMode === 'gregorian' ? 'Gregorian' : 'Hijri'}
            </span>
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark'
              ? <SunIcon className="size-4" />
              : <MoonIcon className="size-4" />
            }
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full focus:outline-none ml-0.5">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border border-border"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-foreground">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="flex-col items-start gap-0.5 px-3 py-2.5">
                <p className="text-xs font-semibold text-foreground truncate">{user.displayName}</p>
                <p className="text-[11px] text-muted-foreground truncate font-normal">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={onSignOut}
                className="text-xs cursor-pointer"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
