'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckInFormData, MoodType, TriggerType, DailyCheckIn } from '@/types';
import { getUserProfile, addCheckIn, getTodayCheckIn, getCheckIns, initializeProgress, saveBehaviorAnalysis, saveRiskPrediction, saveCoachingPlan } from '@/lib/api';
import { analyzeBehavior, predictRisk, generateCoaching, isApiKeyConfigured } from '@/services/gemini';
import { BehaviorAnalysis, RiskPrediction, CoachingPlan } from '@/types';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';

type MoodOption = {
  emoji: string;
  label: MoodType;
};

type FactorOption = {
  id: TriggerType;
  label: string;
};

const moodOptions: MoodOption[] = [
  { emoji: '😊', label: 'great' },
  { emoji: '🙂', label: 'good' },
  { emoji: '😐', label: 'neutral' },
  { emoji: '😔', label: 'bad' },
  { emoji: '😢', label: 'terrible' },
];

const factorOptions: FactorOption[] = [
  { id: 'bored', label: 'Bored' },
  { id: 'stress', label: 'Stress' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'friends', label: 'Friends' },
  { id: 'lonely', label: 'Lonely' },
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'tired', label: 'Tired' },
  { id: 'procrastination', label: 'Procrastination' },
];

export function CheckIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<TriggerType[]>([]);
  const [notes, setNotes] = useState('');
  const [showAdditionalQuestions, setShowAdditionalQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [todayCheckinData, setTodayCheckinData] = useState<DailyCheckIn | null>(null);
  const [analysis, setAnalysis] = useState<BehaviorAnalysis | null>(null);
  const [risk, setRisk] = useState<RiskPrediction | null>(null);
  const [coaching, setCoaching] = useState<CoachingPlan | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const userProfile = await getUserProfile();
      if (!userProfile) {
        router.push('/onboarding');
        return;
      }

      const todayCheckIn = await getTodayCheckIn();
      const checkIns = await getCheckIns();
      
      setHasCheckedInToday(!!todayCheckIn);
      setTodayCheckinData(todayCheckIn || null);
      
      // Calculate streak
      let streak = 0;
      const sortedCheckIns = [...checkIns].sort((a, b) => a.date.getTime() - b.date.getTime());
      for (let i = sortedCheckIns.length - 1; i >= 0; i--) {
        if (sortedCheckIns[i].completedGoal) {
          streak++;
        } else {
          break;
        }
      }
      setStreakCount(streak);
      setIsCheckingStatus(false);
    };

    checkStatus();
  }, [router]);

  const apiKeyConfigured = isApiKeyConfigured();

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setShowAdditionalQuestions(true);
    
    setTimeout(() => {
      const element = document.getElementById('additional-questions');
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleFactorToggle = (factor: TriggerType) => {
    setSelectedFactors((prev) =>
      prev.includes(factor)
        ? prev.filter((f) => f !== factor)
        : [...prev, factor]
    );
    
    if (selectedFactors.length === 0) {
      setTimeout(() => {
        const element = document.getElementById('submit-section');
        element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      setError('Please select your mood before submitting.');
      return;
    }

    const userProfile = await getUserProfile();
    if (!userProfile) {
      setError('User profile not found. Please complete onboarding.');
      return;
    }

    if (!isApiKeyConfigured()) {
      setError('Gemini API key is not configured. Please add your API key to the .env.local file to enable AI features.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const checkIn: DailyCheckIn = {
        id: crypto.randomUUID(),
        userId: userProfile.id,
        date: new Date(),
        mood: selectedMood,
        stressLevel: 5,
        sleepQuality: 5,
        energyLevel: 5,
        currentUrge: 5,
        location: 'home',
        triggers: selectedFactors,
        reflection: notes.trim() || undefined,
        completedGoal: false,
      };

      await addCheckIn(checkIn);

      setIsAnalyzing(true);
      const historicalData = await getCheckIns();

      const [behaviorAnalysis, riskPrediction, coachingPlan] = await Promise.all([
        analyzeBehavior(userProfile, checkIn, historicalData),
        analyzeBehavior(userProfile, checkIn, historicalData).then(() => 
          predictRisk(userProfile, checkIn, {
            userId: userProfile.id,
            checkInId: checkIn.id,
            behaviorSummary: 'Analyzing...',
            emotionalAnalysis: 'Analyzing...',
            triggerAnalysis: 'Analyzing...',
            confidenceScore: 0,
            reasoning: 'Analyzing...',
            timestamp: new Date(),
          }, historicalData)
        ),
        generateCoaching(userProfile, checkIn, {
          userId: userProfile.id,
          checkInId: checkIn.id,
          riskLevel: 'medium',
          factors: [],
          confidence: 0,
          reasoning: 'Analyzing...',
          timestamp: new Date(),
        }),
      ]);

      // Save AI analysis results to database (ignore errors if using localStorage fallback)
      const saveResults = await Promise.all([
        saveBehaviorAnalysis({
          checkInId: checkIn.id,
          behaviorSummary: behaviorAnalysis.behaviorSummary,
          emotionalAnalysis: behaviorAnalysis.emotionalAnalysis,
          triggerAnalysis: behaviorAnalysis.triggerAnalysis,
          confidenceScore: behaviorAnalysis.confidenceScore,
          reasoning: behaviorAnalysis.reasoning,
        }),
        saveRiskPrediction({
          checkInId: checkIn.id,
          riskLevel: riskPrediction.riskLevel,
          factors: riskPrediction.factors,
          confidence: riskPrediction.confidence,
          reasoning: riskPrediction.reasoning,
        }),
        saveCoachingPlan({
          checkInId: checkIn.id,
          motivationalMessage: coachingPlan.motivationalMessage,
          reasoning: coachingPlan.reasoning,
          personalizedSuggestion: coachingPlan.personalizedSuggestion,
          replacementActivity: coachingPlan.replacementActivity,
          microGoal: coachingPlan.microGoal,
          reflectionQuestion: coachingPlan.reflectionQuestion,
        }),
      ]);

      // If any save failed (returned null), use localStorage fallback
      if (saveResults.some(result => result === null)) {
        console.warn('Some AI analysis saves failed, using localStorage fallback');
        // Store AI analysis in localStorage as fallback
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('habitmind_latest_analysis', JSON.stringify({
            behaviorAnalysis,
            riskPrediction,
            coachingPlan,
            checkInId: checkIn.id,
          }));
        }
      }

      setAnalysis(behaviorAnalysis);
      setRisk(riskPrediction);
      setCoaching(coachingPlan);

      // Initialize progress if first check-in
      await initializeProgress(userProfile.id);

      // Navigate to results page
      router.push('/results');
    } catch (err) {
      console.error('Error during check-in:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (hasCheckedInToday) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-t from-blue-500 to-cyan-400 mb-6">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
                  Check-in Completed!
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  You've already checked in today. Come back tomorrow!
                </p>
              </div>

              {todayCheckinData && (
                <div className="mb-8">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Today's Check-in
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Mood:</span>
                        <span className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                          {todayCheckinData.mood}
                        </span>
                      </div>
                      {todayCheckinData.reflection && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Notes:</span>
                          <p className="mt-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg p-4">
                            {todayCheckinData.reflection}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-8">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>
                  You've checked in{' '}
                  <span className="text-purple-600 dark:text-purple-400 font-semibold text-lg">{streakCount} days</span> in a
                  row{streakCount > 0 && ' 🎉'}
                </span>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:w-auto min-w-[200px] h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg rounded-2xl transition-all duration-300"
                >
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {!apiKeyConfigured && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-400">
                  AI Features Disabled
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Gemini API key is not configured. Add your API key to the .env.local file to enable AI analysis and coaching.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-gray-900 dark:text-white mb-3">
                Daily Mood Check-in
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Take a moment to reflect on how you're feeling
              </p>
            </div>

            <div className="mb-9">
              <p className="text-xl text-gray-900 dark:text-white font-medium mb-6">
                How are you feeling today?
              </p>

              <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => handleMoodSelect(mood.label)}
                    className="transition-transform hover:-translate-y-1"
                  >
                    <div
                      className={`w-full aspect-square max-w-[150px] p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform ${
                        selectedMood === mood.label
                          ? 'bg-gradient-to-t from-blue-500 to-cyan-400 scale-105 shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 scale-100'
                      }`}
                    >
                      <span
                        className={`text-5xl mb-2 transition-all duration-300 ${
                          selectedMood === mood.label ? 'scale-110' : 'scale-100'
                        }`}
                      >
                        {mood.emoji}
                      </span>
                      <span
                        className={`text-sm font-medium capitalize ${
                          selectedMood === mood.label
                            ? 'text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {mood.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {!selectedMood && (
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-8">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>
                  You've checked in{' '}
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">{streakCount} days</span> in a
                  row{streakCount > 0 && ' 🎉'}
                </span>
              </div>
            )}

            {showAdditionalQuestions && (
              <div id="additional-questions" className="space-y-8">
                <div>
                  <p className="text-xl text-gray-900 dark:text-white font-medium mb-6">
                    What's affecting your mood?
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {factorOptions.slice(0, 4).map((factor) => (
                      <button
                        key={factor.id}
                        onClick={() => handleFactorToggle(factor.id)}
                        className={`h-14 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 transform ${
                          selectedFactors.includes(factor.id)
                            ? 'bg-gradient-to-t from-blue-500 to-cyan-400 text-white scale-105 shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 scale-100'
                        }`}
                      >
                        {factor.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {factorOptions.slice(4).map((factor) => (
                      <button
                        key={factor.id}
                        onClick={() => handleFactorToggle(factor.id)}
                        className={`h-14 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 transform ${
                          selectedFactors.includes(factor.id)
                            ? 'bg-gradient-to-t from-blue-500 to-cyan-400 text-white scale-105 shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 scale-100'
                        }`}
                      >
                        {factor.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xl text-gray-900 dark:text-white font-medium mb-6">
                    Would you like to share more? (Optional)
                  </p>

                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us more about how you're feeling..."
                    className="min-h-[120px] w-full resize-none rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400 bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all duration-300 px-6 py-4"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">{error}</p>
                  </div>
                )}

                {selectedFactors.length > 0 && (
                  <div id="submit-section" className="text-center pt-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full sm:w-[300px] h-16 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {isAnalyzing ? 'Analyzing...' : 'Submitting...'}
                        </>
                      ) : (
                        'Submit check-in'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
