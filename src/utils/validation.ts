import { z } from 'zod';
import { VALIDATION_MESSAGES } from '@/constants';

// Onboarding validation schema
export const onboardingSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.NAME_REQUIRED).max(50),
  habit: z.enum(['instagram', 'youtube', 'gaming', 'smoking', 'late_night_screen', 'social_media', 'phone_checking', 'other']),
  goal: z.enum(['reduce_usage', 'quit', 'improve_focus', 'improve_sleep', 'reduce_distraction']),
  coachingStyle: z.enum(['friendly', 'motivational', 'direct', 'reflective']),
  ageGroup: z.string().optional(),
  occupation: z.string().max(100).optional(),
});

// Check-in validation schema
export const checkInSchema = z.object({
  mood: z.enum(['great', 'good', 'neutral', 'bad', 'terrible']),
  stressLevel: z.number().min(1).max(10),
  sleepQuality: z.number().min(1).max(10),
  energyLevel: z.number().min(1).max(10),
  currentUrge: z.number().min(1).max(10),
  location: z.enum(['home', 'college', 'office', 'other']),
  triggers: z.array(z.enum(['bored', 'stress', 'notifications', 'friends', 'lonely', 'anxiety', 'tired', 'procrastination', 'other'])).min(1),
  reflection: z.string().max(500).optional(),
});

// Reflection validation schema
export const reflectionSchema = z.object({
  completedGoal: z.boolean(),
  difficulty: z.string().max(500).optional(),
  feeling: z.string().max(500).optional(),
  whatHelped: z.string().max(500).optional(),
});

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .substring(0, 1000); // Limit length
}

// Validate API key format
export function validateApiKey(apiKey: string): boolean {
  // Basic validation - check if it's not empty and has reasonable length
  return apiKey.length > 10 && apiKey.length < 100;
}

// Validate numeric ranges
export function validateRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

// Validate array length
export function validateArrayLength<T>(array: T[], min: number, max: number): boolean {
  return array.length >= min && array.length <= max;
}

// Behavior analysis validation schema
export const behaviorAnalysisSchema = z.object({
  checkInId: z.string().min(1),
  behaviorSummary: z.string().min(1).max(1000),
  emotionalAnalysis: z.string().min(1).max(1000),
  triggerAnalysis: z.string().min(1).max(1000),
  confidenceScore: z.number().min(0).max(10),
  reasoning: z.string().min(1).max(1000),
});

// Risk prediction validation schema
export const riskPredictionSchema = z.object({
  checkInId: z.string().min(1),
  riskLevel: z.enum(['low', 'medium', 'high']),
  factors: z.array(z.object({
    factor: z.string().min(1),
    impact: z.enum(['positive', 'negative', 'neutral']),
    weight: z.number().min(0).max(1),
  })),
  confidence: z.number().min(0).max(100),
  reasoning: z.string().min(1).max(1000),
});

// Coaching plan validation schema
export const coachingPlanSchema = z.object({
  checkInId: z.string().min(1),
  motivationalMessage: z.string().min(1).max(1000),
  reasoning: z.string().min(1).max(1000),
  personalizedSuggestion: z.string().min(1).max(1000),
  replacementActivity: z.object({
    activity: z.string().min(1),
    duration: z.string().min(1),
    reason: z.string().min(1),
  }),
  microGoal: z.object({
    goal: z.string().min(1),
    achievable: z.boolean(),
    timeframe: z.string().min(1),
  }),
  reflectionQuestion: z.string().min(1).max(500),
});

// Nudge validation schema
export const nudgeSchema = z.object({
  userId: z.string().min(1),
  message: z.string().min(1).max(500),
  context: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  timing: z.string().optional(),
});

// Nudge update validation schema
export const nudgeUpdateSchema = z.object({
  id: z.string().min(1),
  delivered: z.boolean().optional(),
  responded: z.boolean().optional(),
});
