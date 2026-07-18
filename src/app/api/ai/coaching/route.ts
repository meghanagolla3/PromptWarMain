import { NextRequest, NextResponse } from 'next/server';
import { generateCoaching } from '@/services/gemini';
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

    const coaching = await generateCoaching(userProfile, checkIn, riskPrediction);
    return NextResponse.json(coaching);
  } catch (error) {
    console.error('[POST /api/ai/coaching] Error:', error);
    return NextResponse.json({ error: 'Failed to generate coaching' }, { status: 500 });
  }
}
