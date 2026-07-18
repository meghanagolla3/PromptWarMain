import { NextRequest, NextResponse } from 'next/server';
import { predictRisk } from '@/services/gemini';
import { getUserProfile, getCheckIns, getAnalysisByCheckIn } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkInId } = body;

    if (!checkInId) {
      return NextResponse.json({ error: 'checkInId is required' }, { status: 400 });
    }

    const userProfile = await getUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const checkIns = await getCheckIns();
    const checkIn = checkIns.find((c: any) => c.id === checkInId);
    if (!checkIn) {
      return NextResponse.json({ error: 'Check-in not found' }, { status: 404 });
    }

    const behaviorAnalysis = await getAnalysisByCheckIn(checkInId);
    if (!behaviorAnalysis) {
      return NextResponse.json({ error: 'Behavior analysis not found' }, { status: 404 });
    }

    const risk = await predictRisk(userProfile, checkIn, behaviorAnalysis, checkIns);
    return NextResponse.json(risk);
  } catch (error) {
    console.error('[POST /api/ai/risk] Error:', error);
    return NextResponse.json({ error: 'Failed to predict risk' }, { status: 500 });
  }
}
