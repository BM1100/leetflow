export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Priority = 'low' | 'medium' | 'high';
export type StudyPlanStatus = 'active' | 'paused' | 'completed';
export type RevisionStatus = 'pending' | 'reviewed' | 'skipped';
export type AIContext = 'general' | 'study-plan' | 'revision' | 'interview' | 'quiz';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
