export function localDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysUntil(dateStr: string): number {
  if (!dateStr) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(`${dateStr}T00:00:00`);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatLongDate(dateStr: string): string {
  if (!dateStr) return 'Actividades del día';
  const d = new Date(`${dateStr}T00:00:00`);
  const label = d.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function urgencyBadge(days: number): { cls: string; label: string } {
  if (days < 0)    return { cls: 'urgency--red',    label: 'Vencido' };
  if (days === 0)  return { cls: 'urgency--red',    label: '¡Hoy!' };
  if (days <= 2)   return { cls: 'urgency--red',    label: `${days}d` };
  if (days <= 5)   return { cls: 'urgency--yellow', label: `${days}d` };
  return { cls: 'urgency--green', label: `${days}d` };
}
