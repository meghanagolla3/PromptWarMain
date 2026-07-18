'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getUserProfile,
  getCheckIns,
  getProgress,
  getNudges,
  saveNudge,
  getRiskByCheckIn,
  getAnalysisByCheckIn,
  getCoachingByCheckIn,
} from '@/lib/api';
import { generateNudge, isApiKeyConfigured } from '@/services/gemini';

export interface DashboardData {
  userProfile: any | null;
  progress: any | null;
  latestAnalysis: any | null;
  latestRisk: any | null;
  latestCoaching: any | null;
  nudges: any[];
}

export interface DashboardState extends DashboardData {
  isLoading: boolean;
  error: string | null;
  isGeneratingNudge: boolean;
}

const DEFAULT_PROGRESS = {
  currentStreak: 0,
  longestStreak: 0,
  totalCheckIns: 0,
  successfulDays: 0,
  achievements: [],
  weeklyReflections: [],
};

export function useDashboard() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>({
    userProfile: null,
    progress: null,
    latestAnalysis: null,
    latestRisk: null,
    latestCoaching: null,
    nudges: [],
    isLoading: true,
    error: null,
    isGeneratingNudge: false,
  });

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const profile = await getUserProfile();

      if (!profile) {
        router.push('/onboarding');
        return;
      }

      const [prog, nudgeData, checkIns] = await Promise.all([
        getProgress(),
        getNudges(profile.id),
        getCheckIns(),
      ]);

      let latestAnalysis = null;
      let latestRisk = null;
      let latestCoaching = null;

      if (checkIns.length > 0) {
        // Sort by date descending to get the true latest
        const sorted = [...checkIns].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const latestCheckIn = sorted[0];

        [latestAnalysis, latestRisk, latestCoaching] = await Promise.all([
          getAnalysisByCheckIn(latestCheckIn.id),
          getRiskByCheckIn(latestCheckIn.id),
          getCoachingByCheckIn(latestCheckIn.id),
        ]);

        // Fallback to localStorage if DB returns nothing
        if (!latestAnalysis && !latestRisk && !latestCoaching && typeof window !== 'undefined') {
          const fallback = window.localStorage.getItem('habitmind_latest_analysis');
          if (fallback) {
            const parsed = JSON.parse(fallback);
            latestAnalysis = parsed.behaviorAnalysis ?? null;
            latestRisk = parsed.riskPrediction ?? null;
            latestCoaching = parsed.coachingPlan ?? null;
          }
        }
      }

      setState({
        userProfile: profile,
        progress: prog ?? DEFAULT_PROGRESS,
        latestAnalysis,
        latestRisk,
        latestCoaching,
        nudges: nudgeData ?? [],
        isLoading: false,
        error: null,
        isGeneratingNudge: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const requestNudge = useCallback(async (userProfile: any) => {
    if (!userProfile || !isApiKeyConfigured()) return;

    setState(prev => ({ ...prev, isGeneratingNudge: true }));
    try {
      const checkIns = await getCheckIns();
      if (checkIns.length === 0) return;

      const latestRisk = await getRiskByCheckIn(checkIns[0].id);
      if (!latestRisk) return;

      const nudge = await generateNudge(userProfile, checkIns[0], latestRisk, new Date(), checkIns);
      if (!nudge) return;

      const saved = await saveNudge({
        userId: nudge.userId,
        message: nudge.message,
        context: nudge.context,
        priority: nudge.priority,
        timing: nudge.timing,
      });

      if (saved) {
        setState(prev => ({ ...prev, nudges: [saved, ...prev.nudges] }));
      }
    } catch (err) {
      console.error('Error generating nudge:', err);
    } finally {
      setState(prev => ({ ...prev, isGeneratingNudge: false }));
    }
  }, []);

  const dismissNudge = useCallback((id: string) => {
    setState(prev => ({ ...prev, nudges: prev.nudges.filter(n => n.id !== id) }));
  }, []);

  return { ...state, loadData, requestNudge, dismissNudge };
}
