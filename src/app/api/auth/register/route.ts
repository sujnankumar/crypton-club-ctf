import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { z } from 'zod';

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(20),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, email, password } = registerSchema.parse(body);

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email or username already exists' },
                { status: 409 }
            );
        }

        const password_hash = await hash(password, 10);

        const user = await User.create({
            username,
            email,
            password_hash,
            role: 'player', // Default role
        });

        return NextResponse.json(
            { message: 'User created successfully', userId: user._id },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
