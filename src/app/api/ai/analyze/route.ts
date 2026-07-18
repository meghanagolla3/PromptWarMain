import { NextRequest, NextResponse } from 'next/server';
import { analyzeBehavior } from '@/services/gemini';
import { getUserProfile, getCheckIns } from '@/lib/api';

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

    const analysis = await analyzeBehavior(userProfile, checkIn, checkIns);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('[POST /api/ai/analyze] Error:', error);
    return NextResponse.json({ error: 'Failed to analyze behavior' }, { status: 500 });
  }
}
