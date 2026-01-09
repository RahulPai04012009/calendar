export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Grade {
  id: string;
  subject: string;
  score: number;
  total: number;
  momComment?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string; // ISO Date string (YYYY-MM-DD)
  studyTime?: string; // HH:mm format
  priority: Priority;
  completed: boolean;
  subTasks: SubTask[];
  aiTips?: string;
  isBrahmaMuhurta?: boolean;
}

export type ViewState = 'inspection' | 'future' | 'add' | 'grades' | 'focus' | 'leaderboard';
