import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Challenge from '@/models/Challenge';
import Submission from '@/models/Submission';
import { z } from 'zod';

const updateChallengeSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    points: z.number().min(0).optional(),
    flag: z.string().min(1).optional(),
    file_url: z.string().optional(),
    external_link: z.string().optional(),
    is_hidden: z.boolean().optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        await dbConnect();

        let challenge;
        if (session.user.role === 'admin') {
            challenge = await Challenge.findById(id);
        } else {
            challenge = await Challenge.findOne({ _id: id, is_hidden: false }).select('-flag');
        }

        if (!challenge) {
            return NextResponse.json({ message: 'Challenge not found' }, { status: 404 });
        }

        // Check if solved by user
        const submission = await Submission.findOne({
            user_id: session.user.id,
            challenge_id: id,
            is_correct: true
        });

        return NextResponse.json({
            ...challenge.toObject(),
            solved: !!submission
        });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await req.json();
        const data = updateChallengeSchema.parse(body);

        await dbConnect();
        const challenge = await Challenge.findByIdAndUpdate(id, data, { new: true });

        if (!challenge) {
            return NextResponse.json({ message: 'Challenge not found' }, { status: 404 });
        }

        return NextResponse.json(challenge);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        await dbConnect();
        const challenge = await Challenge.findByIdAndDelete(id);

        if (!challenge) {
            return NextResponse.json({ message: 'Challenge not found' }, { status: 404 });
        }

        // Also delete associated submissions
        await Submission.deleteMany({ challenge_id: id });

        return NextResponse.json({ message: 'Challenge deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
