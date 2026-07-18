import { STORAGE_KEYS } from '@/constants';
import { UserProfile, DailyCheckIn, Progress, AIInsight, SmartNudge } from '@/types';

// Generic storage functions
export function getStorageItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return null;
    
    // Custom reviver to convert date strings back to Date objects
    return JSON.parse(item, (key, value) => {
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    console.error(`Error reading from storage (${key}):`, error);
    return null;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to storage (${key}):`, error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from storage (${key}):`, error);
  }
}

// User Profile
export function getUserProfile(): UserProfile | null {
  return getStorageItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
}

export function setUserProfile(profile: UserProfile): void {
  setStorageItem(STORAGE_KEYS.USER_PROFILE, profile);
}

export function clearUserProfile(): void {
  removeStorageItem(STORAGE_KEYS.USER_PROFILE);
}

// Daily Check-ins
export function getCheckIns(): DailyCheckIn[] {
  return getStorageItem<DailyCheckIn[]>(STORAGE_KEYS.DAILY_CHECKINS) || [];
}

export function setCheckIns(checkIns: DailyCheckIn[]): void {
  setStorageItem(STORAGE_KEYS.DAILY_CHECKINS, checkIns);
}

export function addCheckIn(checkIn: DailyCheckIn): void {
  const checkIns = getCheckIns();
  checkIns.push(checkIn);
  setCheckIns(checkIns);
}

export function updateCheckIn(checkInId: string, updates: Partial<DailyCheckIn>): void {
  const checkIns = getCheckIns();
  const index = checkIns.findIndex(c => c.id === checkInId);
  if (index !== -1) {
    checkIns[index] = { ...checkIns[index], ...updates };
    setCheckIns(checkIns);
  }
}

export function getTodayCheckIn(): DailyCheckIn | null {
  const checkIns = getCheckIns();
  const today = new Date().toDateString();
  return checkIns.find(c => c.date.toDateString() === today) || null;
}

// Progress
export function getProgress(): Progress | null {
  return getStorageItem<Progress>(STORAGE_KEYS.PROGRESS);
}

export function setProgress(progress: Progress): void {
  setStorageItem(STORAGE_KEYS.PROGRESS, progress);
}

export function initializeProgress(userId: string): Progress {
  const progress: Progress = {
    userId,
    currentStreak: 0,
    longestStreak: 0,
    totalCheckIns: 0,
    successfulDays: 0,
    moodTrend: [],
    riskTrend: [],
    habitFrequency: [],
    achievements: [],
    weeklyReflections: [],
    lastUpdated: new Date(),
  };
  setProgress(progress);
  return progress;
}

// Insights
export function getInsights(): AIInsight[] {
  return getStorageItem<AIInsight[]>(STORAGE_KEYS.INSIGHTS) || [];
}

export function setInsights(insights: AIInsight[]): void {
  setStorageItem(STORAGE_KEYS.INSIGHTS, insights);
}

export function addInsight(insight: AIInsight): void {
  const insights = getInsights();
  insights.push(insight);
  // Keep only last 30 insights
  if (insights.length > 30) {
    insights.shift();
  }
  setInsights(insights);
}

// Nudges
export function getNudges(): SmartNudge[] {
  return getStorageItem<SmartNudge[]>(STORAGE_KEYS.NUDGES) || [];
}

export function setNudges(nudges: SmartNudge[]): void {
  setStorageItem(STORAGE_KEYS.NUDGES, nudges);
}

export function addNudge(nudge: SmartNudge): void {
  const nudges = getNudges();
  nudges.push(nudge);
  setNudges(nudges);
}

// Onboarding
export function isOnboardingComplete(): boolean {
  return getStorageItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE) || false;
}

export function setOnboardingComplete(complete: boolean): void {
  setStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETE, complete);
}

// Clear all data
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeStorageItem(key);
  });
}
