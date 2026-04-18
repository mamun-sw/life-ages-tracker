import { useState, useEffect, useCallback } from 'react'
import { getItems, addItem, deleteItem } from '../lib/db'
import type { TrackerItem } from '../types'

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
    const id = await addItem(userId, item)
    setItems(prev => [{ ...item, id }, ...prev])
  }

  const remove = async (itemId: string) => {
    if (!userId) return
    await deleteItem(userId, itemId)
    setItems(prev => prev.filter(i => i.id !== itemId))
  }

  return { items, loading, add, remove, refresh: fetchItems }
}
