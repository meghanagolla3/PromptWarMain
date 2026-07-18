import { UserProfile, DailyCheckIn, CoachingPlan } from '@/types';
import { buildReflectionPrompt } from '@/prompts';
import { generateJSON } from './client';

export interface ReflectionSummary {
  summary: string;
  achievements: string[];
  challenges: string[];
  insights: string[];
  tomorrowFocus: string;
}

export async function generateReflectionSummary(
  userProfile: UserProfile,
  checkIn: DailyCheckIn,
  coachingPlan: CoachingPlan,
  completedGoal: boolean,
  difficulty?: string,
  feeling?: string,
  whatHelped?: string
): Promise<ReflectionSummary> {
  const prompt = buildReflectionPrompt(
    userProfile,
    checkIn,
    coachingPlan,
    completedGoal,
    difficulty,
    feeling,
    whatHelped
  );
  
  const response = await generateJSON<ReflectionSummary>(prompt);
  return response;
}
