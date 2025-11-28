import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Challenge from '@/models/Challenge';
import { z } from 'zod';

const createChallengeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  points: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().min(0)),
  flag: z.string().min(1),
  file_url: z.string().optional(),
  external_link: z.string().optional(),
  is_hidden: z.boolean().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    await dbConnect();
    const challenges = await Challenge.find({}).sort({ points: 1 }).select('+flag');
    return NextResponse.json(challenges);
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createChallengeSchema.parse(body);

    await dbConnect();
    const challenge = await Challenge.create(data);

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
