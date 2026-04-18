import { useState } from 'react'
import { Icon } from './ui/Icon'
import { Button } from './ui/button'
import { NavBar } from './NavBar'
import { ItemCard } from './ItemCard'
import { AddItemModal } from './AddItemModal'
import { CategoryManager } from './CategoryManager'
import { useItems } from '../hooks/useItems'
import { useCategories } from '../hooks/useCategories'
import type { AppUser, CalendarMode } from '../types'

interface DashboardProps {
  user: AppUser
  onSignOut: () => void
}

export function Dashboard({ user, onSignOut }: DashboardProps) {
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('gregorian')
  const [filterCatId, setFilterCatId] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCatManager, setShowCatManager] = useState(false)

  const { items, loading: itemsLoading, add, remove } = useItems(user.uid)
  const { categories, addCategory, removeCategory } = useCategories(user.uid)

  const filteredItems =
    filterCatId === 'all'
      ? items
      : items.filter(i => i.categoryId === filterCatId)

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
        {/* Filter chips + actions */}
        <div className="flex items-center gap-2 mb-5 sm:mb-6">
          {/* Scrollable chip row */}
          <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0 pb-0.5 no-scrollbar">
            <button
              onClick={() => setFilterCatId('all')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filterCatId === 'all'
                  ? 'bg-foreground border-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-card'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCatId(cat.id)}
                className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filterCatId === cat.id
                    ? 'bg-foreground border-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-card'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Action buttons — always visible, shrink-0 */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowCatManager(true)}
              title="Manage categories"
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="settings" className="text-base" />
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="rounded-full gap-1.5 bg-foreground hover:bg-foreground/90 text-background shadow-sm"
            >
              <Icon name="plus" className="text-sm" />
              <span className="hidden xs:inline sm:inline">Add</span>
            </Button>
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
          <div className="space-y-2.5">
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                category={categories.find(c => c.id === item.categoryId)}
                calendarMode={calendarMode}
                onDelete={remove}
              />
            ))}
            <p className="text-center text-[11px] text-muted-foreground/50 pt-3 pb-6">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} · {calendarMode === 'gregorian' ? 'Gregorian' : 'Hijri'} calendar
            </p>
          </div>
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
