import { UserProfile, DailyCheckIn, RiskPrediction, CoachingPlan } from '@/types';
import { buildCoachingPrompt } from '@/prompts';
import { generateJSON } from './client';

export async function generateCoaching(
  userProfile: UserProfile,
  checkIn: DailyCheckIn,
  riskPrediction: RiskPrediction
): Promise<CoachingPlan> {
  const prompt = buildCoachingPrompt(userProfile, checkIn, riskPrediction);
  
  const response = await generateJSON<{
    motivationalMessage: string;
    reasoning: string;
    personalizedSuggestion: string;
    replacementActivity: {
      activity: string;
      duration: string;
      reason: string;
    };
    microGoal: {
      goal: string;
      achievable: boolean;
      timeframe: string;
    };
    reflectionQuestion: string;
  }>(prompt);

  return {
    userId: userProfile.id,
    checkInId: checkIn.id,
    motivationalMessage: response.motivationalMessage,
    reasoning: response.reasoning,
    personalizedSuggestion: response.personalizedSuggestion,
    replacementActivity: response.replacementActivity,
    microGoal: response.microGoal,
    reflectionQuestion: response.reflectionQuestion,
    timestamp: new Date(),
  };
}
