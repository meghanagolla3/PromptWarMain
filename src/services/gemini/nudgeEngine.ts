import { UserProfile, DailyCheckIn, RiskPrediction, SmartNudge } from '@/types';
import { buildNudgePrompt } from '@/prompts';
import { generateJSON } from './client';

export interface NudgeDecision {
  shouldNudge: boolean;
  priority: 'low' | 'medium' | 'high';
  message: string;
  context: string;
}

export async function generateNudge(
  userProfile: UserProfile,
  checkIn: DailyCheckIn,
  riskPrediction: RiskPrediction,
  currentTime: Date = new Date(),
  historicalData?: DailyCheckIn[]
): Promise<SmartNudge | null> {
  const prompt = buildNudgePrompt(userProfile, checkIn, riskPrediction, currentTime, historicalData);

  const response = await generateJSON<NudgeDecision>(prompt);

  if (!response.shouldNudge) {
    return null;
  }

  return {
    userId: userProfile.id,
    message: response.message,
    context: response.context,
    priority: response.priority,
    timing: currentTime,
    delivered: false,
    responded: false,
  };
}
