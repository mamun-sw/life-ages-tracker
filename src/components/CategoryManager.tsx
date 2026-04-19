import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { Input } from './ui/input'
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
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null)

  const pendingRemoveCategory = categories.find(c => c.id === pendingRemoveId)
  const customCategories = categories.filter(c => !c.isPreset)
  const atLimit = categories.length >= 10

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
    <>
      {pendingRemoveId && (
        <Dialog open onOpenChange={(open) => { if (!open) setPendingRemoveId(null) }}>
          <DialogContent showCloseButton={false} className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Remove category?</DialogTitle>
              <DialogDescription>
                "{pendingRemoveCategory?.label}" will be permanently deleted. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPendingRemoveId(null)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => { onRemove(pendingRemoveId); setPendingRemoveId(null) }}
              >
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open onOpenChange={(open: boolean) => { if (!open) onClose() }}>
        <DialogContent className="w-full max-w-md sm:rounded-2xl rounded-t-2xl rounded-b-none sm:rounded-b-2xl p-0 gap-0 overflow-hidden shadow-xl fixed bottom-0 sm:bottom-auto sm:top-1/2 left-1/2 -translate-x-1/2 sm:-translate-y-1/2 translate-y-0 max-h-[92dvh] flex flex-col">
          <DialogHeader className="px-5 py-4 border-b border-border shrink-0">
            <DialogTitle className="font-semibold text-foreground text-base">Manage categories</DialogTitle>
          </DialogHeader>

          <div className="px-5 py-5 space-y-5 overflow-y-auto flex-1">
            {/* Preset categories */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2">Built-in</p>
              <div className="space-y-1">
                {categories.filter(c => c.isPreset).map(cat => (
                  <div key={cat.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-muted/50">
                    <span className="text-base">{cat.emoji}</span>
                    <span className="text-sm text-foreground">{cat.label}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground/40 font-medium">Built-in</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom categories */}
            {customCategories.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2">Custom</p>
                <div className="space-y-1">
                  {customCategories.map(cat => (
                    <div key={cat.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-muted/50">
                      <span className="text-base">{cat.emoji}</span>
                      <span className="text-sm text-foreground">{cat.label}</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setPendingRemoveId(cat.id)}
                        className="ml-auto text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add custom category */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">Add custom</p>
                {atLimit && (
                  <p className="text-[10px] text-destructive/70">Max 10 categories reached</p>
                )}
              </div>
              <div className={`flex flex-wrap gap-1.5 mb-3 ${atLimit ? 'opacity-40 pointer-events-none' : ''}`}>
                {EMOJI_OPTIONS.map(e => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                      emoji === e
                        ? 'bg-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background'
                        : 'bg-muted hover:bg-muted/80 border border-border'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !atLimit && handleAdd()}
                  placeholder={atLimit ? 'Category limit reached' : 'Category name...'}
                  disabled={atLimit}
                  className="flex-1"
                />
                <Button
                  onClick={handleAdd}
                  disabled={saving || !label.trim() || atLimit}
                  className="bg-foreground hover:bg-foreground/90 text-background"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-border bg-background shrink-0">
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
