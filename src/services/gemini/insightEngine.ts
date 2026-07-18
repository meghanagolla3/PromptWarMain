import { UserProfile, DailyCheckIn, Progress, AIInsight } from '@/types';
import { buildInsightGenerationPrompt } from '@/prompts';
import { generateJSON } from './client';

export async function generateInsight(
  userProfile: UserProfile,
  checkIns: DailyCheckIn[],
  progress: Progress
): Promise<AIInsight> {
  const prompt = buildInsightGenerationPrompt(userProfile, checkIns, progress);
  
  const response = await generateJSON<{
    pattern: string;
    explanation: string;
    actionableAdvice: string;
    confidence: number;
  }>(prompt);

  return {
    userId: userProfile.id,
    pattern: response.pattern,
    explanation: response.explanation,
    actionableAdvice: response.actionableAdvice,
    confidence: response.confidence,
    timestamp: new Date(),
  };
}
