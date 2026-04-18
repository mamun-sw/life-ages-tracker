import { useState } from 'react'
import type { Category } from '../types'

interface AddItemModalProps {
  categories: Category[]
  onAdd: (data: { name: string; categoryId: string; startDate: string; notes: string }) => Promise<void>
  onClose: () => void
}

export function AddItemModal({ categories, onAdd, onClose }: AddItemModalProps) {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [startDate, setStartDate] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Please enter a name.'); return }
    if (!startDate) { setError('Please select a date.'); return }
    if (!categoryId) { setError('Please select a category.'); return }
    setError('')
    setSaving(true)
    try {
      await onAdd({ name: name.trim(), categoryId, startDate, notes: notes.trim() })
      onClose()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm px-4 pb-4 sm:pb-0"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="font-medium text-stone-900">Add new item</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Yusuf, iPhone 15, Started new job..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-stone-300 transition"
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    categoryId === cat.id
                      ? 'bg-stone-900 border-stone-900 text-white'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Start date (Gregorian only) */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">
              Start date <span className="text-stone-300 font-normal">(Gregorian)</span>
            </label>
            <input
              type="date"
              value={startDate}
              max={today}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-stone-300 transition"
            />
          </div>

          {/* Notes (optional) */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">
              Notes <span className="text-stone-300 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any extra details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-stone-300 transition"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Add item'}
          </button>
        </div>
      </div>
    </div>
  )
}
