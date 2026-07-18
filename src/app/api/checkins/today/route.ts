import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET today's check-in
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkIn = await prisma.dailyCheckIn.findFirst({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return NextResponse.json(checkIn);
  } catch (error) {
    console.error('Error fetching today check-in:', error);
    return NextResponse.json({ error: 'Failed to fetch today check-in' }, { status: 500 });
  }
}
