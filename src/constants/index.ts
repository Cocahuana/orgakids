import type { AppData, EntryType } from '../types';

export const TYPE_INFO: Record<
  EntryType,
  { icon: string; label: string; cls: EntryType; tag: string }
> = {
  exam:    { icon: '📝', label: 'Examen',         cls: 'exam',    tag: 'Examen' },
  sport:   { icon: '⚽', label: 'Deporte',        cls: 'sport',   tag: 'Deporte' },
  event:   { icon: '🎉', label: 'Evento',         cls: 'event',   tag: 'Evento' },
  recover: { icon: '⚠️',  label: 'Recuperatorio', cls: 'recover', tag: 'Recuperar' },
  work:    { icon: '📋', label: 'Trabajo',        cls: 'work',    tag: 'Entrega' },
};

export const CALENDAR_TYPE_ORDER: EntryType[] = [
  'exam', 'sport', 'event', 'recover', 'work',
];

export const RECUR_OPTIONS = [
  { value: '',                           label: 'Sin repetición' },
  { value: 'Lunes y Miércoles',          label: 'Lunes y Miércoles' },
  { value: 'Martes y Jueves',            label: 'Martes y Jueves' },
  { value: 'Miércoles y Viernes',        label: 'Miércoles y Viernes' },
  { value: 'Sábados',                    label: 'Sábados' },
  { value: 'Lunes, Miércoles y Viernes', label: 'Lunes, Miércoles y Viernes' },
];

export const TITLE_LABELS: Record<EntryType, string> = {
  exam:    'Materia',
  sport:   'Actividad / Club',
  event:   'Descripción del evento',
  recover: 'Materia a recuperar',
  work:    'Nombre del trabajo',
};

export const DEFAULT_DATA: AppData = {
  entries: [
    { id: 1, type: 'exam',    kid: 'Martín', title: 'Matemáticas',                   date: '2026-06-20', time: '',      grade: '',  notes: 'Álgebra y funciones cuadráticas',     recur: '' },
    { id: 2, type: 'exam',    kid: 'Lucía',  title: 'Historia',                      date: '2026-06-19', time: '',      grade: '',  notes: 'Revolución Francesa hasta Napoleón',  recur: '' },
    { id: 3, type: 'sport',   kid: 'Martín', title: 'Fútbol — Club Atlético',         date: '2026-06-18', time: '16:00', grade: '',  notes: 'Traer canilleras',                    recur: 'Miércoles y Viernes' },
    { id: 4, type: 'sport',   kid: 'Lucía',  title: 'Hockey — Club San Martín',       date: '2026-06-19', time: '09:00', grade: '',  notes: 'Sábados a la mañana',                 recur: 'Sábados' },
    { id: 5, type: 'event',   kid: 'Familia',title: 'Cumpleaños Abuela Rosa',         date: '2026-06-21', time: '13:00', grade: '',  notes: 'Llevar regalo',                       recur: '' },
    { id: 6, type: 'recover', kid: 'Martín', title: 'Ciencias Naturales',             date: '2026-06-25', time: '',      grade: '4', notes: 'Recuperatorio en contra-turno',       recur: '' },
    { id: 7, type: 'recover', kid: 'Lucía',  title: 'Inglés',                        date: '2026-06-24', time: '',      grade: '5', notes: 'Reading comprehension',               recur: '' },
    { id: 8, type: 'work',    kid: 'Martín', title: 'Maqueta Sistema Solar',          date: '2026-06-22', time: '',      grade: '',  notes: 'Física — con soporte cartón',         recur: '' },
    { id: 9, type: 'work',    kid: 'Lucía',  title: 'Informe Novela "Martín Fierro"', date: '2026-06-26', time: '',      grade: '',  notes: 'Lengua — mínimo 3 carillas',          recur: '' },
  ],
  nextId: 10,
};
