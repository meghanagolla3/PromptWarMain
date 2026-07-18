import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST save risk prediction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkInId, riskLevel, factors, confidence, reasoning } = body;

    const risk = await prisma.riskPrediction.create({
      data: {
        checkInId,
        riskLevel,
        factors: JSON.stringify(factors),
        confidence,
        reasoning,
      },
    });

    return NextResponse.json(risk);
  } catch (error) {
    console.error('Error saving risk prediction:', error);
    return NextResponse.json({ error: 'Failed to save risk prediction' }, { status: 500 });
  }
}

// GET risk prediction by check-in ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkInId = searchParams.get('checkInId');

    if (!checkInId) {
      return NextResponse.json({ error: 'checkInId is required' }, { status: 400 });
    }

    const risk = await prisma.riskPrediction.findUnique({
      where: { checkInId },
    });

    return NextResponse.json(risk);
  } catch (error) {
    console.error('Error fetching risk prediction:', error);
    return NextResponse.json({ error: 'Failed to fetch risk prediction' }, { status: 500 });
  }
}
