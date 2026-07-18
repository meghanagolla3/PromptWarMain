import { UserProfile, DailyCheckIn, BehaviorAnalysis } from '@/types';

export const buildRiskPredictionPrompt = (
  userProfile: UserProfile,
  checkIn: DailyCheckIn,
  behaviorAnalysis: BehaviorAnalysis,
  historicalData?: DailyCheckIn[]
): string => {
  const historicalPatterns = historicalData && historicalData.length > 0
    ? `
Historical Risk Patterns:
- Average Urge Level: ${(historicalData.reduce((sum, d) => sum + d.currentUrge, 0) / historicalData.length).toFixed(1)}/10
- Average Stress: ${(historicalData.reduce((sum, d) => sum + d.stressLevel, 0) / historicalData.length).toFixed(1)}/10
- Goal Completion Rate: ${(historicalData.filter(d => d.completedGoal).length / historicalData.length * 100).toFixed(0)}%
- Most Common Triggers: ${getMostCommonTriggers(historicalData)}
- Failed Days: ${historicalData.filter(d => !d.completedGoal).length}
`
    : 'No historical patterns available (first check-in).';

  return `You are an expert behavioral psychologist specializing in addiction and habit formation. Predict the user's risk level for engaging in their harmful habit today.

USER PROFILE:
- Name: ${userProfile.name}
- Habit: ${userProfile.habit}
- Goal: ${userProfile.goal}
- Coaching Style: ${userProfile.coachingStyle}

CURRENT STATE:
- Mood: ${checkIn.mood}
- Stress Level: ${checkIn.stressLevel}/10
- Sleep Quality: ${checkIn.sleepQuality}/10
- Energy Level: ${checkIn.energyLevel}/10
- Current Urge: ${checkIn.currentUrge}/10
- Location: ${checkIn.location}
- Triggers: ${checkIn.triggers.join(', ')}
- Time of Day: ${checkIn.date.toLocaleTimeString()}

BEHAVIOR ANALYSIS:
- Summary: ${behaviorAnalysis.behaviorSummary}
- Emotional State: ${behaviorAnalysis.emotionalAnalysis}
- Trigger Analysis: ${behaviorAnalysis.triggerAnalysis}

${historicalPatterns}

TASK:
Predict the user's risk level and provide a structured JSON response with the following fields:

1. riskLevel (string): "low", "medium", or "high" - based on likelihood of engaging in the habit
2. factors (array of objects): Each object should have:
   - factor (string): Name of the factor (e.g., "High stress", "Poor sleep", "Evening time")
   - impact (string): "positive", "negative", or "neutral" - effect on risk
   - weight (number): 1-10, how much this factor contributes to risk
3. confidence (number): Your confidence in this prediction (0-100)
4. reasoning (string): Your step-by-step reasoning for the risk assessment

RISK ASSESSMENT CRITERIA:
- HIGH RISK: Urge > 7, stress > 7, poor sleep (< 5), multiple triggers, evening/night time, historical failures
- MEDIUM RISK: Urge 5-7, stress 5-7, moderate sleep (5-7), some triggers, mixed history
- LOW RISK: Urge < 5, stress < 5, good sleep (> 7), few/no triggers, good history

Consider:
- Time of day (evenings/nights are typically higher risk)
- Sleep quality impact on willpower
- Stress as a major trigger
- Pattern of failures at similar times
- Energy levels affecting self-control
- Location-based risks
- Trigger combinations

Respond with ONLY valid JSON, no additional text.`;
};

function getMostCommonTriggers(checkIns: DailyCheckIn[]): string {
  const triggerCounts: Record<string, number> = {};
  checkIns.forEach(checkIn => {
    checkIn.triggers.forEach(trigger => {
      triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
    });
  });
  return Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([trigger]) => trigger)
    .join(', ');
}
