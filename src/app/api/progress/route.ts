import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET progress
export async function GET() {
  try {
    const progress = await prisma.progress.findFirst();
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

// POST create/update progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, currentStreak, longestStreak, totalCheckIns, successfulDays, moodTrend, riskTrend, habitFrequency, achievements, weeklyReflections } = body;

    const existing = await prisma.progress.findFirst();
    
    if (existing) {
      const updated = await prisma.progress.update({
        where: { id: existing.id },
        data: {
          currentStreak,
          longestStreak,
          totalCheckIns,
          successfulDays,
          moodTrend: JSON.stringify(moodTrend),
          riskTrend: JSON.stringify(riskTrend),
          habitFrequency: JSON.stringify(habitFrequency),
          achievements: JSON.stringify(achievements),
          weeklyReflections: JSON.stringify(weeklyReflections),
          lastUpdated: new Date(),
        },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.progress.create({
        data: {
          userId,
          currentStreak,
          longestStreak,
          totalCheckIns,
          successfulDays,
          moodTrend: JSON.stringify(moodTrend),
          riskTrend: JSON.stringify(riskTrend),
          habitFrequency: JSON.stringify(habitFrequency),
          achievements: JSON.stringify(achievements),
          weeklyReflections: JSON.stringify(weeklyReflections),
        },
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}
