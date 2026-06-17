import { useEffect, useState } from 'react';
import type { Entry, EntryType } from '../../types';
import { RECUR_OPTIONS, TITLE_LABELS } from '../../constants';
import styles from './EntryModal.module.css';

interface EntryModalProps {
  open: boolean;
  editEntry: Entry | null;
  presetDate?: string;
  onSave: (entry: Omit<Entry, 'id'>) => void;
  onUpdate: (entry: Entry) => void;
  onClose: () => void;
}

const EMPTY_FORM = {
  type: 'exam' as EntryType,
  kid: '',
  title: '',
  date: '',
  time: '',
  grade: '',
  notes: '',
  recur: '',
};

export function EntryModal({
  open,
  editEntry,
  presetDate,
  onSave,
  onUpdate,
  onClose,
}: EntryModalProps) {
  const [form, setForm] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    if (!open) return;
    if (editEntry) {
      setForm({
        type:  editEntry.type,
        kid:   editEntry.kid,
        title: editEntry.title,
        date:  editEntry.date,
        time:  editEntry.time,
        grade: editEntry.grade,
        notes: editEntry.notes,
        recur: editEntry.recur,
      });
    } else {
      setForm({ ...EMPTY_FORM, date: presetDate ?? '' });
    }
  }, [open, editEntry, presetDate]);

  if (!open) return null;

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!form.title.trim()) {
      alert('Por favor ingresá una descripción.');
      return;
    }
    if (editEntry) {
      onUpdate({ ...form, id: editEntry.id });
    } else {
      onSave(form);
    }
    onClose();
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  const isEdit = editEntry !== null;

  return (
    <div className={styles.overlay} onClick={handleBackdrop}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.title}>
          {isEdit ? '✏️ Editar entrada' : '➕ Nueva entrada'}
        </div>

        <div className={styles.group}>
          <label htmlFor="fType">Tipo</label>
          <select
            id="fType"
            value={form.type}
            onChange={(e) => set('type', e.target.value as EntryType)}
          >
            <option value="exam">📝 Examen</option>
            <option value="sport">⚽ Deporte</option>
            <option value="event">🎉 Evento fin de semana</option>
            <option value="recover">⚠️ Nota a recuperar</option>
            <option value="work">📋 Entrega de trabajo</option>
          </select>
        </div>

        <div className={styles.group}>
          <label htmlFor="fKid">Alumno / Hijo</label>
          <input
            id="fKid"
            type="text"
            placeholder="Ej: Martín, Lucía..."
            value={form.kid}
            onChange={(e) => set('kid', e.target.value)}
          />
        </div>

        <div className={styles.group}>
          <label htmlFor="fTitle">{TITLE_LABELS[form.type]}</label>
          <input
            id="fTitle"
            type="text"
            placeholder="Ej: Matemáticas, Fútbol Club Belgrano..."
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.group} style={{ marginBottom: 0 }}>
            <label htmlFor="fDate">Fecha</label>
            <input
              id="fDate"
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </div>
          <div className={styles.group} style={{ marginBottom: 0 }}>
            <label htmlFor="fTime">Hora</label>
            <input
              id="fTime"
              type="time"
              value={form.time}
              onChange={(e) => set('time', e.target.value)}
            />
          </div>
        </div>

        {form.type === 'sport' && (
          <div className={styles.group} style={{ marginTop: 14 }}>
            <label htmlFor="fRecur">Repetición (deportes)</label>
            <select
              id="fRecur"
              value={form.recur}
              onChange={(e) => set('recur', e.target.value)}
            >
              {RECUR_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {form.type === 'recover' && (
          <div className={styles.group}>
            <label htmlFor="fGrade">Nota actual</label>
            <input
              id="fGrade"
              type="text"
              placeholder="Ej: 4, Desaprobado, 55%..."
              value={form.grade}
              onChange={(e) => set('grade', e.target.value)}
            />
          </div>
        )}

        <div className={styles.group}>
          <label htmlFor="fNotes">Notas adicionales</label>
          <textarea
            id="fNotes"
            placeholder="Tema a estudiar, observaciones, lugar..."
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>

        <div className={styles.btns}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className={styles.primary} onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
