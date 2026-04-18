import { useState } from 'react'
import { EMOJI_OPTIONS } from '../lib/categories'
import type { Category } from '../types'

interface CategoryManagerProps {
  categories: Category[]
  onAdd: (cat: { label: string; emoji: string }) => Promise<Category | undefined>
  onRemove: (id: string) => Promise<void>
  onClose: () => void
}

export function CategoryManager({ categories, onAdd, onRemove, onClose }: CategoryManagerProps) {
  const [label, setLabel] = useState('')
  const [emoji, setEmoji] = useState('🏠')
  const [saving, setSaving] = useState(false)

  const customCategories = categories.filter(c => !c.isPreset)

  const handleAdd = async () => {
    if (!label.trim()) return
    setSaving(true)
    try {
      await onAdd({ label: label.trim(), emoji })
      setLabel('')
      setEmoji('🏠')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm px-4 pb-4 sm:pb-0"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="font-medium text-stone-900">Manage categories</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Preset categories (read-only) */}
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Built-in</p>
            <div className="space-y-1">
              {categories.filter(c => c.isPreset).map(cat => (
                <div key={cat.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50">
                  <span className="text-base">{cat.emoji}</span>
                  <span className="text-sm text-stone-600">{cat.label}</span>
                  <span className="ml-auto text-[10px] text-stone-300">Built-in</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom categories */}
          {customCategories.length > 0 && (
            <div>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Custom</p>
              <div className="space-y-1">
                {customCategories.map(cat => (
                  <div key={cat.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50">
                    <span className="text-base">{cat.emoji}</span>
                    <span className="text-sm text-stone-600">{cat.label}</span>
                    <button
                      onClick={() => onRemove(cat.id)}
                      className="ml-auto text-[11px] text-red-400 hover:text-red-600 transition-colors px-1.5 py-0.5 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add new custom category */}
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">Add custom category</p>

            {/* Emoji picker */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                    emoji === e
                      ? 'bg-stone-900 ring-2 ring-stone-900 ring-offset-1'
                      : 'bg-stone-50 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={label}
                onChange={e => setLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Category name..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 transition"
              />
              <button
                onClick={handleAdd}
                disabled={saving || !label.trim()}
                className="px-4 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-40 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
