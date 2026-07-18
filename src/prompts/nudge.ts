import { UserProfile, DailyCheckIn, RiskPrediction } from '@/types';

export const buildNudgePrompt = (
  userProfile: UserProfile,
  checkIn: DailyCheckIn,
  riskPrediction: RiskPrediction,
  currentTime: Date,
  historicalData?: DailyCheckIn[]
): string => {
  const hour = currentTime.getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';

  const historicalPatterns = historicalData && historicalData.length > 0
    ? `
PAST PATTERNS:
- Typical relapse time: ${getTypicalRelapseTime(historicalData)}
- Most common triggers: ${getMostCommonTriggers(historicalData)}
- Interventions that worked before: ${getSuccessfulPatterns(historicalData)}
`
    : 'No historical patterns available yet.';

  return `You are a context-aware behavioral nudge engine. Your job is to decide if the user needs a supportive interruption RIGHT NOW, and if so, craft exactly ONE short, highly personalized nudge message.

USER PROFILE:
- Name: ${userProfile.name}
- Habit: ${userProfile.habit}
- Goal: ${userProfile.goal}
- Coaching Style: ${userProfile.coachingStyle}

CURRENT CONTEXT:
- Time: ${currentTime.toLocaleTimeString()} (${timeOfDay})
- Mood: ${checkIn.mood}
- Stress: ${checkIn.stressLevel}/10
- Current Urge: ${checkIn.currentUrge}/10
- Risk Level: ${riskPrediction.riskLevel}
- Risk Factors: ${riskPrediction.factors.map(f => f.factor).join(', ')}

${historicalPatterns}

TASK:
Decide whether an intervention is warranted right now given the risk level, time of day, and historical relapse timing. Respond with ONLY valid JSON:

{
  "shouldNudge": boolean,
  "priority": "low" | "medium" | "high",
  "message": string,
  "context": string
}

RULES:
- "shouldNudge" should be true only if risk is medium/high OR current time is close to a known relapse time OR urge >= 6.
- "message" must be short (1-3 sentences), warm, reference something specific and true about the user's day (not generic).
- "context" should briefly explain WHY this nudge was triggered (e.g., "Approaching usual relapse time of 7:45 PM with high stress").
- Never say "Drink water" or other generic unrelated advice.
- Match tone to coaching style: ${userProfile.coachingStyle}.

Respond with ONLY valid JSON, no additional text.`;
};

function getTypicalRelapseTime(checkIns: DailyCheckIn[]): string {
  const failedDays = checkIns.filter(c => !c.completedGoal);
  if (failedDays.length === 0) return 'No clear pattern yet';
  const hours = failedDays.map(c => new Date(c.date).getHours());
  const avgHour = Math.round(hours.reduce((a, b) => a + b, 0) / hours.length);
  return `around ${avgHour}:00`;
}

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
    .join(', ') || 'None identified';
}

function getSuccessfulPatterns(checkIns: DailyCheckIn[]): string {
  const successfulDays = checkIns.filter(c => c.completedGoal && c.whatHelped);
  if (successfulDays.length === 0) return 'None recorded yet';
  return successfulDays.map(c => c.whatHelped).slice(0, 3).join(', ');
}
