import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ItemCard } from './ItemCard'
import type { TrackerItem, Category, CalendarMode } from '../types'

interface SortableItemCardProps {
  item: TrackerItem
  category: Category | undefined
  calendarMode: CalendarMode
  onDelete: (id: string) => void
}

export function SortableItemCard({ item, category, calendarMode, onDelete }: SortableItemCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : undefined,
        zIndex: isDragging ? 10 : undefined,
        position: isDragging ? 'relative' : undefined,
      }}
    >
      <ItemCard
        item={item}
        category={category}
        calendarMode={calendarMode}
        onDelete={onDelete}
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}
