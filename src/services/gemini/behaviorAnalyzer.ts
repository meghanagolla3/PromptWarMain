import { UserProfile, DailyCheckIn, BehaviorAnalysis } from '@/types';
import { buildBehaviorAnalysisPrompt } from '@/prompts';
import { generateJSON } from './client';

export async function analyzeBehavior(
  userProfile: UserProfile,
  checkIn: DailyCheckIn,
  historicalData?: DailyCheckIn[]
): Promise<BehaviorAnalysis> {
  const prompt = buildBehaviorAnalysisPrompt(userProfile, checkIn, historicalData);
  
  const response = await generateJSON<{
    behaviorSummary: string;
    emotionalAnalysis: string;
    triggerAnalysis: string;
    confidenceScore: number;
    reasoning: string;
  }>(prompt);

  return {
    userId: userProfile.id,
    checkInId: checkIn.id,
    behaviorSummary: response.behaviorSummary,
    emotionalAnalysis: response.emotionalAnalysis,
    triggerAnalysis: response.triggerAnalysis,
    confidenceScore: response.confidenceScore,
    reasoning: response.reasoning,
    timestamp: new Date(),
  };
}
