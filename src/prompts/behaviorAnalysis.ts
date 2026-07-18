import { UserProfile, DailyCheckIn } from '@/types';

export const buildBehaviorAnalysisPrompt = (
  userProfile: UserProfile,
  checkIn: DailyCheckIn,
  historicalData?: DailyCheckIn[]
): string => {
  const historicalContext = historicalData
    ? `
Historical Context (Last ${historicalData.length} check-ins):
${historicalData.map((data, index) => `
Day ${index + 1}:
- Mood: ${data.mood}
- Stress: ${data.stressLevel}/10
- Sleep: ${data.sleepQuality}/10
- Energy: ${data.energyLevel}/10
- Urge: ${data.currentUrge}/10
- Triggers: ${data.triggers.join(', ')}
- Completed Goal: ${data.completedGoal ? 'Yes' : 'No'}
`).join('\n')}
`
    : 'No historical data available (first check-in).';

  return `You are an expert behavioral psychologist and AI behavior change coach. Analyze the user's current state and provide a comprehensive behavior analysis.

USER PROFILE:
- Name: ${userProfile.name}
- Habit to Change: ${userProfile.habit}
- Goal: ${userProfile.goal}
- Coaching Style: ${userProfile.coachingStyle}
- Age Group: ${userProfile.ageGroup || 'Not specified'}
- Occupation: ${userProfile.occupation || 'Not specified'}

CURRENT CHECK-IN:
- Date: ${checkIn.date.toLocaleDateString()}
- Mood: ${checkIn.mood}
- Stress Level: ${checkIn.stressLevel}/10
- Sleep Quality: ${checkIn.sleepQuality}/10
- Energy Level: ${checkIn.energyLevel}/10
- Current Urge: ${checkIn.currentUrge}/10
- Location: ${checkIn.location}
- Triggers: ${checkIn.triggers.join(', ')}
- Reflection: ${checkIn.reflection || 'None provided'}

${historicalContext}

TASK:
Analyze the user's behavior and provide a structured JSON response with the following fields:

1. behaviorSummary (string): A 2-3 sentence summary of the user's current behavioral state
2. emotionalAnalysis (string): Deep analysis of their emotional state, connecting mood, stress, and energy levels
3. triggerAnalysis (string): Identify which triggers are most significant and why
4. confidenceScore (number): Your confidence in this analysis (0-100)
5. reasoning (string): Your step-by-step reasoning for the analysis

GUIDELINES:
- Be empathetic but objective
- Consider the coaching style in your analysis tone
- Look for patterns in historical data if available
- Identify the root causes, not just symptoms
- Consider how sleep, stress, and energy interact
- Focus on actionable insights

Respond with ONLY valid JSON, no additional text.`;
};
