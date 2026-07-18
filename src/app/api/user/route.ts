import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { onboardingSchema } from '@/utils/validation';

// GET user profile
export async function GET() {
  try {
    const profile = await prisma.userProfile.findFirst();
    return NextResponse.json(profile ?? null);
  } catch (error) {
    console.error('[GET /api/user] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

// POST create/update user profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = onboardingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, habit, goal, coachingStyle, ageGroup, occupation } = validation.data;
    const existing = await prisma.userProfile.findFirst();

    if (existing) {
      const updated = await prisma.userProfile.update({
        where: { id: existing.id },
        data: { name, habit, goal, coachingStyle, ageGroup, occupation, onboardingComplete: true },
      });
      return NextResponse.json(updated);
    }

    const created = await prisma.userProfile.create({
      data: { name, habit, goal, coachingStyle, ageGroup, occupation, onboardingComplete: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('[POST /api/user] Error:', error);
    return NextResponse.json({ error: 'Failed to save user profile' }, { status: 500 });
  }
}
