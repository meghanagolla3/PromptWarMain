'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile, getCheckIns } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const userProfile = await getUserProfile();

      if (userProfile && userProfile.onboardingComplete) {
        // Check if user has completed today's check-in
        const checkIns = await getCheckIns();
        const today = new Date().toDateString();
        const hasCheckedInToday = checkIns.some((checkIn: any) => 
          new Date(checkIn.date).toDateString() === today
        );

        if (hasCheckedInToday) {
          router.push('/dashboard');
        } else {
          router.push('/checkin');
        }
      } else {
        router.push('/onboarding');
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
