import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Challenge from '@/models/Challenge';
import Submission from '@/models/Submission';
import { z } from 'zod';

const createChallengeSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    points: z.number().min(0),
    flag: z.string().min(1),
    file_url: z.string().optional(),
    external_link: z.string().optional(),
    is_hidden: z.boolean().optional(),
});

export async function GET(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        // If admin, show all challenges including hidden ones and flags
        if (session.user.role === 'admin') {
            const challenges = await Challenge.find({}).sort({ points: 1 });
            return NextResponse.json(challenges);
        }

        // If player, show only visible challenges and hide flags
        const challenges = await Challenge.find({ is_hidden: false })
            .select('-flag')
            .sort({ points: 1 });

        // Get user's solves
        const submissions = await Submission.find({
            user_id: session.user.id,
            is_correct: true
        });

        const solvedChallengeIds = new Set(submissions.map(s => s.challenge_id.toString()));

        const challengesWithStatus = challenges.map(c => ({
            ...c.toObject(),
            solved: solvedChallengeIds.has(c._id.toString())
        }));

        return NextResponse.json(challengesWithStatus);
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
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
