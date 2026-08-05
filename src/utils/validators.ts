import { z } from 'zod';

export const leetcodeUsernameSchema = z
  .string()
  .min(1, 'Username is required')
  .max(30, 'Username too long')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid username format');

export const bookmarkSchema = z.object({
  problemId: z.number(),
  problemTitle: z.string(),
  problemSlug: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  topics: z.array(z.string()),
  notes: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  company: z.string().optional(),
});

export const studyPlanSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  topics: z.array(z.string()).min(1, 'Select at least one topic'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Mixed']).optional(),
});

export const dailyGoalSchema = z.object({
  targetCount: z.number().min(1).max(20),
  topics: z.array(z.string()),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Mixed']).optional(),
  notes: z.string().optional(),
});

export const settingsSchema = z.object({
  leetcodeUsername: leetcodeUsernameSchema.optional().or(z.literal('')),
  name: z.string().optional(),
});
