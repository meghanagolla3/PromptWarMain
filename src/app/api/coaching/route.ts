import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST save coaching plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkInId, motivationalMessage, reasoning, personalizedSuggestion, replacementActivity, microGoal, reflectionQuestion } = body;

    const coaching = await prisma.coachingPlan.create({
      data: {
        checkInId,
        motivationalMessage,
        reasoning,
        personalizedSuggestion,
        replacementActivity: JSON.stringify(replacementActivity),
        microGoal: JSON.stringify(microGoal),
        reflectionQuestion,
      },
    });

    return NextResponse.json(coaching);
  } catch (error) {
    console.error('Error saving coaching plan:', error);
    return NextResponse.json({ error: 'Failed to save coaching plan' }, { status: 500 });
  }
}

// GET coaching plan by check-in ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkInId = searchParams.get('checkInId');

    if (!checkInId) {
      return NextResponse.json({ error: 'checkInId is required' }, { status: 400 });
    }

    const coaching = await prisma.coachingPlan.findUnique({
      where: { checkInId },
    });

    return NextResponse.json(coaching);
  } catch (error) {
    console.error('Error fetching coaching plan:', error);
    return NextResponse.json({ error: 'Failed to fetch coaching plan' }, { status: 500 });
  }
}
