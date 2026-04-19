import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { DatePicker } from './ui/date-picker'
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
    <Dialog open onOpenChange={(open: boolean) => { if (!open) onClose() }}>
      <DialogContent className="w-full max-w-md sm:rounded-2xl rounded-t-2xl rounded-b-none sm:rounded-b-2xl p-0 gap-0 overflow-hidden shadow-xl fixed bottom-0 sm:bottom-auto sm:top-1/2 left-1/2 -translate-x-1/2 sm:-translate-y-1/2 translate-y-0 max-h-[92dvh] flex flex-col">
        <DialogHeader className="px-5 py-4 border-b border-border shrink-0">
          <DialogTitle className="font-semibold text-foreground text-base">Add new item</DialogTitle>
        </DialogHeader>

        <div className="px-5 py-5 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Name</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Yusuf, iPhone 15, Started new job..."
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Category</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    categoryId === cat.id
                      ? 'bg-foreground border-foreground text-background'
                      : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-card'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Start date <span className="text-muted-foreground/40 font-normal">(Gregorian)</span>
            </Label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              max={today}
              placeholder="Pick a start date"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Notes <span className="text-muted-foreground/40 font-normal">(optional)</span>
            </Label>
            <Input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any extra details..."
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter className="px-5 pb-5 pt-3 flex-row gap-2 border-t border-border bg-background shrink-0 rounded-none mx-0 mb-0">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-xl bg-foreground hover:bg-foreground/90 text-background"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Add item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
