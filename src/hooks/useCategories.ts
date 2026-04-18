import { useState, useEffect } from 'react'
import { getCategories, saveCategories } from '../lib/db'
import { PRESET_CATEGORIES } from '../lib/categories'
import type { Category } from '../types'

export function useCategories(userId: string | null) {
  const [categories, setCategories] = useState<Category[]>(PRESET_CATEGORIES)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    getCategories(userId)
      .then(saved => {
        if (saved.length > 0) {
          // Merge: always keep presets, add saved custom ones
          const customs = saved.filter(c => !c.isPreset)
          setCategories([...PRESET_CATEGORIES, ...customs])
        }
      })
      .finally(() => setLoading(false))
  }, [userId])

  const addCategory = async (cat: Omit<Category, 'id' | 'isPreset'>) => {
    if (!userId) return
    const newCat: Category = {
      id: `custom_${Date.now()}`,
      label: cat.label,
      emoji: cat.emoji,
      isPreset: false,
    }
    const updated = [...categories, newCat]
    setCategories(updated)
    await saveCategories(userId, updated)
    return newCat
  }

  const removeCategory = async (catId: string) => {
    if (!userId) return
    const updated = categories.filter(c => c.id !== catId)
    setCategories(updated)
    await saveCategories(userId, updated)
  }

  return { categories, loading, addCategory, removeCategory }
}
