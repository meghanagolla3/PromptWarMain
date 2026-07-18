import { NextRequest, NextResponse } from 'next/server';
import { generateNudge } from '@/services/gemini';
import { getUserProfile, getCheckIns, getRiskByCheckIn } from '@/lib/api';

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

    const riskPrediction = await getRiskByCheckIn(checkInId);
    if (!riskPrediction) {
      return NextResponse.json({ error: 'Risk prediction not found' }, { status: 404 });
    }

    const nudge = await generateNudge(userProfile, checkIn, riskPrediction, new Date(), checkIns);
    return NextResponse.json(nudge);
  } catch (error) {
    console.error('[POST /api/ai/nudge] Error:', error);
    return NextResponse.json({ error: 'Failed to generate nudge' }, { status: 500 });
  }
}
