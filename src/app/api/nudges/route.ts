import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nudgeSchema, nudgeUpdateSchema } from '@/utils/validation';

// GET nudges for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const nudges = await prisma.smartNudge.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { timestamp: 'desc' },
      take: 20,
    });
    return NextResponse.json(nudges);
  } catch (error) {
    console.error('[GET /api/nudges] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch nudges' }, { status: 500 });
  }
}

// POST create a new nudge
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = nudgeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { userId, message, context, priority, timing } = validation.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nudge = await (prisma.smartNudge.create as any)({
      data: {
        userId,
        message,
        context: context ?? '',
        priority: priority ?? 'medium',
        timestamp: timing ? new Date(timing) : new Date(),
      },
    });
    return NextResponse.json(nudge, { status: 201 });
  } catch (error) {
    console.error('[POST /api/nudges] Error:', error);
    return NextResponse.json({ error: 'Failed to create nudge' }, { status: 500 });
  }
}

// PATCH mark a nudge as delivered/responded
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = nudgeUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, delivered, responded } = validation.data;

    const nudge = await prisma.smartNudge.update({
      where: { id },
      data: {
        ...(delivered !== undefined && { delivered }),
        ...(responded !== undefined && { responded }),
      },
    });
    return NextResponse.json(nudge);
  } catch (error) {
    console.error('[PATCH /api/nudges] Error:', error);
    return NextResponse.json({ error: 'Failed to update nudge' }, { status: 500 });
  }
}
