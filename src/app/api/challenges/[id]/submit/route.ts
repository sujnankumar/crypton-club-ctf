import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Challenge from '@/models/Challenge';
import Submission from '@/models/Submission';
import { z } from 'zod';

const submitFlagSchema = z.object({
    flag: z.string().min(1),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await req.json();
        const { flag } = submitFlagSchema.parse(body);

        await dbConnect();

        const challenge = await Challenge.findById(id).select('+flag');
        if (!challenge) {
            return NextResponse.json({ message: 'Challenge not found' }, { status: 404 });
        }

        // Check if already solved
        const existingSubmission = await Submission.findOne({
            user_id: session.user.id,
            challenge_id: id,
            is_correct: true
        });

        if (existingSubmission) {
            return NextResponse.json({ message: 'Already solved' }, { status: 400 });
        }

        const isCorrect = challenge.flag === flag;

        await Submission.create({
            user_id: session.user.id,
            challenge_id: id,
            submitted_flag: flag,
            is_correct: isCorrect,
            points_awarded: isCorrect ? challenge.points : 0,
        });

        if (isCorrect) {
            return NextResponse.json({ message: 'Correct flag!', correct: true, points: challenge.points });
        } else {
            return NextResponse.json({ message: 'Incorrect flag', correct: false }, { status: 400 });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
