export type EntryType = 'exam' | 'sport' | 'event' | 'recover' | 'work';

export interface Entry {
  id: number;
  type: EntryType;
  kid: string;
  title: string;
  date: string;
  time: string;
  grade: string;
  notes: string;
  recur: string;
}

export interface AppData {
  entries: Entry[];
  nextId: number;
}

export type TabId =
  | 'overview'
  | 'calendar'
  | 'exams'
  | 'sports'
  | 'events'
  | 'recover'
  | 'works';
