// API client functions to replace localStorage calls

export async function getUserProfile() {
  try {
    const response = await fetch('/api/user');
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem('habitmind_user_profile');
      return item ? JSON.parse(item) : null;
    }
    return null;
  }
}

export async function saveUserProfile(profile: any) {
  try {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new Error('Failed to save user profile');
    return await response.json();
  } catch (error) {
    console.error('Error saving user profile:', error);
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('habitmind_user_profile', JSON.stringify(profile));
      return profile;
    }
    throw error;
  }
}

export async function getCheckIns() {
  try {
    const response = await fetch('/api/checkins');
    if (!response.ok) throw new Error('Failed to fetch check-ins');
    const data = await response.json();
    // Parse triggers from JSON string back to array
    return data.map((checkIn: any) => ({
      ...checkIn,
      triggers: typeof checkIn.triggers === 'string' ? JSON.parse(checkIn.triggers) : checkIn.triggers,
    }));
  } catch (error) {
    console.error('Error fetching check-ins:', error);
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem('habitmind_checkins');
      const data = item ? JSON.parse(item, (key, value) => {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      }) : [];
      return data;
    }
    return [];
  }
}

export async function createCheckIn(checkIn: any) {
  try {
    const response = await fetch('/api/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkIn),
    });
    if (!response.ok) throw new Error('Failed to create check-in');
    return await response.json();
  } catch (error) {
    console.error('Error creating check-in:', error);
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem('habitmind_checkins');
      const checkIns = item ? JSON.parse(item, (key, value) => {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      }) : [];
      checkIns.push(checkIn);
      window.localStorage.setItem('habitmind_checkins', JSON.stringify(checkIns));
      return checkIn;
    }
    throw error;
  }
}

export async function addCheckIn(checkIn: any) {
  return createCheckIn(checkIn);
}

export async function initializeProgress(userId: string) {
  try {
    const progress = {
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
    };
    return saveProgress(progress);
  } catch (error) {
    console.error('Error initializing progress:', error);
    throw error;
  }
}

export async function getTodayCheckIn() {
  try {
    const response = await fetch('/api/checkins/today');
    if (!response.ok) throw new Error('Failed to fetch today check-in');
    const data = await response.json();
    if (!data) return null;
    // Parse triggers from JSON string back to array
    return {
      ...data,
      triggers: typeof data.triggers === 'string' ? JSON.parse(data.triggers) : data.triggers,
    };
  } catch (error) {
    console.error('Error fetching today check-in:', error);
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem('habitmind_checkins');
      const checkIns = item ? JSON.parse(item, (key, value) => {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      }) : [];
      const today = new Date().toDateString();
      return checkIns.find((c: any) => c.date.toDateString() === today) || null;
    }
    return null;
  }
}

export async function getProgress() {
  try {
    const response = await fetch('/api/progress');
    if (!response.ok) throw new Error('Failed to fetch progress');
    const data = await response.json();
    if (!data) return null;
    // Parse JSON fields back to objects
    return {
      ...data,
      moodTrend: typeof data.moodTrend === 'string' ? JSON.parse(data.moodTrend) : data.moodTrend,
      riskTrend: typeof data.riskTrend === 'string' ? JSON.parse(data.riskTrend) : data.riskTrend,
      habitFrequency: typeof data.habitFrequency === 'string' ? JSON.parse(data.habitFrequency) : data.habitFrequency,
      achievements: typeof data.achievements === 'string' ? JSON.parse(data.achievements) : data.achievements,
      weeklyReflections: typeof data.weeklyReflections === 'string' ? JSON.parse(data.weeklyReflections) : data.weeklyReflections,
    };
  } catch (error) {
    console.error('Error fetching progress:', error);
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem('habitmind_progress');
      const data = item ? JSON.parse(item, (key, value) => {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      }) : null;
      return data;
    }
    return null;
  }
}

export async function saveProgress(progress: any) {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress),
    });
    if (!response.ok) throw new Error('Failed to save progress');
    return await response.json();
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
}

export async function saveBehaviorAnalysis(analysis: any) {
  try {
    const response = await fetch('/api/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analysis),
    });
    if (!response.ok) throw new Error('Failed to save behavior analysis');
    return await response.json();
  } catch (error) {
    console.error('Error saving behavior analysis:', error);
    // Don't throw - allow fallback to localStorage
    return null;
  }
}

export async function saveRiskPrediction(risk: any) {
  try {
    const response = await fetch('/api/risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(risk),
    });
    if (!response.ok) throw new Error('Failed to save risk prediction');
    return await response.json();
  } catch (error) {
    console.error('Error saving risk prediction:', error);
    // Don't throw - allow fallback to localStorage
    return null;
  }
}

export async function saveCoachingPlan(coaching: any) {
  try {
    const response = await fetch('/api/coaching', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coaching),
    });
    if (!response.ok) throw new Error('Failed to save coaching plan');
    return await response.json();
  } catch (error) {
    console.error('Error saving coaching plan:', error);
    // Don't throw - allow fallback to localStorage
    return null;
  }
}

export async function getAnalysisByCheckIn(checkInId: string) {
  try {
    const response = await fetch(`/api/analysis?checkInId=${checkInId}`);
    if (!response.ok) throw new Error('Failed to fetch analysis');
    return await response.json();
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
}

export async function getRiskByCheckIn(checkInId: string) {
  try {
    const response = await fetch(`/api/risk?checkInId=${checkInId}`);
    if (!response.ok) throw new Error('Failed to fetch risk');
    const data = await response.json();
    if (!data) return null;
    // Parse factors from JSON string back to object
    return {
      ...data,
      factors: typeof data.factors === 'string' ? JSON.parse(data.factors) : data.factors,
    };
  } catch (error) {
    console.error('Error fetching risk:', error);
    return null;
  }
}

export async function getCoachingByCheckIn(checkInId: string) {
  try {
    const response = await fetch(`/api/coaching?checkInId=${checkInId}`);
    if (!response.ok) throw new Error('Failed to fetch coaching');
    const data = await response.json();
    if (!data) return null;
    // Parse JSON fields back to objects
    return {
      ...data,
      replacementActivity: typeof data.replacementActivity === 'string' ? JSON.parse(data.replacementActivity) : data.replacementActivity,
      microGoal: typeof data.microGoal === 'string' ? JSON.parse(data.microGoal) : data.microGoal,
    };
  } catch (error) {
    console.error('Error fetching coaching:', error);
    return null;
  }
}

export function isOnboardingComplete(): boolean {
  // This will be handled by checking if user profile exists
  return false;
}

export async function getNudges(userId: string) {
  try {
    const response = await fetch(`/api/nudges?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch nudges');
    return await response.json();
  } catch (error) {
    console.error('Error fetching nudges:', error);
    return [];
  }
}

export async function saveNudge(nudge: any) {
  try {
    const response = await fetch('/api/nudges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nudge),
    });
    if (!response.ok) throw new Error('Failed to save nudge');
    return await response.json();
  } catch (error) {
    console.error('Error saving nudge:', error);
    return null;
  }
}

export async function markNudgeResponded(id: string, responded: boolean = true) {
  try {
    const response = await fetch('/api/nudges', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, delivered: true, responded }),
    });
    if (!response.ok) throw new Error('Failed to update nudge');
    return await response.json();
  } catch (error) {
    console.error('Error updating nudge:', error);
    return null;
  }
}
