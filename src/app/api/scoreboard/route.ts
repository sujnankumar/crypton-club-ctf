import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Submission from '@/models/Submission';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();

        // Aggregate scores
        const scoreboard = await Submission.aggregate([
            { $match: { is_correct: true } },
            {
                $group: {
                    _id: '$user_id',
                    total_points: { $sum: '$points_awarded' },
                    last_solve: { $max: '$timestamp' },
                    solve_count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    username: '$user.username',
                    total_points: 1,
                    last_solve: 1,
                    solve_count: 1
                }
            },
            { $sort: { total_points: -1, last_solve: 1 } }
        ]);

        return NextResponse.json(scoreboard);
    } catch (error) {
        console.error('Scoreboard error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
