import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const updateUserSchema = z.object({
    username: z.string().min(3).max(20).optional(),
    email: z.string().email().optional(),
    password: z.string().optional().refine((val) => !val || val.length >= 6, {
        message: 'Password must be at least 6 characters',
    }),
    role: z.enum(['admin', 'player']).optional(),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const user = await User.findById(params.id).select('-password_hash');
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);
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
        const data = updateUserSchema.parse(body);

        await dbConnect();

        // Prepare update data
        const updateData: any = {};
        if (data.username) updateData.username = data.username;
        if (data.email) updateData.email = data.email;
        if (data.role) updateData.role = data.role;
        if (data.password) {
            updateData.password_hash = await hash(data.password, 10);
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password_hash');

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const user = await User.findByIdAndDelete(params.id);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
