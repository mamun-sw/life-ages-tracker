import { useState } from 'react'
import type React from 'react'
import { Icon } from './ui/Icon'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { calculateAge, formatDate, isUpcomingAnniversary } from '../lib/age'
import type { TrackerItem, Category, CalendarMode } from '../types'

interface ItemCardProps {
  item: TrackerItem
  category: Category | undefined
  calendarMode: CalendarMode
  onDelete: (id: string) => void
  dragHandleRef?: (node: HTMLElement | null) => void
  dragHandleProps?: React.HTMLAttributes<HTMLElement>
}

export function ItemCard({ item, category, calendarMode, onDelete, dragHandleRef, dragHandleProps }: ItemCardProps) {
  const age = calculateAge(item.startDate, calendarMode)
  const upcoming = isUpcomingAnniversary(item.startDate)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const heroValue = age.years > 0 ? age.years : age.months > 0 ? age.months : age.days
  const heroUnit  = age.years > 0
    ? (age.years  === 1 ? 'year'  : 'years')
    : age.months > 0
      ? (age.months === 1 ? 'month' : 'months')
      : (age.days   === 1 ? 'day'   : 'days')

  return (
    <>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false} className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove item?</DialogTitle>
            <DialogDescription>
              "{item.name}" will be permanently deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => { setConfirmOpen(false); onDelete(item.id) }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="group gap-0 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 border-border/60">
        <CardContent className="p-0">

          {/* Header row */}
          <div className="px-4 sm:px-5 pt-3.5 pb-3 flex items-start gap-3">
            {/* Drag handle */}
            {dragHandleRef && (
              <button
                ref={dragHandleRef}
                {...dragHandleProps}
                aria-label="Drag to reorder"
                className="shrink-0 mt-1.5 cursor-grab active:cursor-grabbing touch-none text-muted-foreground/30 hover:text-muted-foreground/60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150"
              >
                <Icon name="grip-vertical" className="text-base" />
              </button>
            )}

            {/* Emoji avatar */}
            <div className="w-9 h-9 rounded-xl bg-muted border border-border/70 flex items-center justify-center text-base shrink-0 mt-0.5">
              {category?.emoji ?? '📌'}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground text-[15px] leading-tight tracking-tight">
                  {item.name}
                </h3>
                {upcoming && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-2 py-0.5 h-auto rounded-full text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                  >
                    🎉 Soon
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {category && (
                  <span className="text-[11px] text-muted-foreground font-medium">{category.label}</span>
                )}
                {category && <span className="text-[10px] text-muted-foreground/30">·</span>}
                <span className="text-[11px] text-muted-foreground">since {formatDate(item.startDate)}</span>
              </div>
              {item.notes && (
                <p className="text-xs text-muted-foreground/60 mt-1 truncate">{item.notes}</p>
              )}
            </div>

            {/* Delete button — top-right, hover-only on desktop, always on mobile */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setConfirmOpen(true)}
              className="shrink-0 -mt-0.5 -mr-1 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150"
              title="Remove"
            >
              <Icon name="trash" className="text-sm" />
            </Button>
          </div>

          {/* Age hero section */}
          <div className="mx-3 sm:mx-4 mb-3 rounded-xl bg-muted/60 border border-border/50 px-4 py-3">
            <div className="flex items-end gap-2 sm:gap-3 flex-wrap">
              {/* Hero age number */}
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold tabular-nums text-foreground leading-none">
                  {heroValue}
                </span>
                <span className="text-sm font-medium text-muted-foreground leading-none pb-0.5">
                  {heroUnit}
                </span>
              </div>

              {/* Secondary breakdown */}
              {age.years > 0 && (
                <div className="flex items-center gap-2 pb-0.5">
                  {age.months > 0 && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      <span className="font-semibold text-foreground/70">{age.months}</span> mo
                    </span>
                  )}
                  {age.days > 0 && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      <span className="font-semibold text-foreground/70">{age.days}</span> d
                    </span>
                  )}
                </div>
              )}

              {/* Total days pill */}
              <div className="ml-auto flex items-center gap-1 bg-background border border-border/60 rounded-lg px-2.5 py-1 shrink-0">
                <span className="text-[11px] font-semibold tabular-nums text-foreground/80">
                  {age.totalDays.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground">days</span>
              </div>
            </div>

            {/* Calendar mode tag */}
            <div className="flex items-center gap-1 mt-2">
              <Icon
                name={calendarMode === 'hijri' ? 'moon' : 'calendar'}
                className="text-[10px] text-muted-foreground/50"
              />
              <span className="text-[10px] text-muted-foreground/50 capitalize">
                {calendarMode === 'hijri' ? 'Hijri' : 'Gregorian'}
              </span>
            </div>
          </div>

        </CardContent>
      </Card>
    </>
  )
}
