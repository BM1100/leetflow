export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIConversationWithMessages {
  id: string;
  title: string;
  messages: AIMessage[];
  context: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AISuggestion {
  label: string;
  prompt: string;
  icon: string;
}

export const AI_SUGGESTIONS: AISuggestion[] = [
  { label: 'Analyze my weak topics', prompt: 'Analyze my LeetCode stats and identify my weakest topics. What should I focus on?', icon: 'Target' },
  { label: 'Generate study plan', prompt: 'Create a personalized weekly study plan based on my current progress and weak areas.', icon: 'BookOpen' },
  { label: 'Recommend problems', prompt: 'Recommend 5 problems I should solve today based on my skill level and weak areas.', icon: 'Lightbulb' },
  { label: 'Interview readiness', prompt: 'Based on my progress, how ready am I for a technical interview? What should I improve?', icon: 'Briefcase' },
  { label: 'Quiz me on Trees', prompt: 'Give me a quiz on Tree data structures and algorithms. Start with a medium difficulty question.', icon: 'HelpCircle' },
  { label: 'Explain Dynamic Programming', prompt: 'Explain Dynamic Programming with examples and common patterns I should know for interviews.', icon: 'GraduationCap' },
];
