import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Announcement from '@/models/Announcement';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const announcement = await Announcement.findByIdAndDelete(params.id);

        if (!announcement) {
            return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Announcement deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
