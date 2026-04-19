/**
 * Data layer — all database operations live here.
 * To swap Firestore for another DB (e.g. MongoDB Atlas), only edit this file.
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  setDoc,
  getDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'
import type { TrackerItem, Category } from '../types'

// ── Items ──────────────────────────────────────────────────────────────────

export async function getItems(userId: string): Promise<TrackerItem[]> {
  const q = query(
    collection(db, 'users', userId, 'items'),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as TrackerItem))

  // Sort client-side: ordered items (ascending) first, then legacy items
  // (which already come from Firestore in createdAt desc order)
  return items.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return 0
  })
}

export async function addItem(
  userId: string,
  item: Omit<TrackerItem, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'users', userId, 'items'), item)
  return ref.id
}

export async function updateItem(
  userId: string,
  itemId: string,
  updates: Partial<TrackerItem>
): Promise<void> {
  await updateDoc(doc(db, 'users', userId, 'items', itemId), updates)
}

export async function deleteItem(userId: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'items', itemId))
}

export async function reorderItem(
  userId: string,
  itemId: string,
  newOrder: number
): Promise<void> {
  await updateDoc(doc(db, 'users', userId, 'items', itemId), { order: newOrder })
}

export async function batchUpdateOrders(
  userId: string,
  updates: Array<{ id: string; order: number }>
): Promise<void> {
  const batch = writeBatch(db)
  for (const { id, order } of updates) {
    batch.update(doc(db, 'users', userId, 'items', id), { order })
  }
  await batch.commit()
}

// ── Categories ─────────────────────────────────────────────────────────────

export async function getCategories(userId: string): Promise<Category[]> {
  const snap = await getDoc(doc(db, 'users', userId, 'settings', 'categories'))
  if (!snap.exists()) return []
  return snap.data().list as Category[]
}

export async function saveCategories(
  userId: string,
  categories: Category[]
): Promise<void> {
  await setDoc(doc(db, 'users', userId, 'settings', 'categories'), {
    list: categories,
  })
}
