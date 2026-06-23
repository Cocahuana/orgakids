import type { Entry } from '../../types';
import { CalendarGrid } from '../organisms/CalendarGrid';

interface CalendarViewProps {
  entries: Entry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddForDate: (dateStr: string) => void;
}

export function CalendarView({ entries, onEdit, onDelete, onAddForDate }: CalendarViewProps) {
  return (
    <CalendarGrid
      entries={entries}
      onEdit={onEdit}
      onDelete={onDelete}
      onAddForDate={onAddForDate}
    />
  );
}
