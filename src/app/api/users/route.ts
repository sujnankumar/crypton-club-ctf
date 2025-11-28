import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const createUserSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'player']).optional(),
});

export async function GET() {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const users = await User.find({}).select('-password_hash').sort({ created_at: -1 });
        return NextResponse.json(users);
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
        const { username, email, password, role } = createUserSchema.parse(body);

        await dbConnect();

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 409 }
            );
        }

        const password_hash = await hash(password, 10);
        const user = await User.create({
            username,
            email,
            password_hash,
            role: role || 'player',
        });

        return NextResponse.json(
            { message: 'User created', userId: user._id },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
