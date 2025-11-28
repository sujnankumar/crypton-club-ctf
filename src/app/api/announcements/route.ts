import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Announcement from '@/models/Announcement';
import { z } from 'zod';

const createAnnouncementSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
});

export async function GET() {
    try {
        await dbConnect();
        const announcements = await Announcement.find({}).sort({ created_at: -1 });
        return NextResponse.json(announcements);
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
        const data = createAnnouncementSchema.parse(body);

        await dbConnect();
        const announcement = await Announcement.create(data);

        return NextResponse.json(announcement, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
