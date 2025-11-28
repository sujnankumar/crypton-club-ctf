'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Trash2, Plus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

interface Announcement {
  _id: string;
  title: string;
  body: string;
  created_at: string;
}

const announcementSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

type AnnouncementForm = z.infer<typeof announcementSchema>;

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
  });

  const fetchAnnouncements = async () => {
    const res = await fetch('/api/announcements');
    const data = await res.json();
    setAnnouncements(data);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const onSubmit = async (data: AnnouncementForm) => {
    setIsLoading(true);
    try {
      await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setIsModalOpen(false);
      fetchAnnouncements();
      reset();
    } catch (error) {
      console.error('Failed to create announcement', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    fetchAnnouncements();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Announcements</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Announcement
        </Button>
      </div>

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement._id} className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-white">
                {announcement.title}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(announcement._id)} className="text-red-500 hover:text-red-400">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 whitespace-pre-wrap">{announcement.body}</p>
              <p className="mt-4 text-xs text-slate-500">
                Posted on {format(new Date(announcement.created_at), 'PPP')}
              </p>
            </CardContent>
          </Card>
        ))}
        
        {announcements.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No announcements yet.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Announcement"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} isLoading={isLoading}>Post</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" {...register('title')} error={errors.title?.message} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Content</label>
            <textarea
              {...register('body')}
              className="flex min-h-[150px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your announcement here..."
            />
            {errors.body && <p className="mt-1 text-sm text-red-500">{errors.body.message}</p>}
          </div>
        </div>
      </Modal>
    </div>
  );
}
