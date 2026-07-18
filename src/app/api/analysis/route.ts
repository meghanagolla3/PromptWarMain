import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { behaviorAnalysisSchema } from '@/utils/validation';

// POST save behavior analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = behaviorAnalysisSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { checkInId, behaviorSummary, emotionalAnalysis, triggerAnalysis, confidenceScore, reasoning } = validation.data;

    const analysis = await prisma.behaviorAnalysis.create({
      data: {
        checkInId,
        behaviorSummary,
        emotionalAnalysis,
        triggerAnalysis,
        confidenceScore,
        reasoning,
      },
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error saving behavior analysis:', error);
    return NextResponse.json({ error: 'Failed to save behavior analysis' }, { status: 500 });
  }
}

// GET behavior analysis by check-in ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkInId = searchParams.get('checkInId');

    if (!checkInId) {
      return NextResponse.json({ error: 'checkInId is required' }, { status: 400 });
    }

    const analysis = await prisma.behaviorAnalysis.findUnique({
      where: { checkInId },
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error fetching behavior analysis:', error);
    return NextResponse.json({ error: 'Failed to fetch behavior analysis' }, { status: 500 });
  }
}
