import { useState } from 'react'
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
    await add({
      ...data,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <NavBar
        user={user}
        calendarMode={calendarMode}
        onToggleCalendar={() =>
          setCalendarMode(m => (m === 'gregorian' ? 'hijri' : 'gregorian'))
        }
        onSignOut={onSignOut}
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Filter chips + actions */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilterCatId('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterCatId === 'all'
                ? 'bg-stone-900 border-stone-900 text-white'
                : 'border-stone-200 text-stone-500 hover:border-stone-300 bg-white'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCatId(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filterCatId === cat.id
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'border-stone-200 text-stone-500 hover:border-stone-300 bg-white'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setShowCatManager(true)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              title="Manage categories"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="8" cy="8" r="2" />
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
              </svg>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors"
            >
              <span className="text-sm leading-none">+</span>
              Add
            </button>
          </div>
        </div>

        {/* Items list */}
        {itemsLoading ? (
          <div className="py-20 text-center">
            <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-stone-400">Loading your items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-4">
              {filterCatId === 'all' ? '📋' : categories.find(c => c.id === filterCatId)?.emoji ?? '📋'}
            </div>
            <p className="text-stone-500 text-sm mb-1">
              {filterCatId === 'all'
                ? 'Nothing tracked yet'
                : `No ${categories.find(c => c.id === filterCatId)?.label.toLowerCase() ?? 'items'} tracked`}
            </p>
            <p className="text-stone-400 text-xs mb-5">
              Add your first item to start tracking its age.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Add item
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                category={categories.find(c => c.id === item.categoryId)}
                calendarMode={calendarMode}
                onDelete={remove}
              />
            ))}
            <p className="text-center text-[11px] text-stone-300 pt-2">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} · ages shown in {calendarMode === 'gregorian' ? 'Gregorian' : 'Hijri'} calendar
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
