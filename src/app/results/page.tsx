'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RiskCard } from '@/components/RiskCard';
import { CoachCard } from '@/components/CoachCard';
import { BehaviorAnalysis, RiskPrediction, CoachingPlan } from '@/types';
import { getCheckIns, getAnalysisByCheckIn, getRiskByCheckIn, getCoachingByCheckIn } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<BehaviorAnalysis | null>(null);
  const [risk, setRisk] = useState<RiskPrediction | null>(null);
  const [coaching, setCoaching] = useState<CoachingPlan | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      const checkIns = await getCheckIns();
      const latestCheckIn = checkIns[checkIns.length - 1];
      
      if (latestCheckIn) {
        // Fetch actual AI results from database
        const [behaviorAnalysis, riskPrediction, coachingPlan] = await Promise.all([
          getAnalysisByCheckIn(latestCheckIn.id),
          getRiskByCheckIn(latestCheckIn.id),
          getCoachingByCheckIn(latestCheckIn.id),
        ]);

        // If database doesn't have results, try localStorage fallback
        if (!behaviorAnalysis && !riskPrediction && !coachingPlan) {
          if (typeof window !== 'undefined') {
            const fallbackData = window.localStorage.getItem('habitmind_latest_analysis');
            if (fallbackData) {
              const parsed = JSON.parse(fallbackData);
              setAnalysis(parsed.behaviorAnalysis);
              setRisk(parsed.riskPrediction);
              setCoaching(parsed.coachingPlan);
              setIsLoading(false);
              return;
            }
          }
        }

        setAnalysis(behaviorAnalysis);
        setRisk(riskPrediction);
        setCoaching(coachingPlan);
        setIsLoading(false);
      } else {
        router.push('/checkin');
      }
    };

    loadResults();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Analyzing your responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push('/checkin')}
            variant="ghost"
            className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Check-in
          </Button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-t from-green-500 to-emerald-400 mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Your AI Analysis
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Personalized insights based on your current state
            </p>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Risk Prediction */}
          {risk && <RiskCard risk={risk} />}

          {/* Coaching Plan */}
          {coaching && <CoachCard coaching={coaching} />}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 rounded-2xl transition-all duration-300"
          >
            View Dashboard
          </Button>
          <Button
            onClick={() => router.push('/checkin')}
            variant="outline"
            className="border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold px-8 py-6 rounded-2xl transition-all duration-300"
          >
            New Check-in
          </Button>
        </div>
      </div>
    </div>
  );
}
