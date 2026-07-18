// Habit Options
export const HABIT_OPTIONS = [
  { value: 'instagram', label: 'Instagram', icon: '📱' },
  { value: 'youtube', label: 'YouTube', icon: '▶️' },
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
  { value: 'smoking', label: 'Smoking', icon: '🚬' },
  { value: 'late_night_screen', label: 'Late Night Screen Time', icon: '🌙' },
  { value: 'social_media', label: 'Social Media', icon: '💬' },
  { value: 'phone_checking', label: 'Phone Checking', icon: '📲' },
  { value: 'other', label: 'Other', icon: '📝' },
] as const;

// Goal Options
export const GOAL_OPTIONS = [
  { value: 'reduce_usage', label: 'Reduce Usage', description: 'Cut down on time spent' },
  { value: 'quit', label: 'Quit Completely', description: 'Stop the habit entirely' },
  { value: 'improve_focus', label: 'Improve Focus', description: 'Reduce distractions' },
  { value: 'improve_sleep', label: 'Improve Sleep', description: 'Better sleep quality' },
  { value: 'reduce_distraction', label: 'Reduce Distraction', description: 'Stay more productive' },
] as const;

// Coaching Style Options
export const COACHING_STYLE_OPTIONS = [
  { value: 'friendly', label: 'Friendly', description: 'Warm and encouraging approach' },
  { value: 'motivational', label: 'Motivational', description: 'Energetic and inspiring' },
  { value: 'direct', label: 'Direct', description: 'Clear and straightforward' },
  { value: 'reflective', label: 'Reflective', description: 'Thoughtful and questioning' },
] as const;

// Mood Options
export const MOOD_OPTIONS = [
  { value: 'great', label: 'Great', emoji: '😊', color: 'bg-green-500' },
  { value: 'good', label: 'Good', emoji: '🙂', color: 'bg-blue-500' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'bg-gray-500' },
  { value: 'bad', label: 'Bad', emoji: '😔', color: 'bg-orange-500' },
  { value: 'terrible', label: 'Terrible', emoji: '😢', color: 'bg-red-500' },
] as const;

// Location Options
export const LOCATION_OPTIONS = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'college', label: 'College', icon: '🎓' },
  { value: 'office', label: 'Office', icon: '💼' },
  { value: 'other', label: 'Other', icon: '📍' },
] as const;

// Trigger Options
export const TRIGGER_OPTIONS = [
  { value: 'bored', label: 'Bored', icon: '😴' },
  { value: 'stress', label: 'Stress', icon: '😰' },
  { value: 'notifications', label: 'Notifications', icon: '🔔' },
  { value: 'friends', label: 'Friends', icon: '👥' },
  { value: 'lonely', label: 'Lonely', icon: '😔' },
  { value: 'anxiety', label: 'Anxiety', icon: '😨' },
  { value: 'tired', label: 'Tired', icon: '😪' },
  { value: 'procrastination', label: 'Procrastination', icon: '⏰' },
  { value: 'other', label: 'Other', icon: '❓' },
] as const;

// Risk Level Colors
export const RISK_LEVEL_CONFIG = {
  low: {
    label: 'Low Risk',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  medium: {
    label: 'Medium Risk',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  high: {
    label: 'High Risk',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
} as const;

// Replacement Activities
export const REPLACEMENT_ACTIVITIES = [
  { activity: 'Go for a 5-minute walk', duration: '5 min', reason: 'Physical movement breaks the dopamine loop' },
  { activity: 'Call a friend', duration: '10 min', reason: 'Social connection reduces loneliness' },
  { activity: 'Drink water', duration: '1 min', reason: 'Hydration resets your focus' },
  { activity: 'Journal your thoughts', duration: '5 min', reason: 'Writing processes emotions' },
  { activity: 'Meditate', duration: '5 min', reason: 'Mindfulness reduces stress' },
  { activity: 'Read 10 pages', duration: '15 min', reason: 'Engaging content replaces scrolling' },
  { activity: 'Stretch', duration: '3 min', reason: 'Body movement releases tension' },
  { activity: 'Listen to calming music', duration: '10 min', reason: 'Music regulates mood' },
  { activity: 'Do 10 pushups', duration: '2 min', reason: 'Exercise boosts endorphins' },
  { activity: 'Organize your space', duration: '10 min', reason: 'Order creates mental clarity' },
] as const;

// Achievement Definitions
export const ACHIEVEMENTS = [
  {
    id: 'first_checkin',
    title: 'First Step',
    description: 'Complete your first daily check-in',
    icon: '🎯',
  },
  {
    id: 'streak_3',
    title: 'Building Momentum',
    description: 'Achieve a 3-day streak',
    icon: '🔥',
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Achieve a 7-day streak',
    icon: '⭐',
  },
  {
    id: 'streak_30',
    title: 'Month Master',
    description: 'Achieve a 30-day streak',
    icon: '🏆',
  },
  {
    id: 'goal_complete',
    title: 'Goal Getter',
    description: 'Complete your daily goal',
    icon: '✅',
  },
  {
    id: 'reflection_master',
    title: 'Self-Reflective',
    description: 'Complete 7 reflections',
    icon: '🪞',
  },
  {
    id: 'low_risk',
    title: 'Risk Manager',
    description: 'Maintain low risk for 3 days',
    icon: '🛡️',
  },
  {
    id: 'mood_improver',
    title: 'Mood Lifter',
    description: 'Report improved mood for 5 days',
    icon: '😊',
  },
] as const;

// Age Groups
export const AGE_GROUPS = [
  { value: '13-17', label: '13-17 (Teen)' },
  { value: '18-24', label: '18-24 (Young Adult)' },
  { value: '25-34', label: '25-34 (Adult)' },
  { value: '35-44', label: '35-44 (Mid Adult)' },
  { value: '45-54', label: '45-54 (Mature Adult)' },
  { value: '55+', label: '55+ (Senior)' },
] as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'habitmind_user_profile',
  DAILY_CHECKINS: 'habitmind_checkins',
  PROGRESS: 'habitmind_progress',
  INSIGHTS: 'habitmind_insights',
  NUDGES: 'habitmind_nudges',
  ONBOARDING_COMPLETE: 'habitmind_onboarding_complete',
} as const;

// API Configuration
export const API_CONFIG = {
  GEMINI_MODEL: 'gemini-2.5-flash',
  MAX_RETRIES: 3,
  TIMEOUT_MS: 30000,
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  HABIT_REQUIRED: 'Please select a habit',
  GOAL_REQUIRED: 'Please select a goal',
  COACHING_STYLE_REQUIRED: 'Please select a coaching style',
  MOOD_REQUIRED: 'Please select your mood',
  REFLECTION_TOO_SHORT: 'Reflection must be at least 10 characters',
  REFLECTION_TOO_LONG: 'Reflection must be less than 500 characters',
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
