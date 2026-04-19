import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Icon } from './ui/Icon'
import { Button } from './ui/button'
import { NavBar } from './NavBar'
import { SortableItemCard } from './SortableItemCard'
import { AddItemModal } from './AddItemModal'
import { CategoryManager } from './CategoryManager'
import { useItems } from '../hooks/useItems'
import { useCategories } from '../hooks/useCategories'
import type { AppUser, CalendarMode } from '../types'

const MAX_CATEGORIES = 10
const COLLAPSE_THRESHOLD = 5

interface DashboardProps {
  user: AppUser
  onSignOut: () => void
}

export function Dashboard({ user, onSignOut }: DashboardProps) {
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('gregorian')
  const [filterCatId, setFilterCatId] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCatManager, setShowCatManager] = useState(false)
  const [showAllCats, setShowAllCats] = useState(false)

  const { items, loading: itemsLoading, add, remove, reorder } = useItems(user.uid)
  const { categories, addCategory, removeCategory } = useCategories(user.uid)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  )

  const cappedCategories = categories.slice(0, MAX_CATEGORIES)
  const canCollapse = cappedCategories.length > COLLAPSE_THRESHOLD
  const visibleCategories = canCollapse && !showAllCats
    ? cappedCategories.slice(0, COLLAPSE_THRESHOLD)
    : cappedCategories

  const filteredItems =
    filterCatId === 'all'
      ? items
      : items.filter(i => i.categoryId === filterCatId)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    reorder(String(active.id), String(over.id))
  }

  const handleAdd = async (data: {
    name: string
    categoryId: string
    startDate: string
    notes: string
  }) => {
    await add({ ...data, createdAt: new Date().toISOString() })
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar
        user={user}
        calendarMode={calendarMode}
        onToggleCalendar={() =>
          setCalendarMode(m => (m === 'gregorian' ? 'hijri' : 'gregorian'))
        }
        onSignOut={onSignOut}
      />

      <main className="max-w-2xl mx-auto px-4 py-5 sm:py-6">

        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCatManager(true)}
            title="Manage categories"
            className="gap-1.5 rounded-lg text-foreground/70 hover:text-foreground"
          >
            <Icon name="settings" className="text-sm" />
            <span className="text-xs font-medium">Categories</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="ml-auto rounded-full gap-1.5 bg-foreground hover:bg-foreground/90 text-background shadow-sm px-4"
          >
            <Icon name="plus" className="text-sm" />
            <span className="text-xs font-medium">Add item</span>
          </Button>
        </div>

        {/* Category filter chips */}
        <div className="mb-5 sm:mb-6">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterCatId('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filterCatId === 'all'
                  ? 'bg-foreground border-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-card'
              }`}
            >
              All
            </button>

            {visibleCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCatId(cat.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filterCatId === cat.id
                    ? 'bg-foreground border-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-card'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}

            {canCollapse && (
              <button
                onClick={() => setShowAllCats(v => !v)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
              >
                {showAllCats
                  ? 'Show less'
                  : `+${cappedCategories.length - COLLAPSE_THRESHOLD} more`}
              </button>
            )}
          </div>
        </div>

        {/* Items list */}
        {itemsLoading ? (
          <div className="py-24 text-center">
            <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading your items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 sm:py-24 text-center px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted text-3xl mb-5">
              {filterCatId === 'all' ? '📋' : categories.find(c => c.id === filterCatId)?.emoji ?? '📋'}
            </div>
            <p className="text-foreground font-medium text-sm mb-1">
              {filterCatId === 'all'
                ? 'Nothing tracked yet'
                : `No ${categories.find(c => c.id === filterCatId)?.label.toLowerCase() ?? 'items'} tracked`}
            </p>
            <p className="text-muted-foreground text-xs mb-6">
              Add your first item to start tracking its age.
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="rounded-full bg-foreground hover:bg-foreground/90 text-background px-5 shadow-sm"
            >
              Add item
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredItems.map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2.5">
                {filteredItems.map(item => (
                  <SortableItemCard
                    key={item.id}
                    item={item}
                    category={categories.find(c => c.id === item.categoryId)}
                    calendarMode={calendarMode}
                    onDelete={remove}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {filteredItems.length > 0 && (
          <p className="text-center text-[11px] text-muted-foreground/50 pt-3 pb-6">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} · {calendarMode === 'gregorian' ? 'Gregorian' : 'Hijri'} calendar
          </p>
        )}
      </main>

      {showAddModal && (
        <AddItemModal
          categories={categories}
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showCatManager && (
        <CategoryManager
          categories={categories}
          onAdd={addCategory}
          onRemove={removeCategory}
          onClose={() => setShowCatManager(false)}
        />
      )}
    </div>
  )
}
