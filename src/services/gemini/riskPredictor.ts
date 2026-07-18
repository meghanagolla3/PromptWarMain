import { UserProfile, DailyCheckIn, BehaviorAnalysis, RiskPrediction } from '@/types';
import { buildRiskPredictionPrompt } from '@/prompts';
import { generateJSON } from './client';

export async function predictRisk(
  userProfile: UserProfile,
  checkIn: DailyCheckIn,
  behaviorAnalysis: BehaviorAnalysis,
  historicalData?: DailyCheckIn[]
): Promise<RiskPrediction> {
  const prompt = buildRiskPredictionPrompt(userProfile, checkIn, behaviorAnalysis, historicalData);
  
  const response = await generateJSON<{
    riskLevel: 'low' | 'medium' | 'high';
    factors: Array<{
      factor: string;
      impact: 'positive' | 'negative' | 'neutral';
      weight: number;
    }>;
    confidence: number;
    reasoning: string;
  }>(prompt);

  return {
    userId: userProfile.id,
    checkInId: checkIn.id,
    riskLevel: response.riskLevel,
    factors: response.factors,
    confidence: response.confidence,
    reasoning: response.reasoning,
    timestamp: new Date(),
  };
}
