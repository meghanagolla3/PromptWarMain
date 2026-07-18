import { DailyCheckIn, Progress, Achievement, WeeklyReflection } from '@/types';
import { ACHIEVEMENTS } from '@/constants';

export function calculateProgress(checkIns: DailyCheckIn[], userId: string): Progress {
  const sortedCheckIns = [...checkIns].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = sortedCheckIns.length - 1; i >= 0; i--) {
    const checkIn = sortedCheckIns[i];
    const checkInDate = new Date(checkIn.date);
    checkInDate.setHours(0, 0, 0, 0);
    
    if (checkIn.completedGoal) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      
      // Check if this is part of current streak
      const daysDiff = Math.floor((today.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 1) {
        currentStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }
  
  // Calculate successful days
  const successfulDays = sortedCheckIns.filter(c => c.completedGoal).length;
  
  // Calculate mood trend
  const moodTrend = sortedCheckIns.map(c => ({
    date: c.date,
    mood: c.mood,
    value: moodToValue(c.mood),
  }));
  
  // Calculate risk trend (based on urge level)
  const riskTrend = sortedCheckIns.map(c => ({
    date: c.date,
    riskLevel: urgeToRiskLevel(c.currentUrge),
    value: urgeToValue(c.currentUrge),
  }));
  
  // Calculate habit frequency
  const habitFrequency = sortedCheckIns.map(c => ({
    date: c.date,
    frequency: c.completedGoal ? 0 : 1, // 1 if they failed (engaged in habit)
    urgeLevel: c.currentUrge,
  }));
  
  // Calculate achievements
  const achievements = calculateAchievements(sortedCheckIns, currentStreak, longestStreak);
  
  // Generate weekly reflections (group by week)
  const weeklyReflections = generateWeeklyReflections(sortedCheckIns);
  
  return {
    userId,
    currentStreak,
    longestStreak,
    totalCheckIns: sortedCheckIns.length,
    successfulDays,
    moodTrend,
    riskTrend,
    habitFrequency,
    achievements,
    weeklyReflections,
    lastUpdated: new Date(),
  };
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

function urgeToRiskLevel(urge: number): 'low' | 'medium' | 'high' {
  if (urge >= 7) return 'high';
  if (urge >= 5) return 'medium';
  return 'low';
}

function urgeToValue(urge: number): number {
  if (urge >= 7) return 3;
  if (urge >= 5) return 2;
  return 1;
}

function calculateAchievements(
  checkIns: DailyCheckIn[],
  currentStreak: number,
  longestStreak: number
): Achievement[] {
  const achievements: Achievement[] = [];
  const successfulDays = checkIns.filter(c => c.completedGoal).length;
  const reflectionCount = checkIns.filter(c => c.reflection && c.reflection.length > 0).length;
  const lowRiskDays = checkIns.filter(c => c.currentUrge < 5).length;
  const goodMoodDays = checkIns.filter(c => c.mood === 'good' || c.mood === 'great').length;
  
  // First check-in
  if (checkIns.length > 0) {
    achievements.push({
      ...ACHIEVEMENTS[0],
      unlockedAt: checkIns[0].date,
    });
  }
  
  // Streak achievements
  if (currentStreak >= 3 || longestStreak >= 3) {
    achievements.push({
      ...ACHIEVEMENTS[1],
      unlockedAt: new Date(),
    });
  }
  
  if (currentStreak >= 7 || longestStreak >= 7) {
    achievements.push({
      ...ACHIEVEMENTS[2],
      unlockedAt: new Date(),
    });
  }
  
  if (currentStreak >= 30 || longestStreak >= 30) {
    achievements.push({
      ...ACHIEVEMENTS[3],
      unlockedAt: new Date(),
    });
  }
  
  // Goal completion
  if (successfulDays > 0) {
    achievements.push({
      ...ACHIEVEMENTS[4],
      unlockedAt: new Date(),
    });
  }
  
  // Reflection master
  if (reflectionCount >= 7) {
    achievements.push({
      ...ACHIEVEMENTS[5],
      unlockedAt: new Date(),
    });
  }
  
  // Low risk
  if (lowRiskDays >= 3) {
    achievements.push({
      ...ACHIEVEMENTS[6],
      unlockedAt: new Date(),
    });
  }
  
  // Mood improver
  if (goodMoodDays >= 5) {
    achievements.push({
      ...ACHIEVEMENTS[7],
      unlockedAt: new Date(),
    });
  }
  
  return achievements;
}

function generateWeeklyReflections(checkIns: DailyCheckIn[]): WeeklyReflection[] {
  // This is a simplified version - in production, you'd group by actual weeks
  const reflections: WeeklyReflection[] = [];
  const weekGroups: Record<string, DailyCheckIn[]> = {};
  
  checkIns.forEach(checkIn => {
    const date = new Date(checkIn.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString();
    
    if (!weekGroups[weekKey]) {
      weekGroups[weekKey] = [];
    }
    weekGroups[weekKey].push(checkIn);
  });
  
  Object.entries(weekGroups).forEach(([weekKey, weekCheckIns]) => {
    const weekStart = new Date(weekKey);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const successfulDays = weekCheckIns.filter(c => c.completedGoal).length;
    const avgMood = weekCheckIns.reduce((sum, c) => sum + moodToValue(c.mood), 0) / weekCheckIns.length;
    
    reflections.push({
      weekStart,
      weekEnd,
      summary: `Completed ${successfulDays}/${weekCheckIns.length} days with average mood of ${avgMood.toFixed(1)}/5`,
      insights: [],
      improvements: [],
      challenges: [],
    });
  });
  
  return reflections;
}
