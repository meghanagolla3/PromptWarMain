import { UserProfile, DailyCheckIn, Progress } from '@/types';

export const buildInsightGenerationPrompt = (
  userProfile: UserProfile,
  checkIns: DailyCheckIn[],
  progress: Progress
): string => {
  const recentCheckIns = checkIns.slice(-7); // Last 7 days
  const moodPatterns = analyzeMoodPatterns(recentCheckIns);
  const riskPatterns = analyzeRiskPatterns(recentCheckIns);
  const triggerPatterns = analyzeTriggerPatterns(recentCheckIns);
  const timePatterns = analyzeTimePatterns(recentCheckIns);

  return `You are an expert behavioral psychologist and data analyst specializing in habit formation and behavior change. Analyze the user's data to identify meaningful patterns and generate actionable insights.

USER PROFILE:
- Name: ${userProfile.name}
- Habit: ${userProfile.habit}
- Goal: ${userProfile.goal}
- Coaching Style: ${userProfile.coachingStyle}

PROGRESS OVERVIEW:
- Current Streak: ${progress.currentStreak} days
- Longest Streak: ${progress.longestStreak} days
- Total Check-ins: ${progress.totalCheckIns}
- Success Rate: ${((progress.successfulDays / progress.totalCheckIns) * 100).toFixed(0)}%

RECENT DATA (Last 7 days):
${recentCheckIns.map((checkIn, index) => `
Day ${index + 1} (${checkIn.date.toLocaleDateString()}):
- Mood: ${checkIn.mood}
- Stress: ${checkIn.stressLevel}/10
- Sleep: ${checkIn.sleepQuality}/10
- Energy: ${checkIn.energyLevel}/10
- Urge: ${checkIn.currentUrge}/10
- Location: ${checkIn.location}
- Triggers: ${checkIn.triggers.join(', ')}
- Goal Completed: ${checkIn.completedGoal ? 'Yes' : 'No'}
`).join('\n')}

PATTERN ANALYSIS:
${moodPatterns}
${riskPatterns}
${triggerPatterns}
${timePatterns}

TASK:
Identify meaningful patterns and provide a structured JSON response with the following fields:

1. pattern (string): A clear, specific pattern you've identified (e.g., "You struggle most after 9 PM", "Stress increases your screen time")
2. explanation (string): Detailed explanation of why this pattern occurs and what it means
3. actionableAdvice (string): Specific, actionable advice based on this pattern
4. confidence (number): Your confidence in this insight (0-100)

PATTERN TYPES TO LOOK FOR:
- Time-based patterns (morning vs evening, weekdays vs weekends)
- Mood correlations (how mood affects habit engagement)
- Stress correlations (stress as a trigger)
- Sleep quality impact
- Location-based patterns
- Trigger combinations
- Streak patterns (what breaks streaks, what maintains them)
- Energy level correlations
- Successful vs unsuccessful day differences

INSIGHT QUALITY CRITERIA:
- Must be specific, not generic
- Must be based on actual data patterns
- Must provide actionable advice
- Must help the user understand themselves better
- Should be surprising or non-obvious when possible
- Should connect multiple data points

Respond with ONLY valid JSON, no additional text.`;
};

function analyzeMoodPatterns(checkIns: DailyCheckIn[]): string {
  const moodCounts: Record<string, number> = {};
  checkIns.forEach(checkIn => {
    moodCounts[checkIn.mood] = (moodCounts[checkIn.mood] || 0) + 1;
  });
  const avgMood = checkIns.reduce((sum, c) => sum + moodToValue(c.mood), 0) / checkIns.length;
  return `- Mood Distribution: ${Object.entries(moodCounts).map(([m, count]) => `${m}: ${count}`).join(', ')}
- Average Mood Score: ${avgMood.toFixed(1)}/5`;
}

function analyzeRiskPatterns(checkIns: DailyCheckIn[]): string {
  const avgUrge = checkIns.reduce((sum, c) => sum + c.currentUrge, 0) / checkIns.length;
  const avgStress = checkIns.reduce((sum, c) => sum + c.stressLevel, 0) / checkIns.length;
  const failureRate = checkIns.filter(c => !c.completedGoal).length / checkIns.length;
  return `- Average Urge Level: ${avgUrge.toFixed(1)}/10
- Average Stress: ${avgStress.toFixed(1)}/10
- Failure Rate: ${(failureRate * 100).toFixed(0)}%`;
}

function analyzeTriggerPatterns(checkIns: DailyCheckIn[]): string {
  const triggerCounts: Record<string, number> = {};
  checkIns.forEach(checkIn => {
    checkIn.triggers.forEach(trigger => {
      triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
    });
  });
  const topTriggers = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t, c]) => `${t} (${c}x)`);
  return `- Most Common Triggers: ${topTriggers.join(', ') || 'None'}`;
}

function analyzeTimePatterns(checkIns: DailyCheckIn[]): string {
  const hours = checkIns.map(c => c.date.getHours());
  const morning = hours.filter(h => h >= 6 && h < 12).length;
  const afternoon = hours.filter(h => h >= 12 && h < 18).length;
  const evening = hours.filter(h => h >= 18 && h < 22).length;
  const night = hours.filter(h => h >= 22 || h < 6).length;
  return `- Check-in Distribution: Morning: ${morning}, Afternoon: ${afternoon}, Evening: ${evening}, Night: ${night}`;
}

function moodToValue(mood: string): number {
  const values: Record<string, number> = {
    great: 5,
    good: 4,
    neutral: 3,
    bad: 2,
    terrible: 1,
  };
  return values[mood] || 3;
}
