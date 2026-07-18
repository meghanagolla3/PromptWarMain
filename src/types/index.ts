// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  habit: HabitType;
  goal: GoalType;
  coachingStyle: CoachingStyle;
  ageGroup?: string;
  occupation?: string;
  createdAt: Date;
}

export type HabitType = 
  | 'instagram'
  | 'youtube'
  | 'gaming'
  | 'smoking'
  | 'late_night_screen'
  | 'social_media'
  | 'phone_checking'
  | 'other';

export type GoalType = 
  | 'reduce_usage'
  | 'quit'
  | 'improve_focus'
  | 'improve_sleep'
  | 'reduce_distraction';

export type CoachingStyle = 
  | 'friendly'
  | 'motivational'
  | 'direct'
  | 'reflective';

// Check-in Types
export interface DailyCheckIn {
  id: string;
  userId: string;
  date: Date;
  mood: MoodType;
  stressLevel: number; // 1-10
  sleepQuality: number; // 1-10
  energyLevel: number; // 1-10
  currentUrge: number; // 1-10
  location: LocationType;
  triggers: TriggerType[];
  reflection?: string;
  completedGoal: boolean;
  difficulty?: string;
  feeling?: string;
  whatHelped?: string;
}

export type MoodType = 
  | 'great'
  | 'good'
  | 'neutral'
  | 'bad'
  | 'terrible';

export type LocationType = 
  | 'home'
  | 'college'
  | 'office'
  | 'other';

export type TriggerType = 
  | 'bored'
  | 'stress'
  | 'notifications'
  | 'friends'
  | 'lonely'
  | 'anxiety'
  | 'tired'
  | 'procrastination'
  | 'other';

// AI Analysis Types
export interface BehaviorAnalysis {
  userId: string;
  checkInId: string;
  behaviorSummary: string;
  emotionalAnalysis: string;
  triggerAnalysis: string;
  confidenceScore: number;
  reasoning: string;
  timestamp: Date;
}

export interface RiskPrediction {
  userId: string;
  checkInId: string;
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  confidence: number;
  reasoning: string;
  timestamp: Date;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
}

export interface CoachingPlan {
  userId: string;
  checkInId: string;
  motivationalMessage: string;
  reasoning: string;
  personalizedSuggestion: string;
  replacementActivity: ReplacementActivity;
  microGoal: MicroGoal;
  reflectionQuestion: string;
  timestamp: Date;
}

export interface ReplacementActivity {
  activity: string;
  duration: string;
  reason: string;
}

export interface MicroGoal {
  goal: string;
  achievable: boolean;
  timeframe: string;
}

// Progress Types
export interface Progress {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  successfulDays: number;
  moodTrend: MoodDataPoint[];
  riskTrend: RiskDataPoint[];
  habitFrequency: HabitFrequencyData[];
  achievements: Achievement[];
  weeklyReflections: WeeklyReflection[];
  lastUpdated: Date;
}

export interface MoodDataPoint {
  date: Date;
  mood: MoodType;
  value: number; // 1-5
}

export interface RiskDataPoint {
  date: Date;
  riskLevel: RiskLevel;
  value: number; // 1-3
}

export interface HabitFrequencyData {
  date: Date;
  frequency: number;
  urgeLevel: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface WeeklyReflection {
  weekStart: Date;
  weekEnd: Date;
  summary: string;
  insights: string[];
  improvements: string[];
  challenges: string[];
}

// Insight Types
export interface AIInsight {
  userId: string;
  pattern: string;
  explanation: string;
  actionableAdvice: string;
  confidence: number;
  timestamp: Date;
}

export interface SmartNudge {
  userId: string;
  message: string;
  context: string;
  priority: RiskLevel;
  timing: Date;
  delivered: boolean;
  responded: boolean;
}

// API Response Types
export interface GeminiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form Types
export interface OnboardingFormData {
  name: string;
  habit: HabitType;
  goal: GoalType;
  coachingStyle: CoachingStyle;
  ageGroup?: string;
  occupation?: string;
}

export interface CheckInFormData {
  mood: MoodType;
  stressLevel: number;
  sleepQuality: number;
  energyLevel: number;
  currentUrge: number;
  location: LocationType;
  triggers: TriggerType[];
  reflection?: string;
}

export interface ReflectionFormData {
  completedGoal: boolean;
  difficulty?: string;
  feeling?: string;
  whatHelped?: string;
}

// Utility Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
