import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Submission from '@/models/Submission';

export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    await dbConnect();
    const submissions = await Submission.find({})
      .populate('user_id', 'name email')
      .populate('challenge_id', 'title category points')
      .sort({ submitted_at: -1 });
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
