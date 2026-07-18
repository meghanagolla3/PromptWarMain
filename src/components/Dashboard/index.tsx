'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks/useDashboard';
import { NudgeCard } from '@/components/NudgeCard';
import { SkeletonStatCard, SkeletonAnalysisCard } from './SkeletonCard';
import {
  Flame,
  TrendingUp,
  Award,
  Calendar,
  RefreshCw,
  Bell,
  Loader2,
  AlertTriangle,
  Shield,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

/** Risk level badge color mapping */
const RISK_COLOR: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-orange-500',
  low: 'bg-green-500',
};

/** Risk level icon mapping */
function RiskIcon({ level }: { level: string }) {
  if (level === 'high') return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />;
  if (level === 'medium') return <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" aria-hidden="true" />;
  return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />;
}

export function Dashboard() {
  const router = useRouter();
  const {
    userProfile,
    progress,
    latestAnalysis,
    latestRisk,
    latestCoaching,
    nudges,
    isLoading,
    error,
    isGeneratingNudge,
    loadData,
    requestNudge,
    dismissNudge,
  } = useDashboard();

  if (isLoading) {
    return (
      <main
        className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4"
        aria-busy="true"
        aria-label="Loading dashboard"
      >
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
          <div className="h-5 w-48 bg-gray-100 dark:bg-gray-800 rounded mb-10 animate-pulse" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><SkeletonAnalysisCard /></div>
            <SkeletonAnalysisCard />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center" role="alert">
        <div className="text-center max-w-md p-8">
          <AlertTriangle className="w-14 h-14 text-red-500 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={loadData} className="bg-purple-600 hover:bg-purple-700 text-white">
            <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  const successRate = progress?.totalCheckIns
    ? Math.round((progress.successfulDays / progress.totalCheckIns) * 100)
    : 0;

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4"
      aria-label="HabitMind Dashboard"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome back, {userProfile?.name || 'User'}!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your journey to break{' '}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {userProfile?.habit || 'your habit'}
              </span>{' '}
              continues
            </p>
          </div>
          <nav className="flex gap-3" aria-label="Dashboard actions">
            <Button
              onClick={() => requestNudge(userProfile)}
              disabled={isGeneratingNudge}
              variant="outline"
              aria-label={isGeneratingNudge ? 'Generating nudge…' : 'Request a motivational nudge'}
              className="border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
            >
              {isGeneratingNudge ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
              ) : (
                <Bell className="w-4 h-4 mr-2" aria-hidden="true" />
              )}
              Check on me
            </Button>
            <Button
              onClick={() => router.push('/checkin')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              aria-label="Go to daily check-in"
            >
              Daily Check-in
            </Button>
          </nav>
        </header>

        {/* Active Nudges */}
        {nudges.filter(n => !n.responded).length > 0 && (
          <section aria-label="Active nudges" className="mb-8 space-y-4">
            {nudges.filter(n => !n.responded).slice(0, 2).map((nudge) => (
              <NudgeCard key={nudge.id} nudge={nudge} onDismiss={dismissNudge} />
            ))}
          </section>
        )}

        {/* Stats Grid */}
        <section aria-label="Progress statistics" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900 dark:text-white" aria-label={`${progress?.currentStreak ?? 0} day streak`}>
                {progress?.currentStreak ?? 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">days</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                Longest Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900 dark:text-white" aria-label={`Longest streak: ${progress?.longestStreak ?? 0} days`}>
                {progress?.longestStreak ?? 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">days</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden="true" />
                Total Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900 dark:text-white" aria-label={`${progress?.totalCheckIns ?? 0} total check-ins`}>
                {progress?.totalCheckIns ?? 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">days tracked</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900 dark:text-white" aria-label={`${successRate}% success rate`}>
                {successRate}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">goal completion</p>
            </CardContent>
          </Card>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* AI Analysis Panel */}
          <section aria-label="AI analysis results" className="lg:col-span-2">
            <Card className="border-2 border-purple-200 dark:border-purple-800 h-full">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  Latest AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Risk Prediction */}
                {latestRisk ? (
                  <article
                    className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700"
                    aria-label={`Risk level: ${latestRisk.riskLevel}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <RiskIcon level={latestRisk.riskLevel} />
                        Risk Level
                      </h3>
                      <Badge className={`${RISK_COLOR[latestRisk.riskLevel] ?? 'bg-gray-500'} text-white border-0 text-base px-4 py-1`}>
                        {latestRisk.riskLevel?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">AI Confidence</span>
                      <span className="text-3xl font-bold text-purple-600 dark:text-purple-400" aria-label={`${latestRisk.confidence} percent confidence`}>
                        {latestRisk.confidence}%
                      </span>
                    </div>
                    <div
                      className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3"
                      role="progressbar"
                      aria-valuenow={latestRisk.confidence}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Confidence level"
                    >
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${latestRisk.confidence}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{latestRisk.reasoning}</p>
                  </article>
                ) : (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-40" aria-hidden="true" />
                    <p className="font-medium">No risk analysis yet</p>
                    <p className="text-sm mt-1">Complete a check-in to see your AI risk assessment</p>
                  </div>
                )}

                {/* Behavior Analysis */}
                {latestAnalysis && (
                  <article className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Behavior Analysis</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Confidence Score</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400" aria-label={`Confidence score: ${latestAnalysis.confidenceScore} out of 10`}>
                        {latestAnalysis.confidenceScore}/10
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{latestAnalysis.behaviorSummary}</p>
                  </article>
                )}

                {/* Coaching Plan */}
                {latestCoaching && (
                  <article className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Today's Coaching</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{latestCoaching.motivationalMessage}</p>
                    <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Micro Goal:</strong>{' '}
                        {latestCoaching.microGoal?.goal || 'Set a goal today'}
                      </p>
                    </div>
                  </article>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Achievements */}
          <section aria-label="Achievements">
            <Card className="border-2 border-purple-200 dark:border-purple-800 h-full">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {progress?.achievements?.length > 0 ? (
                  <ul className="grid grid-cols-2 gap-4" aria-label="Earned achievements">
                    {progress.achievements.map((achievement: any) => (
                      <li
                        key={achievement.id}
                        className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700 text-center"
                        aria-label={achievement.title}
                      >
                        <div className="text-3xl mb-2" aria-hidden="true">{achievement.icon}</div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{achievement.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{achievement.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-40" aria-hidden="true" />
                    <p className="font-medium">No achievements yet</p>
                    <p className="text-sm mt-1">Complete check-ins to unlock them!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Weekly Reflections */}
        {progress?.weeklyReflections?.length > 0 && (
          <section aria-label="Weekly reflections" className="mt-6">
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Weekly Reflections</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {progress.weeklyReflections.slice(0, 2).map((reflection: any, index: number) => (
                    <li
                      key={index}
                      className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Week of {new Date(reflection.weekStart).toLocaleDateString()}
                        </span>
                        <Badge variant="outline">Summary</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{reflection.summary}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </main>
  );
}
