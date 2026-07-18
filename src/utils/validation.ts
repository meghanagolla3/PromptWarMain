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
