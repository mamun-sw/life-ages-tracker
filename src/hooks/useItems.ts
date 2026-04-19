import { useState, useEffect, useCallback } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { getItems, addItem, deleteItem, batchUpdateOrders } from '../lib/db'
import type { TrackerItem } from '../types'

const SPARSE_GAP = 1000

// Assigns in-memory order values to items that don't have one yet.
// Uses their current array position × SPARSE_GAP so the values are consistent
// with the existing ordered items around them.
function ensureOrders(items: TrackerItem[]): TrackerItem[] {
  return items.map((item, idx) =>
    item.order !== undefined ? item : { ...item, order: (idx + 1) * SPARSE_GAP }
  )
}

export function useItems(userId: string | null) {
  const [items, setItems] = useState<TrackerItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchItems = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await getItems(userId)
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const add = async (item: Omit<TrackerItem, 'id'>) => {
    if (!userId) return
    // Give the new item an order value lower than the current minimum so it
    // sorts to the top on refresh.
    const withOrders = ensureOrders(items)
    const minOrder = withOrders.length > 0
      ? Math.min(...withOrders.map(i => i.order!))
      : SPARSE_GAP
    const newOrder = minOrder - SPARSE_GAP
    const itemWithOrder = { ...item, order: newOrder }
    const id = await addItem(userId, itemWithOrder)
    setItems(prev => [{ ...itemWithOrder, id }, ...prev])
  }

  const remove = async (itemId: string) => {
    if (!userId) return
    await deleteItem(userId, itemId)
    setItems(prev => prev.filter(i => i.id !== itemId))
  }

  // Reorders the item identified by activeId to the position of overId.
  // Always batch-writes every item's order to Firestore so the full order
  // is persisted — not just the moved item.
  const reorder = async (activeId: string, overId: string) => {
    if (!userId || activeId === overId) return

    const withOrders = ensureOrders(items)
    const oldIndex = withOrders.findIndex(i => i.id === activeId)
    const newIndex = withOrders.findIndex(i => i.id === overId)
    if (oldIndex === -1 || newIndex === -1) return

    // Compute new global order
    const reordered = arrayMove(withOrders, oldIndex, newIndex)

    // Assign clean sequential order values
    const newItems = reordered.map((item, idx) => ({
      ...item,
      order: (idx + 1) * SPARSE_GAP,
    }))

    // Optimistic update — no loading flicker
    setItems(newItems)

    // Persist the complete order to Firestore
    await batchUpdateOrders(
      userId,
      newItems.map(i => ({ id: i.id, order: i.order! }))
    )
  }

  return { items, loading, add, remove, refresh: fetchItems, reorder }
}
