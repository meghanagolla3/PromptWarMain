import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkInSchema } from '@/utils/validation';
import { z } from 'zod';

const createCheckInSchema = checkInSchema.extend({
  userId: z.string().min(1),
  date: z.string(),
  completedGoal: z.boolean().optional(),
});

// GET all check-ins
export async function GET() {
  try {
    const checkIns = await prisma.dailyCheckIn.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(checkIns);
  } catch (error) {
    console.error('[GET /api/checkins] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch check-ins' }, { status: 500 });
  }
}

// POST create check-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = createCheckInSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { userId, date, mood, stressLevel, sleepQuality, energyLevel, currentUrge, location, triggers, reflection, completedGoal } = validation.data;

    const checkIn = await prisma.dailyCheckIn.create({
      data: {
        userId,
        date: new Date(date),
        mood,
        stressLevel,
        sleepQuality,
        energyLevel,
        currentUrge,
        location,
        triggers: JSON.stringify(Array.isArray(triggers) ? triggers : [triggers]),
        reflection,
        completedGoal,
      },
    });

    return NextResponse.json(checkIn, { status: 201 });
  } catch (error) {
    console.error('[POST /api/checkins] Error:', error);
    return NextResponse.json({ error: 'Failed to create check-in' }, { status: 500 });
  }
}
